import { TableColumnsType } from "antd";
import { Button, Row, Select, InputNumber, Popover } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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
const regions = [
  {
    key: "1",
    label: "UK",
  },
];

export const getColumns = (
  editingKey: number | null,
  setEditingKey: (key: number | null) => void,
  setEditValue: (value: number | null) => void,
  updateDataSourceValue: (key: number, newValue: number) => void,
  handleConfirmChange: () => void
): TableColumnsType<DataType> => [
  {
    title: "Country Name",
    width: 150,
    dataIndex: "countryName",
    key: "countryName",
    fixed: "left",
    render: (_, record) => {
      return <div>{record.countryName}</div>;
    },
  },
  {
    title: "Region",
    width: 150,
    dataIndex: "region",
    key: "region",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
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
          )}
        </Row>
      );
    },
  },
  {
    title: "L1",
    dataIndex: "L1",
    key: "1",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
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
              style={{ width: "100%" }}
            />
          ) : (
            <div className="p-3 w-1/8">{record.L1}</div>
          )}
        </Row>
      );
    },
  },
  {
    title: "L2",
    dataIndex: "L2",
    key: "2",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
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
              <div className="p-3 w-40 truncate">{record.L2}</div>
            </Popover>
          )}
        </Row>
      );
    },
  },
  {
    title: "metric",
    dataIndex: "metric",
    key: "3",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
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
            <div className="p-3">{record.metric}</div>
          )}
        </Row>
      );
    },
  },
  {
    title: "unit",
    dataIndex: "unit",
    key: "3",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
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
            <div className="p-3">{record.unit}</div>
          )}
        </Row>
      );
    },
  },
  {
    title: "value",
    dataIndex: "value",
    width: 120,
    key: "4",
    render: (_, record) => {
      return (
        <Row>
          {editingKey === record.key ? (
            <InputNumber
              value={record.value}
              // onChange={(e) =>
              //   e?.valueOf()
              //     ? (record.value = JSON.parse(e.toString()))
              //     : null
              // }
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
    width: 140,
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
          <Button className="w-[30px]">
            <DeleteOutlined></DeleteOutlined>
          </Button>
        </Row>
      );
    },
  },
];
