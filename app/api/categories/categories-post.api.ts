import { IPostCategory } from "@/app/interfaces/categories.interface";
import { http } from "@/app/utils/http";

const BASE_URL = "https://dev.snrautos.co.uk";

export const postCategories = async (token: string, patchCategory: IPostCategory) => {
  try {
    const response = await http.post(`${BASE_URL}/categories`, {
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
