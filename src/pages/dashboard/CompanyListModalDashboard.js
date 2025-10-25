import React from 'react';
import { Modal, Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../config/Encryption';

const CompanyListModalDashboard = ({ data, onClose }) => {
  const navigate = useNavigate(); // For routing to the company view page

  // Define columns for the table
  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'fullName', // Assuming the name is stored in `fullName`
      key: 'fullName',
      render: (text) => <div className="text-nowrap">{text}</div>, // Apply text-nowrap
    },
    {
      title: 'User Name',
      dataIndex: 'userName', // Using `userName` from the object
      key: 'userName',
      render: (text) => <div className="text-nowrap">{text}</div>, // Apply text-nowrap
    },
    {
      title: 'Email',
      dataIndex: 'email', // Display email directly from the object
      key: 'email',
      render: (text) => <div className="text-nowrap">{text}</div>, // Apply text-nowrap
    },
    {
      title: 'Phone Number',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (mobile) => (
        <div className="text-nowrap">
          {mobile.code} {mobile.number}
        </div>
      ), // Combine code and number, apply text-nowrap
    },
    {
      title: 'Plan',
      dataIndex: 'planHistoryData',
      key: 'planHistoryData',
      render: (planHistoryData) => (
        <div className="text-nowrap">{planHistoryData?.title || 'No Plan'}</div>
      ), // Apply text-nowrap
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewCompany(record._id)} // Redirect to the company view page
        >
          View
        </Button>
      ),
    },
  ];

  const handleViewCompany = (companyId) => {
    navigate(`/admin/company/view/${encrypt(companyId)}`);
  };

  return (
    <Modal
      title="Company List"
      className="antmodalclassName"
      visible={true}
      onCancel={onClose}
      width={{
        xs: '95%',
        sm: '90%',
        md: '80%',
        lg: '60%',
        xl: '50%',
        xxl: '50%',
      }}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {/* Table to display company data */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id" // Ensure each row has a unique key based on the company ID
      />
    </Modal>
  );
};

export default CompanyListModalDashboard;
