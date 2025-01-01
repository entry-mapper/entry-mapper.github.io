"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Select, Spin, Table, TableColumnsType, Typography } from "antd";
import { GetMetricCategories, Metrics } from "@/app/interfaces/metrics.interface";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { patchMetricCategories, PatchMetricsApi } from "@/app/api/metrics/metrics-patch.api";
import { deleteMetricCategory, DelMetricsApi } from "@/app/api/metrics/metrics-del.component";
import { addMetricCategory, AddMetricsApi } from "@/app/api/metrics/metrics-post.api";
import { ICategory } from "@/app/interfaces/categories.interface";
import { getCategories, getMetricCategories } from "@/app/api/categories/categories-get.api";

interface DataType {
  key: number;
  metric: {id: number, value: string};
  description: string;
  category: {id: number, value: string};
}

interface MetricFormData {
  metric: {id: number, value: string} | null;
  description: string | null;
  category: {id: number, value: string} | null;
}

export default function MetricCategoriesComponent() {
  const router = useRouter();
  const { isAuthenticated, logout, errorToast, infoToast } = useAuthContext();
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
    metric: null,
    description: null,
    category: null,
  });
  const [categories, setCategories] = useState<ICategory[]>();
  const [metrics, setMetrics] = useState<Metrics[]>();

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await getCategories(token);
      if (res) {
        const mappedData: ICategory[] = res.map((data: any) => ({
            category_id: data.category_id,
            category_name: data.category_name,
            description: data.description,
            parent_category_id: data.parent_id,
            parent_category_name: data.parent_category_name,
        }));
        setCategories(mappedData);
    }
    };
  }

  const fetchMetrics = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res: Metrics[] = await GetMetricsApi(token);
      setMetrics(res);
    };
  }


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
    if (!isAuthenticated) {
      redirect("/login");
      return; // Stop further execution if redirecting
    }
  
    const initialize = async () => {
      setIsLoading(true); // Start loading before fetching data
      try {
        // Fetch data concurrently
        await Promise.all([
          fetchMetricCategories(),
          fetchMetrics(),
          fetchCategories(),
        ]);
  
        // Set up columns after data is fetched
        const columns = [
          {
            title: "Metric Name",
            dataIndex: "metricName",
            key: "metricName",
            width: "25%",
            render: (_: any, record: DataType) => (
              <Typography.Text>{record.metric.value}</Typography.Text>
            ),
          },
          {
            title: "Category",
            dataIndex: "category",
            width: "35%",
            key: "category",
            render: (_: any, record: DataType) => (
              <Typography.Text>{record.category.value}</Typography.Text>
            ),
          },
          {
            title: "Description",
            dataIndex: "description",
            width: "20%",
            key: "description",
            render: (_: any, record: DataType) => (
              <Typography.Text>{record.description}</Typography.Text>
            ),
          },
          {
            title: "Action",
            key: "operation",
            width: 140,
            shouldCellUpdate: () => false,
            render: (_: any, record: DataType) => (
              <Row className="gap-1 w-full" key={record.key}>
                <Button
                  className="w-[30px]"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setEditingKey(record.key);
                    setFormData({
                      metric: record.metric,
                      category: record.category,
                      description: record.description,
                    });
                  }}
                >
                  <EditOutlined />
                </Button>
                <Button
                  className="w-[30px]"
                  onClick={() => {
                    setIdToBeDeleted(record.key);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <DeleteOutlined />
                </Button>
              </Row>
            ),
          },
        ];
  
        setColumns(columns); // Set columns only after all data fetching
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false); // End loading state once everything is done
      }
    };
  
    initialize();
  }, [isAuthenticated]);
  
  const handleAdd = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");
      console.log(formData)
      if (token && userId && formData?.metric?.id && formData?.description && formData?.category?.id ) {
        const res = await addMetricCategory(
          token,
          {
            metric_id: formData.metric.id,
            category_id: formData.category.id,
            description: formData.description
          },
        );
        setFormData({
          metric: null,
          description: null,
          category: null,
        });
        if (res) {
          await fetchMetricCategories();
          infoToast("Updated!");
        }
        setIsAddModalOpen(false);
      } else {
        errorToast("Please fill the required fields")
      }
    } catch (error: any) {
      console.log(error);
    }
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

      if (token && userId && editingKey && formData?.metric && formData?.description && formData?.category) {
        const res = await patchMetricCategories(
          token,
          editingKey, // metric_category_id
          {
            metric_id: formData.metric.id,
            description: formData.description,
            category_id: formData.category.id
          },
        );
        setFormData({
          metric: null,
          description: null,
          category: null,
        });
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
        const response = await deleteMetricCategory(token, idToBeDeleted);
        if (response) {
          await fetchMetricCategories();
        }
      }
    } catch (error: any) {

    }
    setIsDeleteModalOpen(false);
  }

    return (
      <div className="space-y-3 w-full flex flex-col items-center">
        {/* Edit Modal */}
        <Modal title="Edit Record" open={isEditModalOpen} destroyOnClose onCancel={() => {
          setIsEditModalOpen(false)
          setFormData({
            metric: null,
            description: null,
            category: null,
          });
          setEditingKey(null);
        }} okText="Save" onOk={handleEdit}>
          <Col>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Description: </Typography.Text>}
                value={formData?.description ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
            <Select
                className="w-full"
                showSearch
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Metric: </Typography.Text>}
                value={formData.metric?.value}
                placeholder="Select a metric"
                onSelect={(_, rec) => setFormData((prev) => ({...prev, metric: rec}))}
                options={metrics?.map((e) => {
                  return {
                    value: e.value,
                    id: e.metric_id
                  }
                }) ?? []}
              />
            </Row>
            <Row className="mt-3">
            <Select
                className="w-full"
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Category: </Typography.Text>}
                showSearch
                value={formData.category?.value}
                placeholder="Select a category"
                onSelect={(_, rec) => setFormData((prev) => ({...prev, category: rec}))}
                options={categories?.map((e) => {
                  return {
                    value: e.category_name,
                    id: e.category_id
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
            metric: null,
            description: null,
            category: null,
          });
          setEditingKey(null);
        }} okText="Save" onOk={handleAdd}>
          <Col>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Description: </Typography.Text>}
                value={formData?.description ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
            <Select
                className="w-full"
                showSearch
                placeholder="Select a metric"
                onSelect={(_, rec) => setFormData((prev) => ({...prev, metric: rec}))}
                options={metrics?.map((e) => {
                  return {
                    value: e.value,
                    id: e.metric_id
                  }
                }) ?? []}
              />
            </Row>
            <Row className="mt-3">
            <Select
                className="w-full"
                showSearch
                placeholder="Select a category"
                onSelect={(_, rec) => setFormData((prev) => ({...prev, category: rec}))}
                options={categories?.map((e) => {
                  return {
                    value: e.category_name,
                    id: e.category_id
                  }
                }) ?? []}
              />
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
