import { IPostCategory } from "@/app/interfaces/categories.interface";
import { http } from "@/app/utils/http";
import { BASE_URL } from "@/app/utils/config";
//const BASE_URL = process.env.API_URL;

export const postCategories = async (token: string, postCategory: IPostCategory) => {
  try {
    const response = await http.post(`${BASE_URL}/categories`, {
        "category_name": postCategory.category_name,
        "parent_id": postCategory.parent_id,
        "description": postCategory.description
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
