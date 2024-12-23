"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Row, Button } from "antd";
import { Typography } from "antd";
import { Metrics } from "@/app/interfaces/metrics.interface";
import { GetMetricsService } from "@/app/service/metrics-get.service";
import MetricsTable from "@/app/components/metrics/metrics-table.component";

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
        const res: Metrics[] = await GetMetricsService(token);
        setMetrics(res);
      };
      fetchMetrics();
    }
  }, [isAuthenticated, router]);

  if (!isLoading) {
    return (
      <div className="space-y-3 w-full flex flex-col items-center">
        <Row className="w-full h-[100px] bg-zinc-600 justify-between items-center pl-[20px] pr-[20px]">
          <div className="text-[30px]">Admin Portal</div>
          <Button className="text-[15px] px-5 py-4" onClick={logout}>
            Logout
          </Button>
        </Row>

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
