"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button, Col, Input, Modal, Row, Select, Table, TableColumnsType, Typography } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getCategories } from "@/app/api/categories/categories-get.api";
import { patchCategories } from "@/app/api/categories/categories-patch.api";
import { postCategories } from "@/app/api/categories/categories-post.api";
import { delCategories } from "@/app/api/categories/categories-del.api";
import React from "react";

interface DataType {
  key: number;
  category_name: string;
  description: string;
  parent_category_id: number;
  parent_category_name: string;
}

interface FormData {
  parent_id: number | null;
  description: string | null;
  category_name: string | null;
  category_type?: string | null;
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

export default function Categories() {
  const { isAuthenticated, logout, errorToast, infoToast } = useAuthContext();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category_name: null,
    category_type: null,
    parent_id: null,
    description: null
  });

  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const columns = useMemo<TableColumnsType<DataType>>(
    () => [
      {
        title: "Category Name",
        dataIndex: "category_name",
        key: "category_name",
        width: "25%",
        fixed: "left",
        render: (_, record) => {
          return (
            <Row>
              {record.key === editingKey ? (
                <Input placeholder="Enter Category Name"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category_name: e.target.value }))
                  }
                />
              ) : (
                <div className="p-3 text-black">{record.category_name}</div>
              )}
            </Row>
          )
        },
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "25%",
        fixed: "left",
        render: (_, record) => {
          return (
            <Row>
              {record.key === editingKey ? (
                <Input placeholder="Enter Category Description"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              ) : (
                <div className="p-3 text-black">{record.description}</div>
              )}
            </Row>
          )
        },
      },
      {
        title: "Parent Category Name",
        dataIndex: "parent_category_name",
        key: "parent_category_name",
        width: "25%",
        fixed: "left",
        render: (_, record) => {
          return (
            <Row>
              {record.key === editingKey ? (
                <Input placeholder="Enter Parent Category Id"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, parent_category_name: e.target.value }))
                  }
                />
              ) : (
                <div className="p-3 text-black">{record.parent_category_name}</div>
              )}
            </Row>
          )
        },
      },
      {
        title: "Action",
        key: "operation",
        width: "20%",
        fixed: "right",
        render: (_, record) => {
          return (
            <Row className="gap-1 w-full">
              {editingKey === record.key ? (
                <Row className="gap-1">
                  <Button className="w-[30px]">
                    <CheckOutlined className="text-[#00ff00]"></CheckOutlined>
                  </Button>
                  <Button className="w-[30px]" onClick={() => {
                    setEditingKey(null)
                    setFormData({ parent_id: null, category_name: null, description: null, category_type: null })
                  }}>
                    <CloseOutlined className="text-[#ff1a1a]"></CloseOutlined>
                  </Button>
                </Row>
              ) : (
                <Button
                  className="w-[30px]"
                  onClick={() => {
                    setFormData({
                      category_name: record.category_name,
                      description: record.description,
                      parent_id: record.parent_category_id
                    })
                    setIsEditModalOpen(true);
                    setEditingKey(record.key)
                  }}
                >
                  <EditOutlined></EditOutlined>
                </Button>
              )}
              <Button className="w-[30px]"
                onClick={async () => {
                  setIdToBeDeleted(record.key)
                  setIsDeleteModalOpen(true);
                }}>
                <DeleteOutlined></DeleteOutlined>
              </Button>
            </Row>
          );
        },
      },
    ], []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await getCategories(token);
      if (res) {
        const mappedData: DataType[] = res.map((data: any) => ({
          key: data.category_id,
          category_name: data.category_name,
          description: data.description,
          parent_category_id: data.parent_id,
          parent_category_name: data.parent_category_name,
        }));
        setDataSource(mappedData);
      }
    };
  }

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }

    const initialize = async () => {
      setIsLoading(true);
      try {
        await fetchCategories();
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false); // End loading state once everything is done
      }
    }
    initialize();
  }, [isAuthenticated, router]);

  const handleAdd = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");

      if (token && userId && formData?.category_name) {
        const res = await postCategories(
          token,
          {
            category_name: formData?.category_name,
            description: formData?.description,
            parent_id: formData?.parent_id,
            category_type: formData?.category_type
          }
);
        await fetchCategories();
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

      if (token && userId && editingKey && formData?.category_name) {
        const res = await patchCategories(
          token,
          {
            category_id: editingKey,
            category_name: formData.category_name,
            description: formData?.description,
            parent_id: formData?.parent_id ?? 0,
          },
        );
        if (res) {
          await fetchCategories();
        }
        setIsEditModalOpen(false);
        setEditingKey(null);
      } else {
        errorToast("Please fill required fields.")
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token && idToBeDeleted) {
        const response = await delCategories(token, idToBeDeleted);
        if (response) {
          await fetchCategories();
        }
      }
    } catch (error: any) {

    }
    setIdToBeDeleted(null);
    setIsDeleteModalOpen(false);
  }

  return (
    <div className="space-y-3 w-full flex flex-col items-center">
      {/* Edit Modal */}
      <Modal title="Edit Record" open={isEditModalOpen} destroyOnClose onCancel={() => {
        setIsEditModalOpen(false)
        setFormData({
          category_name: null,
          parent_id: null,
          description: null,
          category_type: null
        });
        setEditingKey(null);
      }} okText="Save" onOk={handleEdit}>
        <Col>
          <Row className="mt-3">
            <Input
              prefix={<div><span className="text-[#ed0006] text-xs font-medium font-inter leading-[18px]">*</span><Typography.Text className="text-gray-700 opacity-[40%]">Category Name: </Typography.Text></div>}
              value={formData?.category_name ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_name: e.target.value,
                }))
              }
            ></Input>
          </Row>
          <Row className="mt-3">
            <Input
              prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Category Type: </Typography.Text>}
              value={formData?.category_type ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_type: e.target.value,
                }))
              }
            ></Input>
          </Row>
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
              placeholder="Select a parent category"
              onSelect={(_, rec) => setFormData((prev) => ({ ...prev, parent_id: rec.id }))}
              options={dataSource?.map((e) => {
                return {
                  value: e.category_name,
                  id: e.key
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
          category_name: null,
          parent_id: null,
          description: null,
          category_type: null
        });
        setEditingKey(null);
      }} okText="Save" onOk={handleAdd}>
        <Col>
          <Row className="mt-3">
            <Input
              prefix={<div><span className="text-[#ed0006] text-xs font-medium font-inter leading-[18px]">*</span><Typography.Text className="text-gray-700 opacity-[40%]">Category Name: </Typography.Text></div>}
              value={formData?.category_name ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_name: e.target.value,
                }))
              }
            ></Input>
          </Row>
          <Row className="mt-3">
            <Input
              prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Category Type: </Typography.Text>}
              value={formData?.category_type ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_type: e.target.value,
                }))
              }
            ></Input>
          </Row>
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
              placeholder="Select a parent category"
              onSelect={(_, rec) => setFormData((prev) => ({ ...prev, parent_id: rec.id }))}
              options={dataSource?.map((e) => {
                return {
                  value: e.category_name,
                  id: e.key
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
        Categories
      </Typography.Text>

      <Button onClick={() => setIsAddModalOpen(true)}>+ Add </Button>
      <div className="h-[70vh] lg:w-[75vw] w-[1024px] overflow-y-scroll mx-auto">
        <MemoizedTable
          data={dataSource}
          columns={columns}
          editingKey={editingKey}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}