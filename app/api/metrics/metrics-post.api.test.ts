import { AddMetricsApi, addMetricCategory } from "./metrics-post.api";
import { http } from "../../utils/http";
import { BASE_URL } from "../../utils/config";

jest.mock("../../utils/http", () => ({
  http: { post: jest.fn() },
}));

describe("metrics-add.api", () => {
  const mockToken = "sampleToken";

  // ---- AddMetricsApi ----
  it("AddMetricsApi → should return mapped metric on success", async () => {
    (http.post as jest.Mock).mockResolvedValue({
      data: {
        metric: "Metric Name",
        id: 1,
        description: "Metric Description",
        unit: "kg",
      },
    });

    const result = await AddMetricsApi(mockToken, {
      metric: "Metric Name",
      description: "Metric Description",
      unit: "kg",
    });

    expect(result).toEqual({
      value: "Metric Name",
      metric_id: 1,
      description: "Metric Description",
      unit: "kg",
    });

    expect(http.post).toHaveBeenCalledWith(
      `${BASE_URL}/metrics/`,
      { metric: "Metric Name", description: "Metric Description", unit: "kg" },
      { Authorization: `Bearer ${mockToken}` },
    );
  });

  it("AddMetricsApi → should throw error when error.response exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    await expect(
      AddMetricsApi(mockToken, { metric: "", description: "", unit: "" }),
    ).rejects.toThrow("Server error");
  });

  it("AddMetricsApi → should throw error when error.request exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({ request: {} });

    await expect(
      AddMetricsApi(mockToken, { metric: "", description: "", unit: "" }),
    ).rejects.toThrow("The request was made but no response was received");
  });

  it("AddMetricsApi → should throw default error when no response or request", async () => {
    (http.post as jest.Mock).mockRejectedValue({});

    await expect(
      AddMetricsApi(mockToken, { metric: "", description: "", unit: "" }),
    ).rejects.toThrow("An unknown error occured while patching metrics");
  });

  // ---- addMetricCategory ----
  it("addMetricCategory → should return response on success", async () => {
    const mockResponse = { data: "ok" };
    (http.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await addMetricCategory(mockToken, {
      metric_id: 1,
      description: "desc",
      category_id: 2,
    });

    expect(result).toEqual(mockResponse);
    expect(http.post).toHaveBeenCalledWith(
      `${BASE_URL}/metric-categories`,
      { metric_id: 1, description: "desc", category_id: 2 },
      { Authorization: `Bearer ${mockToken}` },
    );
  });

  it("addMetricCategory → should throw error when error.response exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    await expect(
      addMetricCategory(mockToken, {
        metric_id: 0,
        description: "",
        category_id: 0,
      }),
    ).rejects.toThrow("Server error");
  });

  it("addMetricCategory → should throw error when error.request exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({ request: {} });

    await expect(
      addMetricCategory(mockToken, {
        metric_id: 0,
        description: "",
        category_id: 0,
      }),
    ).rejects.toThrow("The request was made but no response was received");
  });

  it("addMetricCategory → should throw default error when no response or request", async () => {
    (http.post as jest.Mock).mockRejectedValue({});

    await expect(
      addMetricCategory(mockToken, {
        metric_id: 0,
        description: "",
        category_id: 0,
      }),
    ).rejects.toThrow(
      "An unknown error occured while patching metric categories",
    );
  });
});
