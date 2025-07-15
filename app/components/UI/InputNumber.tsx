"use client";

import { InputNumber as AntInputNumber, InputNumberProps } from "antd";

export default function InputNumber(props: InputNumberProps) {
  return <AntInputNumber {...props} />;
}


// import { InputNumber as AntInputNumber, InputNumberProps } from "antd";

// export const InputNumber: React.FC<InputNumberProps> = ({...props}) => {
//   return <AntInputNumber {...props} />;
// }