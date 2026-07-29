jest.mock("../../src/configs/firebase-admin", () => ({
  firebaseAuth: null,
}));

import { UserService } from "../../src/services/user.service";

describe("UserService google login", () => {
  it("returns a clear error when Firebase Admin is not configured", async () => {
    const service = new UserService();

await expect(service.googleLogin({ idToken: "invalid-token" } as any)).rejects.toThrow(
       "Firebase Admin credentials are not configured"
    );
  });
});
