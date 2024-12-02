import { http } from "../utils/http";
import { LoginForm, LoginResponse } from "../interfaces/auth.interfaces";

const BASE_URL= process.env.NEXT_PUBLIC_NEST_CONNECTION_STRING;

export const login = async (
    credentials: LoginForm
): Promise<LoginResponse> => {
    try {
        const response = await http.post(`${BASE_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
        });
          
        const loginResponse: LoginResponse = {
            expiresIn: response.expiresIn,
            accessToken: response.accessToken,
            user: response.user,
        };
        return loginResponse;
    } catch (error: any) {
        const errorMessageDefault = "An unknown error occured while logging in";
        let errorMessage: string = "";
        
        if (error.response) { // The request was made and the server responded with a status code that falls out of the range of 2xx
            errorMessage = error.response.data.message;
          } else if (error.request) { // The request was made but no response was received
            errorMessage = 'The request was made but no response was received'
          } else { // Something happened in setting up the request that triggered an Error
            errorMessage = errorMessageDefault;
          }
        const errorResponse: LoginResponse = {
            message: errorMessage,
            error: "unauthorized",
            statusCode: 401,
        };
        return errorResponse;
    }
};
