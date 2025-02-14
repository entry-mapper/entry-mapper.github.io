"use client";

import { Country, ICountryData } from "@/app/interfaces/country.interfaces";
import { Button, Col, InputNumber, message, Modal, Row, Select, Table, TableColumnsType, Typography } from "antd";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth.context";
import { GetMetricCategories } from "@/app/interfaces/metrics.interface";
import { getEntireDb } from "@/app/api/metrics/data-service.api";
import BulkAddButton from "@/app/components/bulk-add-button.component";
interface ICountryOptions {
  value: number;
  country: Country;
  label: string;
}

interface ICountryTableData extends ICountryData {
  key: string;
  country: string;
  region: string;
}

interface IMetricCategoryOptions {
  value: string;
  metricCategory: GetMetricCategories;
}

export default function Home() {
  const { isAuthenticated, logout, errorToast } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  return (
    <div className="space-y-3 w-full flex flex-col items-center">
      <Typography.Text className="text-[20px] underline underline-offset-2">
        Home
      </Typography.Text>

      <Row className="w-full justify-center">
            <Button className={`visible ml-2`} onClick={async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await getEntireDb(token);
                // Create a blob from the response
                const blob = new Blob([response], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                
                // Create a temporary link to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = 'enitre-db.csv'; // Set the filename for the download
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
            }}>+ Download DB as CSV</Button>
            <BulkAddButton visible={true}></BulkAddButton>
      </Row>
    </div>
  );
}
