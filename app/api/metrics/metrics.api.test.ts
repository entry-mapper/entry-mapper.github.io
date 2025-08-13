import {
  getAvailableMetrics,
  getMetricValuesForCountries,
} from "./metrics.api";
import { http } from "../../utils/http";
import { BASE_URL } from "../../utils/config";

jest.mock("../../utils/http", () => ({
  http: { get: jest.fn() },
}));

describe("metrics.api", () => {
  const mockToken = "sampleToken";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- getAvailableMetrics ----
  it("getAvailableMetrics → should return mapped MetricCategories on success", async () => {
    (http.get as jest.Mock).mockResolvedValue([
      {
        category_id: 1,
        category_name: "Category A",
        description: "Description A",
        metrics: [{ value: 10, metric_id: 101, description: "Metric 1" }],
        sub_categories: [
          {
            category_id: 2,
            category_name: "SubCategory A1",
            metrics: [{ value: 20, metric_id: 102, description: "Metric 2" }],
          },
        ],
      },
    ]);

    const result = await getAvailableMetrics(mockToken);

    expect(result).toEqual([
      {
        category_id: 1,
        category_name: "Category A",
        description: "Description A",
        metrics: [{ value: 10, metric_id: 101, description: "Metric 1" }],
        sub_categories: [
          {
            category_id: 2,
            category_name: "SubCategory A1",
            metrics: [{ value: 20, metric_id: 102, description: "Metric 2" }],
          },
        ],
      },
    ]);

    expect(http.get).toHaveBeenCalledWith(`${BASE_URL}/categories`, {
      Authorization: `Bearer ${mockToken}`,
    });
  });

  it("getAvailableMetrics → should handle missing metrics and sub_categories", async () => {
    (http.get as jest.Mock).mockResolvedValue([
      {
        category_id: 3,
        category_name: "Category No Data",
        description: "No metrics or subcategories",
        metrics: undefined,
        sub_categories: undefined,
      },
    ]);

    const result = await getAvailableMetrics(mockToken);

    expect(result).toEqual([
      {
        category_id: 3,
        category_name: "Category No Data",
        description: "No metrics or subcategories",
        metrics: undefined,
        sub_categories: undefined,
      },
    ]);
  });

  it("getAvailableMetrics → should handle subcategories without metrics", async () => {
    (http.get as jest.Mock).mockResolvedValue([
      {
        category_id: 4,
        category_name: "Category Partial",
        description: "Has subcategories but no metrics in them",
        metrics: [],
        sub_categories: [
          {
            category_id: 5,
            category_name: "Empty Subcategory",
            metrics: undefined,
          },
        ],
      },
    ]);

    const result = await getAvailableMetrics(mockToken);

    expect(result).toEqual([
      {
        category_id: 4,
        category_name: "Category Partial",
        description: "Has subcategories but no metrics in them",
        metrics: [],
        sub_categories: [
          {
            category_id: 5,
            category_name: "Empty Subcategory",
            metrics: undefined,
          },
        ],
      },
    ]);
  });

  it("getAvailableMetrics → should throw error when error.response exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    await expect(getAvailableMetrics(mockToken)).rejects.toThrow(
      "Server error",
    );
  });

  it("getAvailableMetrics → should throw error when error.request exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({ request: {} });

    await expect(getAvailableMetrics(mockToken)).rejects.toThrow(
      "The request was made but no response was received",
    );
  });

  it("getAvailableMetrics → should throw default error when no response or request", async () => {
    (http.get as jest.Mock).mockRejectedValue({});

    await expect(getAvailableMetrics(mockToken)).rejects.toThrow(
      "An unknown error occured while fetching available metrics",
    );
  });

  // ---- getMetricValuesForCountries ----
  const metricIds = [101, 102];
  const countryIds = [1, 2];

  it("getMetricValuesForCountries → should return mapped CountryMetricValues on success", async () => {
    const mockData = [
      { metric_id: 101, country_id: 1, value: 50 },
      { metric_id: 102, country_id: 2, value: 75 },
    ];

    (http.get as jest.Mock).mockResolvedValue(mockData);

    const result = await getMetricValuesForCountries(
      mockToken,
      metricIds,
      countryIds,
    );

    expect(result).toEqual(mockData);
    expect(http.get).toHaveBeenCalledWith(
      `${BASE_URL}/country-data`,
      { Authorization: `Bearer ${mockToken}` },
      { q: JSON.stringify({ metric_ids: metricIds, country_ids: countryIds }) },
    );
  });

  it("getMetricValuesForCountries → should handle empty response array", async () => {
    (http.get as jest.Mock).mockResolvedValue([]);

    const result = await getMetricValuesForCountries(
      mockToken,
      metricIds,
      countryIds,
    );

    expect(result).toEqual([]);
  });

  it("getMetricValuesForCountries → should throw error when error.response exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    await expect(
      getMetricValuesForCountries(mockToken, metricIds, countryIds),
    ).rejects.toThrow("Server error");
  });

  it("getMetricValuesForCountries → should throw error when error.request exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({ request: {} });

    await expect(
      getMetricValuesForCountries(mockToken, metricIds, countryIds),
    ).rejects.toThrow("The request was made but no response was received");
  });

  it("getMetricValuesForCountries → should throw default error when no response or request", async () => {
    (http.get as jest.Mock).mockRejectedValue({});

    await expect(
      getMetricValuesForCountries(mockToken, metricIds, countryIds),
    ).rejects.toThrow(
      "An unknown error occured while fetching country metrics",
    );
  });
});
