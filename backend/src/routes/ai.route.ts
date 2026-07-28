import { Router } from "express";
import { AIService } from "../services/ai.service";

const aiRouter = Router();
const aiService = new AIService();

aiRouter.post("/insight", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });
        const result = await aiService.getGeneralInsight(prompt);
        return res.json({ success: true, data: result });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
    }
});

export default aiRouter;