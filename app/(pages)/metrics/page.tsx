"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Typography } from "antd";
import { Metrics } from "@/app/interfaces/metrics.interface";
import MetricsTable from "@/app/components/metrics/metrics-table.component";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";

export default function Home() {
  const { isAuthenticated, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics[]>();

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);

    const token = localStorage.getItem("token");
    if (token) {
      const fetchMetrics = async () => {
        const res: Metrics[] = await GetMetricsApi(token);
        setMetrics(res);
      };
      fetchMetrics();
    }
  }, [isAuthenticated, router]);

  if (!isLoading) {
    return (
      <div className="space-y-3 w-full flex flex-col items-center">
        <Typography.Text className="text-[20px] underline underline-offset-2">
          Metrics
        </Typography.Text>

        <MetricsTable
          metrics={metrics}
        />
      </div>
    );
  }
  return <></>;
}
