import { useDispatch, useSelector } from "react-redux";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { financeProfitLossFunc, resetFieldsReports2 } from "../../../../redux/_reducers/_reports_reducers2";
import { Controller, useForm, useWatch } from "react-hook-form";
import { convertIntoAmount, domainName } from "../../../../constents/global";
import { Collapse, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { MdKeyboardArrowDown } from "react-icons/md";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import InvoiceDatalistModal from "./InvoiceDatalistModal";
import ExpenseHeadDatalistModal from "./ExpenseHeadDatalistModal";
import DiscountGivenModal from "./DiscountGivenModal";
import DiscountRecievedModal from "./DiscountRecievedModal";
import { useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";


const FinanceProfitandLossReport = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const {pageId,branchId,EndDate}= useParams()
  const page= decrypt(pageId);
  const branch = decrypt(branchId);
  const enddate = decrypt(EndDate);
 

  const PDBranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue:  '',
  });
  
  const getSafeDayjs = (dateStr) => {
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed : dayjs(); 
  };

 
  const { profitLossReportLoading, profitLossReportData } = useSelector((state) => state.report2);
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month"), });
  const endDate = useWatch({ control, name: "endDate", defaultValue: getSafeDayjs(enddate) });
  const dispatch = useDispatch()
  const { branchList } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [invoiceDataList, setInvoiceDataList] = useState({
    data: null,
    isOpen: false
  })
  const [expenseHeadDataList, setExpenseHeadDataList] = useState({
    data: null,
    isOpen: false
  })
  const [discountGivenDataList, setDiscountGivenDataList] = useState({
    data: null,
    isOpen: false
  })
  const [discountReceivedDataList, setDiscountReceivedDataList] = useState({
    data: null,
    isOpen: false
  })
  const getProfitLossReport = () => {
    if ((userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "admin" ||
      userInfoglobal?.userType === "companyDirector")
      && !watch("PDBranchId")) {
      showNotification({
        type: 'info',
        message: "First Select Branch "
      })
      return
    } else {
      dispatch(financeProfitLossFunc({
       
        endDate: endDate
          ? dayjs(endDate).format("YYYY-MM-DD")
          : null,
          startDate : startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        companyId:
          userInfoglobal?.userType === "admin"
            ? watch("PDCompanyId")
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? watch("PDBranchId")
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
      }))
    }
  }

  useEffect(() => {
    if (branch) {
      setValue('PDBranchId', branch);
      setValue('endDate', getSafeDayjs(enddate));
      getProfitLossReport();
    }
  }, [branch, enddate]);
  

  useEffect(() => {
    if (!branch) {
      getProfitLossReport()
    }
  }, [])
  const handleSubmit = async () => {
    getProfitLossReport()
  }
  useEffect(() => {
    if (
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
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
      );
    }
   
    
    setValue('endDate', getSafeDayjs(enddate));
    return () => {
      dispatch(resetFieldsReports2())
    }
  }, []);
  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] sm:space-y-0 space-y-1 sm:flex justify-between items-center">
          <div className="sm:flex grid grid-cols-1 gap-1 sm:flex-wrap text-[14px]">
            {(userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <Controller
                    name="PDBranchId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`inputAntdSelectClassNameFilterReport `}
                        placeholder="Select Branch"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchList?.map((element) => (
                          <Select.Option value={element?._id}>

                            {element?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>
              )}
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
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", "");
                setValue("startDate", dayjs().subtract(1, "month"));
                setValue("endDate", dayjs());
                handleSubmit()
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={() => {
                handleSubmit()
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Submit</span>
            </button>
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <GlobalLayout>
      <Collapse
        className="custom-collapse"
        items={items}
        defaultActiveKey={[1]}
        expandIcon={({ isActive }) => (
          <MdKeyboardArrowDown
            size={20}
            style={{
              color: "white",
              transform: isActive ? "rotate(-90deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",

            }}
          />
        )}
      >
      </Collapse>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-1.5">
        {profitLossReportLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : !profitLossReportData ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-1">No Financial Data</h4>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Financial Performance</h3>
                  {/* <p className="text-xs text-gray-500 mt-1">
              {dayjs(startDate).format('DD-MM-YYYY')} -   {dayjs(endDate).format('DD-MM-YYYY')} 
            </p> */}
                </div>
                <div className="bg-white rounded-lg shadow-xs px-3 py-2 border border-gray-100">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profitLossReportData?.profitAndLoss > 0
                          ? 'bg-green-100 text-green-800'
                          : profitLossReportData?.profitAndLoss < 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                            
                        }`}
                    >
                      {profitLossReportData?.profitAndLoss > 0
                        ? 'Profitable'
                        : profitLossReportData?.profitAndLoss < 0
                          ? 'Loss Making'
                          : 'No Profit No Loss'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50">
              <div className="px-4 py-3 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Income</p>
                <p className="text-xl font-semibold text-green-600 mt-1">
                  ₹ {convertIntoAmount(profitLossReportData?.incomeTotalAmount ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</p>
                <p className="text-xl font-semibold text-red-600 mt-1">
                  ₹ {convertIntoAmount(profitLossReportData?.expenseTotalAmount ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Net</p>
                <p className={`text-xl font-bold mt-1 ${convertIntoAmount(profitLossReportData?.profitAndLoss) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  ₹ {convertIntoAmount(Math.abs(profitLossReportData?.profitAndLoss)).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="p-6">
              {/* Income Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Income Breakdown
                  </h4>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    +{convertIntoAmount(profitLossReportData?.incomeTotalAmount ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-50 rounded-md mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Invoices</p>
                        <p className="text-xs text-gray-500">Paid  invoices with discount and without tax</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">₹ {convertIntoAmount(profitLossReportData?.invoiceAmount ?? 0).toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => setInvoiceDataList({ data: profitLossReportData, isOpen: true })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-50 rounded-md mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Discount Received</p>
                        <p className="text-xs text-gray-500">Discount received from Your Payments</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">₹ {convertIntoAmount(profitLossReportData?.discountReceivedAmount ?? 0).toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => setDiscountReceivedDataList({ data: profitLossReportData, isOpen: true })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Expense Breakdown
                  </h4>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                    -{convertIntoAmount(profitLossReportData?.expenseTotalAmount ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-50 rounded-md mr-3">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Expenses</p>
                        <p className="text-xs text-gray-500">Operational costs</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">₹ {convertIntoAmount(profitLossReportData?.expenseCashBookTotalAmount ?? 0).toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => setExpenseHeadDataList({ data: profitLossReportData, isOpen: true })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-50 rounded-md mr-3">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Discount Given</p>
                        <p className="text-xs text-gray-500">Discount given to Clients</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">₹ {convertIntoAmount(profitLossReportData?.discountGivenAmount ?? 0).toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => setDiscountGivenDataList({ data: profitLossReportData, isOpen: true })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Profit/Loss Card */}
              <div className={`p-4 rounded-lg border ${profitLossReportData?.profitAndLoss >= 0
                  ? 'bg-green-50 border-green-100'
                  : 'bg-red-50 border-red-100'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {profitLossReportData?.profitAndLoss >= 0 ? 'Net Profit' : 'Net Loss'}
                    </p>
                    <p className="text-xs text-gray-500">After all income and expenses</p>
                  </div>
                  <p className={`text-2xl font-bold ${profitLossReportData?.profitAndLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    ₹ {convertIntoAmount(Math.abs(profitLossReportData?.profitAndLoss ?? 0)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <InvoiceDatalistModal isOpen={invoiceDataList?.isOpen} alldata={invoiceDataList?.data} onClose={() => setInvoiceDataList({ data: null, isOpen: false })} />
      <ExpenseHeadDatalistModal isOpen={expenseHeadDataList?.isOpen} alldata={expenseHeadDataList?.data} onClose={() => setExpenseHeadDataList({ data: null, isOpen: false })} />
      <DiscountGivenModal isOpen={discountGivenDataList?.isOpen} alldata={discountGivenDataList?.data} onClose={() => setDiscountGivenDataList({ data: null, isOpen: false })} />
      <DiscountRecievedModal isOpen={discountReceivedDataList?.isOpen} alldata={discountReceivedDataList?.data} onClose={() => setDiscountReceivedDataList({ data: null, isOpen: false })} />
    </GlobalLayout>
  );
};

export default FinanceProfitandLossReport;