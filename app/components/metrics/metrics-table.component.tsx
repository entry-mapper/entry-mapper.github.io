import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Table,
} from "antd";
import { getColumns } from "./metrics-table-cols.component";
import { Metrics } from "@/app/interfaces/metrics.interface";
import { PatchMetricsApi } from "@/app/api/metrics/metrics-patch.api";
import { MetricAdd } from "./metrics-add.component";
import { AddMetricsApi } from "@/app/api/metrics/metrics-add.api";

interface DataType {
  key: number;
  metricName: string;
  metricDescription: string;
  metricUnit: string;
}

interface MetricFormData {
  metricName: string | null;
  metricDescription: string | null;
  metricUnit: string | null;
}

interface MetricsDataTableProps {
  metrics: Metrics[] | undefined;
  // selectedCountry: number | null;
}

const MetricsTable: React.FC<MetricsDataTableProps> = ({ metrics }) => {
  const [editingKey, setEditingKey] = useState<number | null>(null);

  const [formData, setFormData] = useState<MetricFormData>({
    metricName: null,
    metricDescription: null,
    metricUnit: null,
  });

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [addNewMetric, setAddNewMetric] = useState<boolean>(false);

  useEffect(() => {
    if (metrics) {
      const mappedData = metrics.map((data) => ({
        key: data.metric_id,
        metricName: data.value,
        metricDescription: data.description,
        metricUnit: data.unit,
      }));
      setDataSource(mappedData);
    }
  }, [metrics]);

  const updateDataSourceValue = (
    key: number,
    action: string,
    updatedData?: Partial<DataType>
  ) => {
  
    setDataSource((prevDataSource) => {
  
      if (action === "del") {
        return prevDataSource.filter((item) => item.key !== key);
      } else if (action === "patch") {
        return prevDataSource.map((item) =>
          item.key === key
            ? {
                ...item,
                metricName: updatedData?.metricName ?? item.metricName,
                metricDescription:
                  updatedData?.metricDescription ?? item.metricDescription,
                metricUnit: updatedData?.metricUnit ?? item.metricUnit,
              }
            : item
        );
      } else if (action === "add") {
        return [
          ...prevDataSource,
          {
            key,
            metricName: updatedData?.metricName || "Default Name",
            metricDescription: updatedData?.metricDescription || "Default Description",
            metricUnit: updatedData?.metricUnit || "Default Unit",
          },
        ];
      }
      return prevDataSource;
    });
  };
  
  
  
  const handleConfirmChange = async (
    id: number,
    name: string,
    description: string,
    unit: string
  ) => {
    // updateValue();
    const value = {
      metric: formData.metricName ? formData.metricName : name,
      description: formData.metricDescription
        ? formData.metricDescription
        : description,
      unit: formData.metricUnit ? formData.metricUnit : unit,
    };
    const token = localStorage.getItem("token");
    if (token) {
      const res = await PatchMetricsApi(token, id, value);
      if (res) {
        updateDataSourceValue(id, 'patch', {
          metricName: res.value, // Use API response fields
          metricDescription: res.description,
          metricUnit: res.unit,
        });
        setFormData({metricName: null, metricDescription: null, metricUnit: null})
      }
    }

    setEditingKey(null);
  };

  const handleNewAdd = async() => {
    const token = localStorage.getItem("token");
    if (token && formData.metricName && formData.metricDescription && formData.metricUnit) {
      const value = {
        metric: formData.metricName,
        description: formData.metricDescription,
        unit: formData.metricUnit
      }
      const res = await AddMetricsApi(token, value)
      if (res) {
        updateDataSourceValue(res.metric_id,'add',{
          metricName: res.value, // Use API response fields
          metricDescription: res.description,
          metricUnit: res.unit,
        });
        setFormData({metricName: null, metricDescription: null, metricUnit: null})
      }
    }
  }

  const columns = getColumns(
    editingKey,
    setEditingKey,
    formData,
    setFormData,
    handleConfirmChange,
    updateDataSourceValue,
  );

  return (
    <div className="w-full flex items-center justify-center">
      <Col className="w-[90%] justify-center">
        <div className="h-[70vh] lg:w-[75vw] w-[1024px] overflow-y-scroll mx-auto">
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
        <div className="mt-4 w-[75vw] mx-auto rounded-md mb-12">
          {addNewMetric === false ? (
            <Button color="primary" variant="outlined"
              className="py-4 px-8"
              onClick={() => setAddNewMetric(true)}
            >
              Add New Metric
            </Button>
          ) : (
            <MetricAdd setFormData={setFormData} formData={formData} handleSubmit={handleNewAdd} setAddNewMetric={setAddNewMetric}/>
          )}
        </div>
      </Col>
    </div>
  );
};

export default MetricsTable;
