import { delCategories } from "./categories-del.api";
import { http } from "../../utils/http"; // Adjust the path
import { BASE_URL } from "@/app/utils/config";

jest.mock("../../utils/http", () => ({
  http: {
    del: jest.fn(),
  },
}));

describe("delCategories", () => {
  const mockToken = "sampleToken";
  const mockId = 123;

  it("should return true when deletion is successful", async () => {
    (http.del as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await delCategories(mockToken, mockId);
    expect(result).toBe(true);
    expect(http.del).toHaveBeenCalledWith(`${BASE_URL}/categories/${mockId}`, {
      Authorization: `Bearer ${mockToken}`,
    });
  });

  it("should return false when deletion fails with non-200 status", async () => {
    (http.del as jest.Mock).mockResolvedValue({ status: 400 });

    const result = await delCategories(mockToken, mockId);
    expect(result).toBe(false);
  });

  it("should throw an error if request fails with response", async () => {
    const error = {
      response: {
        data: {
          message: "Not authorized",
        },
      },
    };
    (http.del as jest.Mock).mockRejectedValue(error);

    await expect(delCategories(mockToken, mockId)).rejects.toThrow(
      "Not authorized",
    );
  });

  it("should throw a default error if no response or request exists", async () => {
    (http.del as jest.Mock).mockRejectedValue({});

    await expect(delCategories(mockToken, mockId)).rejects.toThrow(
      "An unknown error occured while fetching regions",
    );
  });
});
