import { describe } from "node:test";
import { Metrics } from "../../interfaces/metrics.interface";
import { http } from "../../utils/http";
import { BASE_URL } from "@/app/utils/config";

interface FormData {
    metricName: string | null,
    metricDescription: string | null,
    metricUnit: string | null,
  }

export const PatchMetricsApi = async (
  token: string,
  metric_id: number,
  value: {metric?: string, description?: string | null, unit?: string | null}
): Promise<Metrics> => {
  try {
    const response = await http.patch(
      `${BASE_URL}/metrics/${metric_id}`, value,
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

export const patchMetricCategories = async (
  token: string,
  metric_category_id: number,
  value: {metric_id: number, category_id: number, description: string | null, label: string | null, code: string | null, source: string | null}
): Promise<void> => {
  try {
    const response = await http.patch(
      `${BASE_URL}/metric-categories/${metric_category_id}`, value,
      {
        Authorization: `Bearer ${token}`,
      }
    );    
    response;


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
