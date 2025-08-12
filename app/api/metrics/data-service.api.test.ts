import {
  getTemplate,
  getEntireDb,
  resetDatabase,
  postBulkUploadData,
} from "./data-service.api";
import { http } from "../../utils/http";
import { BASE_URL } from "@/app/utils/config";

jest.mock("../../utils/http", () => ({
  http: {
    get: jest.fn(),
    del: jest.fn(),
    post: jest.fn(),
  },
}));

describe("Data Service API", () => {
  const token = "test-token";
  const mockResponse = { data: "success" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTemplate", () => {
    it("should return response on success", async () => {
      (http.get as jest.Mock).mockResolvedValue(mockResponse);
      const res = await getTemplate(token);
      expect(res).toBe(mockResponse);
      expect(http.get).toHaveBeenCalledWith(
        `${BASE_URL}/data-service/template`,
        {
          Authorization: `Bearer ${token}`,
        },
      );
    });

    it("should throw error with message from error.response", async () => {
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: "Error from server" } },
      });
      await expect(getTemplate(token)).rejects.toThrow("Error from server");
    });

    it("should throw error when error.request exists", async () => {
      (http.get as jest.Mock).mockRejectedValue({ request: {} });
      await expect(getTemplate(token)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });

    it("should throw default error message when neither response nor request exists", async () => {
      (http.get as jest.Mock).mockRejectedValue({});
      await expect(getTemplate(token)).rejects.toThrow(
        "An unknown error occured while fetching regions",
      );
    });
  });

  describe("getEntireDb", () => {
    it("should return response on success", async () => {
      (http.get as jest.Mock).mockResolvedValue(mockResponse);
      const res = await getEntireDb(token);
      expect(res).toBe(mockResponse);
      expect(http.get).toHaveBeenCalledWith(`${BASE_URL}/data-service/get-db`, {
        Authorization: `Bearer ${token}`,
      });
    });

    it("should throw error from error.response", async () => {
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: "DB error" } },
      });
      await expect(getEntireDb(token)).rejects.toThrow("DB error");
    });

    it("should throw request error", async () => {
      (http.get as jest.Mock).mockRejectedValue({ request: {} });
      await expect(getEntireDb(token)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });

    it("should throw default error", async () => {
      (http.get as jest.Mock).mockRejectedValue({});
      await expect(getEntireDb(token)).rejects.toThrow(
        "An unknown error occured while fetching regions",
      );
    });
  });

  describe("resetDatabase", () => {
    it("should return response on success", async () => {
      (http.del as jest.Mock).mockResolvedValue(mockResponse);
      const res = await resetDatabase(token);
      expect(res).toBe(mockResponse);
      expect(http.del).toHaveBeenCalledWith(`${BASE_URL}/data-service/reset`, {
        Authorization: `Bearer ${token}`,
      });
    });

    it("should throw error from error.response", async () => {
      (http.del as jest.Mock).mockRejectedValue({
        response: { data: { message: "Reset failed" } },
      });
      await expect(resetDatabase(token)).rejects.toThrow("Reset failed");
    });

    it("should throw request error", async () => {
      (http.del as jest.Mock).mockRejectedValue({ request: {} });
      await expect(resetDatabase(token)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });

    it("should throw default error", async () => {
      (http.del as jest.Mock).mockRejectedValue({});
      await expect(resetDatabase(token)).rejects.toThrow(
        "An unknown error occured while reseting db",
      );
    });
  });

  describe("postBulkUploadData", () => {
    const formData = new FormData();

    it("should return response on success", async () => {
      (http.post as jest.Mock).mockResolvedValue(mockResponse);
      const res = await postBulkUploadData(token, formData);
      expect(res).toBe(mockResponse);
      expect(http.post).toHaveBeenCalledWith(
        `${BASE_URL}/data-service/upload`,
        formData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      );
    });

    it("should throw error from error.response", async () => {
      (http.post as jest.Mock).mockRejectedValue({
        response: { data: { message: "Upload failed" } },
      });
      await expect(postBulkUploadData(token, formData)).rejects.toThrow(
        "Upload failed",
      );
    });

    it("should throw request error", async () => {
      (http.post as jest.Mock).mockRejectedValue({ request: {} });
      await expect(postBulkUploadData(token, formData)).rejects.toThrow(
        "The request was made but no response was received",
      );
    });

    it("should throw default error", async () => {
      (http.post as jest.Mock).mockRejectedValue({});
      await expect(postBulkUploadData(token, formData)).rejects.toThrow(
        "An unknown error occured while fetching regions",
      );
    });
  });
});
