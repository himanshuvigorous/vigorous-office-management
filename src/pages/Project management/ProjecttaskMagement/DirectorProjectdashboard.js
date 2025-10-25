import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { diretorProjectDashboardFunc } from './ProjecttaskFeatures/_project_task_reducers';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Tag,
  Select,
  Table,
  Avatar,
  Empty,
  Spin,
  Alert,
  Tooltip,
  Badge
} from 'antd';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  LineElement,
  PointElement
} from 'chart.js';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  LineElement,
  PointElement
);

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

const { Option } = Select;

// Color schemes for charts
const COLORS = [
  'rgba(54, 162, 235, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 205, 86, 0.8)',
  'rgba(201, 203, 207, 0.8)',
  'rgba(102, 178, 255, 0.8)'
];

const BORDER_COLORS = [
  'rgb(54, 162, 235)',
  'rgb(75, 192, 192)',
  'rgb(255, 159, 64)',
  'rgb(255, 99, 132)',
  'rgb(153, 102, 255)',
  'rgb(255, 205, 86)',
  'rgb(201, 203, 207)',
  'rgb(102, 178, 255)'
];

const STATUS_COLORS = {
  'assigned': 'rgba(250, 173, 20, 0.8)',
  'done': 'rgba(82, 196, 26, 0.8)',
  'reassign': 'rgba(250, 173, 20, 0.8)',
  'in-progress': 'rgba(24, 144, 255, 0.8)',
  'rejected': 'rgba(245, 34, 45, 0.8)',
  'pending': 'rgba(217, 217, 217, 0.8)',
  'completed': 'rgba(82, 196, 26, 0.8)',
  'reviewed': 'rgba(114, 46, 209, 0.8)'
};

const PRIORITY_COLORS = {
  'high': 'rgba(245, 34, 45, 0.8)',
  'medium': 'rgba(250, 173, 20, 0.8)',
  'low': 'rgba(82, 196, 26, 0.8)',
  'urgent': 'rgba(245, 34, 45, 0.8)'
};

const DirectorProjectdashboard = ({ userInfoglobal }) => {
  const dispatch = useDispatch();
  const { directorDashboardData, loading, error } = useSelector(state => state.projectTask);
  const [statusChartType, setStatusChartType] = useState('pie');
  const [priorityChartType, setPriorityChartType] = useState('pie');
  const [workloadChartType, setWorkloadChartType] = useState('bar');
  const [projectChartType, setProjectChartType] = useState('bar');
  const [timeChartType, setTimeChartType] = useState('line');

  useEffect(() => {
    dispatch(diretorProjectDashboardFunc({
      companyId: userInfoglobal?.userType === "company"
        ? userInfoglobal?._id
        : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "companyBranch"
        ? userInfoglobal?._id
        : userInfoglobal?.branchId,
      "directorId": null,
    }));
  }, [dispatch, userInfoglobal]);

  // Helper function to format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  // Helper function to format priority for display
  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Format duration for display
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Render chart based on type
  const renderChart = (data, chartType, colors, borderColors, dataKey, nameKey, title, indexAxis = 'x') => {
    if (!data || data.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data available" />;
    }

    const chartData = {
      labels: data.map(item => item[nameKey]),
      datasets: [
        {
          label: dataKey === 'count' ? 'Count' : 'Hours',
          data: data.map(item => item[dataKey]),
          backgroundColor: data.map((item, index) => {
            if (nameKey === 'status' && STATUS_COLORS[item.status]) {
              return STATUS_COLORS[item.status];
            } else if (nameKey === 'priority' && PRIORITY_COLORS[item.priority]) {
              return PRIORITY_COLORS[item.priority];
            }
            return colors[index % colors.length];
          }),
          borderColor: data.map((item, index) => {
            if (nameKey === 'status' && STATUS_COLORS[item.status]) {
              return STATUS_COLORS[item.status];
            } else if (nameKey === 'priority' && PRIORITY_COLORS[item.priority]) {
              return PRIORITY_COLORS[item.priority];
            }
            return borderColors[index % borderColors.length];
          }),
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title,
        },
      },
      indexAxis: indexAxis,
    };

    if (chartType === 'pie') {
      return <Pie data={chartData} options={options} />;
    } else if (chartType === 'doughnut') {
      return <Doughnut data={chartData} options={options} />;
    } else if (chartType === 'line') {
      return <Line data={chartData} options={options} />;
    } else {
      return <Bar data={chartData} options={options} />;
    }
  };

  // Table columns for employee workload
  const workloadColumns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ marginRight: 8, backgroundColor: '#1890ff' }}>
            {text.charAt(0)}
          </Avatar>
          {text}
        </div>
      ),
    },
    {
      title: 'Total Tasks',
      dataIndex: 'totalTasks',
      key: 'totalTasks',
      sorter: (a, b) => a.totalTasks - b.totalTasks,
    },
    {
      title: 'Assigned',
      dataIndex: 'assignedTasks',
      key: 'assignedTasks',
      sorter: (a, b) => a.assignedTasks - b.assignedTasks,
    },
    {
      title: 'In Progress',
      dataIndex: 'inProgressTasks',
      key: 'inProgressTasks',
      sorter: (a, b) => a.inProgressTasks - b.inProgressTasks,
    },
    {
      title: 'Done',
      dataIndex: 'doneTasks',
      key: 'doneTasks',
      sorter: (a, b) => a.doneTasks - b.doneTasks,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (_, element) => {
        const percent =
          element?.totalTasks > 0
            ? (element.doneTasks / (element.totalTasks - element?.rejectedTasks)) * 100
            : 0;
        return <Progress percent={Math.round(percent)} size="small" />;
      },
      sorter: (a, b) => {
        const rateA = a.totalTasks > 0 ? a.doneTasks / a.totalTasks : 0;
        const rateB = b.totalTasks > 0 ? b.doneTasks / b.totalTasks : 0;
        return rateA - rateB;
      },
    },
  ];

  // Table columns for recent tasks
  const recentTasksColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.assignedTo?.name}
          </div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={PRIORITY_COLORS[priority] || '#d9d9d9'}>
          {formatPriority(priority)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || '#d9d9d9'}>
          {formatStatus(status)}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'endDateTime',
      key: 'endDateTime',
      render: (date) => date ? dayjs(date).format('MMM D, YYYY') : 'No due date',
    },
  ];

  // Table columns for active tasks
  const activeTasksColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Assigned to: {record.assignedTo?.name}
          </div>
        </div>
      ),
    },
    {
      title: 'Employee',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${assignedTo?.image}`} style={{ marginRight: 8 }}>
            {assignedTo?.name?.charAt(0)}
          </Avatar>
          {assignedTo?.name}
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={PRIORITY_COLORS[priority] || '#d9d9d9'}>
          {formatPriority(priority)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || '#d9d9d9'}>
          {formatStatus(status)}
        </Tag>
      ),
    },

    {
      title: 'Last Activity',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      render: (time) => dayjs(time).fromNow(),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error Loading Dashboard"
          description={error || "There was an issue loading dashboard data. Please try again later."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>



      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #1890ff' }}>
            <Statistic
              title="Total Tasks"
              value={directorDashboardData?.summary?.totalTasks || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title="Completed Tasks"
              value={directorDashboardData?.summary?.doneTasks || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #faad14' }}>
            <Statistic
              title="In Progress"
              value={directorDashboardData?.summary?.inProgressTasks || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #f5222d' }}>
            <Statistic
              title="Urgent Tasks"
              value={directorDashboardData?.summary?.urgentTasks || 0}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #722ed1' }}>
            <Statistic
              title="Project Tasks"
              value={directorDashboardData?.summary?.projectTasks || 0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #13c2c2' }}>
            <Statistic
              title="Active Tasks"
              value={directorDashboardData?.summary?.activeTasks || 0}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #fa8c16' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#8c8c8c', fontSize: '14px' }}>Completion Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {directorDashboardData?.summary?.completionRate || 0}%
                </div>
              </div>
              <Progress
                type="circle"
                percent={directorDashboardData?.summary?.completionRate || 0}
                size={50}
                strokeColor="#fa8c16"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Status Distribution Chart */}
        <Col xs={24} lg={12}>
          <Card
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}
            title="Task Status Distribution"
            extra={
              <Select
                value={statusChartType}
                onChange={setStatusChartType}
                size="small"
                style={{ width: 100 }}
              >
                <Option value="pie">Pie</Option>
                <Option value="doughnut">Doughnut</Option>
                <Option value="bar">Bar</Option>
              </Select>
            }
          >
            <div style={{ height: 300 }}>
              {renderChart(
                directorDashboardData?.charts?.statusDistribution?.map(item => ({
                  ...item,
                  name: formatStatus(item.status),
                })) || [],
                statusChartType,
                COLORS,
                BORDER_COLORS,
                'count',
                'name',
                'Tasks by Status'
              )}
            </div>
          </Card>
        </Col>

        {/* Priority Distribution Chart */}
        <Col xs={24} lg={12}>
          <Card
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}
            title="Task Priority Distribution"
            extra={
              <Select
                value={priorityChartType}
                onChange={setPriorityChartType}
                size="small"
                style={{ width: 100 }}
              >
                <Option value="pie">Pie</Option>
                <Option value="doughnut">Doughnut</Option>
                <Option value="bar">Bar</Option>
              </Select>
            }
          >
            <div style={{ height: 300 }}>
              {renderChart(
                directorDashboardData?.charts?.priorityDistribution?.map(item => ({
                  ...item,
                  name: formatPriority(item.priority),
                })) || [],
                priorityChartType,
                COLORS,
                BORDER_COLORS,
                'count',
                'name',
                'Tasks by Priority'
              )}
            </div>
          </Card>
        </Col>

        {/* Employee Workload Chart */}
        <Col xs={24} lg={12}>
          <Card
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}
            title="Employee Workload"
            extra={
              <Select
                value={workloadChartType}
                onChange={setWorkloadChartType}
                size="small"
                style={{ width: 100 }}
              >
                <Option value="bar">Bar</Option>
                <Option value="horizontalBar">Horizontal Bar</Option>
              </Select>
            }
          >
            <div style={{ height: 300 }}>
              {renderChart(
                directorDashboardData?.charts?.employeeWorkload?.map(item => ({
                  ...item,
                  name: item.name,
                  count: item.totalTasks
                })) || [],
                workloadChartType === 'horizontalBar' ? 'bar' : workloadChartType,
                COLORS,
                BORDER_COLORS,
                'count',
                'name',
                'Tasks by Employee',
                workloadChartType === 'horizontalBar' ? 'y' : 'x'
              )}
            </div>
          </Card>
        </Col>

        {/* Time Analytics Chart */}
        <Col xs={24} lg={12}>
          <Card
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}
            title="Task Activity Over Time"
            extra={
              <Select
                value={timeChartType}
                onChange={setTimeChartType}
                size="small"
                style={{ width: 100 }}
              >
                <Option value="line">Line</Option>
                <Option value="bar">Bar</Option>
              </Select>
            }
          >
            <div style={{ height: 300 }}>
              {renderChart(
                directorDashboardData?.charts?.timeAnalytics?.map(item => ({
                  ...item,
                  name: dayjs(item.date).format('MMM D'),
                  count: item.taskCount
                })) || [],
                timeChartType,
                COLORS,
                BORDER_COLORS,
                'count',
                'name',
                'Tasks by Date'
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Employee Workload Table */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card
            title="Employee Workload Details"
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <Table
              columns={workloadColumns}
               scroll={{x:'auto'}}
              dataSource={directorDashboardData?.charts?.employeeWorkload || []}
              rowKey="userId"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Project Stats and Recent Tasks */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title="Project Statistics"
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}
            extra={
              <Select
                value={projectChartType}
                onChange={setProjectChartType}
                size="small"
                style={{ width: 100 }}
              >
                <Option value="bar">Bar</Option>
                <Option value="horizontalBar">Horizontal Bar</Option>
              </Select>
            }
          >
            <div style={{ height: 300 }}>
              {renderChart(
                directorDashboardData?.charts?.projectStats?.map(item => ({
                  ...item,
                  name: item.projectName || 'Unassigned',
                  count: item.totalTasks
                })) || [],
                projectChartType === 'horizontalBar' ? 'bar' : projectChartType,
                COLORS,
                BORDER_COLORS,
                'count',
                'name',
                'Tasks by Project',
                projectChartType === 'horizontalBar' ? 'y' : 'x'
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Recent Tasks"
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}
          >
            <Table
              columns={recentTasksColumns}
              dataSource={directorDashboardData?.recentTasks?.slice(0, 5) || []}
              rowKey="_id"
              pagination={false}
              
              size="small"
              scroll={{ y: 240 , x:"auto" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Active Tasks Table */}
      {directorDashboardData?.activeTasks?.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24}>
            <Card
              title={
                <span>
                  Active Tasks <Badge count={directorDashboardData.activeTasks.length} style={{ backgroundColor: '#52c41a', marginLeft: '8px' }} />
                </span>
              }
              style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              <Table
                columns={activeTasksColumns}
                dataSource={directorDashboardData.activeTasks}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                size="middle"
                scroll={{x:'auto'}}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DirectorProjectdashboard;