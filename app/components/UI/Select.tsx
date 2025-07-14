"use client";

import { Select as AntSelect, SelectProps } from "antd";

export default function Select(props: SelectProps<any>) {
  return <AntSelect {...props} />;
}
