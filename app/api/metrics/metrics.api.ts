import { CountryMetricValues, MetricCategories } from "../../interfaces/metrics.interface";
import { http } from "../../utils/http";

const BASE_URL = "https://dev.snrautos.co.uk";

export const getAvailableMetrics = async (token: string): Promise<MetricCategories[]> => {
    try {
        const response = await http.get(`${BASE_URL}/categories`, {
            Authorization: `Bearer ${token}`,
        })
        const metricCategories: MetricCategories[] = response?.map((category: any) => {
            return {
                category_id: category?.category_id,
                category_name: category?.category_name,
                description: category?.description,
                metrics: category?.metrics?.map((metric: any) => ({
                    value: metric?.value,
                    metric_id: metric?.metric_id,
                    description: metric?.description
                })),
                sub_categories: category?.sub_categories?.map((category: any) => ({
                    category_id: category?.category_id,
                    category_name: category?.category_name,
                    metrics: category?.metrics?.map((metric: any) => ({
                        value: metric?.value,
                        metric_id: metric?.metric_id,
                        description: metric?.description
                    }))
                }))
            }
        })
        return metricCategories;
    } catch (error: any) {
        console.log(error)
        const errorMessageDefault = "An unknown error occured while fetching available metrics";
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

export const getMetricValuesForCountries = async (token: string, metric_ids: number[], country_ids: number[]): Promise<CountryMetricValues[]> => {
    try {
        const response = await http.get(`${BASE_URL}/country-data`, {
            Authorization: `Bearer ${token}`,
        }, 
        {
            q: JSON.stringify({metric_ids: metric_ids,country_ids: country_ids})
        }
        )
        const countryMetricValues: CountryMetricValues[] = response?.map((metricValue: CountryMetricValues) => {
            return {
                metric_id: metricValue?.metric_id,
                country_id: metricValue?.country_id,
                value: metricValue?.value
            }
        })
        return countryMetricValues;
    } catch (error: any) {
        console.log(error)
        const errorMessageDefault = "An unknown error occured while fetching country metrics";
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