import { TableColumnsType } from "antd";
import { Button, Row, Select, InputNumber, Popover, Input } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { DelMetricsApi } from "@/app/api/metrics/metrics-del.component";

interface DataType {
  key: number;
  metricName: string;
  metricDescription: string;
  metricUnit: string;
}

export const getColumns = (
  editingKey: number | null,
  setEditingKey: (key: number | null) => void,
  formData: { metricName: string | null; metricDescription: string | null; metricUnit: string | null },
  setFormData: React.Dispatch<
    React.SetStateAction<{
      metricName: string | null;
      metricDescription: string | null;
      metricUnit: string | null;
    }>
  >,
  handleConfirmChange: (id: number, name: string, description: string, unit: string) => void,
  updateDataSourceValue: (key: number,action: string, updatedData?: Partial<DataType>) => void
): TableColumnsType<DataType> => [
  {
    title: "Metric Name",
    dataIndex: "metricName",
    key: "metricName",
    width: "25%",
    fixed: "left",
    render: (_, record) => {
      return (
        <Row>
        {record.key === editingKey ? (
          <Input placeholder={record.metricName? record.metricName: 'Enter Metric Name'}               
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, metricName: e.target.value }))
          }/>
        ) : (
          <div className="p-3 text-black">{record.metricName}</div>
        )}
      </Row>
      )
    },
  },
  {
    title: "Metric Description",
    dataIndex: "metricDescription",
    width: "40%",
    key: "metricDescription",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
            <Input placeholder="Enter Metric Description" 
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, metricDescription: e.target.value }))
            }
            />
          ) : (
            <div className="p-3 text-black">{record.metricDescription}</div>
          )}
        </Row>
      );
    },
  },
  {
    title: "Unit",
    dataIndex: "metricUnit",
    width: "15%",
    key: "metricDescription",
    render: (_, record) => {
      return (
        <Row>
          {record.key === editingKey ? (
            <Input placeholder={record.metricUnit? record.metricUnit: 'Enter Unit'} 
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, metricUnit: e.target.value }))
            }/>
          ) : (
            <div className="p-3 text-black">{record.metricUnit}</div>
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
              <Button className="w-[30px]" onClick={()=>handleConfirmChange(record.key, record.metricName, record.metricDescription, record.metricUnit)}>
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
          <Button className="w-[30px]" onClick={async()=>{
            const token = localStorage.getItem('token');
            if (token){
              const res = await DelMetricsApi(token, record.key)
              if(res === true){
                updateDataSourceValue(record.key, 'del')
              }
            }
          }}>
            <DeleteOutlined></DeleteOutlined>
          </Button>
        </Row>
      );
    },
  },
];
