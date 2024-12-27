"use client";

import { Select, InputNumber, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { GetCategoriesService } from "@/app/service/categories-get.service";
import { MetricCategories } from "@/app/interfaces/metrics.interface";

interface FormData {
  L1: number | null;
  L2: number | null;
  metric: string | null;
  unit: string | null;
  value: number | null;
}

interface AddNewCountryDataProps {
  setAddNewCountryData: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddNewCountryData: React.FC<AddNewCountryDataProps> = ({
  setAddNewCountryData,
}) => {
  const [formData, setFormData] = useState<FormData>({
    L1: null,
    L2: null,
    metric: null,
    unit: null,
    value: null,
  });

  const [metricCategories, setMetricCategories] = useState<
    MetricCategories[] | null
  >(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchCategories = async (): Promise<void> => {
        try {
          const res: MetricCategories[] = await GetCategoriesService(token);
          setMetricCategories(res);
          console.log(res);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, []);

  const filterMetrics = () => {
    console.log("l1 is", formData.L1);
    if (formData.L1) {
      const L1FilteredMetrics = metricCategories?.find(
        (category) => category.category_id === formData.L1
      );
      if (formData.L2) {
        if (formData.L2 === 0) {
          return L1FilteredMetrics?.metrics.map((metric) => ({
            value: metric.metric_id,
            label: metric.value,
          }));
        }
        const L2FilteredMetrics = L1FilteredMetrics?.sub_categories?.find(
          (subcategory) => subcategory.category_id === formData.L2
        );
        return L2FilteredMetrics?.metrics.map((metric) => ({
          value: metric.metric_id,
          label: metric.value,
        }));
      }
      return L1FilteredMetrics?.metrics.map((metric) => ({
        value: metric.metric_id,
        label: metric.value,
      }));
    }

    return [];
  };

  const filterL2 = () => {
    const l2options = [];

    if (formData.L1) {
      const L1FilteredCategories = metricCategories?.find(
        (category) => category.category_id === formData.L1
      );
      if (L1FilteredCategories?.metrics.length) {
        l2options.push({
          value: 0,
          label: "Root",
        });
      }
      l2options.push(
        ...(L1FilteredCategories?.sub_categories?.map((subCategory) => ({
          value: subCategory.category_id,
          label: subCategory.category_name,
        })) || [])
      );
    }

    return l2options;
  };

  const handleSubmit = () => {
    //to do..
    setAddNewCountryData(false);
  };
  const regions = [
    {
      key: 0,
      label: "uk",
    },
  ];

  const handleChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1.25fr_1.25fr_1.25fr_1.25fr_0.9fr_1fr] gap-1 h-full p-2 pt-4 rounded-md bg-slate-1.25fr">
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
          options={metricCategories?.map((mc) => {
            console.log(mc.category_id);
            if (mc.category_id) {
              return {
                value: mc.category_id,
                label: mc.category_name,
              };
            } else {
              return {
                value: 0,
                label: "Root",
              };
            }
          })}
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
          options={filterL2()}
          disabled={formData.L1 === null}
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
          options={filterMetrics()}
          disabled={formData.L1 === null}
          style={{ width: "95%" }}
          onChange={(value) => handleChange("metric", value)}
        />
      </div>
      <div id="unit">
        <p className="text-black">Unit</p>
      </div>
      <div id="value">
        <InputNumber
          value={formData.value}
          placeholder="Value"
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
