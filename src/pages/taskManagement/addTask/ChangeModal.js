import React, { useState } from 'react';
import { Modal, Button, Input, Upload, message, Space, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';

const { Text } = Typography;

const TaskStatusModal = ({ visible, onClose, onSubmit }) => {
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Function to handle file removal
  const handleRemoveFile = (index) => {
    const updatedFiles = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedFiles);
  };

  // Handle attachment change
  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle file before upload (optional)
  const beforeUpload = (file) => {
    const isValidFile = file.size / 1024 / 1024 < 5; // Limit file size to 5MB
    if (!isValidFile) {
      message.error('File must be smaller than 5MB!');
    }
    return isValidFile;
  };

  // Submit form
  const handleSubmit = () => {
    if (!status || !description) {
      message.error('Please provide a status and description');
      return;
    }
    onSubmit(status, description, attachments); // Passing data back to parent
    onClose(); // Close modal after submitting
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      title="Task Status & Attachments"
      okText="Submit"
      cancelText="Cancel"
       className="antmodalclassName"
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Status Input */}
        <input
          placeholder="Enter Task Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        
        {/* Description Input */}
        <input.TextArea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        
        {/* File Upload Section */}
        <Upload
          action="/upload"  // Set the endpoint for your file upload
          listType="picture"
          multiple
          beforeUpload={beforeUpload}
          onChange={handleFileChange}
          showUploadList={false}  // Optional: Hide Ant Design's default upload list
     // Optional: Handle preview
        >
          <Button icon={<UploadOutlined />}>Add Attachments</Button>
        </Upload>

        {/* Display Uploaded Files */}
        <div style={{ marginTop: 10 }}>
          {attachments.length > 0 && (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {attachments.map((file, index) => (
                <Space key={index} style={{ width: '100%' }} align="center">
                  <Text>{file.name}</Text>
                  <DeleteOutlined
                    style={{ color: 'red' }}
                    onClick={() => handleRemoveFile(index)}
                  />
                </Space>
              ))}
            </Space>
          )}
        </div>
      </Space>
    </Modal>
  );
};

const ChangeModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = (status, description, attachments) => {

    // Handle your form submission (e.g., send data to the server)
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={handleModalOpen}>
        Open Task Status Modal
      </Button>
      <TaskStatusModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ChangeModal;
