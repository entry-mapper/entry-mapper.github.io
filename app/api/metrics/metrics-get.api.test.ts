import { http } from "@/app/utils/http";
import { BASE_URL } from "@/app/utils/config";
import { GetMetricsApi } from "./metrics-get.api"; // adjust file path as needed

jest.mock("@/app/utils/http", () => ({
  http: {
    get: jest.fn(),
  },
}));

describe("GetMetricsApi", () => {
  const token = "Token123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return mapped metrics when request is successful", async () => {
    const mockApiResponse = [
      { metric: "Speed", id: 1, description: "Vehicle speed", unit: "km/h" },
      { metric: "Distance", id: 2, description: "Travel distance", unit: "km" },
    ];

    (http.get as jest.Mock).mockResolvedValue(mockApiResponse);

    const result = await GetMetricsApi(token);

    expect(result).toEqual([
      {
        value: "Speed",
        metric_id: 1,
        description: "Vehicle speed",
        unit: "km/h",
      },
      {
        value: "Distance",
        metric_id: 2,
        description: "Travel distance",
        unit: "km",
      },
    ]);
    expect(http.get).toHaveBeenCalledWith(`${BASE_URL}/metrics`, {
      Authorization: `Bearer ${token}`,
    });
  });

  it("should throw server error message when error.response exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error occurred" } },
    });

    await expect(GetMetricsApi(token)).rejects.toThrow("Server error occurred");
  });

  it("should throw no response error when error.request exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({
      request: {},
    });

    await expect(GetMetricsApi(token)).rejects.toThrow(
      "The request was made but no response was received",
    );
  });

  it("should throw default error message for other errors", async () => {
    (http.get as jest.Mock).mockRejectedValue(new Error("Some unknown error"));

    await expect(GetMetricsApi(token)).rejects.toThrow(
      "An unknown error occured while fetching regions",
    );
  });
});
