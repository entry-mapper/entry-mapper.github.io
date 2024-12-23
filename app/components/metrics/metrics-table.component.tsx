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

import { useAuthContext } from "@/app/context/auth.context";
import { CountryData } from "@/app/interfaces/country.interfaces";
import { PatchCountryDataService } from "@/app/service/country-data-patch.service";
import { getColumns } from "./metrics-table-cols.component";
import { Metrics } from "@/app/interfaces/metrics.interface";
// import AddNewCountryData from "./new-country-data";

interface DataType {
  key: number;
  metricName: string;
  metricDescription: string;
}

interface MetricsDataTableProps {
  metrics: Metrics[] | undefined;
  // selectedCountry: number | null;
}

const MetricsTable: React.FC<MetricsDataTableProps> = ({ metrics }) => {
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  // const [addNewCountryData, setAddNewCountryData] = useState<boolean>(false);

  const updateDataSourceValue = (key: number, newValue: number) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((item) =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  useEffect(() => {
    if (metrics) {
      const mappedData = metrics.map((data) => ({
        key: data.metric_id,
        metricName: data.value,
        metricDescription: data.description,
      }));
      setDataSource(mappedData);
    }
  }, [metrics]);

  const updateValue = async () => {
    const userString = localStorage.getItem("user");
    let userId = null;
    if (userString) {
      const user = JSON.parse(userString);
      userId = user.id;
    }

    const token = localStorage.getItem("token");

    if (token && userId && editingKey && editValue) {
      const res = await PatchCountryDataService(
        token,
        editingKey,
        userId,
        editValue.toString(10)
      );
      if(res === true){
        updateDataSourceValue(editingKey, editValue);
      }
    }
  };

  const handleConfirmChange = () => {
    updateValue();
    setEditingKey(null);
  };

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

  console.log(dataSource);

  return (
    <div className="w-full flex items-center justify-center">
      <Col className="w-[90%] justify-center">
        <div className="h-[70vh] lg:w-[75vw] w-[1024px] overflow-scroll mx-auto">
          <Table<DataType>
            className="rounded-xl shadow mt-4 w-full"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowHoverable={false}
            tableLayout="fixed"
            rowClassName={(record) =>
              editingKey === record.key
                ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl"
                : "rounded-xl"
            }
          />
        </div>
        {/* <div className="mt-4 w-[85vw] mx-auto rounded-md mb-12">
          {addNewCountryData === false ? (
            <Button color="primary" variant="outlined"
              className="py-4 px-8"
              onClick={() => setAddNewCountryData(true)}
            >
              Add Country Data
            </Button>
          ) : (
            <AddNewCountryData setAddNewCountryData={setAddNewCountryData}></AddNewCountryData>
          )}
        </div> */}
      </Col>
    </div>
  );
};

export default MetricsTable;
