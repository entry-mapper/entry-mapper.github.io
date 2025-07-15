"use client";

import React from "react";
import { Select as AntSelect } from "antd";
import type { SelectProps } from "antd";

interface CustomSelectProps<T = any> extends SelectProps<T> {
  customStyle?: React.CSSProperties;
  analytics?: {
    trackingId?: string;
    eventName?: string;
  };
}

const CustomSelect = React.forwardRef<any, CustomSelectProps>((props, ref) => {
  const {
    customStyle,
    analytics,
    onChange,
    onSelect,
    ...restProps
  } = props;

  const handleChange = (value: any, option: any) => {
    // Analytics logic (optional)
    if (analytics?.eventName) {
      console.log("Select tracking:", analytics.eventName, "with value:", value);
      // You can trigger your analytics API here
    }

    // Trigger original onChange if provided
    onChange?.(value, option);
  };

  const handleSelect = (value: any, option: any) => {
    // Analytics logic for select event (optional)
    if (analytics?.eventName) {
      console.log("Select event:", analytics.eventName, "with value:", value);
      // You can trigger your analytics API here
    }

    // Trigger original onSelect if provided
    onSelect?.(value, option);
  };

  return (
    <AntSelect
      ref={ref}
      onChange={handleChange}
      onSelect={handleSelect}
      style={{ ...customStyle }}
      {...restProps}
    />
  );
});

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;

