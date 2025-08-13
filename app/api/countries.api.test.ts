// __tests__/getCountriesApi.test.ts
import { getCountriesApi } from "./countries.api";
import { http } from "../utils/http";
import { Country } from "../interfaces/country.interfaces";

jest.mock("../utils/http", () => ({
  http: {
    get: jest.fn(),
  },
}));

describe("getCountriesApi", () => {
  const token = "test-token";
  const mockCountries: Country[] = [
    {
      id: 1,
      country_name: "Pakistan",
      iso_code: "PK",
      region: {
        id: 101,
        region_name: "South Asia",
      },
    },
    {
      id: 2,
      country_name: "India",
      iso_code: "IN",
      region: {
        id: 102,
        region_name: "South Asia",
      },
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return countries on success", async () => {
    (http.get as jest.Mock).mockResolvedValue(mockCountries);

    const result = await getCountriesApi(token);

    expect(http.get).toHaveBeenCalledWith(
      expect.stringContaining("/countries"),
      { Authorization: `Bearer ${token}` },
    );
    expect(result).toEqual(mockCountries);
  });

  it("should throw error when error.response exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({
      response: { data: { message: "Server Error" } },
    });

    await expect(getCountriesApi(token)).rejects.toThrow("Server Error");
  });

  it("should throw error when error.request exists", async () => {
    (http.get as jest.Mock).mockRejectedValue({
      request: {},
    });

    await expect(getCountriesApi(token)).rejects.toThrow(
      "The request was made but no response was received",
    );
  });

  it("should throw error when generic error occurs", async () => {
    (http.get as jest.Mock).mockRejectedValue(new Error("Something bad"));

    await expect(getCountriesApi(token)).rejects.toThrow(
      "An unknown error occured while fetching regions",
    );
  });
});
