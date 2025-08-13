import { http } from "@/app/utils/http";
import {
  getCategories,
  getCategoriesNested,
  getMetricCategories,
} from "./categories-get.api";
import { BASE_URL } from "@/app/utils/config";
jest.mock("@/app/utils/http", () => ({
  http: {
    get: jest.fn(),
  },
}));

describe("Category API Functions", () => {
  const mockToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategoriesNested", () => {
    it("should return nested categories when API call is successful", async () => {
      const mockResponse = [
        {
          category_id: "1",
          category_name: "Category 1",
          description: "Description 1",
          metrics: [
            {
              unit: "unit1",
              value: 10,
              metric_id: "m1",
              description: "Metric 1",
            },
          ],
          sub_categories: [
            {
              category_id: "2",
              category_name: "Subcategory 1",
              metrics: [
                {
                  unit: "unit2",
                  value: 20,
                  metric_id: "m2",
                  description: "Metric 2",
                },
              ],
            },
          ],
        },
      ];

      (http.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getCategoriesNested(mockToken);

      expect(http.get).toHaveBeenCalledWith(
        `${BASE_URL}/categories`,
        { Authorization: `Bearer ${mockToken}` },
        { q: "nested" },
      );
      expect(result).toEqual([
        {
          category_id: "1",
          category_name: "Category 1",
          description: "Description 1",
          metrics: [
            {
              unit: "unit1",
              value: 10,
              metric_id: "m1",
              description: "Metric 1",
            },
          ],
          sub_categories: [
            {
              category_id: "2",
              category_name: "Subcategory 1",
              metrics: [
                {
                  unit: "unit2",
                  value: 20,
                  metric_id: "m2",
                  description: "Metric 2",
                },
              ],
            },
          ],
        },
      ]);
    });

    it("should throw an error when API call fails with response error", async () => {
      const errorMessage = "Failed to fetch categories";
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(getCategoriesNested(mockToken)).rejects.toThrow(
        errorMessage,
      );
    });

    it("should throw an error when no response is received", async () => {
      (http.get as jest.Mock).mockRejectedValue({ request: true });

      await expect(getCategoriesNested(mockToken)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });
  });

  describe("getCategories", () => {
    it("should return categories when API call is successful", async () => {
      const mockResponse = [
        {
          id: "1",
          category_name: "Category 1",
          parent_id: null,
          parent_category_name: null,
          description: "Description 1",
        },
      ];

      (http.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getCategories(mockToken);

      expect(http.get).toHaveBeenCalledWith(`${BASE_URL}/categories`, {
        Authorization: `Bearer ${mockToken}`,
      });
      expect(result).toEqual([
        {
          category_id: "1",
          category_name: "Category 1",
          parent_id: null,
          parent_category_name: null,
          description: "Description 1",
        },
      ]);
    });

    it("should throw an error when API call fails", async () => {
      const errorMessage = "Failed to fetch categories";
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(getCategories(mockToken)).rejects.toThrow(errorMessage);
    });
  });

  describe("getMetricCategories", () => {
    it("should return metric categories when API call is successful", async () => {
      const mockResponse = [
        {
          id: "1",
          metric: "Metric 1",
          category: { id: "c1", name: "Category 1" },
          super_category: { id: "sc1", name: "Super Category 1" },
          description: "Description 1",
          label: "Label 1",
          code: "Code 1",
          source: "Source 1",
        },
      ];

      (http.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getMetricCategories(mockToken);

      expect(http.get).toHaveBeenCalledWith(`${BASE_URL}/metric-categories`, {
        Authorization: `Bearer ${mockToken}`,
      });
      expect(result).toEqual([
        {
          id: "1",
          metric: "Metric 1",
          category: { id: "c1", name: "Category 1" },
          super_category: { id: "sc1", name: "Super Category 1" },
          description: "Description 1",
          label: "Label 1",
          code: "Code 1",
          source: "Source 1",
        },
      ]);
    });

    it("should throw an error when API call fails", async () => {
      const errorMessage = "Failed to fetch metric categories";
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(getMetricCategories(mockToken)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
