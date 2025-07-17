"use client";

import { InputNumber as AntInputNumber, InputNumberProps } from "antd";
import React from "react";

const InputNumber = React.forwardRef<any, InputNumberProps>((props, ref) => {
  const {
    ...restProps
  } = props;

  return (
    <AntInputNumber
      ref={ref}
      {...restProps}
    />
  );
});

export default InputNumber;
