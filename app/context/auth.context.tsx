// AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { LoginForm, LoginResponse, LoginSuccessResponse, User } from "../interfaces/auth.interfaces";
import * as loginApi from "../api/auth.api";

interface IAuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (formData: LoginForm) => Promise<LoginResponse>;
  logout: () => void;
  checkLogin: () => void;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

type AuthontextProviderProps = {
  children: ReactNode;
};

// helpers
export const setTokenDetailsInlocalStorage = (
  loginSuccessResponse: LoginSuccessResponse,
  now: Date
) => {
  const { user, accessToken, expiresIn } = loginSuccessResponse;

  localStorage.setItem("token", accessToken);
  localStorage.setItem(
      "expiresIn",
      JSON.stringify(now.getTime() + (expiresIn ? expiresIn * 1000 : 0))
  );
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearTokenDetailsFromlocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("user");
};

export const AuthContextProvider = ({ children }: AuthontextProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (formData: LoginForm) => {
    const response: LoginResponse = await loginApi.login(formData);
    if ("user" in response) {
      const { user, expiresIn } = response;
      const now = new Date();
      setUser(user);
      setIsAuthenticated(true);
      setTokenDetailsInlocalStorage(response, now);
      // setTimeout(() => {
      //   clearTokenDetailsFromlocalStorage();
      //   setUser(null);
      //   setIsAuthenticated(false);
      // }, expiresIn * 1000);
      router.push("/");
    }
    return response;
  };

  // Logout function
  const logout = () => {
    clearTokenDetailsFromlocalStorage();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is already logged in (on page load)
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const expiresIn = parseInt(localStorage.getItem("expiresIn") || "0", 10);

    if (token && expiresIn) {
      const now = new Date();
      if (now.getTime() > expiresIn) {
        clearTokenDetailsFromlocalStorage();
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUser(user);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    checkLogin();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, checkLogin }}
    >
      {!loading ? 
      children : 
      <div></div> //TODO: add a fancy loading icon
      }
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};