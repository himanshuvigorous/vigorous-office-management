import React from 'react';
import { Modal, Table, Typography, List, Divider, Empty, Tag } from 'antd';

const ValidationResultsModal = ({
  open,
  onClose,
  summary = {
    totalRecords: 0,
    successful: 0,
    failed: 0,
    duplicates: 0,
    validationErrors: 0,
    underage: 0
  },
  details = {
    successfulImports: [],
    duplicates: [],
    validationErrors: [],
    underage: []
  }
}) => {
  const { Text, Title } = Typography;

  // Summary cards
  const summaryItems = [
    { label: 'Total Records', value: summary.totalRecords, color: 'default' },
    { label: 'Successful', value: summary.successful, color: 'success' },
    { label: 'Failed', value: summary.failed, color: 'danger' },
    { label: 'Duplicates', value: summary.duplicates, color: 'warning' },
    { label: 'Validation Errors', value: summary.validationErrors, color: 'error' },
    { label: 'Underage', value: summary.underage, color: 'error' },
  ];

  // Validation errors columns
  const validationErrorColumns = [
    {
      title: 'Row Number',
      dataIndex: 'rowNumber',
      key: 'rowNumber',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: ['row', 'fullName'],
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: ['row', 'email'],
      key: 'email',
    },
    {
      title: 'Mobile',
      key: 'mobile',
      render: (_, record) => (
        <span>
          {record.row.primaryMobileCode} {record.row.primaryMobileNumber}
        </span>
      ),
    },
    {
      title: 'Errors',
      key: 'errors',
      render: (_, record) => (
        <List
          size="small"
          dataSource={record.errors}
          renderItem={(error) => (
            <List.Item>
              <Text type="danger">
                <strong>{error.field}:</strong> {error.message}
              </Text>
            </List.Item>
          )}
        />
      ),
    },
  ];

  // Duplicates columns
  const duplicateColumns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      key: 'mobile',
      render: (record) => (
        <span>
          {record.primaryMobileCode} {record.primaryMobileNumber}
        </span>
      ),
    },
  ];

  // Underage columns
  const underageColumns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
  ];

  return (
    <Modal
      title="Import Validation Results"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      centered
    >
      {/* Summary Section */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>Import Summary</Title>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {summaryItems.map((item) => (
            <div 
              key={item.label}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                padding: '8px 16px',
                minWidth: 150,
                textAlign: 'center'
              }}
            >
              <Text type="secondary">{item.label}</Text>
              <div>
                <Text strong style={{ color: item.value > 0 ? (item.color === 'success' ? '#52c41a' : '#ff4d4f') : 'inherit' }}>
                  {item.value}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors Section */}
      {details.validationErrors?.length > 0 && (
        <>
          <Divider orientation="left">
            Validation Errors ({details.validationErrors?.length})
          </Divider>
          <Table
            columns={validationErrorColumns}
            dataSource={details.validationErrors}
            rowKey={(record) => `validation-error-${record.rowNumber}`}
            pagination={false}
            size="small"
            bordered
            scroll={{ x: true }}
            style={{ marginBottom: 24 }}
          />
        </>
      )}

      {/* Duplicates Section */}
      {details.duplicates?.length > 0 && (
        <>
          <Divider orientation="left">Duplicate Entries ({details.duplicates?.length})</Divider>
          <Table
            columns={duplicateColumns}
            dataSource={details.duplicates}
            rowKey="email"
            pagination={false}
            size="small"
            bordered
            scroll={{ x: true }}
            style={{ marginBottom: 24 }}
          />
        </>
      )}

      {/* Underage Section */}
      {details.underage?.length > 0 && (
        <>
          <Divider orientation="left">
            Underage Entries ({details.underage?.length})
          </Divider>
          <Table
            columns={underageColumns}
            dataSource={details.underage}
            rowKey="email"
            pagination={false}
            size="small"
            bordered
            scroll={{ x: true }}
          />
        </>
      )}

      {/* Successfully Imported Section */}
      {details.successfulImports?.length > 0 && (
        <>
          <Divider orientation="left">
            Successfully Imported ({details.successfulImports?.length})
          </Divider>
          <Table
            columns={duplicateColumns} // Reusing the same columns as duplicates
            dataSource={details.successfulImports}
            rowKey="email"
            pagination={false}
            size="small"
            bordered
            scroll={{ x: true }}
          />
        </>
      )}

      {/* Empty State */}
      {details.validationErrors?.length === 0 && 
        details.duplicates?.length === 0 && 
        details.underage?.length === 0 && 
        details.successfulImports?.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No import results to display"
          style={{ margin: '24px 0' }}
        />
      )}
    </Modal>
  );
};

export default ValidationResultsModal;