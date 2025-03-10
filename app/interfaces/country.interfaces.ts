export interface Country {
    id: number,
    country_name: string,
    iso_code: string,
    region: {
        id: number,
        region_name: string
    } | null
}

export interface ICountryData {
    id: number;
    country_name: string;
    region_name: string;
    metric: string;
    category: string;
    super_category: string;
    unit: string;
    value: number;
}