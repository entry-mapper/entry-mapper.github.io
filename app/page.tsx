"use client";

import { useEffect, useState } from "react";
import Main from "./components/Main/Main";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./context/auth.context";

export default function Home() {
 
  const router = useRouter();

  const {isAuthenticated} = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [isAuthenticated, router]);  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [])

  if (!isLoading && isAuthenticated) {
    return <Main></Main>
  } else {
    return null
  }
}
