import { http } from "../utils/http";
import { Metrics } from "../interfaces/metrics.interface";

const BASE_URL = "https://dev.snrautos.co.uk";

export const GetMetricsApi = async (token: string): Promise<Metrics[]> => {
  try {
    const response = await http.get(`${BASE_URL}/metrics`, {
      Authorization: `Bearer ${token}`,
    });

    const metrics: Metrics[] = response.map((metric: any) => ({
        value: metric.metric,
        metric_id: metric.id, 
        description: metric.description,
      }));
    return metrics;

  } catch (error: any) {
    const errorMessageDefault = "An unknown error occured while fetching regions";
    let errorMessage: string = "";

    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      errorMessage = error.response.data.message;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "The request was made but no response was received";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = errorMessageDefault;
    }
    throw new Error(errorMessage);
  }
};
