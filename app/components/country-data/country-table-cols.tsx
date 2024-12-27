import { TableColumnsType } from "antd";
import { Button, Row, Select, InputNumber, Popover } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { DelCountryDataApi } from "@/app/api/country-data/country-data-delete.api";

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

export const getColumns = (
  editingKey: number | null,
  setEditingKey: (key: number | null) => void,
  setEditValue: (value: number | null) => void,
  updateDataSourceValue: (key: number, newValue: number) => void,
  handleConfirmChange: () => void
): TableColumnsType<DataType> => [
  {
    title: "Country Name",
    width:'10%',
    dataIndex: "countryName",
    key: "countryName",
    fixed: "left",
    render: (_, record) => {
      return <div>{record.countryName}</div>;
    },
  },
  {
    title: "Region",
    width:'10%',
    dataIndex: "region",
    key: "region",
    render: (_, record) => {
      return (
        <Row>
          {/* {record.key === editingKey ? (
            <Select
              showSearch
              value={record.region}
              placeholder="Select a region"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={regions.map((value) => ({
                value: value.key,
                label: value.label,
              }))}
            />
          ) : (
            <div className="p-3">{record.region}</div>
          )} */}
                      <div className="p-3">{record.region}</div>

        </Row>
      );
    },
  },
  {
    title: "L1",
    dataIndex: "L1",
    key: "1",
    width:'12.5%',
    render: (_, record) => {
      return (
        <Row>
          {/* {record.key === editingKey ? (
            <Select
              showSearch
              value={record.L1}
              placeholder="Select a L1"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={regions.map((value) => ({
                value: value.key,
                label: value.label,
              }))}
            />
          ) : (
            <Popover content={<p>{record.L2}</p>}>
              <div className="p-3 w-full truncate">{record.L1}</div>
            </Popover>
          )} */}
                      <Popover content={<p>{record.L2}</p>}>
              <div className="p-3 w-full truncate">{record.L1}</div>
            </Popover>
        </Row>
      );
    },
  },
  {
    title: "L2",
    dataIndex: "L2",
    key: "2",
    width:'20%',
    render: (_, record) => {
      return (
        <Row>
          {/* {record.key === editingKey ? (
            <Select
              showSearch
              value={record.L1}
              placeholder="Select a L2"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={regions.map((value) => ({
                value: value.key,
                label: value.label,
              }))}
            />
          ) : (
            <Popover content={<p>{record.L2}</p>}>
              <div className="p-3 w-full truncate">{record.L2}</div>
            </Popover>
          )} */}
                      <Popover content={<p>{record.L2}</p>}>
              <div className="p-3 w-full truncate">{record.L2}</div>
            </Popover>
        </Row>
      );
    },
  },
  {
    title: "metric",
    dataIndex: "metric",
    key: "3",
    width:'20%',
    // fixed: 'left',
    render: (_, record) => {
      return (
        <Row>
          {/* {record.key === editingKey ? (
            <Select
              showSearch
              value={record.L1}
              placeholder="Select a metric"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={regions.map((value) => ({
                value: value.key,
                label: value.label,
              }))}
            />
          ) : (
            <Popover content={record.metric}>
              <div className="p-3 w-full truncate">{record.metric}</div>
            </Popover>
          )} */}
                      <Popover content={record.metric}>
              <div className="p-3 w-full truncate">{record.metric}</div>
            </Popover>
        </Row>
      );
    },
  },
  {
    title: "unit",
    dataIndex: "unit",
    key: "4",
    width:'7.5%', 
    fixed: 'left',
    render: (_, record) => {
      return (
        <Row>
          {/* {record.key === editingKey ? (
            <Select
              showSearch
              value={record.L1}
              placeholder="Select a unit"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={regions.map((value) => ({
                value: value.key,
                label: value.label,
              }))}
            />
          ) : (
            <Popover content={record.unit}>
              <div className="w-[190  px] truncate">{record.unit}</div>
            </Popover>
          )} */}
                      <Popover content={record.unit}>
              <div className="w-[190  px] truncate">{record.unit}</div>
            </Popover>
        </Row>
      );
    },
  },
  {
    title: "value",
    dataIndex: "value",
    width:'7.5%',
    key: "5",
    render: (_, record) => {
      return (
        <Row>
          {editingKey === record.key ? (
            <InputNumber
              value={record.value}
              onChange={(value) => setEditValue(value)}
            ></InputNumber>
          ) : (
            <div>{record.value}</div>
          )}
        </Row>
      );
    },
    sorter: (a, b) => a.value - b.value,
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width:'12.5%',
    render: (_, record) => {
      return (
        <Row className="gap-1 w-full">
          {editingKey === record.key ? (
            <Row className="gap-1">
              <Button className="w-[30px]" onClick={handleConfirmChange}>
                <CheckOutlined className="text-[#00ff00]"></CheckOutlined>
              </Button>
              <Button className="w-[30px]" onClick={() => setEditingKey(null)}>
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
          <Button className="w-[30px]" onClick={()=>{
            const token = localStorage.getItem('token');
            if (token){
              DelCountryDataApi(token, record.key)
            }
          }}>
            <DeleteOutlined></DeleteOutlined>
          </Button>
        </Row>
      );
    },
  },
];
