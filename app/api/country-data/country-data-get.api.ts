import { ICountryData } from "../../interfaces/country.interfaces";
import { http } from "../../utils/http";

const BASE_URL = "https://dev.snrautos.co.uk";

export const GetCountryDataApi = async (token: string, id: number): Promise<ICountryData[]> => {
    try {
        const response = await http.get(`${BASE_URL}/country-data/country/${id}`, {
                Authorization: `Bearer ${token}`, 
            },)
        return response;
    } catch (error: any) {
        const errorMessageDefault = "An unknown error occured while fetching regions";
        let errorMessage: string = "";

        if (error.response) { // The request was made and the server responded with a status code that falls out of the range of 2xx
            errorMessage = error.response.data.message;
        } else if (error.request) { // The request was made but no response was received
            errorMessage = 'The request was made but no response was received'
        } else { // Something happened in setting up the request that triggered an Error
            errorMessage = errorMessageDefault;
        }
        throw new Error(errorMessage);
    }
}