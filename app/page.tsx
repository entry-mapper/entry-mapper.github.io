"use client";

import { useRouter } from "next/navigation";
``;
import { useAppSelector } from "./redux/hook";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/country-data");
    }
  }, [isAuthenticated, router]);
}
