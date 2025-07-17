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
    ...restProps
  } = props;

  return (
    <AntSelect
      ref={ref}
      {...restProps}
    />
  );
});

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;

