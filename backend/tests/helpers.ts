import request from "supertest";
import app from "../src/app";

let counter = 0;

export function uniqueUser(role: "player" | "organizer" = "player") {
  counter += 1;
  return {
    firstName: "Test",
    lastName: `User${counter}`,
    email: `test.user${counter}.${Date.now()}@example.com`,
    username: `testuser${counter}${Date.now()}`,
    password: "Password123!",
    role,
  };
}

/**
 * Registers + logs in a fresh user and returns their auth token + id.
 * Registration only allows "player" | "organizer" (see RegisterDTO), so
 * admin users must be promoted separately (see promoteToAdmin below).
 */
export async function registerAndLogin(role: "player" | "organizer" = "player") {
  const payload = uniqueUser(role);

  const registerRes = await request(app).post("/api/v1/auth/register").send(payload);
  if (registerRes.status !== 201) {
    throw new Error(
      `Failed to register test user: ${registerRes.status} ${JSON.stringify(registerRes.body)}`
    );
  }

  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: payload.email, password: payload.password });

  return {
    token: loginRes.body.data.token as string,
    user: loginRes.body.data.user,
    credentials: payload,
  };
}

export { request, app };
