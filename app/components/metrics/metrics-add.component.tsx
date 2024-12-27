import { Input, Button } from "antd";
import * as React from "react";

interface MetricFormData {
  metricName: string | null;
  metricDescription: string | null;
  metricUnit: string | null;
}

interface MetricAddProps {
  setFormData: React.Dispatch<React.SetStateAction<MetricFormData>>;
  formData: MetricFormData;
  handleSubmit: () => void;
  setAddNewMetric: React.Dispatch<React.SetStateAction<boolean>>
}
export const MetricAdd = ({ setFormData, formData, handleSubmit, setAddNewMetric }: MetricAddProps) => {
  return (
    <div className="grid grid-cols-[1fr_1.6fr_0.6fr_0.8fr] bg-zinc-300 py-3 px-2 rounded-md">
      <div>
        <Input
          placeholder="name"
          className="w-[95%]"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, metricName: e.target.value }))
          }
          value={formData.metricName || ""}
        ></Input>
      </div>
      <div>
        <Input
          placeholder="description"
          className="w-[95%]"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              metricDescription: e.target.value,
            }))
          }
          value={formData.metricDescription || ""}
        ></Input>
      </div>
      <div>
        <Input
          placeholder="unit"
          className="w-[95%]"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, metricUnit: e.target.value }))
          }
          value={formData.metricUnit || ""}
        ></Input>
      </div>
      <div className="space-x-3">
        <Button type="primary" className="w-2/5 ml-1" onClick={handleSubmit} disabled={!formData.metricName || !formData.metricDescription || !formData.metricUnit}>
        Submit
      </Button>
      <Button type="default" className="w-2/5" onClick={()=>setAddNewMetric(false)}>
        Cancel
      </Button>
      </div>
      
    </div>
  );
};
