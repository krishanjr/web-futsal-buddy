import { request, app, registerAndLogin } from "../helpers";

describe("AI: /api/v1/ai/*", () => {
  test("rejects all AI routes when not authenticated", async () => {
    const res = await request(app).get("/api/v1/ai/my-insights");
    expect(res.status).toBe(401);
  });

  test("GET /my-insights requires a player profile to exist first", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .get("/api/v1/ai/my-insights")
      .set("Authorization", `Bearer ${token}`);

    // No player profile has been created yet for this fresh user, so this
    // should fail gracefully (not 500 / crash) rather than succeed.
    expect(res.status).not.toBe(200);
  });

  test("POST /match-tip returns a tip using sensible defaults", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/ai/match-tip")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(typeof res.body.data.tip).toBe("string");
    expect(res.body.data.tip.length).toBeGreaterThan(0);
  });

  test("POST /team-advice returns advice for a given team composition", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/ai/team-advice")
      .set("Authorization", `Bearer ${token}`)
      .send({ skillLevel: "advanced", memberCount: 8, maxMembers: 10 });

    expect(res.status).toBe(200);
    expect(typeof res.body.data.advice).toBe("string");
  });

  test("POST /ask returns an answer for a valid question", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/ai/ask")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "How do I improve my passing accuracy?" });

    expect(res.status).toBe(200);
    expect(typeof res.body.data.answer).toBe("string");
  });

  test("POST /ask rejects an empty question", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/ai/ask")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "" });

    expect(res.status).toBe(400);
  });

  test("POST /ask rejects a question that's too short/meaningless", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/ai/ask")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "hi" });

    expect(res.status).toBe(400);
  });
});
