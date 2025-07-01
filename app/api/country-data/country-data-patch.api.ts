import { http } from "../../utils/http";
import { BASE_URL } from "@/app/utils/config";

export const PatchCountryDataApi = async (
  token: string,
  countrydata_id: number,
  user_id: number,
  value: string
): Promise<boolean> => {
  try {
    const response = await http.patch(
      `${BASE_URL}/country-data/${countrydata_id}`,
      {
        value: value,
        user_id: user_id,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if(response.status === 200){
      return true
    }
    return false;
  } catch (error: any) {
    const errorMessageDefault =
      "An unknown error occured while fetching regions";
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
