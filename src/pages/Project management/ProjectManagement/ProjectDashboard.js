import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { projectmanagementdashboard } from './ProjectManagementFeatures/_ProjectManagement_reducers';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { useForm, Controller, useWatch } from 'react-hook-form';
import CustomDatePicker from '../../../global_layouts/DatePicker/CustomDatePicker';
import dayjs from 'dayjs';
import { domainName } from '../../../constents/global';
import {
    Card,
    Col,
    Row,
    Spin,
    Table,
    Tag,
    Empty,
    Badge,
    Tabs,
    Avatar,
    Grid,
    Space,
    Typography,
    Button,
    Divider,
    Alert,
    Popover,
    Progress
} from 'antd';
import {
    ProjectOutlined,
    FileTextOutlined,
    UserOutlined,
    DollarOutlined,
    BarChartOutlined,
    ClockCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    TeamOutlined,
    PieChartOutlined,
    WalletOutlined,
    ArrowRightOutlined,
    FundOutlined,
    ShoppingOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { Chart } from 'chart.js/auto';
import { Doughnut, Bar } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { encrypt } from '../../../config/Encryption';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
Chart.register();

const { Title: AntTitle, Text } = Typography;
const { useBreakpoint } = Grid;

const statusColors = {
    'NotStarted': 'default',
    'InProgress': 'processing',
    'OnHold': 'warning',
    'Completed': 'success',
    'Cancelled': 'error',
    'Working': 'processing',
    'Maintenance': 'warning'
};

const statusIcons = {
    'NotStarted': <ClockCircleOutlined />,
    'InProgress': <SyncOutlined spin />,
    'OnHold': <ExclamationCircleOutlined />,
    'Completed': <CheckCircleOutlined />,
    'Cancelled': <CloseCircleOutlined />,
    'Working': <SyncOutlined spin />,
    'Maintenance': <ExclamationCircleOutlined />
};

const ProjectDashboard = () => {
    const { control, setValue } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');
    const [chartView, setChartView] = useState('status');
    const [showDateFilter, setShowDateFilter] = useState(false);
    const startDate = useWatch({ control, name: "startDate", defaultValue: null });
    const endDate = useWatch({ control, name: "endDate", defaultValue: null });

    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );

    const { projectmanagementdashboardData } = useSelector((state) => state.projectManagement);

    useEffect(() => {
        setLoading(true);
        if (!startDate && !endDate) return
        dispatch(projectmanagementdashboard({
            "companyId": userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
            "directorId": "",
            "branchId": userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
            startDate: startDate?.format("YYYY-MM-DD"),
            endDate: endDate?.format("YYYY-MM-DD"),
        })).finally(() => setLoading(false));
    }, [startDate, endDate]);

    useEffect(() => {
        setValue('startDate', dayjs().subtract(1, "month"));
        setValue('endDate', dayjs());
    }, []);

    // Format data for charts
    const projectStatusData = {
        labels: projectmanagementdashboardData?.projectOverview?.projectByStatus?.map(item => item.status) || [],
        datasets: [
            {
                data: projectmanagementdashboardData?.projectOverview?.projectByStatus?.map(item => item.total) || [],
                backgroundColor: [
                    '#6366f1',
                    '#3b82f6',
                    '#f59e0b',
                    '#10b981',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899'
                ],
                borderWidth: 0,
            },
        ],
    };

    const projectCategoryData = {
        labels: projectmanagementdashboardData?.projectOverview?.projectByCategory?.map(item => item.catagoryName) || [],
        datasets: [
            {
                label: 'Projects by Category',
                data: projectmanagementdashboardData?.projectOverview?.projectByCategory?.map(item => item.total) || [],
                backgroundColor: '#3b82f6',
                borderColor: '#1d4ed8',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const financialOverviewData = {
        labels: ['Generated', 'Received'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [
                    projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalDebitAmount || 0,
                    projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalCreditAmount || 0
                ],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    // Recent projects table columns
    const projectColumns = [
        {
            title: 'Project Details',
            dataIndex: 'projectCode',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            key: 'project',
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Text strong style={{ fontSize: '15px' }}>{record.title}</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>{text}</Text>
                    <Space size={4}>
                        <Tag icon={statusIcons[record.status]} color={statusColors[record.status]}>
                            {record.status}
                        </Tag>
                        {record.priority && (
                            <Tag color={
                                record.priority === 'High' ? 'red' :
                                    record.priority === 'Medium' ? 'orange' : 'green'
                            }>
                                {record.priority}
                            </Tag>
                        )}
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Client & Team',
            dataIndex: 'clientName',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            key: 'client',
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <div>
                        <Text strong>Client: </Text>
                        <Text>{text}</Text>
                    </div>
                    {record.teamLeadName && (
                        <div>
                            <Text strong>Team Lead: </Text>
                            <Text>{record.teamLeadName}</Text>
                        </div>
                    )}
                    {record.managerName && (
                        <div>
                            <Text strong>Manager: </Text>
                            <Text>{record.managerName}</Text>
                        </div>
                    )}
                </Space>
            )
        },
        {
            title: 'Financials',
            key: 'financials',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            render: (_, record) => (
                <Space direction="vertical" size={2} style={{ textAlign: 'right' }}>
                    <div>
                        <Text strong>Amount: </Text>
                        <Text>₹{record.finalWithGSTAmount?.toLocaleString() || '0'}</Text>
                    </div>
                    <div>
                        <Text strong>Balance: </Text>
                        <Text type={record.invoiceSummary?.closingBalance < 0 ? 'danger' : 'success'}>
                            ₹{Math.abs(record.invoiceSummary?.closingBalance || 0).toLocaleString()}
                        </Text>
                    </div>
                    <div>
                        <Text strong>Created Date: </Text>
                        <Text>{record.createdAt ? dayjs(record.createdAt).format('DD MMM YYYY') : '-'}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Action',
            key: 'action',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            width: 100,
            render: (_, record) => (
            
                <Tag
                    onClick={() => navigate(`/admin/project-invoicing/${encrypt(JSON.stringify(record))}`)}
                    icon={<ArrowRightOutlined />}
                    color="blue"
                    style={{ cursor: 'pointer', margin: 0 }}
                >
                    View
                </Tag>
            ),
        }
    ];

    // Invoice table columns
    const invoiceColumns = [
        {
            title: 'Transaction Details',
            dataIndex: 'invoiceNumber',
            key: 'transaction',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Text strong style={{ fontSize: '15px' }}>
                        <Badge
                            color={record.invoiceType === 'debit' ? 'blue' : 'green'}
                            text={text}
                        />
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        {record.invoiceDate ? dayjs(record.invoiceDate).format('DD MMM YYYY') :
                            record.paymentDate ? dayjs(record.paymentDate).format('DD MMM YYYY') : '-'}
                    </Text>
                    {record.paymentMethod && (
                        <Tag color="geekblue">{record.paymentMethod}</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Project',
            dataIndex: 'projectId',
            key: 'project',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            render: (_, record) => (
                <Text strong>
                    {projectmanagementdashboardData?.projectOverview?.recentProjects?.find(
                        p => p._id === record.projectId
                    )?.title || 'N/A'}
                </Text>
            )
        },
        {
            title: 'Amount',
            key: 'amount',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            render: (_, record) => (
                <Space direction="vertical" size={2} style={{ textAlign: 'right' }}>
                    <Text strong style={{ fontSize: '16px' }}>
                        ₹{(
                            record.invoiceType === 'debit' ?
                                record.finalWithGSTAmount :
                                record.amountPaid
                        )?.toLocaleString() || '0'}
                    </Text>
                </Space>
            )
        },
        {
            title: 'Type',
            dataIndex: 'invoiceType',
            key: 'type',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            render: (type) => (
                <Tag color={type === 'debit' ? 'blue' : 'green'}>
                    {type === 'debit' ? 'Invoice Generated' : 'Payment Received'}
                </Tag>
            )
        }
    ];

    const SummaryCard = ({ title, value, icon, color, prefix, suffix, trend, description, isFiltered }) => {
        return (
            <Card
                bordered={false}
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                bodyStyle={{ padding: '16px' }}
            >
                {/* {isFiltered && (
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#f0f5ff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <CalendarOutlined style={{ fontSize: '10px' }} />
                        <span>Filtered</span>
                    </div>
                )} */}
                <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                    <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text type="secondary">{title}</Text>
                        <Avatar
                            size="large"
                            icon={icon}
                            style={{
                                backgroundColor: `${color}20`,
                                color: color
                            }}
                        />
                    </Space>
                    <Space size="small" direction="vertical" style={{ width: '100%' }}>
                        <AntTitle level={3} style={{ margin: 0 }}>
                            {prefix}
                            <CountUp
                                end={value}
                                duration={1}
                                separator=","
                                style={{ color: color }}
                            />
                            {suffix}
                        </AntTitle>
                        {trend && (
                            <Text type={trend.value > 0 ? 'success' : 'danger'}>
                                {trend.value > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                {Math.abs(trend.value)}% {trend.label}
                            </Text>
                        )}
                        {description && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>{description}</Text>
                        )}
                    </Space>
                </Space>
            </Card>
        );
    };

    const ChartContainer = ({ title, children, extra, isFiltered }) => {
        return (
            <Card
                title={
                    <Space>
                        <Text>{title}</Text>
                        {isFiltered && (
                            <Tag icon={<CalendarOutlined />} color="blue">
                                Filtered
                            </Tag>
                        )}
                    </Space>
                }
                bordered={false}
                style={{
                    borderRadius: '12px',
                    height: '100%',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
                extra={extra}
            >
                {children}
            </Card>
        );
    };

    const renderProjectTable = () => (
        <Card
            title={
                <Space>
                    <ProjectOutlined />
                    <Text>Recent Projects</Text>
                    <Tag icon={<CalendarOutlined />} color="blue">
                        Filtered
                    </Tag>
                </Space>
            }
            bordered={false}
            style={{
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '24px'
            }}
        >
            <Table
                columns={projectColumns}
                dataSource={projectmanagementdashboardData?.projectOverview?.recentProjects || []}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                size="middle"
                scroll={{ x: true }}
                locale={{
                    emptyText: <Empty description="No projects found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }}
            />
        </Card>
    );

    const renderFinanceTables = () => (
        <Card
            title={
                <Space>
                    <DollarOutlined />
                    <Text>Financial Transactions</Text>
                    <Tag icon={<CalendarOutlined />} color="blue">
                        Filtered
                    </Tag>
                </Space>
            }
            bordered={false}
            style={{
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '24px'
            }}
        >
            <Tabs
                defaultActiveKey="all"
                items={[
                    {
                        key: 'all',
                        label: (
                            <Space>
                                <DashboardOutlined />
                                <Text>All Transactions</Text>
                            </Space>
                        ),
                        children: (
                            <Table
                                columns={invoiceColumns}
                                dataSource={[
                                    ...(projectmanagementdashboardData?.invoiceOverview?.debitInvoiceList || []),
                                    ...(projectmanagementdashboardData?.invoiceOverview?.creditInvoiceList || [])
                                ].sort((a, b) => new Date(b.invoiceDate || b.paymentDate) - new Date(a.invoiceDate || a.paymentDate))}
                                rowKey="_id"
                                pagination={{ pageSize: 5 }}
                                size="middle"
                                scroll={{ x: true }}
                                locale={{
                                    emptyText: <Empty description="No transactions found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }}
                            />
                        ),
                    },
                    {
                        key: 'invoices',
                        label: (
                            <Space>
                                <FileTextOutlined />
                                <Text>Invoices Generated</Text>
                            </Space>
                        ),
                        children: (
                            <Table
                                columns={invoiceColumns}
                                dataSource={projectmanagementdashboardData?.invoiceOverview?.debitInvoiceList || []}
                                rowKey="_id"
                                pagination={{ pageSize: 5 }}
                                size="middle"
                                scroll={{ x: true }}
                                locale={{
                                    emptyText: <Empty description="No invoices generated" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }}
                            />
                        ),
                    },
                    {
                        key: 'payments',
                        label: (
                            <Space>
                                <WalletOutlined />
                                <Text>Payments Received</Text>
                            </Space>
                        ),
                        children: (
                            <Table
                                columns={invoiceColumns}
                                dataSource={projectmanagementdashboardData?.invoiceOverview?.creditInvoiceList || []}
                                rowKey="_id"
                                pagination={{ pageSize: 5 }}
                                size="middle"
                                scroll={{ x: true }}
                                locale={{
                                    emptyText: <Empty description="No payments received" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }}
                            />
                        ),
                    },
                ]}
            />
        </Card>
    );

    return (
        <GlobalLayout isBreadCrump={false}>
            <div className="project-dashboard-container" style={{ padding: screens.xs ? '16px' : '24px' }}>
                <Spin spinning={loading} tip="Loading dashboard..." size="large">
                    {projectmanagementdashboardData ? (
                        <>
                            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                                <Col>
                                    <AntTitle level={3} style={{ margin: 0 }}>
                                        Project Dashboard
                                    </AntTitle>
                                    <Text type="secondary">
                                        Overview of your projects and financials
                                    </Text>
                                </Col>
                                <Col>
                                    <Button
                                        type={showDateFilter ? 'primary' : 'default'}
                                        icon={<FilterOutlined />}
                                        onClick={() => setShowDateFilter(!showDateFilter)}
                                    >
                                        {showDateFilter ? 'Hide Filters' : 'Filter Tables'}
                                    </Button>
                                </Col>
                            </Row>

                            {showDateFilter && (
                                <div
                                    className="filter-section"
                                    style={{
                                        padding: '16px',
                                        marginBottom: '24px',
                                        borderRadius: '12px',
                                        backgroundColor: '#f8fafc',
                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                    }}
                                >
                                    <Alert
                                        message="Date filters only apply to tables below"
                                        type="info"
                                        showIcon
                                        style={{ marginBottom: '16px' }}
                                    />
                                    <Row gutter={[16, 16]} align="middle">
                                        <Col xs={24} sm={12} md={6}>
                                            <Controller
                                                name="startDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomDatePicker
                                                        report={true}
                                                        defaultValue={dayjs().subtract(1, "month")}
                                                        size={"middle"}
                                                        field={field}
                                                        allowClear={false}
                                                        placeholder="Start Date"
                                                        style={{ width: '100%' }}
                                                    />
                                                )}
                                            />
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Controller
                                                name="endDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomDatePicker
                                                        report={true}
                                                        defaultValue={dayjs()}
                                                        size={"middle"}
                                                        field={field}
                                                        allowClear={false}
                                                        placeholder="End Date"
                                                        style={{ width: '100%' }}
                                                    />
                                                )}
                                            />
                                        </Col>
                                        <Col xs={24} sm={24} md={12}>
                                            <Space style={{ float: screens.md ? 'right' : 'none', width: screens.md ? 'auto' : '100%' }}>
                                                <Button
                                                    onClick={() => {
                                                        setValue("startDate", dayjs().subtract(1, "month"));
                                                        setValue("endDate", dayjs());
                                                    }}
                                                >
                                                    Reset Filters
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={() => setShowDateFilter(false)}
                                                >
                                                    Apply Filters
                                                </Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Total Projects"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalProjects || 0}
                                        icon={<ProjectOutlined />}
                                        color="#3b82f6"
                                        description="All projects in the system"
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Total Transactions"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalInvoices || 0}
                                        icon={<FileTextOutlined />}
                                        color="#6366f1"
                                        description="All financial transactions"
                                        isFiltered={showDateFilter}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Accountants"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalAccountents || 0}
                                        icon={<TeamOutlined />}
                                        color="#8b5cf6"
                                        description="Active team members"
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Purchase Expense"
                                        value={projectmanagementdashboardData?.dashboardCounts?.purchaseExpenseTotal || 0}
                                        icon={<ShoppingOutlined />}
                                        color="#f59e0b"
                                        prefix="₹"
                                        description="Total expenses on purchases"
                                        isFiltered={showDateFilter}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Invoices Generated"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalDebitCount || 0}
                                        icon={<CreditCardOutlined />}
                                        color="#3b82f6"
                                        description="Total invoices sent to clients"
                                        isFiltered={showDateFilter}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Invoice Amount"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalDebitAmount || 0}
                                        icon={<DollarOutlined />}
                                        color="#3b82f6"
                                        prefix="₹"
                                        description="Total amount invoiced"
                                        isFiltered={showDateFilter}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Payments Received"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalCreditCount || 0}
                                        icon={<WalletOutlined />}
                                        color="#10b981"
                                        description="Total payments received"
                                        isFiltered={showDateFilter}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <SummaryCard
                                        title="Payment Amount"
                                        value={projectmanagementdashboardData?.dashboardCounts?.totalInvoices?.totalCreditAmount || 0}
                                        icon={<FundOutlined />}
                                        color="#10b981"
                                        prefix="₹"
                                        description="Total amount received"
                                        isFiltered={showDateFilter}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                                <Col xs={24} lg={12}>
                                    <ChartContainer
                                        title={
                                            <Space>
                                                <Text>Project Distribution</Text>
                                                <div style={{ marginLeft: '10px' }}>
                                                    <Button
                                                        type={chartView === 'status' ? 'primary' : 'default'}
                                                        size="small"
                                                        onClick={() => setChartView('status')}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        By Status
                                                    </Button>
                                                    <Button
                                                        type={chartView === 'category' ? 'primary' : 'default'}
                                                        size="small"
                                                        onClick={() => setChartView('category')}
                                                    >
                                                        By Category
                                                    </Button>
                                                </div>
                                            </Space>
                                        }
                                    >
                                        <div style={{ height: '350px', marginTop: '16px' }}>
                                            {chartView === 'status' ? (
                                                <Doughnut
                                                    data={projectStatusData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'right',
                                                                labels: {
                                                                    padding: 20,
                                                                    usePointStyle: true,
                                                                    pointStyle: 'circle',
                                                                    font: {
                                                                        size: screens.xs ? 10 : 12
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        cutout: '65%'
                                                    }}
                                                />
                                            ) : (
                                                <Bar
                                                    data={projectCategoryData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                display: false
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                ticks: {
                                                                    precision: 0
                                                                },
                                                                grid: {
                                                                    drawBorder: false
                                                                }
                                                            },
                                                            x: {
                                                                grid: {
                                                                    display: false
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </ChartContainer>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <ChartContainer
                                        title="Financial Overview"
                                        extra={<BarChartOutlined />}
                                        isFiltered={showDateFilter}
                                    >
                                        <div style={{ height: '350px', marginTop: '16px' }}>
                                            <Bar
                                                data={financialOverviewData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            display: false
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                callback: function (value) {
                                                                    return '₹' + value.toLocaleString();
                                                                }
                                                            },
                                                            grid: {
                                                                drawBorder: false
                                                            }
                                                        },
                                                        x: {
                                                            grid: {
                                                                display: false
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </ChartContainer>
                                </Col>
                            </Row>

                            <Tabs
                                activeKey={activeTab}
                                onChange={setActiveTab}
                                items={[
                                    {
                                        key: 'projects',
                                        label: (
                                            <Space>
                                                <ProjectOutlined />
                                                <Text>Projects</Text>

                                            </Space>
                                        ),
                                        children: renderProjectTable(),
                                    },
                                    {
                                        key: 'finance',
                                        label: (
                                            <Space>
                                                <DollarOutlined />
                                                <Text>Financials</Text>

                                            </Space>
                                        ),
                                        children: renderFinanceTables(),
                                    }
                                ]}
                                style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}
                            />
                        </>
                    ) : (
                        <Card bordered={false} style={{ borderRadius: '12px' }}>
                            <Empty
                                description="No dashboard data available"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </Card>
                    )}
                </Spin>
            </div>
        </GlobalLayout>
    );
};

export default ProjectDashboard;