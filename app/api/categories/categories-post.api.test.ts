import { http } from "@/app/utils/http";
import { postCategories } from "./categories-post.api";
import { IPostCategory } from "@/app/interfaces/categories.interface";
import { BASE_URL } from "@/app/utils/config";

jest.mock("@/app/utils/http", () => ({
  http: {
    post: jest.fn(),
  },
}));

describe("postCategories", () => {
  const mockToken = "mock-token";
  const mockPostCategory: IPostCategory = {
    category_name: "New Category",
    parent_id: null,
    description: "Category description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when post is successful with status 200", async () => {
    (http.post as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await postCategories(mockToken, mockPostCategory);

    expect(http.post).toHaveBeenCalledWith(
      `${BASE_URL}/categories`,
      {
        category_name: mockPostCategory.category_name,
        parent_id: mockPostCategory.parent_id,
        description: mockPostCategory.description,
      },
      { Authorization: `Bearer ${mockToken}` },
    );
    expect(result).toBe(true);
  });

  it("should throw an error when API call fails with response error", async () => {
    const errorMessage = "Failed to create category";
    (http.post as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    await expect(postCategories(mockToken, mockPostCategory)).rejects.toThrow(
      errorMessage,
    );
  });

  it("should throw an error when no response is received", async () => {
    (http.post as jest.Mock).mockRejectedValue({ request: true });

    await expect(postCategories(mockToken, mockPostCategory)).rejects.toThrow(
      "The request was made but no response was received",
    );
  });

  it("should throw default error message for unknown errors", async () => {
    (http.post as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await expect(postCategories(mockToken, mockPostCategory)).rejects.toThrow(
      "An unknown error occured while fetching regions",
    );
  });

  it("should handle non-200 status by not returning true", async () => {
    (http.post as jest.Mock).mockResolvedValue({ status: 400 });

    const result = await postCategories(mockToken, mockPostCategory);

    expect(result).toBeUndefined(); // Only returns true on 200
    expect(http.post).toHaveBeenCalledWith(
      `${BASE_URL}/categories`,
      {
        category_name: mockPostCategory.category_name,
        parent_id: mockPostCategory.parent_id,
        description: mockPostCategory.description,
      },
      { Authorization: `Bearer ${mockToken}` },
    );
  });

  it("should correctly handle post with empty description", async () => {
    const postCategoryWithEmptyDesc: IPostCategory = {
      ...mockPostCategory,
      description: "",
    };
    (http.post as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await postCategories(mockToken, postCategoryWithEmptyDesc);

    expect(http.post).toHaveBeenCalledWith(
      `${BASE_URL}/categories`,
      {
        category_name: postCategoryWithEmptyDesc.category_name,
        parent_id: postCategoryWithEmptyDesc.parent_id,
        description: "",
      },
      { Authorization: `Bearer ${mockToken}` },
    );
    expect(result).toBe(true);
  });
});
