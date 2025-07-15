"use client";

import { Country, ICountryData } from "@/app/interfaces/country.interfaces";
import {  Col, Row, Table, TableColumnsType} from "antd";
import { Typography } from "@/app/components/UI/Typography";
import Modal from "@/app/components/UI/Modal";
import { message } from "@/app/components/UI/Message";
import Button from "@/app/components/UI/Button";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetMetricCategories } from "@/app/interfaces/metrics.interface";
import { getEntireDb, resetDatabase } from "@/app/api/metrics/data-service.api";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await resetDatabase(token);
        message.success(JSON.stringify(response.data?.message || response))
        setIsModalOpen(false);
      } catch (e: any) {
        message.error(JSON.stringify(e))
      }
  }
}

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-3 w-full flex flex-col items-center">
      <Typography.Text className="text-[20px] underline underline-offset-2">
        Home
      </Typography.Text>
      <Modal
        className="text-red-500"
        title="Warning"
        open={isModalOpen}
        okButtonProps={{
          danger: true
        }}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Destroy!"
        cancelText="Cancel"
      >
        This action will delete all metrics, categories, and their mappings from the database. Are you sure you want to proceed?
      </Modal>

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
            }}>Download DB as CSV</Button>
            <BulkAddButton visible={true}></BulkAddButton>
            <Button className={`visible ml-2`} danger={true} onClick={() => setIsModalOpen(true)}>Reset</Button>
      </Row>
    </div>
  );
}
