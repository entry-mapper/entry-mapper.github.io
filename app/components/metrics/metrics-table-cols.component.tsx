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
  metricName: string;
  metricDescription: string;
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
    title: "Metric Name",
    dataIndex: "metricName",
    key: "metricName",
    width: "30%",
    fixed: "left",
    render: (_, record) => {
      return <div>{record.metricName}</div>;
    },
  },
  {
    title: "Metric Description",
    dataIndex: "metricDescription",
    width: "50%",
    key: "metricDescription",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
            <Select
              showSearch
              value={record.metricDescription}
              placeholder="Enter the metric description"
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
            <div className="p-3 text-black">{record.metricDescription}</div>
          )}
        </Row>
      );
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
