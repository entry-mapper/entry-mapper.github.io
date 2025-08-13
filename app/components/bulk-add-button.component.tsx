import React, { useState } from "react";
import { Row, Upload } from "antd";
import { message } from "@/app/components/UI/Message";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import { UploadOutlined } from "@ant-design/icons";
import { postBulkUploadData } from "../api/metrics/data-service.api";
import { useAppSelector } from "../redux/hook";

const BulkAddModal: React.FC<{ visible: boolean }> = ({ visible }) => {
  const user = useAppSelector((state) => state.auth.user); // Assuming user is stored in auth slice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFile(null); // Reset file selection on close
  };

  const handleFileChange = (file: File) => {
    const MAX_SIZE = 0.5 * 1024 * 1024; // 0.5MB

    if (file.size > MAX_SIZE) {
      message.error("File is too large. Please select a file under 500KBs.");
      return false; // Reject file if it's too large
    }
    setFile(file);
    return false; // Prevent default upload behavior
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a file under 500KBs before confirming.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", JSON.stringify(user?.id));

    setUploading(true);

    try {
      const response = await postBulkUploadData(token, formData);

      if (response.status === 201) {
        message.success("File uploaded successfully!");
        handleCloseModal();
      } else {
        message.error("File upload failed. Please try again.");
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          "An error occurred during the file upload.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Row>
      <Button
        className={`${visible ? "visible ml-2" : "hidden"}`}
        onClick={handleOpenModal}
      >
        + Bulk Add
      </Button>

      <Modal
        title="Bulk Add"
        visible={isModalOpen}
        onOk={handleUpload}
        onCancel={handleCloseModal}
        confirmLoading={uploading}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Upload beforeUpload={handleFileChange} accept=".csv" maxCount={1}>
          <Button icon={<UploadOutlined />}>
            Select CSV File - Max 500KBs
          </Button>
        </Upload>
      </Modal>
    </Row>
  );
};

export default BulkAddModal;
