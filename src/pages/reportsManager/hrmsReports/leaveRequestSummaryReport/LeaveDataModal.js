import React, { useState, useEffect } from 'react';
import { Modal, Progress, Card, Tag, Button, Row, Col, Statistic, Empty } from 'antd';
import { 
  CalendarOutlined, 
  CloseOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined 
} from '@ant-design/icons';

const LeaveDataModal = ({ isModalOpen, handleClose, assignleaveList }) => {
  // Calculate totals for summary
  const usedLeaves = assignleaveList.reduce((sum, item) => sum + item.usedLeaves, 0);
  const availableLeaves = assignleaveList.reduce((sum, item) => sum + item.availableLeaves, 0);
  const totalLeaves = usedLeaves + availableLeaves;
  const utilizationRate = totalLeaves > 0 ? ((usedLeaves / totalLeaves) * 100).toFixed(2) : 0;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <CalendarOutlined className="text-blue-500 mr-2" />
          <span>Leave Balance Details</span>
        </div>
      }
      open={isModalOpen}
      onCancel={handleClose}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Close
        </Button>
      ]}
      width={800}
      className="leave-balance-modal"
      closeIcon={<CloseOutlined className="text-gray-500" />}
    >
      {/* Summary Section */}
      <div className="mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small" className="text-center border-blue-200">
              <Statistic
                title="Total Leaves"
                value={totalLeaves}
                valueStyle={{ color: '#1890ff' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="text-center border-green-200">
              <Statistic
                title="Available Leaves"
                value={availableLeaves}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="text-center border-amber-200">
              <Statistic
                title="Used Leaves"
                value={usedLeaves}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="text-center border-purple-200">
              <Statistic
                title="Utilization Rate"
                value={utilizationRate}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* Leave Types List */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FileTextOutlined className="text-gray-500 mr-2" />
          Leave Types Breakdown
        </h3>
        
        {assignleaveList.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No leave data available"
          />
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {assignleaveList.map((leave) => {
                const usedLeaves = leave.usedLeaves || 0;
                const availableLeaves = leave.availableLeaves || 0;
                const totalLeaves = usedLeaves + availableLeaves;   
              const usagePercentage = totalLeaves > 0 ? 
                (usedLeaves / totalLeaves) * 100 : 0;
              
              return (
                <Card 
                  key={leave._id} 
                  size="small" 
                  className="shadow-sm hover:shadow-md transition-all"
                  title={
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{leave.leaveTypeData.name}</span>
                      {leave.leaveTypeData.isPaid && (
                        <Tag color="green" className="m-0">
                          Paid
                        </Tag>
                      )}
                    </div>
                  }
                  extra={
                    <Tag color="blue">
                      Max: {leave.leaveTypeData.maxDays} days
                    </Tag>
                  }
                >
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Usage Progress</span>
                      <span>{usagePercentage.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      percent={usagePercentage} 
                      showInfo={false}
                      strokeColor={{
                        '0%': '#1890ff',
                        '100%': '#722ed1',
                      }}
                    />
                  </div>
                  
                  <Row gutter={16}>
                    <Col span={8}>
                      <div className="text-center p-2 bg-blue-50 rounded border">
                        <div className="text-blue-700 font-bold text-lg">{availableLeaves}</div>
                        <div className="text-blue-600 text-xs">Available</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center p-2 bg-amber-50 rounded border">
                        <div className="text-amber-700 font-bold text-lg">{usedLeaves}</div>
                        <div className="text-amber-600 text-xs">Used</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center p-2 bg-gray-50 rounded border">
                        <div className="text-gray-700 font-bold text-lg">{totalLeaves}</div>
                        <div className="text-gray-600 text-xs">Total</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LeaveDataModal;