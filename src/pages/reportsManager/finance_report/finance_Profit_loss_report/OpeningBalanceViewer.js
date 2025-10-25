import React from 'react';
import { Tabs, Table, Card, Typography } from 'antd';
import { convertIntoAmount } from '../../../../constents/global';

const { TabPane } = Tabs;
const { Title } = Typography;

const OpeningBalanceViewer = ({ data ,lastYearProfitLoss}) => {
  
  // Define columns for each table
  const bankColumns = [
    {
      title: 'Bank Holder Name',
      dataIndex: 'bankholderName',
      key: 'bankholderName',
    },
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  const assetColumns = [
    {
      title: 'Asset Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  const clientColumns = [
    {
      title: 'Client Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  const vendorColumns = [
    {
      title: 'Vendor Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  const employeeColumns = [
    {
      title: 'Employee Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  const groupTypeColumns = [
    {
      title: 'Group Type ID',
       dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  // Calculate totals
  const calculateTotal = (items) => {
   if(items){ return items.reduce((sum, item) => sum + (item?.openingBalance || 0), 0);}
   else{
    return 0;
   }
  };

  const bankTotal = calculateTotal(data.bankOpeningBalance);
  const assetTotal = calculateTotal(data.assetOpeningBalance);
  const clientTotal = calculateTotal(data.clientOpeningBalance);
  // const vendorTotal = calculateTotal(data.vendorOpeningBalance);
  const employeeTotal = calculateTotal(data.employeOpeningBalance);
  const groupTypeTotal = calculateTotal(data.groupTypeOpeningBalance);

  const grandTotal = bankTotal + assetTotal + clientTotal  + employeeTotal + groupTypeTotal;

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Opening Balances</Title>
      
      <Tabs defaultActiveKey="1" type="card" size="large">
        <TabPane tab="Summary" key="1">
          <Card title="Summary of Opening Balances" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              <Card>
                <Title level={4}>Bank Accounts</Title>
                <Title level={3}>₹{bankTotal.toLocaleString()}</Title>
                <p>{data.bankOpeningBalance?.length} accounts</p>
              </Card>
              
              <Card>
                <Title level={4}>Assets</Title>
                <Title level={3}>₹{assetTotal.toLocaleString()}</Title>
                <p>{data.assetOpeningBalance?.length} assets</p>
              </Card>
              
              <Card>
                <Title level={4}>Clients</Title>
                <Title level={3}>₹{clientTotal.toLocaleString()}</Title>
                <p>{data.clientOpeningBalance?.length} clients</p>
              </Card>
              
              {/* <Card>
                <Title level={4}>Vendors</Title>
                <Title level={3}>₹{vendorTotal.toLocaleString()}</Title>
                <p>{data.vendorOpeningBalance?.length} vendors</p>
              </Card> */}
              
              <Card>
                <Title level={4}>Employees</Title>
                <Title level={3}>₹{employeeTotal.toLocaleString()}</Title>
                <p>{data.employeOpeningBalance?.length} employees</p>
              </Card>
              
              <Card>
                <Title level={4}>Group Types</Title>
                <Title level={3}>₹{groupTypeTotal.toLocaleString()}</Title>
                <p>{data.groupTypeOpeningBalance?.length} group types</p>
              </Card>
              {lastYearProfitLoss > 0 && <Card>
                <Title level={4}>Last Year Profit/Loss</Title>
                <Title level={3}>₹{convertIntoAmount(lastYearProfitLoss)}</Title>
                
              </Card>}
            </div>
            
            <div style={{ marginTop: '20px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
              <Title level={3}>Grand Total: ₹{grandTotal.toLocaleString()}</Title>
            </div>
          </Card>
        </TabPane>
        
        <TabPane tab="Bank Accounts" key="2">
          <Table 
            columns={bankColumns} 
            dataSource={data?.bankOpeningBalance} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            footer={() => `Total: ₹${bankTotal.toLocaleString()}`}
          />
        </TabPane>
        
        <TabPane tab="Assets" key="3">
          <Table 
            columns={assetColumns} 
            dataSource={data?.assetOpeningBalance} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            footer={() => `Total: ₹${assetTotal.toLocaleString()}`}
          />
        </TabPane>
        
        <TabPane tab="Clients" key="4">
          <Table 
            columns={clientColumns} 
            dataSource={data?.clientOpeningBalance} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            footer={() => `Total: ₹${clientTotal.toLocaleString()}`}
          />
        </TabPane>
        
        {/* <TabPane tab="Vendors" key="5">
          <Table 
            columns={vendorColumns} 
            dataSource={data?.vendorOpeningBalance} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            footer={() => `Total: ₹${vendorTotal.toLocaleString()}`}
          />
        </TabPane>
         */}
        <TabPane tab="Employees" key="6">
          <Table 
            columns={employeeColumns} 
            dataSource={data?.employeOpeningBalance} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            footer={() => `Total: ₹${employeeTotal.toLocaleString()}`}
          />
        </TabPane>
        
        <TabPane tab="Group Types" key="7">
          <Table 
            columns={groupTypeColumns} 
            dataSource={data?.groupTypeOpeningBalance} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            footer={() => `Total: ₹${groupTypeTotal.toLocaleString()}`}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OpeningBalanceViewer;