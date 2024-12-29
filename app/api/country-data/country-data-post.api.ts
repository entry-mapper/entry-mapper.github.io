import { http } from "../../utils/http";

const BASE_URL = "https://dev.snrautos.co.uk";

interface CountryDataPostApiPayload {
  country_id: number;
  metric_category_id: number;
  value: string;
  user_id: number
}
  

export const AddCountryDataApi = async (token: string, formData: CountryDataPostApiPayload): Promise<boolean> => {
     try {
        const response = await http.post(
          `${BASE_URL}/country-data`,
          formData,
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
          errorMessage = error.response.data.message;
        } else if (error.request) {
          errorMessage = "The request was made but no response was received";
        } else {
          errorMessage = errorMessageDefault;
        }
        throw new Error(errorMessage);
      }
}