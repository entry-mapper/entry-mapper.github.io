import { http } from "../../utils/http";
import { Metrics } from "../../interfaces/metrics.interface";
import { BASE_URL } from "@/app/utils/config";

//const BASE_URL = process.env.API_URL;

export const GetMetricsApi = async (token: string): Promise<Metrics[]> => {
  try {
    const response = await http.get(`${BASE_URL}/metrics`, {
      Authorization: `Bearer ${token}`,
    });

    const metrics: Metrics[] = response.map((metric: any) => ({
        value: metric.metric,
        metric_id: metric.id, 
        description: metric.description,
        unit: metric.unit,
      }));
    return metrics;

  } catch (error: any) {
    const errorMessageDefault = "An unknown error occured while fetching regions";
    let errorMessage: string = "";

    if (error.response) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = "The request was made but no response was received";
    } else {
      errorMessage = errorMessageDefault;
    }
    throw new Error(errorMessage);
  }
};
