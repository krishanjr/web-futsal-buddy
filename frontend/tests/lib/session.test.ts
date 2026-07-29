import { cookies } from "next/headers";
import { getSession, requireSession, SESSION_COOKIE } from "@/lib/auth/session";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("server-only", () => ({}));

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

function mockCookieStore(value: string | undefined) {
  mockedCookies.mockResolvedValue({
    get: (name: string) =>
      name === SESSION_COOKIE && value !== undefined ? { name, value } : undefined,
  } as never);
}

describe("session helpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when there is no session cookie", async () => {
    mockCookieStore(undefined);
    const session = await getSession();
    expect(session).toBeNull();
  });

  it("returns the parsed session when the cookie is valid JSON", async () => {
    const sessionData = {
      token: "tok-1",
      user: {
        _id: "u1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        username: "jane",
        role: "player",
        isActive: true,
        isVerified: true,
      },
    };
    mockCookieStore(JSON.stringify(sessionData));

    const session = await getSession();

    expect(session).toEqual(sessionData);
  });

  it("returns null when the cookie value is not valid JSON", async () => {
    mockCookieStore("{not-json");
    const session = await getSession();
    expect(session).toBeNull();
  });

  it("requireSession returns the session when authenticated", async () => {
    const sessionData = {
      token: "tok-2",
      user: {
        _id: "u2",
        firstName: "John",
        lastName: "Smith",
        email: "john@example.com",
        username: "john",
        role: "admin",
        isActive: true,
        isVerified: true,
      },
    };
    mockCookieStore(JSON.stringify(sessionData));

    const session = await requireSession();

    expect(session).toEqual(sessionData);
  });

  it("requireSession throws when there is no session", async () => {
    mockCookieStore(undefined);
    await expect(requireSession()).rejects.toThrow("Not authenticated");
  });
});
