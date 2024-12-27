import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Input,
    Row,
    Table,
    TableColumnsType,
} from "antd";
import { ICategory } from "@/app/interfaces/categories.interface";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
}

interface CategoriesDataTableProps {
    categories: ICategory[] | undefined;
}

const CategoriesTable: React.FC<CategoriesDataTableProps> = ({ categories }) => {
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [formData, setFormData] = useState<FormData>({
        category_name: null,
        parent_id: null,
        description: null
    });

    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [addNewMetric, setAddNewMetric] = useState<boolean>(false);

    const columns: TableColumnsType<DataType> = [
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
                        setFormData({parent_id: null, category_name: null, description: null})
                      }}>
                        <CloseOutlined className="text-[#ff1a1a]"></CloseOutlined>
                      </Button>
                    </Row>
                  ) : (
                    <Button
                      className="w-[30px]"
                      onClick={() => setEditingKey(record.key)}
                    >
                      <EditOutlined></EditOutlined>
                    </Button>
                  )}
                  <Button className="w-[30px]">
                    <DeleteOutlined></DeleteOutlined>
                  </Button>
                </Row>
              );
            },
          },
    ]

    useEffect(() => {
        if (categories) {
            const mappedData: DataType[] = categories.map((data) => ({
                key: data.category_id,
                category_name: data.category_name,
                description: data.description,
                parent_category_id: data.parent_id,
                parent_category_name: data.parent_category_name,
            }));
            setDataSource(mappedData);
            setLoading(false)
        }
    }, [categories]);

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
                        loading={loading}
                        rowClassName={(record) =>
                            editingKey === record.key
                                ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl"
                                : "rounded-xl"
                        }
                    />
                </div>
            </Col>
        </div>
    );
};

export default CategoriesTable;
