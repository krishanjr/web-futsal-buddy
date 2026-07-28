import { request, app, uniqueUser } from "../helpers";

describe("Auth: POST /api/v1/auth/register", () => {
  test("registers a new player successfully", async () => {
    const payload = uniqueUser("player");
    const res = await request(app).post("/api/v1/auth/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(payload.email);
    expect(res.body.data.password).toBeUndefined(); // password must never be returned
  });

  test("registers a new organizer successfully", async () => {
    const payload = uniqueUser("organizer");
    const res = await request(app).post("/api/v1/auth/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe("organizer");
  });

  test("rejects registration with an already-used email", async () => {
    const payload = uniqueUser("player");
    await request(app).post("/api/v1/auth/register").send(payload);

    const dupe = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...payload, username: payload.username + "x" });

    expect(dupe.status).toBeGreaterThanOrEqual(400);
    expect(dupe.body.success).toBe(false);
  });

  test("rejects registration with missing required fields", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({ email: "no-fields@example.com" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("rejects registration with an invalid email format", async () => {
    const payload = uniqueUser("player");
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...payload, email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  test("rejects a password that is too short", async () => {
    const payload = uniqueUser("player");
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...payload, password: "123" });
    expect(res.status).toBe(400);
  });

  test("cannot self-register as admin via the public endpoint", async () => {
    const payload = uniqueUser("player");
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...payload, role: "admin" });

    // RegisterDTO only accepts player|organizer, so either the request is
    // rejected outright, or "admin" is silently ignored and defaulted.
    if (res.status === 201) {
      expect(res.body.data.role).not.toBe("admin");
    } else {
      expect(res.status).toBe(400);
    }
  });
});

describe("Auth: POST /api/v1/auth/login", () => {
  test("logs in with correct credentials and returns a token", async () => {
    const payload = uniqueUser("player");
    await request(app).post("/api/v1/auth/register").send(payload);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: payload.email, password: payload.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(payload.email);
  });

  test("rejects login with the wrong password", async () => {
    const payload = uniqueUser("player");
    await request(app).post("/api/v1/auth/register").send(payload);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: payload.email, password: "WrongPassword123!" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("rejects login for a non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@example.com", password: "Password123!" });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
