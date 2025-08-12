// patchMetricsApi.test.ts
import { PatchMetricsApi, patchMetricCategories } from "./metrics-patch.api";
import { http } from "../../utils/http";
import { Metrics } from "../../interfaces/metrics.interface";
import { BASE_URL } from "@/app/utils/config";

jest.mock("../../utils/http", () => ({
  http: {
    patch: jest.fn(),
  },
}));

describe("PatchMetricsApi", () => {
  const token = "test-token";
  const metric_id = 123;
  const value = { metric: "CPU Usage", description: "desc", unit: "%" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should patch metric successfully", async () => {
    const mockResponse = {
      data: {
        metric: "CPU Usage",
        id: 123,
        description: "desc",
        unit: "%",
      },
    };
    (http.patch as jest.Mock).mockResolvedValue(mockResponse);

    const result: Metrics = await PatchMetricsApi(token, metric_id, value);

    expect(http.patch).toHaveBeenCalledWith(
      `${BASE_URL}/metrics/${metric_id}`,
      value,
      { Authorization: `Bearer ${token}` },
    );
    expect(result).toEqual({
      value: "CPU Usage",
      metric_id: 123,
      description: "desc",
      unit: "%",
    });
  });

  it("should throw error when error.response exists", async () => {
    (http.patch as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    await expect(PatchMetricsApi(token, metric_id, value)).rejects.toThrow(
      "Server error",
    );
  });

  it("should throw error when error.request exists", async () => {
    (http.patch as jest.Mock).mockRejectedValue({
      request: {},
    });

    await expect(PatchMetricsApi(token, metric_id, value)).rejects.toThrow(
      "The request was made but no response was received",
    );
  });

  it("should throw default error for unknown issue", async () => {
    (http.patch as jest.Mock).mockRejectedValue(new Error("Random error"));

    await expect(PatchMetricsApi(token, metric_id, value)).rejects.toThrow(
      "An unknown error occured while patching metrics", // match implementation typo
    );
  });
});

describe("patchMetricCategories", () => {
  const token = "test-token";
  const metric_category_id = 456;
  const value = {
    metric_id: 1,
    category_id: 2,
    description: "desc",
    label: "label",
    code: "code",
    source: "source",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should patch metric category successfully", async () => {
    (http.patch as jest.Mock).mockResolvedValue({ data: {} });

    await patchMetricCategories(token, metric_category_id, value);

    expect(http.patch).toHaveBeenCalledWith(
      `${BASE_URL}/metric-categories/${metric_category_id}`,
      value,
      { Authorization: `Bearer ${token}` },
    );
  });

  it("should throw error when error.response exists", async () => {
    (http.patch as jest.Mock).mockRejectedValue({
      response: { data: { message: "Category error" } },
    });

    await expect(
      patchMetricCategories(token, metric_category_id, value),
    ).rejects.toThrow("Category error");
  });

  it("should throw error when error.request exists", async () => {
    (http.patch as jest.Mock).mockRejectedValue({
      request: {},
    });

    await expect(
      patchMetricCategories(token, metric_category_id, value),
    ).rejects.toThrow("The request was made but no response was received");
  });

  it("should throw default error for unknown issue", async () => {
    (http.patch as jest.Mock).mockRejectedValue(new Error("Random error"));

    await expect(
      patchMetricCategories(token, metric_category_id, value),
    ).rejects.toThrow("An unknown error occured while patching metrics"); // match implementation typo
  });
});
