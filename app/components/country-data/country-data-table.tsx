import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  InputNumber,
  Layout,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Key } from "antd/es/table/interface";
import { Popover } from "antd";
import { useAuthContext } from "@/app/context/auth.context";
import { CountryData } from "@/app/interfaces/country.interfaces";
import { PatchCountryDataService } from "@/app/service/country-data-patch.service";
import { json } from "stream/consumers";
import { getColumns } from "./country-table-cols";

interface DataType {
  key: number;
  countryName: string;
  region: string;
  L1: string;
  L2: string;
  metric: string;
  unit: string;
  value: number;
}

interface CountryDataTableProps {
  countryData: CountryData[] | undefined;
}

const CountryDataTable: React.FC<CountryDataTableProps> = ({ countryData }) => {
  const { logout } = useAuthContext();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const updateDataSourceValue = (key: number, newValue: number) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((item) =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  useEffect(() => {
    if (countryData) {
      const mappedData = countryData.map((data) => ({
        key: data.id,
        countryName: data.country_name,
        region: data.region_name,
        L1: data.super_category ?? "-",
        L2: data.category ?? "-",
        metric: data.metric,
        unit: data.unit,
        value: data.value ?? 0,
      }));
      setDataSource(mappedData);
    }
  }, [countryData]);

  const updateValue = async () => {
    const userString = localStorage.getItem("user");
    let userId = null;
    if (userString) {
      const user = JSON.parse(userString);
      userId = user.id;
      console.log("User ID:", userId);
    }

    const token = localStorage.getItem("token");
    if (token && userId && editingKey && editValue) {
      updateDataSourceValue(editingKey, editValue);
      // Uncomment this line once you confirm the service
      // await PatchCountryDataService(token, editingKey, userId, editValue);
    }
  };

  const handleConfirmChange = () => {
    updateValue();
    setEditingKey(null);
  }

  const regions = [
    {
      key: "1",
      label: "UK",
    },
  ];

  const columns = getColumns(
    editingKey,
    setEditingKey,
    setEditValue,
    updateDataSourceValue,
    handleConfirmChange
  );

  // const dataSource: DataType[] = [
  //     { key: '1', countryName: 'UK', region: "United Kingdom", L1: "Industry Size", L2: "Acommodation", metric: "Industry Turnover", unit: 'unit', value: 31 },
  //     { key: '2', countryName: 'US', region: "United States", L1: "Industry Size", L2: "Acommodation", metric: "Industry Turnover", unit: 'unit', value: 32 },
  // ];

  return (
    <div className="w-full flex items-center justify-center">
      <Col className="w-[90%] justify-center">
        <Row className="w-full justify-center h-[20%]">
          <Typography.Text className="text-[20px] underline underline-offset-2">
            Country Data
          </Typography.Text>
        </Row>

        <div className="h-[75vh] overflow-scroll">
          <Table<DataType>
            className="rounded-xl shadow mt-4"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowHoverable={false}
            rowClassName={(record) =>
              editingKey === record.key
                ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl"
                : "rounded-xl"
            }
            scroll={{ x: "max-content" }}
          />
        </div>
      </Col>
    </div>
  );
};

export default CountryDataTable;
