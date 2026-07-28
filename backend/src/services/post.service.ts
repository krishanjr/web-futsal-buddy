import { PostMongoRepository } from "../repositories/post.repository";
import { ApplicationMongoRepository } from "../repositories/application.repository";
import { TeamMongoRepository } from "../repositories/team.repository";
import { MatchMongoRepository } from "../repositories/match.repository";
import { CreatePostDTO, SearchPostDTO, ApplyToPostDTO } from "../dtos/post.dto";
import { IPost } from "../models/post.model";
import { IApplication } from "../models/application.model";
import { HttpException } from "../exceptions/http-exception";

const postRepository = new PostMongoRepository();
const applicationRepository = new ApplicationMongoRepository();
const teamRepository = new TeamMongoRepository();
const matchRepository = new MatchMongoRepository();

interface Author {
    id: string;
    role: "player" | "organizer" | "admin";
}

export class PostService {
    // ---------------------------------------------------------------- create
    async createPost(author: Author, data: CreatePostDTO): Promise<IPost> {
        if (data.postType === "player_seeking_team" && author.role === "organizer") {
            throw new HttpException(403, "Only players can post that they're looking for a team");
        }
        if (
            (data.postType === "team_recruit" || data.postType === "opponent_request") &&
            author.role === "player"
        ) {
            throw new HttpException(403, "Only organizers can post on behalf of a team");
        }

        if (data.teamId) {
            const team = await teamRepository.findById(data.teamId);
            if (!team) throw new HttpException(404, "Team not found");
            if (team.organizerId !== author.id && author.role !== "admin") {
                throw new HttpException(403, "You don't manage this team");
            }
        }

        return postRepository.create({
            ...data,
            authorId: author.id,
            authorRole: author.role === "admin" ? "organizer" : author.role,
            status: "open",
        });
    }

    // ----------------------------------------------------------------- list
    async searchPosts(query: SearchPostDTO, excludeAuthorId?: string) {
        const filters: Record<string, any> = { status: "open" };
        if (query.postType) filters.postType = query.postType;
        if (query.city) filters.city = { $regex: query.city, $options: "i" };
        if (query.skillLevel) filters.skillLevel = query.skillLevel;
        if (excludeAuthorId) filters.authorId = { $ne: excludeAuthorId };

        const skip = (query.page - 1) * query.limit;
        const [posts, total] = await Promise.all([
            postRepository.search(filters, skip, query.limit),
            postRepository.countSearch(filters),
        ]);

        return { posts, meta: { page: query.page, limit: query.limit, total } };
    }

    async getMyPosts(authorId: string): Promise<IPost[]> {
        return postRepository.findByAuthor(authorId);
    }

    async getPostById(id: string): Promise<IPost> {
        const post = await postRepository.findById(id);
        if (!post) throw new HttpException(404, "Post not found");
        return post;
    }

    // --------------------------------------------------------------- delete
    async closePost(author: Author, postId: string): Promise<void> {
        const post = await postRepository.findById(postId);
        if (!post) throw new HttpException(404, "Post not found");
        if (post.authorId !== author.id && author.role !== "admin") {
            throw new HttpException(403, "You can't manage this post");
        }
        await postRepository.delete(postId);
    }

    // ---------------------------------------------------------------- apply
    async applyToPost(
        applicant: Author,
        postId: string,
        data: ApplyToPostDTO
    ): Promise<IApplication> {
        const post = await postRepository.findById(postId);
        if (!post) throw new HttpException(404, "Post not found");
        if (post.status !== "open") throw new HttpException(400, "This post is no longer open");
        if (post.authorId === applicant.id) {
            throw new HttpException(400, "You can't apply to your own post");
        }

        if (post.postType === "team_recruit") {
            if (applicant.role !== "player") {
                throw new HttpException(403, "Only players can apply to join a team");
            }
        } else {
            // player_seeking_team & opponent_request: an organizer applies with one of their teams
            if (applicant.role !== "organizer") {
                throw new HttpException(403, "Only organizers can respond to this post");
            }
            if (!data.teamId) {
                throw new HttpException(400, "Select which of your teams this applies to");
            }
            const team = await teamRepository.findById(data.teamId);
            if (!team) throw new HttpException(404, "Team not found");
            if (team.organizerId !== applicant.id) {
                throw new HttpException(403, "You don't manage that team");
            }
            if (post.postType === "opponent_request" && data.teamId === post.teamId) {
                throw new HttpException(400, "You can't challenge your own team");
            }
        }

        const existing = await applicationRepository.findPendingByPostAndApplicant(
            postId,
            applicant.id
        );
        if (existing) throw new HttpException(400, "You already have a pending application for this post");

        return applicationRepository.create({
            postId,
            applicantId: applicant.id,
            applicantRole: applicant.role as "player" | "organizer",
            teamId: data.teamId,
            message: data.message,
            status: "pending",
        });
    }

    async withdrawApplication(applicant: Author, applicationId: string): Promise<void> {
        const application = await applicationRepository.findById(applicationId);
        if (!application) throw new HttpException(404, "Application not found");
        if (application.applicantId !== applicant.id) {
            throw new HttpException(403, "This isn't your application");
        }
        if (application.status !== "pending") {
            throw new HttpException(400, "Only a pending application can be withdrawn");
        }
        await applicationRepository.update(applicationId, { status: "withdrawn" });
    }

    async getApplicationsForPost(author: Author, postId: string): Promise<IApplication[]> {
        const post = await postRepository.findById(postId);
        if (!post) throw new HttpException(404, "Post not found");
        if (post.authorId !== author.id && author.role !== "admin") {
            throw new HttpException(403, "You can't view applicants for this post");
        }
        return applicationRepository.findByPost(postId);
    }

    async getMyApplications(applicantId: string): Promise<IApplication[]> {
        return applicationRepository.findByApplicant(applicantId);
    }

    // ------------------------------------------------------- accept/reject
    async reviewApplication(
        author: Author,
        applicationId: string,
        action: "accept" | "reject"
    ): Promise<{ application: IApplication; matchId?: string }> {
        const application = await applicationRepository.findById(applicationId);
        if (!application) throw new HttpException(404, "Application not found");

        const post = await postRepository.findById(application.postId);
        if (!post) throw new HttpException(404, "Post not found");
        if (post.authorId !== author.id && author.role !== "admin") {
            throw new HttpException(403, "You can't review applicants for this post");
        }
        if (application.status !== "pending") {
            throw new HttpException(400, "This application has already been reviewed");
        }

        if (action === "reject") {
            const updated = await applicationRepository.update(applicationId, { status: "rejected" });
            return { application: updated as IApplication };
        }

        // action === "accept" — perform the real side effect for each post type
        let matchId: string | undefined;

        if (post.postType === "team_recruit") {
            if (!post.teamId) throw new HttpException(500, "Post is missing a team reference");
            const team = await teamRepository.findById(post.teamId);
            if (!team) throw new HttpException(404, "Team no longer exists");
            if (team.members.length >= team.maxMembers) {
                throw new HttpException(400, "This team is already full");
            }
            await teamRepository.addMember(post.teamId, application.applicantId);

            const remainingSlots = post.slotsNeeded - 1;
            const stillHasRoom = team.members.length + 1 < team.maxMembers;
            if (remainingSlots <= 0 || !stillHasRoom) {
                await postRepository.update(post._id.toString(), { status: "filled" });
                await applicationRepository.rejectAllPendingForPost(post._id.toString(), applicationId);
            } else {
                await postRepository.update(post._id.toString(), { slotsNeeded: remainingSlots });
            }
        } else if (post.postType === "player_seeking_team") {
            if (!application.teamId) throw new HttpException(500, "Application is missing a team reference");
            const team = await teamRepository.findById(application.teamId);
            if (!team) throw new HttpException(404, "Team no longer exists");
            if (team.members.length >= team.maxMembers) {
                throw new HttpException(400, "Your team is already full");
            }
            // the post's author is the player being recruited
            await teamRepository.addMember(application.teamId, post.authorId);
            await postRepository.update(post._id.toString(), { status: "filled" });
            await applicationRepository.rejectAllPendingForPost(post._id.toString(), applicationId);
        } else if (post.postType === "opponent_request") {
            if (!post.teamId || !application.teamId) {
                throw new HttpException(500, "Missing team reference for opponent request");
            }
            const [ourTeam, theirTeam] = await Promise.all([
                teamRepository.findById(post.teamId),
                teamRepository.findById(application.teamId),
            ]);
            if (!ourTeam || !theirTeam) throw new HttpException(404, "One of the teams no longer exists");

            const maxPlayers = post.maxPlayers || ourTeam.maxMembers + theirTeam.maxMembers;
            const combinedPlayers = Array.from(
                new Set([...ourTeam.members, ...theirTeam.members])
            ).slice(0, maxPlayers);

            const match = await matchRepository.create({
                title: `${ourTeam.name} vs ${theirTeam.name}`,
                organizerId: post.authorId,
                venue: post.venue || "TBD",
                city: post.city,
                matchDate: post.matchDate || "",
                matchTime: post.matchTime || "",
                maxPlayers,
                skillLevel: post.skillLevel === "any" ? "any" : post.skillLevel,
                matchType: "competitive",
                status: "open",
                players: combinedPlayers,
            } as any);
            matchId = match._id.toString();

            await postRepository.update(post._id.toString(), { status: "filled" });
            await applicationRepository.rejectAllPendingForPost(post._id.toString(), applicationId);
        }

        const updated = await applicationRepository.update(applicationId, { status: "accepted" });
        return { application: updated as IApplication, matchId };
    }
}
