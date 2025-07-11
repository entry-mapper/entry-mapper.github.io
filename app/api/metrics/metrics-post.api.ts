import { Metrics } from "../../interfaces/metrics.interface";
import { http } from "../../utils/http";
import { BASE_URL } from "@/app/utils/config";

interface FormData {
    metricName: string | null,
    metricDescription: string | null,
    metricUnit: string | null,
  }

export const AddMetricsApi = async (
  token: string,
  value: {metric: string, description: string, unit: string}
): Promise<Metrics> => {
  try {
    const response = await http.post(
      `${BASE_URL}/metrics/`, value,
      {
        Authorization: `Bearer ${token}`,
      }
    );    
    const updatedMetric = {
        value: response.data.metric,
        metric_id: response.data.id,
        description: response.data.description,
        unit: response.data.unit,
    };
    
    return updatedMetric;


  } catch (error: any) {
    const errorMessageDefault =
      "An unknown error occured while patching metrics";
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

export const addMetricCategory = async (
  token: string,
  value: {metric_id: number, description: string, category_id: number}
): Promise<Metrics> => {
  try {
    const response = await http.post(
      `${BASE_URL}/metric-categories`, value,
      {
        Authorization: `Bearer ${token}`,
      }
    );    
    return response;


  } catch (error: any) {
    const errorMessageDefault =
      "An unknown error occured while patching metric categories";
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
