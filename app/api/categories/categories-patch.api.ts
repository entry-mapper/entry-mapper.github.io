import { IPatchCategory } from "@/app/interfaces/categories.interface";
import { MetricCategories } from "@/app/interfaces/metrics.interface";
import { http } from "@/app/utils/http";

const BASE_URL = "https://dev.snrautos.co.uk";

export const patchCategories = async (token: string, patchCategory: IPatchCategory) => {
  try {
    const response = await http.patch(`${BASE_URL}/categories/${patchCategory.category_id}`, {
        "category_name": patchCategory.category_name,
        "parent_id": patchCategory.parent_id,
        "description": patchCategory.description
    }, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status == 200) {
        return true;
    }
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
}
