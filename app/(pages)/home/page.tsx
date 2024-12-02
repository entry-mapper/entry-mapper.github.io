"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Main from "@/app/components/Main/Main";

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect('/login');
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);
  
    if (!isLoading) {
        return <Main></Main>
    }
    return <></>
}
