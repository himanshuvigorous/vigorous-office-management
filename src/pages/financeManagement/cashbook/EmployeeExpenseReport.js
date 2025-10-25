import React from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Divider, 
  Descriptions, 
  Typography, 
  Button, 
  Result, 
  Avatar, 
  Space, 
  Tabs,
  Badge,
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  EyeOutlined, 
  FrownOutlined, 
  ArrowLeftOutlined, 
  DownloadOutlined,
  MoneyCollectOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EmployeeExpenseReport = ({ data }) => {
  const navigate = useNavigate();
  
  if (!data || !data.cashbookData?.statusWiseSummary) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <Result
          icon={<FrownOutlined style={{ color: '#ff4d4f' }} />}
          title="No Expense Data Available"
          subTitle="We couldn't find any expense records for this employee."
          extra={
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  const { 
    fullName,
    profileImage,
    email,
    mobile,
    openingBalance,
    cashbookData,
    advance
  } = data;

  const { 
    statusWiseSummary = [], 
    overallBalance 
  } = cashbookData;

  const handleViewAttachment = (attachmentUrl) => {
    window.open(`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${attachmentUrl}`, '_blank');
  };

  const renderAmount = (amount) => (
    <Text strong type={amount < 0 ? 'danger' : amount > 0 ? 'success' : undefined}>
      ₹{Math.abs(amount)}
    </Text>
  );

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '15%',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => renderAmount(amount),
      sorter: (a, b) => a.amount - b.amount,
      width: '15%',
    },
    {
      title: 'Narration',
      dataIndex: 'naration',
      key: 'naration',
      ellipsis: true,
      width: '40%',
    },
    {
      title: 'Attachments',
      dataIndex: 'attachment',
      key: 'attachment',
      render: (attachments) => (
        <div>
          {attachments && attachments.length > 0 ? (
            <Space>
              <Badge count={attachments.length} />
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewAttachment(attachments[0])}
                size="small"
              >
                View
              </Button>
            </Space>
          ) : (
            'No attachments'
          )}
        </div>
      ),
      width: '30%',
    },
  ];

  const advanceTransactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Type',
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (type) => (
        <Tag color={type === 'deposit' ? 'green' : 'red'}>
          {type === 'deposit' ? 'Deposit' : 'Deduction'}
        </Tag>
      ),
    },
    {
      title: 'Receipt',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => renderAmount(
        record.paymentType === 'deposit' ? amount : -amount
      ),
    },
    {
      title: 'Narration',
      dataIndex: 'naration',
      key: 'naration',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.receiptPDFPath && (
          <Button 
            icon={<DownloadOutlined />} 
            size="small"
            onClick={() => handleViewAttachment(record.receiptPDFPath)}
          >
            Receipt
          </Button>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title={
          <Space>
            <Avatar src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${profileImage}`} />
            <span>{fullName}'s Financial Summary</span>
          </Space>
        } 
        style={{ marginBottom: 20 }}
        extra={
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Employee Name">
            <Text strong>{fullName}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Contact">
            <Text>{mobile?.code} {mobile?.number}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Text>{email}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Opening Balance">
            {openingBalance ? renderAmount(openingBalance) : 0}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Current Balance"
                value={overallBalance}
                precision={2}
                valueStyle={{ color: overallBalance < 0 ? '#cf1322' : '#3f8600' }}
                prefix={<MoneyCollectOutlined />}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Advance Available"
                value={advance?.availableBalance || 0}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<TransactionOutlined />}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Advance"
                value={advance?.totalDepositAmount || 0}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<TransactionOutlined />}
                suffix="₹"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Expense Transactions" key="1">
          {statusWiseSummary.map((statusSummary) => {
            const statusColor = 
              statusSummary.status === 'Approved' ? 'green' : 
              statusSummary.status === 'Rejected' ? 'red' : 
              statusSummary.status === 'Paid' ? 'blue' : 'orange';

            return (
              <div key={statusSummary.status} style={{ marginBottom: 24 }}>
                <Divider orientation="left">
                  <Tag color={statusColor} style={{ fontSize: '1.1em', padding: '5px 10px' }}>
                    {statusSummary.status} (Total: {renderAmount(statusSummary.totalAmount)})
                  </Tag>
                  <span style={{ marginLeft: 8 }}>
                    {statusSummary.count} transaction{statusSummary.count !== 1 ? 's' : ''}
                  </span>
                </Divider>
                
                <Table
                  columns={transactionColumns}
                  dataSource={statusSummary.transactions}
                  rowKey="_id"
                  pagination={statusSummary.transactions.length > 10 ? { pageSize: 10 } : false}
                  bordered
                  size="middle"
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={2}>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text strong>{renderAmount(statusSummary.totalAmount)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </div>
            );
          })}
        </TabPane>

        <TabPane tab="Advance Transactions" key="2">
          <div style={{ marginBottom: 24 }}>
            <Divider orientation="left">
              <Tag color="green" style={{ fontSize: '1.1em', padding: '5px 10px' }}>
                Deposits (Total: {renderAmount(advance?.totalDepositAmount || 0)})
              </Tag>
              <span style={{ marginLeft: 8 }}>
                {advance?.depositList?.length || 0} transaction{advance?.depositList?.length !== 1 ? 's' : ''}
              </span>
            </Divider>
            
            <Table
              columns={advanceTransactionColumns}
              dataSource={advance?.depositList || []}
              rowKey="_id"
              pagination={false}
              bordered
              size="middle"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Divider orientation="left">
              <Tag color="red" style={{ fontSize: '1.1em', padding: '5px 10px' }}>
                Deductions (Total: {renderAmount(-(advance?.totalDeductionAmount || 0))})
              </Tag>
              <span style={{ marginLeft: 8 }}>
                {advance?.deductionList?.length || 0} transaction{advance?.deductionList?.length !== 1 ? 's' : ''}
              </span>
            </Divider>
            
            <Table
              columns={advanceTransactionColumns}
              dataSource={advance?.deductionList || []}
              rowKey="_id"
              pagination={false}
              bordered
              size="middle"
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmployeeExpenseReport;