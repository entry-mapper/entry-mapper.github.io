"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hook";
import { setAuth } from "@/app/redux/authSlice";
import isLogin from "@/app/utils/isLogin";

interface AuthWrapperProps {
  readonly children: React.ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login"];

export default function AuthWrapper({ children }: Readonly<AuthWrapperProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isUserLoggedIn = isLogin();
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      // Update Redux state based on login status
      dispatch(setAuth({ isAuthenticated: isUserLoggedIn }));

      // If user is not authenticated and trying to access a protected route
      if (!isUserLoggedIn && !isPublicRoute) {
        router.push("/login");
        return;
      }

      // If user is authenticated and trying to access login page, redirect to country-data
      if (isUserLoggedIn && pathname === "/login") {
        router.push("/country-data");
        return;
      }

      // If user is authenticated and on root path, redirect to country-data
      if (isUserLoggedIn && pathname === "/") {
        router.push("/country-data");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, dispatch, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
