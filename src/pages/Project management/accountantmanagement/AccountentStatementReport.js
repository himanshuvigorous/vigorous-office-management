import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decrypt, encrypt } from '../../../config/Encryption';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fundTransferreport, getfundTransferDetails } from '../fundTransfer/fundTransferFeatures/_fundTransfer_reducers';
import { Controller, useForm, useWatch } from 'react-hook-form';
import CustomDatePicker from '../../../global_layouts/DatePicker/CustomDatePicker';
import dayjs from 'dayjs';
import { Table, Spin, Typography, Card, Divider, Space, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import NewDataModal from '../projectpurchse/NewDataModal';
import { getprojetpurchaseExpenceDetails } from '../projectpurchse/projectpurchseFeature/_projectpurchseFeature_reducers';
import FundTransferViewModal from '../fundTransfer/FundTransferViewModal';

const { Title, Text } = Typography;

const AccountentStatementReport = () => {
    const { register, setValue, control, formState: { errors } } = useForm();
    const { accountantIdEnc } = useParams()
    const navigate = useNavigate()
    const [viewOpen, setViewOpen] = useState(false);
    const [viewFundTransfer, setViewFunTransferOpen] = useState(false)
    const accountantId = JSON.parse(decrypt(accountantIdEnc))
    const dispatch = useDispatch()
    const { fundTransferReportData, loading: fundTransferReportLoading } = useSelector((state) => state.fundTransfer)
    const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month") });
    const endDate = useWatch({ control, name: "endDate", defaultValue: dayjs() });
    const filters = [startDate, endDate].join("-");
    const [isFirstRender, setisFirstRender] = useState(false);
    const { projectpurchaseExpenceDetails, } = useSelector((state) => state.projectpurchaseExpence);
    useEffect(() => {
        setValue('startDate', dayjs().subtract(1, "month"));
        setValue('endDate', dayjs());
    }, []);

    useEffect(() => {
        if (!isFirstRender) {
            setisFirstRender(state => true);
            return;
        }
        fetchAccountantReport();
    }, [filters]);

    useEffect(() => {
        fetchAccountantReport();
    }, []);

    const fetchAccountantReport = () => {
        dispatch(fundTransferreport({
            "companyId": accountantId?.companyId,
            "directorId": "",
            "branchId": accountantId?.branchId,
            "userId": accountantId?.userId,
            "startDate": startDate.format("YYYY-MM-DD"),
            "endDate": endDate.format("YYYY-MM-DD")
        }))
    }

    const getTableData = () => {
        if (!fundTransferReportData) return [];

        const openingBalanceRow = {
            _id: 'opening-balance',
            date: startDate.format('YYYY-MM-DD'),
            reference: 'opening',
            naration: 'Opening Balance',
            amount: 0,
            debit_credit: fundTransferReportData.summary.openingBalance < 0 ? 'debit' : 'credit',
            currentBalance: fundTransferReportData.summary.openingBalance,
            isOpening: true
        };

        return [openingBalanceRow, ...fundTransferReportData.allTransactions];
    };

    const handleClickTag = (record) => {
        if (record.reference === "purchaseExpense") {
            dispatch(
                getprojetpurchaseExpenceDetails({
                    _id: record?._id,
                })
            );
            setViewOpen(true);
        } else if (record.reference === "invoice") {
            navigate(`/admin/project-invoice/view/${encrypt(JSON.stringify(record))}`)
        } else if (record.reference === "fundTransfer") {
            dispatch(
                getfundTransferDetails({
                    _id: record?._id,
                })
            );
            setViewFunTransferOpen(true);
        }
    }
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            width: 120,

        },
        {
            title: 'Type',
            dataIndex: 'reference',
            key: 'type',
            render: (reference, record) => record.isOpening ? '--' : (
                <Tag color={reference === 'invoice' ? 'blue' : reference === "purchaseExpense" ? 'green' : 'purple'}>
                    {reference === 'invoice' ? 'Bill Amount' : reference === "purchaseExpense" ? 'Purchase Expense' : 'Fund Transfer'}
                </Tag>
            ),
            width: 120
        },
        {
            title: 'Narration',
            dataIndex: 'naration',
            key: 'naration',
            render: (text) => <Text className="whitespace-normal">{text || '--'}</Text>,
            width: 200
        },
        {
            title: 'Debit',
            dataIndex: 'amount',
            key: 'debit',
            render: (amount, record) => {
                if (record.isOpening) return '--';
                return record.debit_credit === 'debit' ? (
                    <Text type="danger" strong className="flex items-center justify-end">
                        <ArrowDownOutlined className="mr-1" /> ₹{amount.toLocaleString()}
                    </Text>
                ) : '--'
            },
            align: 'right',
            width: 120
        },
        {
            title: 'Credit',
            dataIndex: 'amount',
            key: 'credit',
            render: (amount, record) => {
                if (record.isOpening) return '--';
                return record.debit_credit === 'credit' ? (
                    <Text type="success" strong className="flex items-center justify-end">
                        <ArrowUpOutlined className="mr-1" /> ₹{amount.toLocaleString()}
                    </Text>
                ) : '--'
            },
            align: 'right',
            width: 120
        },
        {
            title: 'Balance',
            dataIndex: 'currentBalance',
            key: 'balance',
            render: (balance) => (
                <Text strong style={{ color: balance < 0 ? '#cf1322' : '#389e0d' }}>
                    ₹{Math.abs(balance).toLocaleString()} {balance < 0 ? 'Dr' : 'Cr'}
                </Text>
            ),
            align: 'right',
            width: 140,

        },
    ];



    return (
        <GlobalLayout>
            {/* Date Filters */}
            <FundTransferViewModal
                visible={viewFundTransfer}
                onClose={() => setViewFunTransferOpen(false)}
            />
            <NewDataModal setViewOpen={setViewOpen} viewOpen={viewOpen} projectpurchaseExpenceDetails={projectpurchaseExpenceDetails} />
            <div className="sm:flex justify-between items-center py-3 bg-gray-100 rounded-lg shadow px-4 mb-4">
                <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1.5">
                    <div>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <CustomDatePicker
                                    report={true}
                                    defaultValue={dayjs().subtract(1, "month")}
                                    size={"middle"}
                                    field={field}
                                    errors={errors}
                                    allowClear={false}
                                    placeholder="Select Start Date"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <CustomDatePicker
                                    report={true}
                                    defaultValue={dayjs()}
                                    size={"middle"}
                                    field={field}
                                    errors={errors}
                                    allowClear={false}
                                    placeholder="Select End Date"
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 mt-2 sm:mt-0">
                    <button
                        onClick={() => {
                            setValue("startDate", dayjs().subtract(1, "month"));
                            setValue("endDate", dayjs());
                        }}
                        className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-md flex items-center text-sm text-white"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <Spin spinning={fundTransferReportLoading}>
                {fundTransferReportData && (
                    <div className="space-y-6">
                        {/* Account Summary */}
                        <Card bordered={false} className="bg-white rounded-lg shadow-sm">
                            <div className="md:hidden">
                                <div className="flex justify-between items-center mb-3">
                                    <Text strong>Period:</Text>
                                    <Text>
                                        {dayjs(startDate).format('DD MMM')} - {dayjs(endDate).format('DD MMM YYYY')}
                                    </Text>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <Text type="secondary" className="block">Opening</Text>
                                        <Text strong style={{ color: fundTransferReportData.summary.openingBalance < 0 ? '#cf1322' : '#389e0d' }}>
                                            ₹{Math.abs(fundTransferReportData.summary.openingBalance).toLocaleString()}
                                        </Text>
                                        <Text type="secondary" className="block text-xs">
                                            {fundTransferReportData.summary.openingBalance < 0 ? 'Debit' : 'Credit'}
                                        </Text>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <Text type="secondary" className="block">Closing</Text>
                                        <Text strong style={{ color: fundTransferReportData.summary.closingBalance < 0 ? '#cf1322' : '#389e0d' }}>
                                            ₹{Math.abs(fundTransferReportData.summary.closingBalance).toLocaleString()}
                                        </Text>
                                        <Text type="secondary" className="block text-xs">
                                            {fundTransferReportData.summary.closingBalance < 0 ? 'Debit' : 'Credit'}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:grid grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-4 rounded">
                                    <Text type="secondary" className="block">Opening Balance</Text>
                                    <Title level={4} className="m-0" style={{ color: fundTransferReportData.summary.openingBalance < 0 ? '#cf1322' : '#389e0d' }}>
                                        ₹{Math.abs(fundTransferReportData.summary.openingBalance).toLocaleString()}
                                    </Title>
                                    <Text type="secondary">{fundTransferReportData.summary.openingBalance < 0 ? 'Debit' : 'Credit'}</Text>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <Text type="secondary" className="block">Total Credit</Text>
                                    <Title level={4} type="success" className="m-0">
                                        ₹{fundTransferReportData.summary.totalCredit.toLocaleString()}
                                    </Title>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <Text type="secondary" className="block">Total Debit</Text>
                                    <Title level={4} type="danger" className="m-0">
                                        ₹{fundTransferReportData.summary.totalDebit.toLocaleString()}
                                    </Title>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <Text type="secondary" className="block">Closing Balance</Text>
                                    <Title level={4} className="m-0" style={{ color: fundTransferReportData.summary.closingBalance < 0 ? '#cf1322' : '#389e0d' }}>
                                        ₹{Math.abs(fundTransferReportData.summary.closingBalance).toLocaleString()}
                                    </Title>
                                    <Text type="secondary">{fundTransferReportData.summary.closingBalance < 0 ? 'Debit' : 'Credit'}</Text>
                                </div>
                            </div>
                        </Card>

                        {/* Account Holder Info */}
                        <Card bordered={false} className="bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-200">
                                    {fundTransferReportData.profileImage && (
                                        <img
                                            src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${fundTransferReportData.profileImage}`}
                                            alt={fundTransferReportData.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Title level={4} className="m-0 text-base md:text-lg">{fundTransferReportData.fullName}</Title>
                                    <Text type="secondary" className="text-xs md:text-sm">{fundTransferReportData.userType}</Text>
                                    <div className="mt-1 text-xs md:text-sm">
                                        <Text>{fundTransferReportData.email}</Text>
                                        <Text className="ml-2">
                                            {fundTransferReportData.mobile.code} {fundTransferReportData.mobile.number}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Transactions Table */}
                        <Card
                            title="Transaction History"
                            bordered={false}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <div className="block">
                                <div className="overflow-x-auto">
                                    <Table
                                        columns={columns}
                                        dataSource={getTableData()}
                                        rowKey="_id"
                                        pagination={false}
                                        scroll={{ x: 'max-content' }}
                                        onRow={(record) => ({
                                            onClick: (event) => handleClickTag(record, event)
                                        })}
                                        size="middle"
                                        className="custom-table"
                                        summary={() => (
                                            <Table.Summary fixed>
                                                <Table.Summary.Row className="bg-gray-50">
                                                    <Table.Summary.Cell index={0} colSpan={3}>
                                                        <Text strong>Final Balance</Text>
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={1} align="right">
                                                        <Text strong type="danger">
                                                            -  {/* ₹{fundTransferReportData.summary.totalDebit.toLocaleString()} */}
                                                        </Text>
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={2} align="right">
                                                        <Text strong type="success">
                                                            - {/* ₹{fundTransferReportData.summary.totalCredit.toLocaleString()} */}
                                                        </Text>
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={3} align="right">
                                                        <Text strong style={{ color: fundTransferReportData.summary.closingBalance < 0 ? '#cf1322' : '#389e0d' }}>
                                                            ₹{Math.abs(fundTransferReportData.summary.closingBalance).toLocaleString()}
                                                        </Text>
                                                    </Table.Summary.Cell>
                                                </Table.Summary.Row>
                                            </Table.Summary>
                                        )}
                                    />
                                </div>
                            </div>
                            {/* <div className="md:hidden">
                                <Table
                                    columns={mobileColumns}
                                    dataSource={getTableData()}
                                    rowKey="_id"
                                    pagination={{ pageSize: 10 }}
                                    showHeader={false}
                                    size="small"
                                    summary={() => (
                                        <Table.Summary fixed>
                                            <Table.Summary.Row className="bg-gray-50">
                                                <Table.Summary.Cell index={0}>
                                                    <div className="flex justify-between">
                                                        <Text strong>Final Balance</Text>
                                                        <Text 
                                                            strong 
                                                            style={{ color: fundTransferReportData.summary.closingBalance < 0 ? '#cf1322' : '#389e0d' }}
                                                        >
                                                            ₹{Math.abs(fundTransferReportData.summary.closingBalance).toLocaleString()}
                                                        </Text>
                                                    </div>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                    )}
                                />
                            </div> */}
                        </Card>
                    </div>
                )}
            </Spin>
        </GlobalLayout>
    );
};

export default AccountentStatementReport;