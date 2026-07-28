import { ReportMongoRepository } from "../repositories/report.repository";
import { NotifyService } from "../repositories/notification.repository";
import { UserMongoRepository } from "../repositories/user.repository";
import { CreateReportDTO } from "../dtos/report.dto";
import { IReport } from "../models/report.model";
import { HttpException } from "../exceptions/http-exception";

const reportRepository = new ReportMongoRepository();
const userRepository = new UserMongoRepository();

export class ReportService {
    async fileReport(reporterId: string, data: CreateReportDTO): Promise<IReport> {
        const reportedUser = await userRepository.getUserByUsername(data.reportedUsername);
        if (!reportedUser) throw new HttpException(404, "No user found with that username");
        const reportedUserId = reportedUser._id.toString();
        if (reportedUserId === reporterId) {
            throw new HttpException(400, "You cannot report yourself");
        }

        const report = await reportRepository.create({
            reporterId,
            reportedUserId,
            reason: data.reason,
            status: "pending",
        });

        const allUsers = await userRepository.getAll();
        const admins = allUsers.filter((u) => u.role === "admin");
        await Promise.all(
            admins.map((admin) =>
                NotifyService.send(
                    admin._id.toString(),
                    "reported_user",
                    `A user was reported: ${data.reason.slice(0, 80)}`,
                    report._id.toString()
                )
            )
        );

        return report;
    }
}
