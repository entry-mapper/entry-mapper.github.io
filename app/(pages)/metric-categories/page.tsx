"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Select, Table, TableColumnsType, Typography } from "antd";
import { GetMetricCategories, Metrics } from "@/app/interfaces/metrics.interface";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { patchMetricCategories, PatchMetricsApi } from "@/app/api/metrics/metrics-patch.api";
import { DelMetricsApi } from "@/app/api/metrics/metrics-del.component";
import { addMetricCategory, AddMetricsApi } from "@/app/api/metrics/metrics-post.api";
import { ICategory } from "@/app/interfaces/categories.interface";
import { getMetricCategories } from "@/app/api/categories/categories-get.api";

interface DataType {
  key: number;
  metric: {id: number, value: string};
  description: string;
  category: {id: number, value: string};
}

interface MetricFormData {
  metric_id: number | null;
  category_id: number | null;
  description: string | null;
}

export default function MetricCategoriesComponent() {
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
  const [metricCategories, setMetricCategories] = useState<GetMetricCategories[]>();
  const [formData, setFormData] = useState<MetricFormData>({
    metric_id: null,
    description: null,
    category_id: null,
  });

  const fetchMetricCategories = async () => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      try {
        const metricCategoriesResponse: GetMetricCategories[] = await getMetricCategories(token);
        console.log(metricCategoriesResponse)
        setMetricCategories(metricCategoriesResponse);
        const newTableData: DataType[] = metricCategoriesResponse.map((e: GetMetricCategories) => {
          return {
            key: e.id,
            metric: {id: e.metric.id, value: e.metric.value},
            category: {id: e.category.id ? e.category.id : e.super_category.id, value: e.category.id? e.category.value : e.super_category.value},
            description: e.description
          }
        })
        setTableData(newTableData)
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);
    fetchMetricCategories();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const columns = [
      {
        title: "Metric Name",
        dataIndex: "metricName",
        key: "metricName",
        width: "25%",
        render: (_: any, record: DataType) => <Typography.Text>{record.metric.value}</Typography.Text>
      },
      {
        title: "Category",
        dataIndex: "category",
        width: "35%",
        key: "category",
        render: (_: any, record: DataType) => <Typography.Text>{record.category.value}</Typography.Text>
      },
      {
        title: "Description",
        dataIndex: "description",
        width: "20%",
        key: "description",
        render: (_: any, record: DataType) => <Typography.Text>{record.description}</Typography.Text>
      },
      {
        title: 'Action',
        key: 'operation',
        width: 140,
        shouldCellUpdate: () => false,
        render: (_: any, record: DataType) => {
          console.log(record);
          return (
            <Row className='gap-1 w-full' key={record.key}>
              <Button className='w-[30px]' onClick={() => {
                setIsEditModalOpen(true);
                setEditingKey(record.key);
                setFormData({
                  metric_id: record.metric.id,
                  category_id: record.category.id,
                  description: record.description
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

      if (token && userId && formData?.metric_id && formData?.description && formData?.category_id ) {
        const res = await addMetricCategory(
          token,
          {
            metric_id: formData.metric_id,
            category_id: formData.category_id,
            description: formData.description
          },
        );
        if (res) {
          await fetchMetricCategories();
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

      if (token && userId && editingKey && formData?.metric_id && formData?.description && formData?.category_id ) {
        const res = await patchMetricCategories(
          token,
          editingKey, // metric_category_id
          {
            metric_id: formData.metric_id,
            description: formData.description,
            category_id: formData.category_id
          },
        );
        await fetchMetricCategories();
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
          await fetchMetricCategories();
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
            metric_id: null,
            description: null,
            category_id: null,
          });
          setEditingKey(null);
        }} okText="Save" onOk={handleEdit}>
          <Col>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Name: </Typography.Text>}
                value={formData?.metric_id ?? ""}
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
                value={formData?.description ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricDescription: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
            <Select
                className="w-full"
                showSearch
                placeholder="Select a category"
                onSelect={(_, rec) => setFormData((prev) => ({...prev, category_id: rec.id}))}
                options={tableData?.map((e) => {
                  return {
                    value: e.category.value,
                    id: e.category.id
                  }
                }) ?? []}
              />
            </Row>
          </Col>
        </Modal>

        {/* Add Modal */}
        <Modal title="Add Record" open={isAddModalOpen} destroyOnClose onCancel={() => {
          setIsAddModalOpen(false)
          setFormData({
            metric_id: null,
            description: null,
            category_id: null,
          });
          setEditingKey(null);
        }} okText="Save" onOk={handleAdd}>
          <Col>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric Name: </Typography.Text>}
                value={formData?.metric_id ?? ""}
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
                value={formData?.description ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metricDescription: e.target.value,
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
            Metric Mappings
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
