"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Input, Modal, Row, Select, Spin, Table, TableColumnsType, Typography } from "antd";
import { GetMetricCategories, Metrics } from "@/app/interfaces/metrics.interface";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";
import { DeleteOutlined, EditOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { patchMetricCategories, PatchMetricsApi } from "@/app/api/metrics/metrics-patch.api";
import { deleteMetricCategory, DelMetricsApi } from "@/app/api/metrics/metrics-del.component";
import { addMetricCategory, AddMetricsApi } from "@/app/api/metrics/metrics-post.api";
import { ICategory } from "@/app/interfaces/categories.interface";
import { getCategories, getMetricCategories } from "@/app/api/categories/categories-get.api";
import React from "react";

interface DataType {
  key: number;
  metric: {id: number, value: string};
  description: string;
  label: string;
  code: string;
  source: string;
  l1: {id: number, value: string};
  l2: {id: number, value: string};
}

interface MetricFormData {
  metric: {id: number, value: string} | null;
  description: string | null;
  label: string | null;
  code: string | null;
  source: string | null;
  category: {id: number, value: string} | null;
}

const MemoizedTable = React.memo(
  ({
    data,
    columns,
    editingKey,
    isLoading,
  }: {
    data: DataType[] | undefined;
    columns: TableColumnsType<DataType>;
    editingKey: number | null;
    isLoading: boolean;
  }) => {
    return (
      <Table<DataType>
        className="rounded-xl shadow mt-4 w-full"
        pagination={false}
        columns={columns}
        dataSource={data}
        rowHoverable={false}
        tableLayout="fixed"
        loading={isLoading}
        rowClassName={(record) =>
          editingKey === record.key
            ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl"
            : "rounded-xl"
        }
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.columns === nextProps.columns &&
    prevProps.editingKey === nextProps.editingKey &&
    prevProps.isLoading === nextProps.isLoading
);

export default function MetricCategoriesComponent() {
  const router = useRouter();
  const { isAuthenticated, logout, errorToast, infoToast } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<DataType[]>();
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
    label: null,
    code: null,
    source: null,
  });
  const [categories, setCategories] = useState<ICategory[]>();
  const [metrics, setMetrics] = useState<Metrics[]>();

  const columns = useMemo<TableColumnsType<DataType>>(() => [
    {
      title: "Metric Name",
      dataIndex: "metricName",
      key: "metricName",
      width: "25%",
      shouldCellUpdate: () => false,
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.metric.value}</Typography.Text>
      ),
    },
    {
      title: "L1",
      dataIndex: "l1",
      width: "35%",
      key: "l1",
      shouldCellUpdate: () => false,
      sorter: (a: any, b: any) => {
        console.log(a.l1?.value.length);
        return a.l1?.value.localeCompare(b.l1?.value)
      },
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.l1.value}</Typography.Text>
      ),
    },
    {
      title: "L2",
      dataIndex: "l2",
      width: "25%",
      key: "l2",
      shouldCellUpdate: () => false,
      sorter: (a: any, b: any) => {
        if (a.l2?.value && b.l2?.value) {
          return a.l2?.value.localeCompare(b.l2?.value)
        }
        return false;
      },
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.l2.value}</Typography.Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "20%",
      key: "description",
      shouldCellUpdate: () => false,
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.description}</Typography.Text>
      ),
    },
    {
      title: "Label",
      dataIndex: "label",
      width: "10%",
      key: "label",
      shouldCellUpdate: () => false,
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.label}</Typography.Text>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      width: "10%",
      key: "code",
      shouldCellUpdate: () => false,
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.code}</Typography.Text>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      width: "10%",
      key: "source",
      shouldCellUpdate: () => false,
      render: (_: any, record: DataType) => (
        <Typography.Text>{record.source}</Typography.Text>
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
                category: record?.l2.id ? record.l2 : record.l1,
                description: record.description,
                label: record.label,
                code: record.code,
                source: record.source,
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
  ], []);

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
        setMetricCategories(metricCategoriesResponse);
        const newTableData: DataType[] = metricCategoriesResponse.map((e: GetMetricCategories) => {
          return {
            key: e.id,
            metric: {id: e.metric.id, value: e.metric.value},
            l2: {id: e?.category.id, value: e.category?.value},
            l1: {id: e?.super_category.id, value: e.super_category?.value},
            description: e.description,
            label: e.label,
            code: e.code,
            source: e.source,
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
      if (token && userId && formData?.metric?.id && formData?.category?.id ) {
        const res = await addMetricCategory(
          token,
          {
            metric_id: formData.metric.id,
            category_id: formData.category.id,
            description: formData.description ?? ""
          },
        );
        setFormData({
          metric: null,
          description: null,
          category: null,
          label: null,
          code: null,
          source: null,
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
      errorToast(`${error.message ? error.message : JSON.stringify(error)}`)
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

      if (token && userId && editingKey && formData?.metric && formData?.category) {
        const res = await patchMetricCategories(
          token,
          editingKey, // metric_category_id
          {
            metric_id: formData.metric.id,
            description: formData.description,
            category_id: formData.category.id,
            label: formData.label,
            code: formData.code,
            source: formData.source,
          },
        );
        setFormData({
          metric: null,
          description: null,
          category: null,
          label: null,
          code: null,
          source: null,
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
            label: null,
            code: null,
            source: null,
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
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Code: </Typography.Text>}
                value={formData?.code ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Source: </Typography.Text>}
                value={formData?.source ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: e.target.value,
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
            <Row className="mt-3">
            <Select
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Label: </Typography.Text>}
                className="w-full"
                showSearch
                placeholder="Select a label"
                value={formData?.label}
                onSelect={(_, rec) => setFormData((prev) => ({...prev, label: rec.id}))}
                options={[{value: 'eu', id: 'eu'}, {value: 'non_eu', id: 'non_eu'},]}
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
            label: null,
            code: null,
            source: null,
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
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Code: </Typography.Text>}
                value={formData?.code ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))}          
                ></Input>
            </Row>
            <Row className="mt-3">
              <Input
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Source: </Typography.Text>}
                value={formData?.source ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: e.target.value,
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
            <Row className="mt-3">
            <Select
                className="w-full"
                showSearch
                placeholder="Select a label"
                onSelect={(_, rec) => setFormData((prev) => ({...prev, label: rec.id}))}
                options={[{value: 'eu', id: 'eu'}, {value: 'non_eu', id: 'non_eu'},]}
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
          <MemoizedTable
            data={tableData}
            columns={columns}
            editingKey={editingKey}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
}
