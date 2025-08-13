import { AddCountryDataApi } from "./country-data-post.api";
import { http } from "../../utils/http";

jest.mock("../../utils/http", () => ({
  http: {
    post: jest.fn(),
  },
}));

describe("AddCountryDataApi", () => {
  const token = "mockToken";
  const formData = {
    country_id: 1,
    metric_category_id: 2,
    value: "100",
    user_id: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when response.status is 200", async () => {
    (http.post as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await AddCountryDataApi(token, formData);

    expect(http.post).toHaveBeenCalledWith(
      expect.stringContaining("/country-data"),
      formData,
      { Authorization: `Bearer ${token}` },
    );
    expect(result).toBe(true);
  });

  it("should return false when response.status is not 200", async () => {
    (http.post as jest.Mock).mockResolvedValue({ status: 400 });

    const result = await AddCountryDataApi(token, formData);
    expect(result).toBe(false);
  });

  it("should throw error when error.response exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    await expect(AddCountryDataApi(token, formData)).rejects.toThrow(
      "Server error",
    );
  });

  it("should throw error when error.request exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({ request: {} });

    await expect(AddCountryDataApi(token, formData)).rejects.toThrow(
      "The request was made but no response was received",
    );
  });

  it("should throw default error when neither response nor request exists", async () => {
    (http.post as jest.Mock).mockRejectedValue({});

    await expect(AddCountryDataApi(token, formData)).rejects.toThrow(
      "An unknown error occured while fetching regions",
    );
  });
});
