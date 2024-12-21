import { PatchCountryDataApi } from "../api/country-data-patch.api"

export const PatchCountryDataService = (token: string,country_id: number, user_id: number, value: string) => {
    const response = PatchCountryDataApi(token, country_id, user_id, value);
    return response;
}