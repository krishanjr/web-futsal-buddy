import { GEMINI_API_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";

export class AIService {
    private async callGemini(prompt: string): Promise<string> {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
            // Return mock response if no API key configured
            return this.getMockInsight(prompt);
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        if (!response.ok) {
            throw new HttpException(500, "AI service unavailable");
        }

        const data: any = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new HttpException(500, "AI returned empty response");
        return text;
    }

    private getMockInsight(prompt: string): string {
        // Mock AI insights when no Gemini key is configured
        if (prompt.includes("player analysis")) {
            return "Based on your profile: You are an intermediate midfielder with strong availability on weekends. Recommendation: Focus on improving defensive transitions and look for teams in your city that need a box-to-box midfielder. Your stats suggest consistent play — aim for 5 more assists this season.";
        }
        if (prompt.includes("match tip")) {
            return "AI Match Tip: For a competitive futsal match, ensure your team has clear positional assignments. Rotate your pivot player every 5 minutes to maintain energy. Keep possession under pressure by using short triangular passes near the walls.";
        }
        if (prompt.includes("team advice")) {
            return "Team Insight: Your team composition looks balanced. Consider recruiting a goalkeeper specialist if you don't have a dedicated one. Playing 2-2 formation with a rotating pivot is optimal for mixed-skill teams.";
        }
        return "AI Insight: Keep training consistently, focus on your weak foot, and always communicate with teammates during matches. Futsal rewards quick decision-making — practice small-sided drills to improve your reaction time.";
    }

    async getPlayerInsights(playerData: {
        position: string;
        skillLevel: string;
        stats: any;
        city: string;
        lookingFor: string;
    }): Promise<{ insight: string; recommendations: string[] }> {
        const prompt = `You are a futsal AI coach. Given this player profile:
- Position: ${playerData.position}
- Skill Level: ${playerData.skillLevel}
- City: ${playerData.city}
- Looking For: ${playerData.lookingFor}
- Stats: Matches: ${playerData.stats?.matchesPlayed || 0}, Wins: ${playerData.stats?.wins || 0}, Goals: ${playerData.stats?.goals || 0}, Assists: ${playerData.stats?.assists || 0}

Provide: 1) A personalized player analysis (player analysis) 2) Three specific recommendations to improve. Keep it concise and actionable. Format: Analysis paragraph then Recommendations as bullet points.`;

        const raw = await this.callGemini(prompt);

        const recommendations = raw
            .split("\n")
            .filter((l) => l.trim().startsWith("•") || l.trim().startsWith("-") || l.trim().startsWith("*"))
            .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
            .slice(0, 3);

        return {
            insight: raw,
            recommendations: recommendations.length > 0
                ? recommendations
                : [
                    "Practice 1v1 dribbling to improve your ball control",
                    "Work on your weak foot to become more unpredictable",
                    "Study video of professional futsal matches to improve positioning",
                  ],
        };
    }

    async getMatchTips(matchData: {
        skillLevel: string;
        matchType: string;
        playersCount: number;
    }): Promise<{ tip: string }> {
        const prompt = `Give a concise futsal match tip (match tip) for a ${matchData.matchType} match at ${matchData.skillLevel} level with ${matchData.playersCount} players. Keep it under 100 words and practical.`;
        const tip = await this.callGemini(prompt);
        return { tip };
    }

    async getTeamAdvice(teamData: {
        skillLevel: string;
        memberCount: number;
        maxMembers: number;
    }): Promise<{ advice: string }> {
        const prompt = `Give concise team advice (team advice) for a futsal team with ${teamData.memberCount}/${teamData.maxMembers} members at ${teamData.skillLevel} skill level. Focus on team building and strategy. Keep it under 100 words.`;
        const advice = await this.callGemini(prompt);
        return { advice };
    }

    async getGeneralInsight(question: string): Promise<{ answer: string }> {
        if (!question || question.trim().length < 5) {
            throw new HttpException(400, "Please provide a meaningful question");
        }
        const prompt = `You are a futsal AI expert assistant. Answer this question concisely and practically: "${question}". Keep the answer under 150 words.`;
        const answer = await this.callGemini(prompt);
        return { answer };
    }
}
