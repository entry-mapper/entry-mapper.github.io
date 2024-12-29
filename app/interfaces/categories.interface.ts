export interface ICategory {
    category_id: number;
    category_name: string;
    description: string;
    parent_id: number;
    parent_category_name: string;
}

export interface IPatchCategory {
    category_id: number;
    category_name?: string;
    category_type?: string;
    description?: string;
    parent_id?: number;
}

export interface IPostCategory {
    category_name: string;
    category_type?: string;
    description: string;
    parent_id: number;
}