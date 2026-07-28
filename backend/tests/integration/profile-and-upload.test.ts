import path from "path";
import { request, app, registerAndLogin } from "../helpers";

describe("Profile: GET/PATCH /api/v1/auth/profile", () => {
  test("rejects unauthenticated access to the profile route", async () => {
    const res = await request(app).get("/api/v1/auth/profile");
    expect(res.status).toBe(401);
  });

  test("rejects requests with a malformed auth token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });

  test("player can fetch their own profile when authenticated", async () => {
    const { token, user } = await registerAndLogin("player");
    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  test("organizer can fetch their own profile when authenticated", async () => {
    const { token, user } = await registerAndLogin("organizer");
    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("organizer");
  });

  test("player can update their first/last name", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .patch("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Updated", lastName: "Name" });

    expect(res.status).toBe(200);
    expect(res.body.data.firstName).toBe("Updated");
    expect(res.body.data.lastName).toBe("Name");
  });

  test("player can set profilePhoto to an uploaded file URL", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .patch("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ profilePhoto: "/uploads/12345-abcde.png" });

    expect(res.status).toBe(200);
    expect(res.body.data.profilePhoto).toBe("/uploads/12345-abcde.png");
  });

  test("organizer can also set a profile photo (feature is role-agnostic)", async () => {
    const { token } = await registerAndLogin("organizer");
    const res = await request(app)
      .patch("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ profilePhoto: "/uploads/organizer-photo.jpg" });

    expect(res.status).toBe(200);
    expect(res.body.data.profilePhoto).toBe("/uploads/organizer-photo.jpg");
  });

  test("rejects an empty firstName on update", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .patch("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "" });

    expect(res.status).toBe(400);
  });

  test("a regular user cannot elevate their own role via profile update", async () => {
    const { token, user } = await registerAndLogin("player");
    await request(app)
      .patch("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "admin" });

    const check = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    // Flags a real security gap if this ever returns "admin" — UpdateUserDTO
    // currently allows `role` in the payload, which a normal user shouldn't
    // be able to change on themselves.
    expect(check.body.data.role).toBe(user.role);
  });
});

describe("Upload: POST /api/v1/upload", () => {
  test("rejects a request with no file attached", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/upload")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  test("uploads a valid PNG and returns a usable URL", async () => {
    const { token } = await registerAndLogin("player");
    // 1x1 transparent PNG, generated in-memory (no fixture file needed)
    const pngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64"
    );

    const res = await request(app)
      .post("/api/v1/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", pngBuffer, "avatar.png");

    expect(res.status).toBe(201);
    expect(res.body.data.url).toMatch(/^\/uploads\//);
  });

  test("rejects a non-image file type (e.g. .txt)", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("just some text"), "notes.txt");

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("DELETE rejects a path-traversal attempt in filename", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .delete("/api/v1/upload/..%2F..%2Fpackage.json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("DELETE returns 404 for a filename that doesn't exist", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .delete("/api/v1/upload/does-not-exist.png")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
