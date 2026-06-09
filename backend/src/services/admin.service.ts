import { UserMongoRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import { UpdateUserDTO } from "../dtos/user.dto";
import { MatchModel } from "../models/match.model";
import { TeamModel } from "../models/team.model";
import { PlayerProfileModel } from "../models/player.model";

const userRepository = new UserMongoRepository();

export class AdminService {
    async getAllUsers(): Promise<IUser[]> {
        return await userRepository.getAll();
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await userRepository.getUserById(id);
        if (!user) throw new HttpException(404, "User not found");
        return user;
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

    async getDashboardStats() {
        const [totalUsers, totalMatches, totalTeams, totalPlayers] = await Promise.all([
            userRepository.getAll().then((u) => u.length),
            MatchModel.countDocuments(),
            TeamModel.countDocuments(),
            PlayerProfileModel.countDocuments(),
        ]);

        const usersByRole = await (async () => {
            const all = await userRepository.getAll();
            return {
                players: all.filter((u) => u.role === "player").length,
                organizers: all.filter((u) => u.role === "organizer").length,
                admins: all.filter((u) => u.role === "admin").length,
            };
        })();

        const openMatches = await MatchModel.countDocuments({ status: "open" });
        const openTeams = await TeamModel.countDocuments({ isOpen: true });

        return {
            totalUsers,
            totalMatches,
            totalTeams,
            totalPlayers,
            usersByRole,
            openMatches,
            openTeams,
        };
    }
}
