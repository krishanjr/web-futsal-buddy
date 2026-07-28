import bcryptjs from "bcryptjs";
import { UserMongoRepository } from "../repositories/user.repository";
import { TeamMongoRepository } from "../repositories/team.repository";
import { MatchMongoRepository } from "../repositories/match.repository";
import { UserModel, IUser } from "../models/user.model";
import { TeamModel, ITeam } from "../models/team.model";
import { MatchModel, IMatch } from "../models/match.model";
import { PlayerProfileModel } from "../models/player.model";
import { FutsalModel, IFutsal } from "../models/futsal.model";
import { IBooking } from "../models/booking.model";
import { HttpException } from "../exceptions/http-exception";
import { UpdateUserDTO } from "../dtos/user.dto";
import { SearchUserDTO, AdminCreateUserDTO, AdminListQueryDTO, SearchFutsalAdminDTO } from "../dtos/admin.dto";
import { AdminBookingQueryDTO } from "../dtos/booking.dto";
import { CreateTeamDTO, UpdateTeamDTO } from "../dtos/team.dto";
import { CreateMatchDTO, UpdateMatchDTO } from "../dtos/match.dto";
import { FutsalMongoRepository } from "../repositories/futsal.repository";
import { BookingMongoRepository } from "../repositories/booking.repository";
import { ChallengeMongoRepository } from "../repositories/challenge.repository";
import { ReportMongoRepository } from "../repositories/report.repository";
import { NotifyService } from "../repositories/notification.repository";

const userRepository = new UserMongoRepository();
const teamRepository = new TeamMongoRepository();
const matchRepository = new MatchMongoRepository();
const futsalRepository = new FutsalMongoRepository();
const bookingRepository = new BookingMongoRepository();
const challengeRepository = new ChallengeMongoRepository();
const reportRepository = new ReportMongoRepository();

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
        await teamRepository.delete(id);
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
        await matchRepository.delete(id);
    }

    // ─── Dashboard ─────────────────────────────────────────────────────────
    async getDashboardStats() {
        const [totalUsers, totalMatches, totalTeams, totalPlayers, totalFutsals, totalBookings, totalChallenges] =
            await Promise.all([
                UserModel.countDocuments(),
                MatchModel.countDocuments(),
                TeamModel.countDocuments(),
                PlayerProfileModel.countDocuments(),
                FutsalModel.countDocuments(),
                bookingRepository.countDocuments({}),
                challengeRepository.countAllForAdmin(),
            ]);

        const [players, organizers, admins] = await Promise.all([
            UserModel.countDocuments({ role: "player" }),
            UserModel.countDocuments({ role: "organizer" }),
            UserModel.countDocuments({ role: "admin" }),
        ]);

        const openMatches = await MatchModel.countDocuments({ status: "open" });
        const openTeams = await TeamModel.countDocuments({ isOpen: true });
        const unverifiedFutsals = await FutsalModel.countDocuments({ isVerified: false });
        const pendingBookings = await bookingRepository.countDocuments({ status: "pending" });

        return {
            totalUsers,
            totalMatches,
            totalTeams,
            totalPlayers,
            totalFutsals,
            totalBookings,
            totalChallenges,
            usersByRole: { players, organizers, admins },
            openMatches,
            openTeams,
            unverifiedFutsals,
            pendingBookings,
        };
    }

    // ─── Futsals ────────────────────────────────────────────────────────────

    async getAllFutsals(query: SearchFutsalAdminDTO) {
        const filters: Record<string, any> = {};
        if (query.district) filters.district = { $regex: query.district, $options: "i" };
        if (query.search) filters.name = { $regex: query.search, $options: "i" };
        if (query.isVerified !== undefined) filters.isVerified = query.isVerified;
        if (query.isActive !== undefined) filters.isActive = query.isActive;

        const skip = (query.page - 1) * query.size;
        const [futsals, total] = await Promise.all([
            futsalRepository.findAllForAdmin(filters, skip, query.size),
            futsalRepository.countAllForAdmin(filters),
        ]);

        return {
            futsals,
            pagination: {
                page: query.page,
                size: query.size,
                total,
                totalPages: Math.ceil(total / query.size) || 1,
            },
        };
    }

    async getFutsalById(id: string): Promise<IFutsal> {
        const futsal = await futsalRepository.findById(id);
        if (!futsal) throw new HttpException(404, "Futsal not found");
        return futsal;
    }

    async verifyFutsal(id: string): Promise<IFutsal> {
        const updated = await futsalRepository.update(id, { isVerified: true });
        if (!updated) throw new HttpException(404, "Futsal not found");
        await NotifyService.send(
            updated.organizerId,
            "futsal_verified",
            `${updated.name} has been verified and is now visible to players`,
            updated._id.toString()
        );
        return updated;
    }

    async unverifyFutsal(id: string): Promise<IFutsal> {
        const updated = await futsalRepository.update(id, { isVerified: false });
        if (!updated) throw new HttpException(404, "Futsal not found");
        return updated;
    }

    async deleteFutsal(id: string): Promise<void> {
        const deleted = await futsalRepository.delete(id);
        if (!deleted) throw new HttpException(404, "Futsal not found");
    }

    // ─── Bookings ───────────────────────────────────────────────────────────

    async getAllBookings(query: AdminBookingQueryDTO) {
        const filters: Record<string, any> = {};
        if (query.status) filters.status = query.status;

        const skip = (query.page - 1) * query.size;
        const [bookings, total] = await Promise.all([
            bookingRepository.findAllForAdmin(filters, skip, query.size),
            bookingRepository.countAllForAdmin(filters),
        ]);

        return {
            bookings,
            pagination: {
                page: query.page,
                size: query.size,
                total,
                totalPages: Math.ceil(total / query.size) || 1,
            },
        };
    }

    async deleteBooking(id: string): Promise<void> {
        const booking = await bookingRepository.findById(id);
        if (!booking) throw new HttpException(404, "Booking not found");
        await bookingRepository.update(id, { status: "cancelled" });
    }

    // ─── Challenges ─────────────────────────────────────────────────────────

    async getAllChallenges(page: number, size: number) {
        const skip = (page - 1) * size;
        const [challenges, total] = await Promise.all([
            challengeRepository.findAllForAdmin(skip, size),
            challengeRepository.countAllForAdmin(),
        ]);
        return {
            challenges,
            pagination: { page, size, total, totalPages: Math.ceil(total / size) || 1 },
        };
    }

    // ─── Organizer account verification ────────────────────────────────────

    async verifyOrganizerAccount(userId: string) {
        const user = await userRepository.getUserById(userId);
        if (!user) throw new HttpException(404, "User not found");
        if (user.role !== "organizer") {
            throw new HttpException(400, "Only organizer accounts can be verified");
        }
        return await userRepository.update(userId, { isVerified: true } as Partial<any>);
    }

    // ─── Reported users ─────────────────────────────────────────────────────

    async getAllReports(status: string | undefined, page: number, size: number) {
        const filters: Record<string, any> = {};
        if (status) filters.status = status;
        const skip = (page - 1) * size;
        const [reports, total] = await Promise.all([
            reportRepository.findAllForAdmin(filters, skip, size),
            reportRepository.countAllForAdmin(filters),
        ]);
        return {
            reports,
            pagination: { page, size, total, totalPages: Math.ceil(total / size) || 1 },
        };
    }

    async resolveReport(id: string, status: "resolved" | "dismissed") {
        const updated = await reportRepository.update(id, { status });
        if (!updated) throw new HttpException(404, "Report not found");
        return updated;
    }

    // ─── Analytics ──────────────────────────────────────────────────────────

    async getAnalytics() {
        const [mostBookedFutsals, mostActivePlayers, revenueByMonth, userGrowthByMonth, totalRevenue] =
            await Promise.all([
                bookingRepository.aggregateMostBooked(5),
                bookingRepository.aggregateMostActivePlayers(5),
                bookingRepository.aggregateRevenueByMonth(6),
                userRepository.aggregateUserGrowthByMonth
                    ? userRepository.aggregateUserGrowthByMonth(6)
                    : Promise.resolve([]),
                bookingRepository.getTotalRevenue(),
            ]);

        const futsalIds = mostBookedFutsals.map((f: any) => f.futsalId);
        const futsals = await Promise.all(futsalIds.map((id: string) => futsalRepository.findById(id)));
        const mostBookedFutsalsWithNames = mostBookedFutsals.map((f: any, i: number) => ({
            futsalId: f.futsalId,
            name: futsals[i]?.name || "Unknown",
            count: f.count,
        }));

        return {
            mostBookedFutsals: mostBookedFutsalsWithNames,
            mostActivePlayers,
            revenueByMonth,
            userGrowthByMonth,
            totalRevenue,
        };
    }
}
