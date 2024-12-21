import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const http = {
  get: async (url: string, headers?: any, params?: any): Promise<any> => {
    try {
      const response = await apiClient.get(url, { params, headers });
      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  },

  post: async (url: string, body?: any, headers?: any): Promise<any> => {
    try {
      const response = await apiClient.post(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  },

  put: async (url: string, body?: any, headers?: any): Promise<any> => {
    try {
      const response = await apiClient.put(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in PUT request:', error);
      throw error;
    }
  },

  patch: async (url: string, body?: any, headers?: any): Promise<any> => {
    try {
      const response = await apiClient.patch(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in PUT request:', error);
      throw error;
    }
  },

  del: async (url: string, headers?: any): Promise<any> => {
    try {
      const response = await apiClient.delete(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in DELETE request:', error);
      throw error;
    }
  }
}
