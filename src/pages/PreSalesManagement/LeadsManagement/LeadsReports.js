import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Table,
  Tag,
  Space,
  Statistic,
  Spin,
  Empty,
  Grid,
  Button,
  Dropdown,
  Menu
} from 'antd';
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  AreaChartOutlined,
  DotChartOutlined
} from '@ant-design/icons';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { LeadManagementReport } from './LeadmanagementFeature/_LeadmanagementFeature_reducers';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { domainName, inputAntdSelectClassNameFilter } from '../../../constents/global';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import moment from 'moment';
import { encrypt } from '../../../config/Encryption';

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
ChartJS.register(...registerables);

const { useBreakpoint } = Grid;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Vibrant color palette
const statusColors = {
  Qualified: '#3A86FF',  // Bright blue
  ProposalSent: '#FFBE0B', // Vibrant yellow
  Closed: '#FF006E',    // Pink
  Working: '#FB5607',   // Orange
  Converted: '#8338EC'  // Purple
};

const sourceColors = {
  'Social Media': '#00BBF9',  // Sky blue
  'Organic': '#00F5D4',       // Teal
  'Compaign': '#F15BB5',      // Hot pink
  'Call': '#9B5DE5'           // Light purple
};

// Chart color variants with transparency
const getColorVariants = (baseColor) => ({
  main: baseColor,
  light: `${baseColor}80`,
  lighter: `${baseColor}30`
});

const chartTypes = {
  weeklyStatus: ['pie', 'doughnut', 'bar'],
  monthlyStatus: ['bar', 'line', 'stacked'],
  sourceDistribution: ['bar', 'line', 'stacked']
};

const LeadsReports = () => {
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { LeadmanagementReportdata, loading } = useSelector((state) => state.LeadmanagementFeature);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [branchId, setBranchId] = useState('');

  const today = moment();
  const startOfMonth = today.clone().startOf('month');
  const weekOfMonth = today.diff(startOfMonth, 'weeks') + 1;
  const normalizedWeek = weekOfMonth <= 0 ? 1 : weekOfMonth;

  // State for filters
  const [filters, setFilters] = useState({
    weekFilter: {
      weekDay: normalizedWeek,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    monthFilter: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    sourceMonthFilter: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    listFilter: {
      assignedToId: "",
      leadCategoryId: "",
      leadSubCategoryId: "",
      startDate: "",
      endDate: "",
      text: "",
      status: "",
      limit: 10,
      isPagination: true,
      sort: { createdAt: -1 }
    }
  });

  // State for chart visibility and types
  const [chartVisibility, setChartVisibility] = useState({
    weeklyStatus: true,
    monthlyStatus: true,
    sourceDistribution: true
  });

  const [chartType, setChartType] = useState({
    weeklyStatus: 'pie',
    monthlyStatus: 'bar',
    sourceDistribution: 'bar'
  });

  useEffect(() => {
    handleReportCallingFunc();
  }, [filters, branchId]);

  const handleReportCallingFunc = () => {
    dispatch(LeadManagementReport({
      companyId: userInfoglobal?.userType === "company"
        ? userInfoglobal?._id
        : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" ? branchId : userInfoglobal?.userType === "companyBranch"
        ? userInfoglobal?._id
        : userInfoglobal?.branchId,
      ...filters
    }));
  };

  const handleFilterChange = (filterType, key, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [key]: value
      }
    }));
  };

  const handleBranchChange = (value) => {
    setBranchId(value);
  };

  useEffect(() => {
    dispatch(
      branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      })
    )
  }, []);

  const toggleChart = (chart) => {
    setChartVisibility(prev => ({
      ...prev,
      [chart]: !prev[chart]
    }));
  };

  const changeChartType = (chart, type) => {
    setChartType(prev => ({
      ...prev,
      [chart]: type
    }));
  };

  // Chart data preparation
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const weeklyStatusData = {
  labels: LeadmanagementReportdata?.weeklyStats?.map(item => item._id.status) || [],
  datasets: [
    {
      data: LeadmanagementReportdata?.weeklyStats?.map(item => item.leadsCount) || [],
      backgroundColor: LeadmanagementReportdata?.weeklyStats?.map(() => getRandomColor()) || [],
      borderColor: '#fff',
      borderWidth: 2,
      hoverBorderWidth: 3
    }
  ]
};


  const monthlyStatusData = {
    labels: LeadmanagementReportdata?.monthlyStats?.map(item => item._id.status) || [],
    datasets: [
      {
        label: 'Leads',
        data: LeadmanagementReportdata?.monthlyStats?.map(item => item.leadsCount) || [],
        backgroundColor: getColorVariants(statusColors.Qualified).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Followups',
        data: LeadmanagementReportdata?.monthlyStats?.map(item => item.followupsCount) || [],
        backgroundColor: getColorVariants(statusColors.ProposalSent).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Transfers',
        data: LeadmanagementReportdata?.monthlyStats?.map(item => item.transfersCount) || [],
        backgroundColor: getColorVariants(statusColors.Working).main,
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  const stackedMonthlyStatusData = {
    labels: LeadmanagementReportdata?.monthlyStats?.map(item => item._id.status) || [],
    datasets: [
      {
        label: 'Leads',
        data: LeadmanagementReportdata?.monthlyStats?.map(item => item.leadsCount) || [],
        backgroundColor: getColorVariants(statusColors.Qualified).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Followups',
        data: LeadmanagementReportdata?.monthlyStats?.map(item => item.followupsCount) || [],
        backgroundColor: getColorVariants(statusColors.ProposalSent).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Transfers',
        data: LeadmanagementReportdata?.monthlyStats?.map(item => item.transfersCount) || [],
        backgroundColor: getColorVariants(statusColors.Working).main,
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  const sourceDistributionData = {
    labels: LeadmanagementReportdata?.sourceStats?.map(item => item._id.source) || [],
    datasets: [
      {
        label: 'Leads',
        data: LeadmanagementReportdata?.sourceStats?.map(item => item.leadsCount) || [],
        backgroundColor: getColorVariants(sourceColors['Social Media']).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Followups',
        data: LeadmanagementReportdata?.sourceStats?.map(item => item.followupsCount) || [],
        backgroundColor: getColorVariants(sourceColors['Organic']).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Transfers',
        data: LeadmanagementReportdata?.sourceStats?.map(item => item.transfersCount) || [],
        backgroundColor: getColorVariants(sourceColors['Compaign']).main,
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  const stackedSourceDistributionData = {
    labels: LeadmanagementReportdata?.sourceStats?.map(item => item._id.source) || [],
    datasets: [
      {
        label: 'Leads',
        data: LeadmanagementReportdata?.sourceStats?.map(item => item.leadsCount) || [],
        backgroundColor: getColorVariants(sourceColors['Social Media']).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Followups',
        data: LeadmanagementReportdata?.sourceStats?.map(item => item.followupsCount) || [],
        backgroundColor: getColorVariants(sourceColors['Organic']).main,
        borderColor: '#fff',
        borderWidth: 1
      },
      {
        label: 'Transfers',
        data: LeadmanagementReportdata?.sourceStats?.map(item => item.transfersCount) || [],
        backgroundColor: getColorVariants(sourceColors['Compaign']).main,
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  // Common chart options
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: screens.xs ? 'bottom' : 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: screens.xs ? 10 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label || ''}: ${context.raw}`;
          }
        }
      }
    }
  };

  const barChartOptions = {
    ...baseChartOptions,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: screens.xs ? 10 : 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            size: screens.xs ? 10 : 12
          }
        }
      }
    }
  };

  const stackedBarChartOptions = {
    ...barChartOptions,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      }
    }
  };

  const lineChartOptions = {
    ...baseChartOptions,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      }
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 3
      },
      point: {
        radius: 5,
        hoverRadius: 7
      }
    }
  };

  // Render appropriate chart based on type
  const renderChart = (type, data, options, stackedData, stackedOptions) => {
    switch (type) {
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      case 'stacked':
        return <Bar data={stackedData} options={stackedOptions} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  // Columns for leads table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      onCell: () => ({
        style: { whiteSpace: 'nowrap' },
      }),
      key: 'name',
      render: (text, record) => (
        <a
          onClick={() => navigate(`/admin/lead-management/view/${encrypt(record._id)}`)}
          style={{ color: '#3A86FF', fontWeight: 500 }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      onCell: () => ({
        style: { whiteSpace: 'nowrap' },
      }),
      key: 'email',
      render: (email) => <span style={{ color: '#666' }}>{email}</span>,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      onCell: () => ({
        style: { whiteSpace: 'nowrap' },
      }),
      key: 'mobile',
      render: (mobile) => (
        <span style={{ color: '#666' }}>{`${mobile.code} ${mobile.number}`}</span>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      onCell: () => ({
        style: { whiteSpace: 'nowrap' },
      }),
      key: 'source',
      render: (source) => (
        <Tag
          color={sourceColors[source] || '#888'}
          style={{
            color: '#fff',
            fontWeight: 600,
            borderRadius: 12,
            padding: '0 10px'
          }}
        >
          {source}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={statusColors[status] || '#888'}
          style={{
            color: '#fff',
            fontWeight: 600,
            borderRadius: 12,
            padding: '0 10px'
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      onCell: () => ({
        style: { whiteSpace: 'nowrap' },
      }),
      render: (date) => (
        <span style={{ color: '#666' }}>
          {dayjs(date).format('DD MMM YYYY, hh:mm A')}
        </span>
      ),
    },
    {
      title: 'Followups',
      dataIndex: 'followupsCount',
      key: 'followupsCount',
      render: (count) => (
        <span style={{
          color: count > 0 ? '#3A86FF' : '#666',
          fontWeight: count > 0 ? 600 : 400
        }}>
          {count}
        </span>
      ),
    },
    {
      title: 'Last Followup',
      dataIndex: 'lastFollowupDate',
      key: 'lastFollowupDate',
      onCell: () => ({
        style: { whiteSpace: 'nowrap' },
      }),
      render: (date) => (
        <span style={{ color: '#666' }}>
          {date ? dayjs(date).format('DD MMM YYYY') : 'N/A'}
        </span>
      ),
    },
  ];

  // Summary statistics
  const totalLeads = LeadmanagementReportdata?.leadList?.length || 0;
  const totalFollowups = LeadmanagementReportdata?.leadList?.reduce((sum, lead) => sum + lead.followupsCount, 0) || 0;
  const convertedLeads = LeadmanagementReportdata?.leadList?.filter(lead => lead.status === 'Converted').length || 0;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;

  // Chart container style
  const chartContainerStyle = {
    height: screens.xs ? '250px' : '350px',
    position: 'relative',
    margin: screens.xs ? '0 -10px' : '0'
  };

  const chartTypeMenu = (chart) => (
    <Menu onClick={({ key }) => changeChartType(chart, key)}>
      {chartTypes[chart].map(type => (
        <Menu.Item key={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <GlobalLayout isBreadCrump={false}>
      <div style={{
        padding: screens.xs ? '10px' : '24px',
       
      }}>

        <Card
          type="inner"
          title={
            <span style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#2c3e50'
            }}>
              Filters
            </span>
          }
          style={{
            marginBottom: 24,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
          }}
          headStyle={{

            borderBottom: '1px solid #e0e0e0',
            padding: screens.xs ? '12px 16px' : '16px 24px'
          }}
          bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
        >

          <div className='flex gap-2 items-center'>
            {userInfoglobal?.userType === "company" && (

              <Select
                placeholder="Select Branch"
                style={{ width: '100%' }}
                className={inputAntdSelectClassNameFilter}
                onChange={handleBranchChange}
                value={branchId}
                suffixIcon={<span style={{ color: '#3A86FF' }}>▼</span>}
              >
                <Option value="">All Branches</Option>
                {branchList?.map((item) => (
                  <Option key={item._id} value={item._id}>{item.fullName}</Option>
                ))}
              </Select>

            )}
            <Select
              placeholder="Select Week"
              className={inputAntdSelectClassNameFilter}
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('weekFilter', 'weekDay', value)}
              value={filters.weekFilter.weekDay}
              suffixIcon={<span style={{ color: '#3A86FF' }}>▼</span>}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>Week {i + 1}</Option>
              ))}
            </Select>

            <Select
              placeholder="Select Year"
              className={inputAntdSelectClassNameFilter}
              style={{ width: '100%' }}
              onChange={(value) => {
                handleFilterChange('weekFilter', 'year', value);
                handleFilterChange('monthFilter', 'year', value);
                handleFilterChange('sourceMonthFilter', 'year', value);
              }}
              value={filters.weekFilter.year}
              suffixIcon={<span style={{ color: '#3A86FF' }}>▼</span>}
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>

            <Select
              placeholder="Select Month"
              className={inputAntdSelectClassNameFilter}
              style={{ width: '100%' }}
              onChange={(value) => {
                handleFilterChange('weekFilter', 'month', value);
                handleFilterChange('monthFilter', 'month', value);
                handleFilterChange('sourceMonthFilter', 'month', value);
              }}
              value={filters.monthFilter.month}
              suffixIcon={<span style={{ color: '#3A86FF' }}>▼</span>}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>
                  {dayjs().month(i).format('MMMM')}
                </Option>
              ))}
            </Select>

          </div>
        </Card>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {[
            {
              title: 'Total Leads',
              value: totalLeads,
              icon: <BarChartOutlined style={{ color: '#3A86FF' }} />,
              color: '#3A86FF',
              trend: 'up'
            },
            {
              title: 'Total Followups',
              value: totalFollowups,
              icon: <LineChartOutlined style={{ color: '#FFBE0B' }} />,
              color: '#FFBE0B',
              trend: 'up'
            },
            {
              title: 'Converted Leads',
              value: convertedLeads,
              icon: <PieChartOutlined style={{ color: '#8338EC' }} />,
              color: '#8338EC',
              trend: convertedLeads > 0 ? 'up' : 'down'
            },
            {
              title: 'Conversion Rate',
              value: conversionRate,
              suffix: '%',
              icon: <AreaChartOutlined style={{ color: '#FF006E' }} />,
              color: '#FF006E',
              trend: conversionRate > 0 ? 'up' : 'down'
            }
          ].map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                bordered={false}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${stat.color}`,
                  marginBottom: '16px'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic
                  title={
                    <span style={{
                      color: '#7f8c8d',
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      {stat.title}
                    </span>
                  }
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginRight: '8px'
                    }}>
                      {stat.icon}
                      {stat.trend === 'up' ? (
                        <span style={{
                          color: '#2ecc71',
                          marginLeft: '4px',
                          fontSize: '12px'
                        }}>↑</span>
                      ) : (
                        <span style={{
                          color: '#e74c3c',
                          marginLeft: '4px',
                          fontSize: '12px'
                        }}>↓</span>
                      )}
                    </div>
                  }
                  valueStyle={{
                    color: stat.color,
                    fontWeight: 600,
                    fontSize: '24px'
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            background: '#fff',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <Spin size="large" tip="Loading reports..." />
          </div>
        ) : (
          <>
            {/* Charts Section */}
            <Row gutter={[16, 16]}>
              {chartVisibility.weeklyStatus && (
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: 500 }}>Weekly Lead Status</span>
                        <Space>
                          <Dropdown
                            overlay={chartTypeMenu('weeklyStatus')}
                            placement="bottomRight"
                          >
                            <Button
                              size="small"
                              icon={<DotChartOutlined />}
                              style={{ border: 'none' }}
                            />
                          </Dropdown>
                          <Button
                            size="small"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => toggleChart('weeklyStatus')}
                            style={{ border: 'none' }}
                          />
                        </Space>
                      </div>
                    }
                    bordered={false}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      background: '#fff'
                    }}
                    bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
                  >
                    {LeadmanagementReportdata?.weeklyStats?.length ? (
                      <div style={chartContainerStyle}>
                        {renderChart(
                          chartType.weeklyStatus,
                          weeklyStatusData,
                          baseChartOptions
                        )}
                      </div>
                    ) : (
                      <Empty
                        description="No weekly data available"
                        imageStyle={{ height: 80 }}
                      />
                    )}
                  </Card>
                </Col>
              )}

              {chartVisibility.monthlyStatus && (
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: 500 }}>Monthly Lead Status</span>
                        <Space>
                          <Dropdown
                            overlay={chartTypeMenu('monthlyStatus')}
                            placement="bottomRight"
                          >
                            <Button
                              size="small"
                              icon={<DotChartOutlined />}
                              style={{ border: 'none' }}
                            />
                          </Dropdown>
                          <Button
                            size="small"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => toggleChart('monthlyStatus')}
                            style={{ border: 'none' }}
                          />
                        </Space>
                      </div>
                    }
                    bordered={false}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      background: '#fff'
                    }}
                    bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
                  >
                    {LeadmanagementReportdata?.monthlyStats?.length ? (
                      <div style={chartContainerStyle}>
                        {renderChart(
                          chartType.monthlyStatus,
                          monthlyStatusData,
                          chartType.monthlyStatus === 'stacked' ? stackedBarChartOptions :
                            chartType.monthlyStatus === 'line' ? lineChartOptions : barChartOptions,
                          stackedMonthlyStatusData,
                          stackedBarChartOptions
                        )}
                      </div>
                    ) : (
                      <Empty
                        description="No monthly data available"
                        imageStyle={{ height: 80 }}
                      />
                    )}
                  </Card>
                </Col>
              )}

              {chartVisibility.sourceDistribution && (
                <Col xs={24}>
                  <Card
                    title={
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: 500 }}>Lead Source Distribution</span>
                        <Space>
                          <Dropdown
                            overlay={chartTypeMenu('sourceDistribution')}
                            placement="bottomRight"
                          >
                            <Button
                              size="small"
                              icon={<DotChartOutlined />}
                              style={{ border: 'none' }}
                            />
                          </Dropdown>
                          <Button
                            size="small"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => toggleChart('sourceDistribution')}
                            style={{ border: 'none' }}
                          />
                        </Space>
                      </div>
                    }
                    bordered={false}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      background: '#fff'
                    }}
                    bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
                  >
                    {LeadmanagementReportdata?.sourceStats?.length ? (
                      <div style={chartContainerStyle}>
                        {renderChart(
                          chartType.sourceDistribution,
                          sourceDistributionData,
                          chartType.sourceDistribution === 'stacked' ? stackedBarChartOptions :
                            chartType.sourceDistribution === 'line' ? lineChartOptions : barChartOptions,
                          stackedSourceDistributionData,
                          stackedBarChartOptions
                        )}
                      </div>
                    ) : (
                      <Empty
                        description="No source data available"
                        imageStyle={{ height: 80 }}
                      />
                    )}
                  </Card>
                </Col>
              )}
            </Row>

            {/* Hidden charts toggle */}
            <div style={{
              textAlign: 'center',
              margin: '16px 0',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {!chartVisibility.weeklyStatus && (
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => toggleChart('weeklyStatus')}
                  style={{
                    color: '#3A86FF',
                    fontWeight: 500
                  }}
                >
                  Show Weekly Status
                </Button>
              )}
              {!chartVisibility.monthlyStatus && (
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => toggleChart('monthlyStatus')}
                  style={{
                    color: '#FFBE0B',
                    fontWeight: 500
                  }}
                >
                  Show Monthly Status
                </Button>
              )}
              {!chartVisibility.sourceDistribution && (
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => toggleChart('sourceDistribution')}
                  style={{
                    color: '#8338EC',
                    fontWeight: 500
                  }}
                >
                  Show Source Distribution
                </Button>
              )}
            </div>

            {/* Leads Table */}
            <Card
              title={
                <span style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  Recent Leads
                </span>
              }
              style={{
                marginTop: 24,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: 'none'
              }}

              headStyle={{
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0',
                padding: screens.xs ? '12px 16px' : '16px 24px'
              }}
              bodyStyle={{ padding: screens.xs ? '0' : '0 16px' }}
            >
              <Table
                columns={columns}
                dataSource={LeadmanagementReportdata?.leadList?.slice(0, 10) || []}
                rowKey="_id"
                pagination={false}
                scroll={{ x: true }}
                locale={{
                  emptyText: (
                    <Empty
                      description="No leads found"
                      imageStyle={{ height: 60 }}
                      style={{ padding: '40px 0' }}
                    />
                  )
                }}
                style={{
                  borderRadius: '8px'
                }}
              />
            </Card>
          </>
        )}

      </div>
    </GlobalLayout>
  );
};

export default LeadsReports;