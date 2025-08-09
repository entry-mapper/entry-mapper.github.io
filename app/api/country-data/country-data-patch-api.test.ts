import { PatchCountryDataApi } from './country-data-patch.api';
import { http } from '../../utils/http';

jest.mock('../../utils/http', () => ({
  http: {
    patch: jest.fn(),
  },
}));

describe('PatchCountryDataApi', () => {
  const token = 'mockToken';
  const countrydata_id = 123;
  const user_id = 456;
  const value = 'newValue';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when response.status is 200', async () => {
    (http.patch as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await PatchCountryDataApi(token, countrydata_id, user_id, value);

    expect(http.patch).toHaveBeenCalledWith(
      expect.stringContaining(`/country-data/${countrydata_id}`),
      { value, user_id },
      { Authorization: `Bearer ${token}` }
    );
    expect(result).toBe(true);
  });

  it('should return false when response.status is not 200', async () => {
    (http.patch as jest.Mock).mockResolvedValue({ status: 400 });

    const result = await PatchCountryDataApi(token, countrydata_id, user_id, value);
    expect(result).toBe(false);
  });

  it('should throw error when error.response exists', async () => {
    (http.patch as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Server error' } },
    });

    await expect(
      PatchCountryDataApi(token, countrydata_id, user_id, value)
    ).rejects.toThrow('Server error');
  });

  it('should throw error when error.request exists', async () => {
    (http.patch as jest.Mock).mockRejectedValue({ request: {} });

    await expect(
      PatchCountryDataApi(token, countrydata_id, user_id, value)
    ).rejects.toThrow('The request was made but no response was received');
  });

  it('should throw default error when neither response nor request exists', async () => {
    (http.patch as jest.Mock).mockRejectedValue({});

    await expect(
      PatchCountryDataApi(token, countrydata_id, user_id, value)
    ).rejects.toThrow('An unknown error occured while fetching regions');
  });
});
