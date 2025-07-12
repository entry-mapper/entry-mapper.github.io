"use client";

import { getCountriesApi } from "@/app/api/countries.api";
import { GetCountryDataApi, getCountryDataByMetric } from "@/app/api/country-data/country-data-get.api";
import { Country, ICountryData } from "@/app/interfaces/country.interfaces";
import { Col, InputNumber, Modal, Row, Select, Table, TableColumnsType, Typography } from "antd";
import Button from "@/app/components/UI/Button";
import { message } from "@/app/components/UI/Message";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector,useAppDispatch } from "@/app/redux/hook";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PatchCountryDataApi } from "@/app/api/country-data/country-data-patch.api";
import { DelCountryDataApi } from "@/app/api/country-data/country-data-delete.api";
import { GetMetricCategories } from "@/app/interfaces/metrics.interface";
import { getMetricCategories } from "@/app/api/categories/categories-get.api";
import { AddCountryDataApi } from "@/app/api/country-data/country-data-post.api";
import { getTemplate } from "@/app/api/metrics/data-service.api";
import BulkAddButton from "@/app/components/bulk-add-button.component";
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

interface IMetricCategoryOptions {
  value: string;
  metricCategory: GetMetricCategories;
}

export default function CountryData() {
  const dispatch= useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null); // State to hold selected country
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null); // State to hold selected country
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<GetMetricCategories>();
  const router = useRouter();
  const [tableData, setTableData] = useState<ICountryTableData[]>();
  const [countries, setCountries] = useState<ICountryOptions[]>([]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [metricValue, setMetricValue] = useState<string | null>("");
  const [columns, setColumns] = useState<TableColumnsType<ICountryTableData>>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [countryDataIdToBeDeleted, setCountryDataIdToBeDeleted] = useState<number | null>(null);
  const [selectedMetricCategoryToAdd, setSelectedMetricCategoryToAdd] = useState<GetMetricCategories>();
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState<Country>();
  const [metricCategories, setMetricCategories] = useState<GetMetricCategories[]>();

  const fetchCountries = async () => {
    const token: string | null = localStorage.getItem("token");
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

  const fetchMetricCategories = async () => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      try {
        const metricCategoriesResponse: GetMetricCategories[] = await getMetricCategories(token);
        setMetricCategories(metricCategoriesResponse);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchMetricCategories();
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
    setIsLoading(true);
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
    if (selectedMetricCategory && token) {
      const countryDataResponse: ICountryData[] = await getCountryDataByMetric(
        token,
        selectedMetricCategory.id
      );
      const tableData = countryDataResponse.map((entry: ICountryData) => {
        return {
          ...entry,
          key: JSON.stringify(entry.id),
          country: entry?.country_name ?? "",
          region: entry?.region_name ?? ""
        }
      })
      tableData.sort((a, b) => a.metric.length - b.metric.length);
      setTableData(tableData);      
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCountryData();
  }, [selectedCountryId, selectedMetricCategory]);

  const handleCountrySelect = (value: any) => {
    setSelectedCountry(value?.country);
    setSelectedCountryId(value?.country.id);
  };

  const handleAdd = async () => {
    try {
      const userString = localStorage.getItem("user");
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        userId = user.id;
      }

      const token = localStorage.getItem("token");

      if (token && userId && metricValue && selectedMetricCategoryToAdd && selectedCountryToAdd) {
        const payload = {
          country_id: selectedCountryToAdd.id,
          metric_category_id: selectedMetricCategoryToAdd.id,
          value: metricValue,
          user_id: userId
        }
        const res = await AddCountryDataApi(
          token,
          payload
        );
        if (res === true) {
          await fetchCountryData();
        }
      } else {
message.error("select required fields");
      }
    } catch (error: any) {
    
message.error(error?.message);
    }
    setIsAddModalOpen(false);
    setMetricValue("");
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

      if (token && userId && editingKey && metricValue) {
        const res = await PatchCountryDataApi(
          token,
          editingKey,
          userId,
          metricValue.toString()
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
      }} okText="Save" onOk={handleAdd}>
        <Col>
            <Row className="mt-3">
            <Select
              showSearch
              placeholder="Select a Country"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: 350 }}
              value={selectedCountryToAdd?.country_name}
              onSelect={(_, rec) => setSelectedCountryToAdd(rec.country)}
              options={countries}
            />
            <Select
                className="mt-3"
                showSearch
                placeholder="Select a Metric"
                style={{ width: 350 }}
                onSelect={(_, rec) => setSelectedMetricCategoryToAdd(rec.metricCategory)}
                options={metricCategories?.map((e) => {
                  return {
                    value: e.category.id ? `${e.super_category.value}->${e.category.value}->${e.metric.value}` : `${e.super_category.value}->${e.metric.value}`,
                    metricCategory: e
                  }
                }) ?? []}
              />
            </Row>
            <Row className="mt-3">
              <InputNumber
                className="w-full"
                prefix={<Typography.Text className="text-gray-700 opacity-[40%]">Value: </Typography.Text>}
                value={metricValue}
                onChange={(event: any) => {
                  setMetricValue(JSON.stringify(event))
                }}
              ></InputNumber>
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
        Country Data
      </Typography.Text>
      <Row className="w-full justify-center">
      <Select
        showSearch
        placeholder="Filter By Country"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: 350 }}
        value={selectedCountry?.country_name}
        onSelect={(_, rec) => {
          setSelectedMetricCategory(undefined);
          handleCountrySelect(rec);
        }}
        options={countries}
      />
      <div className="ml-3 mr-3 text-[15px] font-bold">Or</div>
      <Select
          className="ml-1"
          showSearch
          placeholder="Filter By Metric"
          style={{ width: 350 }}
          value={selectedMetricCategory?.category.id ? `${selectedMetricCategory.super_category.value}->${selectedMetricCategory.category.value}->${selectedMetricCategory.metric.value}` : selectedMetricCategory ? `${selectedMetricCategory.super_category.value}->${selectedMetricCategory.metric.value}` : undefined}
          onSelect={(_, rec) => {
            setSelectedMetricCategory(rec.metricCategory)
            setSelectedCountry(null);
          }}
          options={metricCategories?.map((e) => {
            return {
              value: e.category.id ? `${e.super_category.value}->${e.category.value}->${e.metric.value}` : `${e.super_category.value}->${e.metric.value}`,
              metricCategory: e
            }
          }) ?? []}
        />
      </Row>
      <Row className="w-full justify-center">
          {/* <Button className={`visible ml-2`} onClick={async () => {
            const token = localStorage.getItem('token');
            if (token) {
              const response = await getTemplate(token);
              // Create a blob from the response
              const blob = new Blob([response.data], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              
              // Create a temporary link to trigger the download
              const link = document.createElement('a');
              link.href = url;
              link.download = 'template.csv'; // Set the filename for the download
              document.body.appendChild(link);
              link.click();
              
              // Clean up
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }}>+ Download Bulk Upload Template</Button> */}
            {/* <BulkAddButton visible={true}></BulkAddButton> */}
          <Button className="ml-2" onClick={() => setIsAddModalOpen(true)}>+ Add </Button>
      </Row>
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
