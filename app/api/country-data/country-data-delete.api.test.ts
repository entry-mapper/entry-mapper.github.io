import { DelCountryDataApi } from "./country-data-delete.api";
import { http } from "../../utils/http";
import { BASE_URL } from "@/app/utils/config";
jest.mock("../../utils/http", () => ({
  http: {
    del: jest.fn(),
  },
}));

describe("DelCountryDataApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when deletion is successful", async () => {
    (http.del as jest.Mock).mockResolvedValueOnce({ status: 200 });

    const result = await DelCountryDataApi("123", 2);
    expect(result).toBe(true);
    expect(http.del).toHaveBeenCalledWith(`${BASE_URL}/country-data/2`, {
      Authorization: "Bearer 123",
    });
  });

  it("should return false when deletion fails (non-200 status)", async () => {
    (http.del as jest.Mock).mockResolvedValueOnce({ status: 404 });

    const result = await DelCountryDataApi("123", 2);
    expect(result).toBe(false);
  });

  it("should throw an error when the server responds with an error message", async () => {
    (http.del as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: "Country not found",
        },
      },
    });

    await expect(DelCountryDataApi("123", 999)).rejects.toThrow("Country not found");
  });

  it("should throw a generic error when no response is received", async () => {
    (http.del as jest.Mock).mockRejectedValueOnce({
      request: {},
    });

    await expect(DelCountryDataApi("123", 999)).rejects.toThrow(
      "The request was made but no response was received"
    );
  });

  it("should throw default error when an unknown error occurs", async () => {
    (http.del as jest.Mock).mockRejectedValueOnce(new Error("Unexpected failure"));

    await expect(DelCountryDataApi("123", 999)).rejects.toThrow(
      "An unknown error occured while fetching regions"
    );
  });
});
