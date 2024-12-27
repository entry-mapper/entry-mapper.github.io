import { DelCountryDataApi } from "../api/country-data-delete.api";

export const DelCountryDataService = async (token: string, id: number): Promise<boolean> => {
    const res = DelCountryDataApi(token, id);
    return res;

}
