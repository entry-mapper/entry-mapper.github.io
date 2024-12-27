import { http } from "../utils/http";

const BASE_URL = "https://dev.snrautos.co.uk";

interface FormData {
    L1: number | null;
    L2: number | null;
    metric: string | null;
    unit: string | null;
    value: number | null;
  }
  

export const PatchCountryDataApi = async (formData: FormData): Promise<boolean> => {
    //  try {
    //     const response = await http.post(
    //       `${BASE_URL}/country-data/${countrydata_id}`,
    //       {
    //         value: value,
    //         user_id: user_id,
    //       },
    //       {
    //         Authorization: `Bearer ${token}`,
    //       }
    //     );
    //     if(response.status === 200){
    //       return true
    //     }
    //     return false;
    //   } catch (error: any) {
    //     const errorMessageDefault =
    //       "An unknown error occured while fetching regions";
    //     let errorMessage: string = "";
    
    //     if (error.response) {
    //       // The request was made and the server responded with a status code that falls out of the range of 2xx
    //       errorMessage = error.response.data.message;
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       errorMessage = "The request was made but no response was received";
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       errorMessage = errorMessageDefault;
    //     }
    //     throw new Error(errorMessage);
    //   }

    return false
}