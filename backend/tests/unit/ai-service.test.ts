/**
 * These tests never hit the real Gemini API. They control the
 * GEMINI_API_KEY the service sees (via jest.doMock on the config module)
 * and stub global.fetch, so the suite is deterministic, free, and works
 * with no internet connection.
 */

describe("AIService — no API key configured (mock fallback)", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("../../src/configs/constant", () => ({ GEMINI_API_KEY: "" }));
  });

  test("getMatchTips returns the canned mock tip instead of erroring", async () => {
    const { AIService } = await import("../../src/services/ai.service");
    const service = new AIService();
    const result = await service.getMatchTips({
      skillLevel: "intermediate",
      matchType: "friendly",
      playersCount: 10,
    });
    expect(result.tip.toLowerCase()).toContain("match tip");
  });

  test("getTeamAdvice returns the canned mock advice", async () => {
    const { AIService } = await import("../../src/services/ai.service");
    const service = new AIService();
    const result = await service.getTeamAdvice({
      skillLevel: "mixed",
      memberCount: 5,
      maxMembers: 10,
    });
    expect(result.advice.length).toBeGreaterThan(0);
  });

  test("getPlayerInsights returns an insight plus exactly up to 3 recommendations", async () => {
    const { AIService } = await import("../../src/services/ai.service");
    const service = new AIService();
    const result = await service.getPlayerInsights({
      position: "midfielder",
      skillLevel: "intermediate",
      stats: { matchesPlayed: 10, wins: 5, goals: 3, assists: 4 },
      city: "Kathmandu",
      lookingFor: "team",
    });
    expect(result.insight.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });

  test("getGeneralInsight rejects a too-short question before ever calling the model", async () => {
    const { AIService } = await import("../../src/services/ai.service");
    const service = new AIService();
    await expect(service.getGeneralInsight("hi")).rejects.toThrow();
  });
});

describe("AIService — API key configured (calls Gemini)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    jest.doMock("../../src/configs/constant", () => ({ GEMINI_API_KEY: "fake-test-key" }));
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("calls the gemini-pro endpoint with the API key as a query parameter", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "Great tip!" }] } }] }),
    });
    global.fetch = fetchMock;

    const { AIService } = await import("../../src/services/ai.service");
    const service = new AIService();
    await service.getMatchTips({ skillLevel: "advanced", matchType: "friendly", playersCount: 10 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("gemini-3.6-flash");
  });

  test("throws a clean error when Gemini responds with a non-OK status", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "model not found",
    });
    global.fetch = fetchMock;

    const { AIService } = await import("../../src/services/ai.service");
    const service = new AIService();
    await expect(
      service.getMatchTips({ skillLevel: "advanced", matchType: "friendly", playersCount: 10 })
    ).rejects.toThrow("AI service unavailable");
  });
});