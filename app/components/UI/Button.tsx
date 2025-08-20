"use client";
import React from 'react';
import { Button as AntButton, ButtonProps } from "antd";

export default function Button(props: ButtonProps) {
  return <AntButton {...props} />;
}
