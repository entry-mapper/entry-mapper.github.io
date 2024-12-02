"use client";

import { useEffect, useState } from "react";
import Main from "./components/Main/Main";

export default function Home() {
 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [])

  if (isLoading) {
    return null
  } else {
    return <Main></Main>
  }
}
