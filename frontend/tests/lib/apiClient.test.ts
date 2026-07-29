import { apiFetch, API_BASE_URL } from "@/lib/api/client";

describe("apiFetch", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("requests the correct URL by combining the base URL and path", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ status: 200, success: true, message: "ok", data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/users/me");

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/users/me`,
      expect.objectContaining({ method: "GET" })
    );
  });

  it("defaults to the GET method when none is specified", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ status: 200, success: true, message: "ok", data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/users/me");

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe("GET");
  });

  it("sends a JSON-stringified body for write requests", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 201,
      json: async () => ({ status: 201, success: true, message: "created", data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/teams", { method: "POST", body: { name: "Dream Team" } });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.body).toBe(JSON.stringify({ name: "Dream Team" }));
    expect(options.method).toBe("POST");
  });

  it("adds an Authorization header when a token is provided", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ status: 200, success: true, message: "ok", data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/users/me", { token: "abc123" });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc123");
  });

  it("omits the Authorization header when no token is provided", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ status: 200, success: true, message: "ok", data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/users/me");

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("returns the parsed JSON response on success", async () => {
    const payload = { status: 200, success: true, message: "ok", data: { hello: "world" } };
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => payload,
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await apiFetch("/users/me");

    expect(result).toEqual(payload);
  });

  it("returns a graceful error response when the network request fails", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("network down"));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await apiFetch("/users/me");

    expect(result.success).toBe(false);
    expect(result.status).toBe(0);
    expect(result.message).toMatch(/Could not reach the Futsal Buddy API/);
  });

  it("returns a graceful error response when the response body is not valid JSON", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      status: 502,
      json: async () => {
        throw new Error("invalid json");
      },
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await apiFetch("/users/me");

    expect(result.success).toBe(false);
    expect(result.status).toBe(502);
    expect(result.message).toBe("Unexpected response from server");
  });
});
