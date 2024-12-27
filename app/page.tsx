'use client'

import { useRouter } from "next/navigation";``
import { useAuthContext } from "./context/auth.context";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  const {isAuthenticated} = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/country-data");
    }
  }, [isAuthenticated, router]);
}
