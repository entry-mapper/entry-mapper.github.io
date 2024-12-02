export interface Metrics {
    value: string;
    metric_id: number;
    description: string; 
}

export interface MetricCategories {
    category_id: number;
    category_name: string;
    metrics: Metrics[];
    description?: string;
    sub_categories?: MetricCategories[];
}

export interface MatrixData { 
    x: string; 
    y: string; 
    value: number;
    base_value?: string | null;
}

export interface CountryMetricValues {
    metric_id: number;
    country_id: number;
    value: string | null;
}

export interface CountryMetricValuesTransformed {
    metric_id: number;
    country_id: number;
    value: string | null;
    base_value: string | null;
}