import bcryptjs from "bcryptjs";
import { UserMongoRepository } from "../repositories/user.repository";
import { TeamMongoRepository } from "../repositories/team.repository";
import { MatchMongoRepository } from "../repositories/match.repository";
import { UserModel, IUser } from "../models/user.model";
import { TeamModel, ITeam } from "../models/team.model";
import { MatchModel, IMatch } from "../models/match.model";
import { PlayerProfileModel } from "../models/player.model";
import { HttpException } from "../exceptions/http-exception";
import { UpdateUserDTO } from "../dtos/user.dto";
import { SearchUserDTO, AdminCreateUserDTO, AdminListQueryDTO } from "../dtos/admin.dto";
import { CreateTeamDTO, UpdateTeamDTO } from "../dtos/team.dto";
import { CreateMatchDTO, UpdateMatchDTO } from "../dtos/match.dto";

const userRepository = new UserMongoRepository();
const teamRepository = new TeamMongoRepository();
const matchRepository = new MatchMongoRepository();

export class AdminService {
    // ─── Users ──────────────────────────────────────────────────────────────
    async getAllUsers(query: SearchUserDTO) {
        const filters: Record<string, any> = {};
        if (query.role) filters.role = query.role;
        if (query.isActive !== undefined) filters.isActive = query.isActive;
        if (query.search) {
            filters.$or = [
                { firstName: { $regex: query.search, $options: "i" } },
                { lastName: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
                { username: { $regex: query.search, $options: "i" } },
            ];
        }

        const skip = (query.page - 1) * query.size;
        const [users, total] = await Promise.all([
            UserModel.find(filters).select("-password").skip(skip).limit(query.size).sort({ createdAt: -1 }),
            UserModel.countDocuments(filters),
        ]);

        return {
            users,
            pagination: {
                page: query.page,
                size: query.size,
                total,
                totalPages: Math.ceil(total / query.size) || 1,
            },
        };
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await userRepository.getUserById(id);
        if (!user) throw new HttpException(404, "User not found");
        return user;
    }

    async createUser(data: AdminCreateUserDTO): Promise<IUser> {
        const existingEmail = await userRepository.getUserByEmail(data.email);
        if (existingEmail) throw new HttpException(400, "Email already registered");

        const existingUsername = await userRepository.getUserByUsername(data.username);
        if (existingUsername) throw new HttpException(400, "Username already taken");

        const hashedPassword = await bcryptjs.hash(data.password, 10);
        const user = await userRepository.createUser({ ...data, password: hashedPassword });
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        delete userObj.password;
        return userObj;
    }

    async updateUser(id: string, data: UpdateUserDTO): Promise<IUser> {
        const updated = await userRepository.update(id, data as Partial<IUser>);
        if (!updated) throw new HttpException(404, "User not found");
        return updated;
    }

    async deleteUser(id: string): Promise<void> {
        const deleted = await userRepository.delete(id);
        if (!deleted) throw new HttpException(404, "User not found");
    }

    async deactivateUser(id: string): Promise<IUser> {
        const updated = await userRepository.update(id, { isActive: false } as Partial<IUser>);
        if (!updated) throw new HttpException(404, "User not found");
        return updated;
    }

    async activateUser(id: string): Promise<IUser> {
        const updated = await userRepository.update(id, { isActive: true } as Partial<IUser>);
        if (!updated) throw new HttpException(404, "User not found");
        return updated;
    }

    // ─── Teams (admin has full control, bypasses ownership checks) ───────────
    async getAllTeams(query: AdminListQueryDTO) {
        const filters: Record<string, any> = {};
        if (query.search) {
            filters.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { city: { $regex: query.search, $options: "i" } },
            ];
        }
        const skip = (query.page - 1) * query.size;
        const [teams, total] = await Promise.all([
            TeamModel.find(filters).skip(skip).limit(query.size).sort({ createdAt: -1 }),
            TeamModel.countDocuments(filters),
        ]);
        return {
            teams,
            pagination: {
                page: query.page,
                size: query.size,
                total,
                totalPages: Math.ceil(total / query.size) || 1,
            },
        };
    }

    async getTeamById(id: string): Promise<ITeam> {
        const team = await teamRepository.findById(id);
        if (!team) throw new HttpException(404, "Team not found");
        return team;
    }

    async createTeam(adminId: string, data: CreateTeamDTO & { organizerId?: string }): Promise<ITeam> {
        const organizerId = data.organizerId || adminId;
        const team = await teamRepository.create({ ...data, organizerId, members: [organizerId] });
        return team;
    }

    async updateTeam(id: string, data: UpdateTeamDTO): Promise<ITeam> {
        const updated = await teamRepository.update(id, data as Partial<ITeam>);
        if (!updated) throw new HttpException(404, "Team not found");
        return updated;
    }

    async deleteTeam(id: string): Promise<void> {
        const deleted = await teamRepository.delete(id);
        if (!deleted) throw new HttpException(404, "Team not found");
    }

    // ─── Matches (admin has full control, bypasses ownership checks) ─────────
    async getAllMatches(query: AdminListQueryDTO) {
        const filters: Record<string, any> = {};
        if (query.search) {
            filters.$or = [
                { title: { $regex: query.search, $options: "i" } },
                { city: { $regex: query.search, $options: "i" } },
                { venue: { $regex: query.search, $options: "i" } },
            ];
        }
        const skip = (query.page - 1) * query.size;
        const [matches, total] = await Promise.all([
            MatchModel.find(filters).skip(skip).limit(query.size).sort({ createdAt: -1 }),
            MatchModel.countDocuments(filters),
        ]);
        return {
            matches,
            pagination: {
                page: query.page,
                size: query.size,
                total,
                totalPages: Math.ceil(total / query.size) || 1,
            },
        };
    }

    async getMatchById(id: string): Promise<IMatch> {
        const match = await matchRepository.findById(id);
        if (!match) throw new HttpException(404, "Match not found");
        return match;
    }

    async createMatch(adminId: string, data: CreateMatchDTO & { organizerId?: string }): Promise<IMatch> {
        const organizerId = data.organizerId || adminId;
        const match = await matchRepository.create({ ...data, organizerId, status: "open" });
        return match;
    }

    async updateMatch(id: string, data: UpdateMatchDTO): Promise<IMatch> {
        const updated = await matchRepository.update(id, data as Partial<IMatch>);
        if (!updated) throw new HttpException(404, "Match not found");
        return updated;
    }

    async deleteMatch(id: string): Promise<void> {
        const deleted = await matchRepository.delete(id);
        if (!deleted) throw new HttpException(404, "Match not found");
    }

    // ─── Dashboard ─────────────────────────────────────────────────────────
    async getDashboardStats() {
        const [totalUsers, totalMatches, totalTeams, totalPlayers] = await Promise.all([
            UserModel.countDocuments(),
            MatchModel.countDocuments(),
            TeamModel.countDocuments(),
            PlayerProfileModel.countDocuments(),
        ]);

        const [players, organizers, admins] = await Promise.all([
            UserModel.countDocuments({ role: "player" }),
            UserModel.countDocuments({ role: "organizer" }),
            UserModel.countDocuments({ role: "admin" }),
        ]);

        const openMatches = await MatchModel.countDocuments({ status: "open" });
        const openTeams = await TeamModel.countDocuments({ isOpen: true });

        return {
            totalUsers,
            totalMatches,
            totalTeams,
            totalPlayers,
            usersByRole: { players, organizers, admins },
            openMatches,
            openTeams,
        };
    }
}
