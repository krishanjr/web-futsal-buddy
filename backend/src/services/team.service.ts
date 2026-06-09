import { TeamMongoRepository } from "../repositories/team.repository";
import { CreateTeamDTO, UpdateTeamDTO, SearchTeamDTO } from "../dtos/team.dto";
import { ITeam } from "../models/team.model";
import { HttpException } from "../exceptions/http-exception";

const teamRepository = new TeamMongoRepository();

export class TeamService {
    async createTeam(organizerId: string, data: CreateTeamDTO): Promise<ITeam> {
        const team = await teamRepository.create({
            ...data,
            organizerId,
            members: [organizerId], // organizer is auto first member
        });
        return team;
    }

    async getTeamById(id: string): Promise<ITeam> {
        const team = await teamRepository.findById(id);
        if (!team) throw new HttpException(404, "Team not found");
        return team;
    }

    async getMyTeams(organizerId: string): Promise<ITeam[]> {
        return await teamRepository.findByOrganizer(organizerId);
    }

    async updateTeam(organizerId: string, teamId: string, data: UpdateTeamDTO): Promise<ITeam> {
        const team = await teamRepository.findById(teamId);
        if (!team) throw new HttpException(404, "Team not found");
        if (team.organizerId !== organizerId) {
            throw new HttpException(403, "You are not authorized to update this team");
        }
        const updated = await teamRepository.update(teamId, data as Partial<ITeam>);
        if (!updated) throw new HttpException(500, "Failed to update team");
        return updated;
    }

    async deleteTeam(organizerId: string, teamId: string): Promise<void> {
        const team = await teamRepository.findById(teamId);
        if (!team) throw new HttpException(404, "Team not found");
        if (team.organizerId !== organizerId) {
            throw new HttpException(403, "You are not authorized to delete this team");
        }
        await teamRepository.delete(teamId);
    }

    async searchTeams(query: SearchTeamDTO) {
        const filters: Record<string, any> = {};
        if (query.city) filters.city = { $regex: query.city, $options: "i" };
        if (query.skillLevel) filters.skillLevel = query.skillLevel;
        if (query.isOpen !== undefined) filters.isOpen = query.isOpen;

        const skip = (query.page - 1) * query.limit;
        const [teams, total] = await Promise.all([
            teamRepository.search(filters, skip, query.limit),
            teamRepository.countSearch(filters),
        ]);

        return {
            teams,
            meta: { page: query.page, limit: query.limit, total },
        };
    }

    async joinTeam(teamId: string, userId: string): Promise<ITeam> {
        const team = await teamRepository.findById(teamId);
        if (!team) throw new HttpException(404, "Team not found");
        if (!team.isOpen) throw new HttpException(400, "This team is not accepting new members");
        if (team.members.includes(userId)) throw new HttpException(400, "You are already a member");
        if (team.members.length >= team.maxMembers) {
            throw new HttpException(400, "Team is already full");
        }

        const updated = await teamRepository.addMember(teamId, userId);
        if (!updated) throw new HttpException(500, "Failed to join team");
        return updated;
    }

    async leaveTeam(teamId: string, userId: string): Promise<ITeam> {
        const team = await teamRepository.findById(teamId);
        if (!team) throw new HttpException(404, "Team not found");
        if (team.organizerId === userId) {
            throw new HttpException(400, "Organizer cannot leave. Transfer ownership or delete the team.");
        }
        if (!team.members.includes(userId)) {
            throw new HttpException(400, "You are not a member of this team");
        }

        const updated = await teamRepository.removeMember(teamId, userId);
        if (!updated) throw new HttpException(500, "Failed to leave team");
        return updated;
    }
}
