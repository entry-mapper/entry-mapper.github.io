import { ICountryData } from "../../interfaces/country.interfaces";
import { http } from "../../utils/http";
import { BASE_URL } from "../../utils/config";

export const GetCountryDataApi = async (token: string, id: number): Promise<ICountryData[]> => {
    try {
        const response = await http.get(`${BASE_URL}/country-data/country/${id}`, {
                Authorization: `Bearer ${token}`, 
            },)
        const country_data: ICountryData[] = response.map((e: ICountryData) => {
            return {
                id: e.id,
                country_name: e.country_name,
                region_name: e.region_name,
                metric: e.metric,
                category: e.super_category ? e.category : "",
                super_category: e.super_category ? e.super_category : e.category,
                unit: e.unit,
                value: e.value,
            }
        })
        return country_data;
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

export const getCountryDataByMetric = async (token: string, id: number): Promise<ICountryData[]> => {
    try {
        const response = await http.get(`${BASE_URL}/country-data/metric/${id}`, {
                Authorization: `Bearer ${token}`, 
            },)
        const country_data: ICountryData[] = response.map((e: ICountryData) => {
            return {
                id: e.id,
                country_name: e.country_name,
                region_name: e.region_name,
                metric: e.metric,
                category: e.super_category ? e.category : "",
                super_category: e.super_category ? e.super_category : e.category,
                unit: e.unit,
                value: e.value,
            }
        })
        return country_data;
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