import { http } from "../../utils/http";
import { Metrics } from "../../interfaces/metrics.interface";

const BASE_URL = "https://dev.snrautos.co.uk";

export const getTemplate = async (token: string) => {
  try {
    const response = await http.get(`${BASE_URL}/data-service/template`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error: any) {
    const errorMessageDefault = "An unknown error occured while fetching regions";
    let errorMessage: string = "";

    if (error.response) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = "The request was made but no response was received";
    } else {
      errorMessage = errorMessageDefault;
    }
    throw new Error(errorMessage);
  }
};

export const getEntireDb = async (token: string) => {
  try {
    const response = await http.get(`${BASE_URL}/data-service/get-db`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error: any) {
    const errorMessageDefault = "An unknown error occured while fetching regions";
    let errorMessage: string = "";

    if (error.response) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = "The request was made but no response was received";
    } else {
      errorMessage = errorMessageDefault;
    }
    throw new Error(errorMessage);
  }
};

export const postBulkUploadData = async (token: string, formData: FormData) => {
    try {
      const response = await http.post(`${BASE_URL}/data-service/upload`, formData, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      });
      return response;
    } catch (error: any) {
      const errorMessageDefault = "An unknown error occured while fetching regions";
      let errorMessage: string = "";
  
      if (error.response) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "The request was made but no response was received";
      } else {
        errorMessage = errorMessageDefault;
      }
      throw new Error(errorMessage);
    }
  };
  