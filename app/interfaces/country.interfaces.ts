export interface Country {
    id: number,
    country_name: string,
    iso_code: string,
    region: {
        id: number,
        region_name: string
    } | null
}
