"use client";
import React from "react";

import { Modal as AntModal, ModalProps } from "antd";

export default function Modal(props: ModalProps) {
  return <AntModal {...props} />;
}
