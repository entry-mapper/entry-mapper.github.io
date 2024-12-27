"use client";

import { Select, InputNumber, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { GetCategoriesApi } from "@/app/api/categories-get.api";
import { MetricCategories } from "@/app/interfaces/metrics.interface";
import { AddCountryDataApi } from "@/app/api/country-data/country-data-post.api";

interface CountryDataFormData {
  L1: number | null;
  L2: number | null;
  metric_id: number | null;
  value: number | null;
}

interface AddNewCountryDataProps {
  setAddNewCountryData: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCountry: number;
}

const AddNewCountryData: React.FC<AddNewCountryDataProps> = ({
  setAddNewCountryData,
  selectedCountry,
}) => {
  const [formData, setFormData] = useState<CountryDataFormData>({
    L1: null,
    L2: null,
    metric_id: null,
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
          const res: MetricCategories[] = await GetCategoriesApi(token);
          setMetricCategories(res);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, []);

  const filterMetrics = () => {
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
  const findMetricUnit = (
    categories: MetricCategories[],
    metric_id: number
  ): string | undefined => {
    // Iterate through each category
    for (const category of categories) {
      // Check if the metric_id exists in the category's metrics
      const metric = category.metrics.find((m) => m.metric_id === metric_id);

      if (metric) {
        // If found, return the unit
        return metric.unit;
      }
      // If the category has sub_categories, search them as well
      if (category.sub_categories) {
        const subCategoryUnit = findMetricUnit(
          category.sub_categories,
          metric_id
        );
        if (subCategoryUnit) {
          return subCategoryUnit;
        }
      }
    }
    return undefined;
  };

  const handleSubmit = () => {
    //to do..
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    let userId = null;
    if (userString) {
      const user = JSON.parse(userString);
      userId = user.id;
    }
    if (
      token &&
      userId &&
      formData.L2 &&
      formData.metric_id &&
      formData.value
    ) {
      AddCountryDataApi(token, {
        country_id: selectedCountry,
        super_category_id: formData.L1,
        category_id: formData.L2,
        metric_id: formData.metric_id,
        value: formData.value,
        user_id: userId,
      });
    }
    setAddNewCountryData(false);
  };

  const handleChange = (key: keyof CountryDataFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1.25fr_2fr_2fr_0.75fr_0.75fr_1.25fr] gap-1 h-full p-2 pt-4 rounded-md bg-slate-1.25fr py-3 px-2 bg-stone-200">
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
          style={{ width: "97.5%" }}
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
          style={{ width: "97.5%" }}
          onChange={(value) => handleChange("L2", value)}
        />
      </div>
      <div id="metric">
        <Select
          showSearch
          value={formData.metric_id}
          placeholder="Select a Metric"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={filterMetrics()}
          disabled={formData.L1 === null}
          style={{ width: "97.5%" }}
          onChange={(value) => handleChange("metric_id", value)}
        />
      </div>
      <div id="unit" className="flex justify-center items-center">
        <p className="text-gray-500">
          {formData.metric_id && metricCategories
            ? findMetricUnit(metricCategories, formData.metric_id)
            : "select metric"}
        </p>
      </div>
      <div id="value">
        <InputNumber
          value={formData.value}
          placeholder="Value"
          onChange={(value) => handleChange("value", value)}
          style={{ width: "97.5%" }}
        ></InputNumber>
      </div>
      <div className="space-x-2">
        <Button
          type="primary"
          className="px-6"
          onClick={handleSubmit}
          disabled={
            formData.L1 === null ||
            formData.L1 === undefined ||
            formData.L2 === null ||
            formData.L2 === undefined ||
            formData.metric_id === null ||
            formData.metric_id === undefined ||
            formData.value === null ||
            formData.value === undefined
          }
        >
          Submit
        </Button>
        <Button
          type="default"
          className="px-6"
          onClick={() => setAddNewCountryData(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddNewCountryData;
