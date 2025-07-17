"use client";

import { Table as AntTable, TableProps } from "antd";

export default function Table<RecordType extends object = any>(
  props: TableProps<RecordType>
) {
  return <AntTable {...props} />;
}
