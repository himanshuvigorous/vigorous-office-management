import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Descriptions, 
  Tag, 
  Avatar, 
  Row, 
  Col,
  Divider,
  Typography 
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  InfoCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { getwfhRequestDetails } from './WFHRequestFeatures/_wfh_request_reducers';

const { Title, Text } = Typography;

const WFHRequestViewModal = ({ modaldata, handleClose }) => {
  const dispatch = useDispatch();
  const isOpen = modaldata?.isOpen;
  const data = modaldata?.data;
  const { wfhrequestDetails } = useSelector((state) => state.wfhRequest);

  useEffect(() => {
    if (data && data?._id) {
      dispatch(getwfhRequestDetails({ _id: data?._id }));
    }
  }, [data, dispatch]);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title="WFH Request Details"
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
    >
      <div style={{ padding: '10px 0' }}>
        {/* Employee Information */}
        <Title level={4} style={{ marginBottom: 16 }}>
          <UserOutlined /> Employee Information
        </Title>
        <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
          <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Full Name">{wfhrequestDetails?.employeData?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{wfhrequestDetails?.employeData?.email}</Descriptions.Item>
          </Descriptions>
         
        </Row>

        <Divider />

        {/* Request Details */}
        <Title level={4} style={{ marginBottom: 16 }}>
          <CalendarOutlined /> Request Details
        </Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Request Type">{wfhrequestDetails?.wfhManagerData?.name}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(wfhrequestDetails?.status)}>
              {wfhrequestDetails?.status?.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {formatDate(wfhrequestDetails?.startDate)}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {formatDate(wfhrequestDetails?.endDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Duration">
            {Math.ceil((new Date(wfhrequestDetails?.endDate) - new Date(wfhrequestDetails?.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
          </Descriptions.Item>
          <Descriptions.Item label="Reason">
            {wfhrequestDetails?.reason}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* Manager Information */}
        <Title level={4} style={{ marginBottom: 16 }}>
          <TeamOutlined /> WFH Type Information
        </Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="WFH Type">
            {wfhrequestDetails?.wfhManagerData?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Per Day Salary Percent">
            {wfhrequestDetails?.wfhManagerData?.perdaySalaryPercent}%
          </Descriptions.Item>
          {/* <Descriptions.Item label="Allowed Days">
            {wfhrequestDetails?.wfhManagerData?.allowedDays}
          </Descriptions.Item> */}
        </Descriptions>

        <Divider />

        {/* System Information */}
        <Title level={4} style={{ marginBottom: 16 }}>
          <InfoCircleOutlined /> System Information
        </Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Created At">
            {formatDate(wfhrequestDetails?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {formatDate(wfhrequestDetails?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default WFHRequestViewModal;