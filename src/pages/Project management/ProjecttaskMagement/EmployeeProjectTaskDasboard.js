import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { employeeProjectdashbord } from './ProjecttaskFeatures/_project_task_reducers';
import { 
  Card, 
  Select,
  Empty,
  Alert,
  Spin,
  Tag,
  Progress,
  Grid
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  ProjectOutlined,
  BarChartOutlined,
  CalendarOutlined,
  RocketOutlined,
  DashboardOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title
} from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title
);

const { Option } = Select;
const { useBreakpoint } = Grid;

// Professional color scheme
const COLORS = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  success: '#4cc9f0',
  warning: '#f72585',
  info: '#7209b7',
  accent: '#4895ef',
  dark: '#2b2d42',
  light: '#f8f9fa'
};

const CHART_COLORS = [
  '#4361ee', '#4cc9f0', '#f72585', '#7209b7', '#4895ef', '#3a0ca3',
  '#38b000', '#f3722c', '#6a4c93', '#ff9e00', '#06d6a0', '#ef476f'
];

const STATUS_CONFIG = {
  'done': { color: '#06d6a0', icon: <CheckCircleOutlined />, label: 'Done' },
  'completed': { color: '#06d6a0', icon: <CheckCircleOutlined />, label: 'Completed' },
  'inProgress': { color: '#4361ee', icon: <SyncOutlined spin />, label: 'In Progress' },

  'rejected': { color: '#ef476f', icon: <CloseCircleOutlined />, label: 'Rejected' },
  'reassign': { color: '#f3722c', icon: <ExclamationCircleOutlined />, label: 'Reassign' },
  'assigned': { color: '#ffd166', icon: <ClockCircleOutlined />, label: 'Assigned' },
  'reviewed': { color: '#7209b7', icon: <ExclamationCircleOutlined />, label: 'Reviewed' }
};

const PRIORITY_CONFIG = {
  'urgent': { color: '#ef476f', label: 'Urgent' },
  'high': { color: '#f3722c', label: 'High' },
  'medium': { color: '#ffd166', label: 'Medium' },
  'low': { color: '#06d6a0', label: 'Low' }
};

const EmployeeProjectTaskDashboard = ({ userInfoglobal }) => {
  const dispatch = useDispatch();
  const { employeeProjectDashboardData, loading, error } = useSelector(state => state.projectTask);
  const screens = useBreakpoint();
  
  // State for chart types
  const [statusChartType, setStatusChartType] = useState('doughnut');
  const [priorityChartType, setPriorityChartType] = useState('doughnut');
  const [projectChartType, setProjectChartType] = useState('bar');

  useEffect(() => {
    dispatch(employeeProjectdashbord({
      "employeeId": userInfoglobal?._id,
      startDate: '',
      endDate: '',
    }));
  }, [dispatch, userInfoglobal?._id]);
  
  // Helper function to format hours for display
  const formatHours = (hours) => {
    if (!hours || isNaN(hours)) return '0h 0m';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  // Render chart based on type
  const renderChart = (data, chartType, colors, dataKey, nameKey, title) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-72">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data available" />
        </div>
      );
    }

    const chartData = {
      labels: data.map(item => item[nameKey]),
      datasets: [
        {
          label: dataKey === 'count' ? 'Task Count' : 'Hours',
          data: data.map(item => item[dataKey]),
          backgroundColor: data.map((item, index) => {
            if (nameKey === 'status' && STATUS_CONFIG[item.status]) {
              return STATUS_CONFIG[item.status].color + '90';
            } else if (nameKey === 'priority' && PRIORITY_CONFIG[item.priority]) {
              return PRIORITY_CONFIG[item.priority].color + '90';
            }
            return colors[index % colors.length] + '90';
          }),
          borderColor: data.map((item, index) => {
            if (nameKey === 'status' && STATUS_CONFIG[item.status]) {
              return STATUS_CONFIG[item.status].color;
            } else if (nameKey === 'priority' && PRIORITY_CONFIG[item.priority]) {
              return PRIORITY_CONFIG[item.priority].color;
            }
            return colors[index % colors.length];
          }),
          borderWidth: 2,
          borderRadius: chartType === 'bar' ? 4 : 0,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            }
          }
        },
        title: {
          display: false,
        },
      },
      ...(chartType === 'bar' && {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      })
    };

    if (chartType === 'pie') {
      return <Pie data={chartData} options={options} />;
    } else if (chartType === 'doughnut') {
      return <Doughnut data={chartData} options={options} />;
    } else {
      return <Bar data={chartData} options={options} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spin size="large" />
        <div className="mt-4 text-gray-500 text-sm">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert
          message="Error Loading Dashboard"
          description={error || "There was an issue loading your dashboard data. Please try again later."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-sm md:text-2xl font-bold text-gray-800">Project Task Dashboard</h1>
          <p className="text-gray-500 text-xs md:text-sm">Overview of your tasks and time tracking</p>
        </div>
        <div className="flex items-center space-x-2 bg-white py-1 px-3 md:py-2 md:px-4 rounded-lg shadow-sm text-xs md:text-sm">
          <DashboardOutlined className="text-blue-500" />
          <span className="font-medium">Employee Workspace</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-4 md:mb-6">
        {/* Total Hours Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs opacity-80">Total Hours</p>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mt-1">
                {formatHours(employeeProjectDashboardData?.timeAnalytics?.totalHoursAllTime || 0)}
              </h3>
            </div>
            <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full">
              <FieldTimeOutlined className="text-lg md:text-xl" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs">
            <span className="opacity-80">All Time</span>
          </div>
        </div>

        {/* Tasks Assigned Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg p-4 md:p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs opacity-80">Tasks Assigned</p>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mt-1">
                {employeeProjectDashboardData?.detailedBreakdown?.totalAssignedTasks || 0}
              </h3>
            </div>
            <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full">
              <ProjectOutlined className="text-lg md:text-xl" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs">
            <span className="opacity-80">
              {employeeProjectDashboardData?.detailedBreakdown?.completedTasks || 0} Completed
            </span>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg p-4 md:p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs opacity-80">Completion Rate</p>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mt-1">
                {Number((employeeProjectDashboardData?.detailedBreakdown?.doneTasks/(employeeProjectDashboardData?.detailedBreakdown?.totalAssignedTasks -employeeProjectDashboardData?.detailedBreakdown?.rejectedTasks ))*100|| 0).toFixed(2)}%
              </h3>
            </div>
            <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full">
              <TrophyOutlined className="text-lg md:text-xl" />
            </div>
          </div>
          <div className="mt-3">
            <Progress   
              percent={(employeeProjectDashboardData?.detailedBreakdown?.doneTasks/(employeeProjectDashboardData?.detailedBreakdown?.totalAssignedTasks -employeeProjectDashboardData?.detailedBreakdown?.rejectedTasks ))*100|| 0} 
              showInfo={false}
              strokeColor="#fff"
              trailColor="rgba(255,255,255,0.3)"
              size="small"
            />
          </div>
        </div>

        {/* Avg Hours/Task Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg p-4 md:p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs opacity-80">Avg Hours/Task</p>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mt-1">
                {formatHours(employeeProjectDashboardData?.detailedBreakdown?.avgHoursPerTask || 0)}
              </h3>
            </div>
            <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full">
              <BarChartOutlined className="text-lg md:text-xl" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs">
            <span className="opacity-80">Efficiency Metric</span>
          </div>
        </div>
      </div>

      {/* Time Analytics Section - Made Responsive */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Time Analytics</h2>
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
            <FieldTimeOutlined />
            <span>Work Hours Tracking</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Today Hours */}
          <div className="bg-blue-50 rounded-lg p-3 md:p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-600 font-medium">TODAY</p>
                <p className="text-base md:text-lg font-bold text-gray-800 mt-1">
                  {formatHours(employeeProjectDashboardData?.timeAnalytics?.todayHours || 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-1 md:p-2 rounded-full">
                <FieldTimeOutlined className="text-blue-500 text-sm md:text-base" />
              </div>
            </div>
          </div>

          {/* Week Hours */}
          <div className="bg-purple-50 rounded-lg p-3 md:p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-purple-600 font-medium">THIS WEEK</p>
                <p className="text-base md:text-lg font-bold text-gray-800 mt-1">
                  {formatHours(employeeProjectDashboardData?.timeAnalytics?.weekHours || 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-1 md:p-2 rounded-full">
                <FieldTimeOutlined className="text-purple-500 text-sm md:text-base" />
              </div>
            </div>
          </div>

          {/* Month Hours */}
          <div className="bg-amber-50 rounded-lg p-3 md:p-4 border-l-4 border-amber-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-amber-600 font-medium">THIS MONTH</p>
                <p className="text-base md:text-lg font-bold text-gray-800 mt-1">
                  {formatHours(employeeProjectDashboardData?.timeAnalytics?.monthHours || 0)}
                </p>
              </div>
              <div className="bg-amber-100 p-1 md:p-2 rounded-full">
                <FieldTimeOutlined className="text-amber-500 text-sm md:text-base" />
              </div>
            </div>
          </div>

          {/* Total Hours Spent */}
          <div className="bg-green-50 rounded-lg p-3 md:p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-green-600 font-medium">TOTAL HOURS</p>
                <p className="text-base md:text-lg font-bold text-gray-800 mt-1">
                  {formatHours(employeeProjectDashboardData?.detailedBreakdown?.totalHoursSpent || 0)}
                </p>
              </div>
              <div className="bg-green-100 p-1 md:p-2 rounded-full">
                <FieldTimeOutlined className="text-green-500 text-sm md:text-base" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Status Wise Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Tasks by Status</h3>
            <Select 
              value={statusChartType} 
              onChange={setStatusChartType} 
              size="small"
              className="w-28"
            >
              <Option value="pie">Pie</Option>
              <Option value="doughnut">Doughnut</Option>
              <Option value="bar">Bar</Option>
            </Select>
          </div>
          <div className="h-64 md:h-72">
            {renderChart(
              employeeProjectDashboardData?.charts?.statusWise?.map(item => ({
                ...item,
                name: STATUS_CONFIG[item.status]?.label || item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' '),
              })) || [],
              statusChartType,
              CHART_COLORS,
              'count',
              'name',
              'Tasks by Status'
            )}
          </div>
        </div>

        {/* Priority Wise Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Tasks by Priority</h3>
            <Select 
              value={priorityChartType} 
              onChange={setPriorityChartType} 
              size="small"
              className="w-28"
            >
              <Option value="pie">Pie</Option>
              <Option value="doughnut">Doughnut</Option>
              <Option value="bar">Bar</Option>
            </Select>
          </div>
          <div className="h-64 md:h-72">
            {renderChart(
              employeeProjectDashboardData?.charts?.priorityWise?.map(item => ({
                ...item,
                name: PRIORITY_CONFIG[item.priority]?.label || item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
              })) || [],
              priorityChartType,
              CHART_COLORS,
              'count',
              'name',
              'Tasks by Priority'
            )}
          </div>
        </div>
      </div>

      {/* Project & Task Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Project Wise Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Tasks by Project</h3>
            <Select 
              value={projectChartType} 
              onChange={setProjectChartType} 
              size="small"
              className="w-28"
            >
              <Option value="bar">Bar</Option>
              <Option value="pie">Pie</Option>
              <Option value="doughnut">Doughnut</Option>
            </Select>
          </div>
          <div className="h-64 md:h-72">
            {renderChart(
              employeeProjectDashboardData?.charts?.projectWise?.map(item => ({
                ...item,
                name: item.projectName || 'Unassigned',
                count: item.totalTasks
              })) || [],
              projectChartType,
              CHART_COLORS,
              'count',
              'name',
              'Tasks by Project'
            )}
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Task Status Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const statusData = employeeProjectDashboardData?.detailedBreakdown?.[`${status}Tasks`] || 
                                employeeProjectDashboardData?.detailedBreakdown?.[`${status.replace('-', '')}Tasks`] || 0;
              
           
              
              return (
                <div key={status} className="bg-gray-50 rounded-lg p-3 md:p-4 flex items-center">
                  <div className={`text-base md:text-lg mr-3`} style={{ color: config.color }}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm md:text-base">{statusData}</div>
                    <div className="text-xs md:text-sm text-gray-500">{config.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Urgent Tasks */}
      {employeeProjectDashboardData?.todayUrgentTasks?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Today's Urgent Tasks</h3>
            <Tag color="red" icon={<ExclamationCircleOutlined />} className="flex items-center text-xs md:text-sm">
              <RocketOutlined className="mr-1" /> Urgent
            </Tag>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {employeeProjectDashboardData.todayUrgentTasks.map((task) => (
              <div key={task._id} className="border border-red-200 rounded-lg p-3 md:p-4 bg-red-50 transition-all duration-300 hover:shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900 pr-2 text-sm md:text-base">{task.title}</div>
                  <Tag color={PRIORITY_CONFIG[task.priority]?.color || 'red'} className="text-xs">
                    {task.priority?.toUpperCase()}
                  </Tag>
                </div>
                <div className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{task.description}</div>
                <div className="flex flex-col xs:flex-row justify-between text-xs text-gray-500 gap-1 xs:gap-0">
                  <div className="flex items-center">
                    <FieldTimeOutlined className="mr-1 text-xs" />
                    <span>{formatHours(task.totalTimeSpent)} spent</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-1 text-xs" />
                    <span>Due: {new Date(task.endDateTime).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Completion Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Project Completion</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {employeeProjectDashboardData?.charts?.projectWise?.map((project, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <TeamOutlined className="text-blue-500 text-sm md:text-base" />
                </div>
                <div>
                  <div className="font-medium text-sm md:text-base">{project.projectName || 'Unassigned'}</div>
                  <div className="text-gray-500 text-xs md:text-sm">{project.totalTasks} tasks</div>
                </div>
              </div>
               
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProjectTaskDashboard;