import { MetricCategories } from "@/app/interfaces/metrics.interface";
import { http } from "@/app/utils/http";
import { BASE_URL } from "@/app/utils/config";

export const getCategoriesNested = async (
  token: string,
): Promise<MetricCategories[]> => {
  try {
    const response = await http.get(
      `${BASE_URL}/categories`,
      {
        Authorization: `Bearer ${token}`,
      },
      {
        q: "nested",
      },
    );
    const metricCategories: MetricCategories[] = response?.map(
      (category: any) => {
        return {
          category_id: category?.category_id,
          category_name: category?.category_name,
          description: category?.description,
          metrics: category?.metrics?.map((metric: any) => ({
            unit: metric?.unit,
            value: metric?.value,
            metric_id: metric?.metric_id,
            description: metric?.description,
          })),
          sub_categories: category?.sub_categories?.map((category: any) => ({
            category_id: category?.category_id,
            category_name: category?.category_name,
            metrics: category?.metrics?.map((metric: any) => ({
              unit: metric?.unit,
              value: metric?.value,
              metric_id: metric?.metric_id,
              description: metric?.description,
            })),
          })),
        };
      },
    );

    return metricCategories;
  } catch (error: any) {
    const errorMessageDefault =
      "An unknown error occured while fetching regions";
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

export const getCategories = async (token: string) => {
  try {
    const response = await http.get(`${BASE_URL}/categories`, {
      Authorization: `Bearer ${token}`,
    });
    return response?.map((entry: any) => {
      return {
        category_id: entry.id,
        category_name: entry.category_name,
        parent_id: entry.parent_id,
        parent_category_name: entry.parent_category_name,
        description: entry.description,
      };
    });
  } catch (error: any) {
    const errorMessageDefault =
      "An unknown error occured while fetching regions";
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

export const getMetricCategories = async (token: string) => {
  try {
    const response = await http.get(`${BASE_URL}/metric-categories`, {
      Authorization: `Bearer ${token}`,
    });
    return response?.map((entry: any) => {
      return {
        id: entry.id,
        metric: entry.metric,
        category: entry.super_category?.id
          ? entry.category
          : entry.super_category,
        super_category: entry.super_category?.id
          ? entry.super_category
          : entry.category,
        description: entry.description,
        label: entry.label,
        code: entry.code,
        source: entry.source,
      };
    });
  } catch (error: any) {
    const errorMessageDefault =
      "An unknown error occured while fetching regions";
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
