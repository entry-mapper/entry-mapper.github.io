// login.test.ts
import { login } from "./auth.api";
import { http } from "../utils/http";
import { LoginForm, LoginResponse } from "../interfaces/auth.interfaces";
import { BASE_URL } from "../utils/config";
jest.mock("../utils/http", () => ({
  http: {
    post: jest.fn(),
  },
}));

describe("login", () => {
  const credentials: LoginForm = {
    email: "test@example.com",
    password: "password123",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully", async () => {
    const mockResponse = {
      data: {
        expiresIn: 3600,
        accessToken: "token123",
        user: { id: 1, name: "John Doe" },
      },
    };
    (http.post as jest.Mock).mockResolvedValue(mockResponse);

    const result: LoginResponse = await login(credentials);

    expect(http.post).toHaveBeenCalledWith(`${BASE_URL}/api/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });
    expect(result).toEqual({
      expiresIn: 3600,
      accessToken: "token123",
      user: { id: 1, name: "John Doe" },
    });
  });

  it("should handle error.response case", async () => {
    (http.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    const result = await login(credentials);

    expect(result).toEqual({
      message: "Invalid credentials",
      error: "unauthorized",
      statusCode: 401,
    });
  });

  it("should handle error.request case", async () => {
    (http.post as jest.Mock).mockRejectedValue({
      request: {},
    });

    const result = await login(credentials);

    expect(result).toEqual({
      message: "The request was made but no response was received",
      error: "unauthorized",
      statusCode: 401,
    });
  });

  it("should handle default error case", async () => {
    (http.post as jest.Mock).mockRejectedValue(new Error("Some random error"));

    const result = await login(credentials);

    expect(result).toEqual({
      message: "An unknown error occured while logging in",
      error: "unauthorized",
      statusCode: 401,
    });
  });
});
