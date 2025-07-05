"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, redirect } from "next/navigation";
import { Button, Col, Input, Modal, Row, Table, TableColumnsType, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { setErrorToast } from "@/app/redux/authSlice";
import { useAppDispatch,useAppSelector } from "@/app/redux/hook";
import { Metrics } from "@/app/interfaces/metrics.interface";
import { GetMetricsApi } from "@/app/api/metrics/metrics-get.api";
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

interface Payload {
  metric?: string;
  description?: string | null;
  unit?: string | null;
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

export default function MetricsComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<DataType[]>();
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
      const newTableData: DataType[] = res.map((entry: Metrics) => ({
        key: entry.metric_id,
        metricName: entry.value,
        metricDescription: entry.description,
        metricUnit: entry.unit,
      }));
      setTableData(newTableData);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
    const initialize = async () => {
      try {
        setIsLoading(true);
        await fetchMetrics();
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [isAuthenticated, router]);

  const columns = useMemo<TableColumnsType<DataType>>(
    () => [
      {
        title: "Metric Name",
        dataIndex: "metricName",
        key: "metricName",
        width: "25%",
      },
      {
        title: "Metric Description",
        dataIndex: "metricDescription",
        key: "metricDescription",
        width: "40%",
      },
      {
        title: "Unit",
        dataIndex: "metricUnit",
        key: "metricUnit",
        width: "15%",
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
                  metricName: record.metricName,
                  metricDescription: record.metricDescription,
                  metricUnit: record.metricUnit,
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
    ],
    []
  );

  const handleAdd = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");

      if (
        token &&
        userId &&
        formData.metricName &&
        formData.metricDescription &&
        formData.metricUnit
      ) {
        const res = await AddMetricsApi(token, {
          metric: formData.metricName,
          description: formData.metricDescription,
          unit: formData.metricUnit,
        });
        if (res) {
          await fetchMetrics();
        }
      }
    } catch (error: any) {
      console.error(error);
    }
    setIsAddModalOpen(false);
    setFormData({ metricName: null, metricDescription: null, metricUnit: null });
  };

  const handleEdit = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");

      if (
        token &&
        userId &&
        editingKey
      ) {
        const payload: Payload = {};

        if (formData.metricName) {
          payload.metric = formData.metricName;
        }
        payload.description = formData.metricDescription;
        payload.unit = formData.metricUnit;

        const res = await PatchMetricsApi(token, editingKey, payload);
        if (res) {
          await fetchMetrics();
        }
      } else {
        dispatch(setErrorToast("Have you filled all the fields?"));
      }
    } catch (error: any) {
      console.error(error);
    }
    setIsEditModalOpen(false);
    setEditingKey(null);
    setFormData({ metricName: null, metricDescription: null, metricUnit: null });
  };

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
      console.error(error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-3 w-full flex flex-col items-center">
      {/* Edit Modal */}
      <Modal
        title="Edit Record"
        open={isEditModalOpen}
        destroyOnClose
        onCancel={() => {
          setIsEditModalOpen(false);
          setFormData({ metricName: null, metricDescription: null, metricUnit: null });
          setEditingKey(null);
        }}
        okText="Save"
        onOk={handleEdit}
      >
        <Col>
          <Row className="mt-3">
            <Input
              prefix={
                <Typography.Text className="text-gray-700 opacity-[40%]">
                  Metric Name:
                </Typography.Text>
              }
              value={formData.metricName ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metricName: e.target.value }))
              }
            />
          </Row>
          <Row className="mt-3">
            <Input
              prefix={
                <Typography.Text className="text-gray-700 opacity-[40%]">
                  Metric Description:
                </Typography.Text>
              }
              value={formData.metricDescription ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metricDescription: e.target.value }))
              }
            />
          </Row>
          <Row className="mt-3">
            <Input
              prefix={
                <Typography.Text className="text-gray-700 opacity-[40%]">
                  Metric Unit:
                </Typography.Text>
              }
              value={formData.metricUnit ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metricUnit: e.target.value }))
              }
            />
          </Row>
        </Col>
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Add Record"
        open={isAddModalOpen}
        destroyOnClose
        onCancel={() => {
          setIsAddModalOpen(false);
          setFormData({ metricName: null, metricDescription: null, metricUnit: null });
          setEditingKey(null);
        }}
        okText="Save"
        onOk={handleAdd}
      >
        <Col>
          <Row className="mt-3">
            <Input
              prefix={
                <Typography.Text className="text-gray-700 opacity-[40%]">
                  Metric Name:
                </Typography.Text>
              }
              value={formData.metricName ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metricName: e.target.value }))
              }
            />
          </Row>
          <Row className="mt-3">
            <Input
              prefix={
                <Typography.Text className="text-gray-700 opacity-[40%]">
                  Metric Description:
                </Typography.Text>
              }
              value={formData.metricDescription ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metricDescription: e.target.value }))
              }
            />
          </Row>
          <Row className="mt-3">
            <Input
              prefix={
                <Typography.Text className="text-gray-700 opacity-[40%]">
                  Metric Unit:
                </Typography.Text>
              }
              value={formData.metricUnit ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metricUnit: e.target.value }))
              }
            />
          </Row>
        </Col>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete Record"
        open={isDeleteModalOpen}
        destroyOnClose
        onCancel={() => {
          setIsDeleteModalOpen(false);
        }}
        okText="Confirm"
        onOk={handleDelete}
        okButtonProps={{ style: { backgroundColor: "red" } }}
      >
        <Typography.Text>Are you sure you want to delete this?</Typography.Text>
      </Modal>

      <Typography.Text className="text-[20px] underline underline-offset-2">
        Metrics
      </Typography.Text>

      <Button onClick={() => setIsAddModalOpen(true)}>+ Add</Button>
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