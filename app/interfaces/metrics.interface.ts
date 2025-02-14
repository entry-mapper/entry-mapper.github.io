export interface Metrics {
    value: string;
    metric_id: number;
    description: string;
    unit: string; 
}

export interface MetricCategories {
    category_id: number;
    category_name: string;
    metrics: Metrics[];
    description?: string;
    sub_categories?: MetricCategories[];
}

export interface GetMetricCategories {
    id: number;
    metric: {
        id: number;
        value: string;
    };
    category: {
        id: number;
        value: string;
    };
    super_category: {
        id: number;
        value: string;
    };
    description: string;
    label: string;
    code: string;
    source: string;
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