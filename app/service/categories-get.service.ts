import { GetCategoriesApi } from "../api/categories-get.api"


export const GetCategoriesService = (token: string) => {
    const res = GetCategoriesApi( token );
    return res;
}