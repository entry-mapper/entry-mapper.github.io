import { GetMetricsApi } from "../api/metrics/metrics-get.api" 

export const GetMetricsService = (token: string) => {
    const res = GetMetricsApi(token);
    return res;
}