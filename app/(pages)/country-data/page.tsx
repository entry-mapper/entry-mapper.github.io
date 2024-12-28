"use client";

import { getCountriesApi } from "@/app/api/countries.api";
import { GetCountryDataApi } from "@/app/api/country-data/country-data-get.api";
import { Country, ICountryData } from "@/app/interfaces/country.interfaces";
import { Button, Col, Input, InputNumber, Modal, Row, Select, Table, TableColumnsType, Typography } from "antd";
import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth.context";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { render } from "react-dom";
import { PatchCountryDataApi } from "@/app/api/country-data/country-data-patch.api";
import { DelCountryDataApi } from "@/app/api/country-data/country-data-delete.api";
interface ICountryOptions {
  value: number;
  country: Country;
  label: string;
}

interface ICountryTableData extends ICountryData {
  key: string;
  country: string;
  region: string;
}

export default function Home() {
  const { isAuthenticated, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null); // State to hold selected country
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null); // State to hold selected country
  const router = useRouter();
  const [tableData, setTableData] = useState<ICountryTableData[]>();
  const [countries, setCountries] = useState<ICountryOptions[]>([]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [metricValue, setMetricValue] = useState<string | number | null>("");
  const [columns, setColumns] = useState<TableColumnsType<ICountryTableData>>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [countryDataIdToBeDeleted, setCountryDataIdToBeDeleted] = useState<number | null>(null);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    const fetchCountries = async () => {
      if (token) {
        try {
          const countriesResponse: Country[] = await getCountriesApi(token);
          const options = countriesResponse.map((country) => ({
            value: country.id,
            country: country,
            label: country.country_name,
          }));
          setCountries(options);
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      }
    };
    fetchCountries();
    const columns = [
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: 'Region',
        dataIndex: 'region',
        key: 'region',
      },
      {
        title: 'Metric',
        dataIndex: 'metric',
        key: 'metric',
      },
      {
        title: 'L1',
        dataIndex: 'super_category',
        key: 'super_category',
      },
      {
        title: 'L2',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Action',
        key: 'operation',
        width: 140,
        shouldCellUpdate: () => false,
        render: (_: any, record: any) => {
          return (
            <Row className='gap-1 w-full' key={record.id}>
              <Button className='w-[30px]' onClick={() => {
                setMetricValue(record.value)
                setIsEditModalOpen(true);
                setEditingKey(record.id);
              }}>
                <EditOutlined></EditOutlined>
              </Button>
              <Button className='w-[30px]' onClick={async () => {
                setCountryDataIdToBeDeleted(record.key)
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
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const fetchCountryData = async () => {
    const token = localStorage.getItem("token");
    if (selectedCountryId && token) {
      const countryDataResponse: ICountryData[] = await GetCountryDataApi(
        token,
        selectedCountryId
      );
      const tableData = countryDataResponse.map((entry: ICountryData) => {
        return {
          ...entry,
          key: JSON.stringify(entry.id),
          country: selectedCountry?.country_name ?? "",
          region: selectedCountry?.region?.region_name ?? ""
        }
      })
      tableData.sort((a, b) => a.metric.length - b.metric.length);
      setTableData(tableData);
    }
  };

  useEffect(() => {
    fetchCountryData();
  }, [selectedCountryId]);

  const handleCountrySelect = (value: any) => {
    setSelectedCountry(value?.country);
    setSelectedCountryId(value?.country.id);
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

      if (token && userId && editingKey && metricValue) {
        const res = await PatchCountryDataApi(
          token,
          editingKey,
          userId,
          metricValue.toString(10)
        );
        if (res === true) {
          await fetchCountryData();
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
      if (token && countryDataIdToBeDeleted) {
        const response = await DelCountryDataApi(token, countryDataIdToBeDeleted);
        if (response) {
          fetchCountryData();
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
        setMetricValue("");
        setEditingKey(null);
      }} okText="Save" onOk={handleEdit}>
        <Col>
          <Typography.Text>Value: </Typography.Text>
          <InputNumber
            value={metricValue}
            onChange={setMetricValue}
          ></InputNumber>
        </Col>
      </Modal>

      {/* Add Modal */}
      <Modal title="Add Record" open={isAddModalOpen} destroyOnClose onCancel={() => {
        setIsAddModalOpen(false)
        setMetricValue("");
        setEditingKey(null);
      }} okText="Save">
        <Col>
          <Typography.Text>Value: </Typography.Text>
          <InputNumber
            value={metricValue}
            onChange={(event: any) => {
              setMetricValue(JSON.stringify(event))
            }}
          ></InputNumber>
        </Col>
      </Modal>

      {/* Delete Modal */}
      <Modal title="Delete Record" open={isDeleteModalOpen} destroyOnClose onCancel={() => {
        setIsDeleteModalOpen(false)
      }} okText="Confirm" onOk={handleDelete} okButtonProps={{ style: { backgroundColor: 'red' } }}>
        <Typography.Text>Are you sure you want to delete this?</Typography.Text>
      </Modal>

      <Typography.Text className="text-[20px] underline underline-offset-2">
        Country Data
      </Typography.Text>
      <Select
        showSearch
        placeholder="Select a Country"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: 350 }}
        value={selectedCountry?.country_name}
        onSelect={(_, rec) => handleCountrySelect(rec)}
        options={countries}
      />
      <Button onClick={() => setIsAddModalOpen(true)}>+ Add </Button>
      <div className="h-[70vh] lg:w-[75vw] w-[1024px] overflow-y-scroll mx-auto">
        <Table<ICountryTableData>
          className="rounded-xl shadow mt-4 w-full"
          pagination={false}
          columns={columns}
          dataSource={tableData}
          rowHoverable={false}
          tableLayout="fixed"
          // scroll={{ y: 500 }}
          loading={isLoading}
          showSorterTooltip
          locale={{
            emptyText: (
              <div className="h-[55vh]">
                <p className="text-lg text-gray-400">Select Country to View its country data</p>
              </div>
            ),
          }}
          rowClassName={(record) => editingKey === record.id ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl" : "rounded-xl"}
        />
      </div>
    </div>
  );
}
