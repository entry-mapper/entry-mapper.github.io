import { http } from "@/app/utils/http";
import { patchCategories } from "./categories-patch.api";
import { IPatchCategory } from "@/app/interfaces/categories.interface";
import { BASE_URL } from "@/app/utils/config";

jest.mock("@/app/utils/http", () => ({
  http: {
    patch: jest.fn(),
  },
}));

describe("patchCategories", () => {
  const mockToken = "mock-token";
  const mockPatchCategory: IPatchCategory = {
    category_id: 1,
    category_name: "Updated Category",
    parent_id: null,
    description: "Updated description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when patch is successful", async () => {
    (http.patch as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await patchCategories(mockToken, mockPatchCategory);

    expect(http.patch).toHaveBeenCalledWith(
      `${BASE_URL}/categories/${mockPatchCategory.category_id}`,
      {
        category_name: mockPatchCategory.category_name,
        parent_id: mockPatchCategory.parent_id,
        description: mockPatchCategory.description,
      },
      { Authorization: `Bearer ${mockToken}` }
    );
    expect(result).toBe(true);
  });

  it("should throw an error when API call fails with response error", async () => {
    const errorMessage = "Failed to update category";
    (http.patch as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    await expect(patchCategories(mockToken, mockPatchCategory)).rejects.toThrow(errorMessage);
  });

  it("should throw an error when no response is received", async () => {
    (http.patch as jest.Mock).mockRejectedValue({ request: true });

    await expect(patchCategories(mockToken, mockPatchCategory)).rejects.toThrow(
      "The request was made but no response was received"
    );
  });

  it("should throw default error message for unknown errors", async () => {
    (http.patch as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await expect(patchCategories(mockToken, mockPatchCategory)).rejects.toThrow(
      "An unknown error occured while fetching regions"
    );
  });
});