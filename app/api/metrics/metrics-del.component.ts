import { BASE_URL } from "@/app/utils/config";
import { http } from "../../utils/http";


//const BASE_URL = process.env.API_URL;

export const DelMetricsApi = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await http.del(`${BASE_URL}/metrics/${id}`, {
                Authorization: `Bearer ${token}`, 
            },)
        if(response.status === 200) {
            return true
        }
        return false;
    } catch (error: any) {
        const errorMessageDefault = "An unknown error occured while deleting metric";
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

export const deleteMetricCategory = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await http.del(`${BASE_URL}/metric-categories/${id}`, {
                Authorization: `Bearer ${token}`, 
            },)
        if(response.status === 200) {
            return true
        }
        return false;
    } catch (error: any) {
        const errorMessageDefault = "An unknown error occured while deleting metric categories";
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