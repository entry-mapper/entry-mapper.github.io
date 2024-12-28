"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Input, InputNumber, Modal, Row, Table, TableColumnsType, Typography } from "antd";
import { Metrics } from "@/app/interfaces/metrics.interface";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PatchMetricsApi } from "@/app/api/metrics/metrics-patch.api";
import { DelMetricsApi } from "@/app/api/metrics/metrics-del.component";
import { AddMetricsApi } from "@/app/api/metrics/metrics-post.api";
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

export default function MetricsComponent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<DataType[]>();
  const [columns, setColumns] = useState<TableColumnsType<DataType>>();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<number | null>(null);
  const [formData, setFormData] = useState<MetricFormData>({
    metricName: null,
    metricDescription: null,
    metricUnit: null,
  });

  const fetchMetrics = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res: Metrics[] = await GetMetricsApi(token);
      const newTableData: DataType[] = res.map((entry: Metrics) => {
        return {
          key: entry.metric_id,
          metricName: entry.value,
          metricDescription: entry.description,
          metricUnit: entry.unit
        }
      })
      setTableData(newTableData);
    };
  }

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);
    fetchMetrics();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const columns = [
      {
        title: "Metric Name",
        dataIndex: "metricName",
        key: "metricName",
        width: "25%",
      },
      {
        title: "Metric Description",
        dataIndex: "metricDescription",
        width: "40%",
        key: "metricDescription",
      },
      {
        title: "Unit",
        dataIndex: "metricUnit",
        width: "15%",
        key: "metricDescription",
      },
      {
        title: 'Action',
        key: 'operation',
        width: 140,
        shouldCellUpdate: () => false,
        render: (_: any, record: DataType) => {
          return (
            <Row className='gap-1 w-full' key={record.key}>
              <Button className='w-[30px]' onClick={() => {
                setIsEditModalOpen(true);
                setEditingKey(record.key);
                setFormData({
                  metricDescription: record.metricDescription,
                  metricName: record.metricName,
                  metricUnit: record.metricUnit
                })
              }}>
                <EditOutlined></EditOutlined>
              </Button>
              <Button className='w-[30px]' onClick={async () => {
                setIdToBeDeleted(record.key)
                setIsDeleteModalOpen(true);
              }}>
                <DeleteOutlined></DeleteOutlined>
              </Button>
            </Row>
          )
        },
      }
    ];
    setColumns(columns);
  }, [])

  const handleAdd = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");

      if (token && userId && formData?.metricName && formData?.metricDescription && formData?.metricUnit ) {
        const res = await AddMetricsApi(
          token,
          {
            metric: formData.metricName,
            description: formData.metricDescription,
            unit: formData.metricUnit
          },
        );
        if (res) {
          await fetchMetrics();
        }
      }
    } catch (error: any) {
      console.log(error);
    }
    setIsAddModalOpen(false);
  }

  const handleEdit = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");

      if (token && userId && editingKey && formData?.metricName && formData?.metricDescription && formData?.metricUnit ) {
        const res = await PatchMetricsApi(
          token,
          editingKey,
          {
            metric: formData.metricName,
            description: formData.metricDescription,
            unit: formData.metricUnit
          },
        );
        if (res) {
          await fetchMetrics();
        }
      }
    } catch (error: any) {
      console.log(error);
    }
    setIsEditModalOpen(false);
    setEditingKey(null);
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token && idToBeDeleted) {
        const response = await DelMetricsApi(token, idToBeDeleted);
        if (response) {
          await fetchMetrics();
        }
      }
    } catch (error: any) {

    }
    setIsDeleteModalOpen(false);
  }

  if (!isLoading) {
    return (
      <div className="space-y-3 w-full flex flex-col items-center">
        {/* Edit Modal */}
        <Modal title="Edit Record" open={isEditModalOpen} destroyOnClose onCancel={() => {
          setIsEditModalOpen(false)
          setFormData({
            metricName: null,
            metricDescription: null,
            metricUnit: null,
          });
          setEditingKey(null);
        }} okText="Save" onOk={handleEdit}>
          <Col>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Name: </Typography.Text>}
                value={formData?.metricName ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricName: e.target.value,
                  }))
                }
              ></Input>
            </Row>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Description: </Typography.Text>}
                value={formData?.metricDescription ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricDescription: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Unit: </Typography.Text>}
                value={formData?.metricUnit ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricUnit: e.target.value,
                  }))}
                ></Input>
            </Row>
          </Col>
        </Modal>

        {/* Add Modal */}
        <Modal title="Add Record" open={isAddModalOpen} destroyOnClose onCancel={() => {
          setIsAddModalOpen(false)
          setFormData({
            metricName: null,
            metricDescription: null,
            metricUnit: null,
          });
          setEditingKey(null);
        }} okText="Save" onOk={handleAdd}>
          <Col>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Name: </Typography.Text>}
                value={formData?.metricName ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricName: e.target.value,
                  }))
                }
              ></Input>
            </Row>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Description: </Typography.Text>}
                value={formData?.metricDescription ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricDescription: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Unit: </Typography.Text>}
                value={formData?.metricUnit ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricUnit: e.target.value,
                  }))}
                ></Input>
            </Row>
          </Col>
        </Modal>

        {/* Delete Modal */}
        <Modal title="Delete Record" open={isDeleteModalOpen} destroyOnClose onCancel={() => {
          setIsDeleteModalOpen(false)
        }} okText="Confirm" onOk={handleDelete} okButtonProps={{ style: { backgroundColor: 'red' } }}>
          <Typography.Text>Are you sure you want to delete this?</Typography.Text>
        </Modal>

        <Typography.Text className="text-[20px] underline underline-offset-2">
          Metrics
        </Typography.Text>

        <Button onClick={() => setIsAddModalOpen(true)}>+ Add </Button>
        <div className="h-[70vh] lg:w-[75vw] w-[1024px] overflow-y-scroll mx-auto">
          <Table<DataType>
            className="rounded-xl shadow mt-4 w-full"
            pagination={false}
            columns={columns}
            dataSource={tableData}
            rowHoverable={false}
            tableLayout="fixed"
            loading={isLoading}
            rowClassName={(record) =>
              editingKey === record.key
                ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl"
                : "rounded-xl"
            }
          />
        </div>

      </div>
    );
  }
  return <></>;
}
