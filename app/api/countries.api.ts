import { Country } from "../interfaces/country.interfaces";
import { http } from "../utils/http";

const BASE_URL = process.env.NEXT_PUBLIC_NEST_CONNECTION_STRING;

export const getCountriesApi = async (token: string): Promise<Country[]> => {
    try {
        const response = await http.get(`${BASE_URL}/countries`, {
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