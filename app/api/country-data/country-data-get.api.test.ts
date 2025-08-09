import { GetCountryDataApi, getCountryDataByMetric } from "./country-data-get.api";
import { http } from '../../utils/http';
import { ICountryData } from '../../interfaces/country.interfaces';

jest.mock('../../utils/http', () => ({
  http: {
    get: jest.fn(),
  },
}));

describe('Country Data API', () => {
  const token = 'mockToken';
  const id = 1;

  const mockApiData: ICountryData[] = [
    {
      id: 1,
      country_name: 'Country A',
      region_name: 'Region X',
      metric: 'GDP',
      category: 'Economy',
      super_category: 'Finance',
      unit: 'USD',
      value: 1000,
    },
    {
      id: 2,
      country_name: 'Country B',
      region_name: 'Region Y',
      metric: 'Population',
      category: 'Demographics',
      super_category: '',
      unit: 'People',
      value: 500000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GetCountryDataApi', () => {
    it('should return mapped country data on success', async () => {
      (http.get as jest.Mock).mockResolvedValue(mockApiData);

      const result = await GetCountryDataApi(token, id);

      expect(http.get).toHaveBeenCalledWith(
        expect.stringContaining(`/country-data/country/${id}`),
        { Authorization: `Bearer ${token}` },
      );
      expect(result).toEqual([
        {
          id: 1,
          country_name: 'Country A',
          region_name: 'Region X',
          metric: 'GDP',
          category: 'Economy',
          super_category: 'Finance',
          unit: 'USD',
          value: 1000,
        },
        {
          id: 2,
          country_name: 'Country B',
          region_name: 'Region Y',
          metric: 'Population',
          category: '',
          super_category: 'Demographics',
          unit: 'People',
          value: 500000,
        },
      ]);
    });

    it('should throw error when error.response exists', async () => {
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: 'Server error' } },
      });

      await expect(GetCountryDataApi(token, id)).rejects.toThrow('Server error');
    });

    it('should throw error when error.request exists', async () => {
      (http.get as jest.Mock).mockRejectedValue({ request: {} });

      await expect(GetCountryDataApi(token, id)).rejects.toThrow(
        'The request was made but no response was received'
      );
    });

    it('should throw default error when neither response nor request exists', async () => {
      (http.get as jest.Mock).mockRejectedValue({});

      await expect(GetCountryDataApi(token, id)).rejects.toThrow(
        'An unknown error occured while fetching regions'
      );
    });
  });

  describe('getCountryDataByMetric', () => {
    it('should return mapped country data on success', async () => {
      (http.get as jest.Mock).mockResolvedValue(mockApiData);

      const result = await getCountryDataByMetric(token, id);

      expect(http.get).toHaveBeenCalledWith(
        expect.stringContaining(`/country-data/metric/${id}`),
        { Authorization: `Bearer ${token}` },
      );
      expect(result).toEqual([
        {
          id: 1,
          country_name: 'Country A',
          region_name: 'Region X',
          metric: 'GDP',
          category: 'Economy',
          super_category: 'Finance',
          unit: 'USD',
          value: 1000,
        },
        {
          id: 2,
          country_name: 'Country B',
          region_name: 'Region Y',
          metric: 'Population',
          category: '',
          super_category: 'Demographics',
          unit: 'People',
          value: 500000,
        },
      ]);
    });

    it('should throw error when error.response exists', async () => {
      (http.get as jest.Mock).mockRejectedValue({
        response: { data: { message: 'Metric error' } },
      });

      await expect(getCountryDataByMetric(token, id)).rejects.toThrow('Metric error');
    });

    it('should throw error when error.request exists', async () => {
      (http.get as jest.Mock).mockRejectedValue({ request: {} });

      await expect(getCountryDataByMetric(token, id)).rejects.toThrow(
        'The request was made but no response was received'
      );
    });

    it('should throw default error when neither response nor request exists', async () => {
      (http.get as jest.Mock).mockRejectedValue({});

      await expect(getCountryDataByMetric(token, id)).rejects.toThrow(
        'An unknown error occured while fetching regions'
      );
    });
  });
});
