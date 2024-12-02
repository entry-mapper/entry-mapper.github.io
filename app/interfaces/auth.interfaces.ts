export interface LoginForm {
    email: string;
    password: string;
}

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface LoginSuccessResponse {
    expiresIn: number;
    accessToken: string;
    user: User;
  }
  
  interface LoginFailureResponse {
    message: string;
    error: string;
    statusCode: number;
  }
  
export type LoginResponse = LoginSuccessResponse | LoginFailureResponse;
  

