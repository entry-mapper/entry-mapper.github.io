"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Typography } from "antd";
import { Metrics } from "@/app/interfaces/metrics.interface";
import MetricsTable from "@/app/components/metrics/metrics-table.component";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";
import { ICategory } from "@/app/interfaces/categories.interface";
import CategoriesTable from "@/app/components/categories/categories-table.component";
import { getCategories } from "@/app/api/categories-get.api";

export default function Categories() {
  const { isAuthenticated, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>();

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);

    const token = localStorage.getItem("token");
    if (token) {
      const fetchMetrics = async () => {
        const res = await getCategories(token);
        console.log(res);
        const cat: ICategory[] = res.map((entry: any) => {
          return {
            category_id: entry.category_id,
            category_name: entry.category_name,
            parent_id: entry.parent_id,
            parent_category_name: entry.parent_category_name,
            description: entry.description
          }
        })
        setCategories(cat);
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

        <CategoriesTable
          categories={categories}
        />
      </div>
    );
  }
  return <></>;
}