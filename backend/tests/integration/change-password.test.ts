import { request, app, registerAndLogin } from "../helpers";

describe("POST /api/v1/auth/change-password", () => {
  test("changes the password when the current password is correct", async () => {
    const { token, credentials } = await registerAndLogin("player");

    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: credentials.password,
        newPassword: "NewPassword456!",
        confirmPassword: "NewPassword456!",
      });

    expect(res.status).toBe(200);

    // Old password should no longer work
    const oldLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: credentials.email, password: credentials.password });
    expect(oldLogin.status).toBeGreaterThanOrEqual(400);

    // New password should work
    const newLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: credentials.email, password: "NewPassword456!" });
    expect(newLogin.status).toBe(200);
  });

  test("rejects when the current password is wrong", async () => {
    const { token } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "WrongCurrentPassword!",
        newPassword: "NewPassword456!",
        confirmPassword: "NewPassword456!",
      });
    expect(res.status).toBe(400);
  });

  test("rejects when newPassword and confirmPassword don't match", async () => {
    const { token, credentials } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: credentials.password,
        newPassword: "NewPassword456!",
        confirmPassword: "SomethingElse!",
      });
    expect(res.status).toBe(400);
  });

  test("rejects a new password shorter than 6 characters", async () => {
    const { token, credentials } = await registerAndLogin("player");
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: credentials.password, newPassword: "123", confirmPassword: "123" });
    expect(res.status).toBe(400);
  });

  test("requires authentication", async () => {
    const res = await request(app)
      .post("/api/v1/auth/change-password")
      .send({ currentPassword: "a", newPassword: "bbbbbb", confirmPassword: "bbbbbb" });
    expect(res.status).toBe(401);
  });
});
