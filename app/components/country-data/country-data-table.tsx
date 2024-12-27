import React, { useEffect, useState } from "react";
import { Button, Col, Table } from "antd";
import { CountryData } from "@/app/interfaces/country.interfaces";
import { PatchCountryDataApi } from "@/app/api/country-data/country-data-patch.api";
import { getColumns } from "./country-table-cols";
import AddNewCountryData from "./new-country-data";

interface DataType {
  key: number;
  countryName: string;
  region: string;
  L1: string;
  L2: string;
  metric: string;
  unit: string;
  value: number;
}

interface CountryDataTableProps {
  countryData: CountryData[] | undefined;
  selectedCountry: number | null;
}

const CountryDataTable: React.FC<CountryDataTableProps> = ({
  countryData,
  selectedCountry,
}) => {
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [addNewCountryData, setAddNewCountryData] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false)

  const updateDataSourceValue = (key: number, newValue: number) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((item) =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  useEffect(()=>{
    if(selectedCountry){
      setLoading(true)
    }
    
  },[selectedCountry])

  useEffect(() => {
    if (countryData) {
      const mappedData = countryData.map((data) => ({
        key: data.id,
        countryName: data.country_name,
        region: data.region_name,
        L1: data.super_category ?? "-",
        L2: data.category ?? "-",
        metric: data.metric,
        unit: data.unit,
        value: data.value ?? 0,
      }));
      setDataSource(mappedData);
      setLoading(false)
    }
  }, [countryData]);

  const updateValue = async () => {
    const userString = localStorage.getItem("user");
    let userId = null;
    if (userString) {
      const user = JSON.parse(userString);
      userId = user.id;
    }

    const token = localStorage.getItem("token");

    if (token && userId && editingKey && editValue) {
      const res = await PatchCountryDataApi(
        token,
        editingKey,
        userId,
        editValue.toString(10)
      );
      if (res === true) {
        updateDataSourceValue(editingKey, editValue);
      }
    }
  };

  const handleConfirmChange = () => {
    updateValue();
    setEditingKey(null);
  };

  const columns = getColumns(
    editingKey,
    setEditingKey,
    setEditValue,
    updateDataSourceValue,
    handleConfirmChange
  );

  return (
    <div className="w-full flex items-center justify-center">
      <Col className="w-[90%] justify-center">
        <div className="h-[70vh] lg:w-[85vw] w-[1024px] overflow-y-scroll mx-auto">
          <Table<DataType>
            className="rounded-xl shadow mt-4 w-full"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowHoverable={false}
            tableLayout="fixed"
            loading={loading}
            locale={{
              emptyText: (
                <div className="h-[55vh]">
                  <p className="text-lg text-gray-400">Select Country to View its country data</p>
                </div>
              ),
            }}
            rowClassName={(record) =>
              editingKey === record.key
                ? "shadow-inner bg-[#ffffcc] hover:!bg-[#ffffcc] rounded-xl"
                : "rounded-xl"
            }
          />
        </div>
        <div className="mt-4 w-[85vw] mx-auto rounded-md mb-12">
          {selectedCountry ? (
            addNewCountryData === false ? (
              <Button
                color="primary"
                variant="outlined"
                className="py-4 px-8"
                onClick={() => setAddNewCountryData(true)}
              >
                Add Country Data
              </Button>
            ) : (
              <AddNewCountryData setAddNewCountryData={setAddNewCountryData} selectedCountry={selectedCountry}/>
            )
          ) : null}
        </div>
      </Col>
    </div>
  );
};

export default CountryDataTable;
