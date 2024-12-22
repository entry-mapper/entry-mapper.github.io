import { Select, InputNumber, Typography } from "antd";
import React, { useState } from "react";
import { Button } from "antd";

interface FormData {
  L1: string | null;
  L2: string | null;
  metric: string | null;
  unit: string | null;
  value: number | null;
}

interface AddNewCountryDataProps {
    setAddNewCountryData: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddNewCountryData: React.FC<AddNewCountryDataProps> = ({setAddNewCountryData}) => {
  const [formData, setFormData] = useState<FormData>({
    L1: null,
    L2: null,
    metric: null,
    unit: null,
    value: null,
  });

  const handleSubmit = () => {
    //to do..
    setAddNewCountryData(false);
  };

  const handleChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const regions = [
    {
      key: "1",
      label: "UK",
    },
  ];

  return (
    <div className="grid grid-cols-[150px_150px_225px_225px_225px_225px_120px_140px] gap-1 h-full p-2 pt-4 rounded-md bg-slate-200">
      <div>
        <Typography className="font-bold">Country</Typography>
      </div>
      <div>
        <Typography className="font-bold">Region</Typography>
      </div>
      <div id="L1">
        <Select
          showSearch
          value={formData.L1}
          placeholder="Select a L1"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={regions.map((value) => ({
            value: value.key,
            label: value.label,
          }))}
          style={{ width: "95%" }}
          onChange={(value) => handleChange("L1", value)}
        />
      </div>
      <div id="L2">
        <Select
          showSearch
          value={formData.L2}
          placeholder="Select a L2"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={regions.map((value) => ({
            value: value.key,
            label: value.label,
          }))}
          style={{ width: "95%" }}
          onChange={(value) => handleChange("L2", value)}
        />
      </div>
      <div id="metric">
        <Select
          showSearch
          value={formData.metric}
          placeholder="Select a Metric"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={regions.map((value) => ({
            value: value.key,
            label: value.label,
          }))}
          style={{ width: "95%" }}
          onChange={(value) => handleChange("metric", value)}
        />
      </div>
      <div id="unit">
        <Select
          showSearch
          value={formData.unit}
          placeholder="Select a Unit"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={regions.map((value) => ({
            value: value.key,
            label: value.label,
          }))}
          style={{ width: "95%" }}
          onChange={(value) => handleChange("unit", value)}
        />
      </div>
      <div id="value">
        <InputNumber
          value={formData.value}
          placeholder="Value"
          // onChange={(e) =>
          //   e?.valueOf()
          //     ? (record.value = JSON.parse(e.toString()))
          //     : null
          // }
          //   onChange={(value) => setEditValue(value)}
          onChange={(value) => handleChange("value", value)}
        ></InputNumber>
      </div>
      <div>
        <Button type="primary" className="px-6" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddNewCountryData;
