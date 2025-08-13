import { http } from "@/app/utils/http";
import { BASE_URL } from "@/app/utils/config";
import { DelMetricsApi, deleteMetricCategory } from "./metrics-del.component";

jest.mock("@/app/utils/http", () => ({
  http: {
    del: jest.fn(),
  },
}));

describe("DelMetricsApi & deleteMetricCategory", () => {
  const id = 234;
  const token = "Token234";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTS FOR DelMetricsApi

  describe("DelMetricsApi", () => {
    it("should return true when deletion is successful (status 200)", async () => {
      (http.del as jest.Mock).mockResolvedValue({ status: 200 });

      const response = await DelMetricsApi(token, id);

      expect(response).toBe(true);
      expect(http.del).toHaveBeenCalledWith(`${BASE_URL}/metrics/${id}`, {
        Authorization: `Bearer ${token}`,
      });
    });

    it("should return false when deletion is not successful (status != 200)", async () => {
      (http.del as jest.Mock).mockResolvedValue({ status: 404 });

      const response = await DelMetricsApi(token, id);

      expect(response).toBe(false);
    });

    it("should throw correct error when server responds with error", async () => {
      (http.del as jest.Mock).mockRejectedValue({
        response: { data: { message: "Server error occurred" } },
      });

      await expect(DelMetricsApi(token, id)).rejects.toThrow(
        "Server error occurred",
      );
    });

    it("should throw correct error when request is made but no response", async () => {
      (http.del as jest.Mock).mockRejectedValue({
        request: {},
      });

      await expect(DelMetricsApi(token, id)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });

    it("should throw default error message for other errors", async () => {
      (http.del as jest.Mock).mockRejectedValue(new Error("Some setup error"));

      await expect(DelMetricsApi(token, id)).rejects.toThrow(
        "An unknown error occured while deleting metric",
      );
    });
  });

  // TESTS FOR deleteMetricCategory ----
  describe("deleteMetricCategory", () => {
    it("should return true when deletion is successful (status 200)", async () => {
      (http.del as jest.Mock).mockResolvedValue({ status: 200 });

      const response = await deleteMetricCategory(token, id);

      expect(response).toBe(true);
      expect(http.del).toHaveBeenCalledWith(
        `${BASE_URL}/metric-categories/${id}`,
        { Authorization: `Bearer ${token}` },
      );
    });

    it("should return false when deletion is not successful (status != 200)", async () => {
      (http.del as jest.Mock).mockResolvedValue({ status: 404 });

      const response = await deleteMetricCategory(token, id);

      expect(response).toBe(false);
    });

    it("should throw correct error when server responds with error", async () => {
      (http.del as jest.Mock).mockRejectedValue({
        response: { data: { message: "Server error occurred" } },
      });

      await expect(deleteMetricCategory(token, id)).rejects.toThrow(
        "Server error occurred",
      );
    });

    it("should throw correct error when request is made but no response", async () => {
      (http.del as jest.Mock).mockRejectedValue({
        request: {},
      });

      await expect(deleteMetricCategory(token, id)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });

    it("should throw default error message for other errors", async () => {
      (http.del as jest.Mock).mockRejectedValue(new Error("Some setup error"));

      await expect(deleteMetricCategory(token, id)).rejects.toThrow(
        "An unknown error occured while deleting metric categories",
      );
    });
  });
});
