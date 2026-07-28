import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const reportRouter = Router();
const reportController = new ReportController();

reportRouter.post("/", authorizedMiddleware, (req, res) => reportController.fileReport(req, res));

export default reportRouter;
