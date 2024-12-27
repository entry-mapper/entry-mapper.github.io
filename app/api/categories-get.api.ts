import { http } from "../utils/http";
import { MetricCategories } from "../interfaces/metrics.interface";

const BASE_URL = "https://dev.snrautos.co.uk";

export const GetCategoriesApi = async (token: string): Promise<MetricCategories[]> => {
  try {
    const response = await http.get(`${BASE_URL}/categories`, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response);
    const metricCategories: MetricCategories[] = response?.map((category: any) => {
      return {
          category_id: category?.category_id,
          category_name: category?.category_name,
          description: category?.description,
          metrics: category?.metrics?.map((metric: any) => ({
              value: metric?.value,
              metric_id: metric?.metric_id,
              description: metric?.description
          })),
          sub_categories: category?.sub_categories?.map((category: any) => ({
              category_id: category?.category_id,
              category_name: category?.category_name,
              metrics: category?.metrics?.map((metric: any) => ({
                  value: metric?.value,
                  metric_id: metric?.metric_id,
                  description: metric?.description
              }))
          }))
      }
    })

    // const metrics: MetricCategories[] = response.map((metric: any) => ({
    //     value: metric.metric,
    //     metric_id: metric.id, 
    //     description: metric.description,
    //   }));
    return metricCategories;

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