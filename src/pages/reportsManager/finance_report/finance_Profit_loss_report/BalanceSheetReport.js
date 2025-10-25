import { useDispatch, useSelector } from "react-redux";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Controller, useForm, useWatch } from "react-hook-form";
import { convertIntoAmount, domainName } from "../../../../constents/global";
import { Collapse, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { MdKeyboardArrowDown, MdInfoOutline, MdRefresh, MdSend } from "react-icons/md";
import { FiDollarSign, FiCreditCard, FiPieChart, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { RiBankLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsCashCoin, BsBuilding } from "react-icons/bs";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { balanceSheetReportFunc, emptyReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import BalanceSheetModal from "./BalanceSheetModal";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../../../../config/Encryption";
import { dynamicSidebarSearch } from "../../../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";

const BalanceSheetReport = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const { balanceSheetReportList, balanceSheetReport_loading } = useSelector(
    (state) => state.reports
  );
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);


  const [isOpen, setIsOpen] = useState(false);
  const [alldata, setAlldata] = useState({});
  const [keys, setKeys] = useState("");
  const endDate = useWatch({
    control,
    name: "endDate",
    defaultValue: dayjs(),
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: '',
  });
  const navigate = useNavigate();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  useEffect(() => {

    dispatch(
      dynamicSidebarSearch({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        isPagination: false,
      })
    );
  }, []);

  function InfoIcon({ keys }) {
    return (
      <button onClick={() => {
        if (keys == "profitAndLoss") {
          navigate(`/admin/finance-profit-loss-report/${encrypt(
            sidebarListData?.find(
              (data) => data?.slug == "finance-profit-loss-report"
            )?._id
          )}/${encrypt(endDate)}/${encrypt(branchId)}`);
        }
        setIsOpen(true);
        setAlldata({ balanceSheetReportList });
        setKeys(keys)
      }}
        className={`ml-2 text-gray-400 `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }



  const dispatch = useDispatch();
  const { branchList } = useSelector((state) => state.branch);

  const getProfitLossReport = () => {
    if (
      (userInfoglobal?.userType === "company" ||
        userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector") &&
      !watch("PDBranchId")
    ) {
      showNotification({
        type: "info",
        message: "First Select Branch ",
      });
      return;
    } else {
      dispatch(
        balanceSheetReportFunc({
          startDate: null,
          endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
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
        })
      );
    }
  };
  useEffect(() => {

    getProfitLossReport();
    return () => {
      dispatch(emptyReportFunc())
    }
  }, []);
  const handleSubmit = async () => {
    getProfitLossReport();
  };
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
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }

    setValue("endDate", dayjs());
  }, []);
  const liabilityItems = [
    {
      label: "Capital Balance",
      value: balanceSheetReportList?.liabilitySummery?.capitalBalance,
      key: "capitalBalance",
      icon: <FiTrendingUp className="text-blue-500 mr-2" />
    },
    {
      label: "Profit & Loss",
      value: balanceSheetReportList?.liabilitySummery?.profitAndLoss,
      key: "profitAndLoss",
      icon: <FiPieChart className="text-blue-500 mr-2" />
    },
    {
      label: "Accounts Payable",
      value: balanceSheetReportList?.liabilitySummery?.duePaymentAmount,
      key: "duePaymentAmount",
      icon: <FiCreditCard className="text-blue-500 mr-2" />
    },
    {
      label: "Client Advances",
      value: balanceSheetReportList?.liabilitySummery?.ClientAdvanceReceiptAmount,
      key: "ClientAdvanceReceiptAmount",
      icon: <RiMoneyDollarCircleLine className="text-blue-500 mr-2" />
    },
    {
      label: "GST Payable",
      value: balanceSheetReportList?.liabilitySummery?.FinalGSTAmount,
      key: "FinalGSTAmount",
      icon: <FiDollarSign className="text-blue-500 mr-2" />
    },
    {
      label: "TDS Payable",
      value: balanceSheetReportList?.liabilitySummery?.TDSpayableAmount,
      key: "TDSpayableAmount",
      icon: <FiDollarSign className="text-blue-500 mr-2" />
    },
  ];

  const assetItems = [
    {
      label: "Fixed Assets",
      value: balanceSheetReportList?.assetsSummery?.assetsAmount,
      key: "assetsAmount",
      icon: <BsBuilding className="text-green-500 mr-2" />
    },
    {
      label: "Sundry Debtors",
      value: balanceSheetReportList?.assetsSummery?.SundryDebtorAmount,
      key: "SundryDebtorAmount",
      icon: <FiTrendingDown className="text-green-500 mr-2" />
    },
    {
      label: "Bank Balance",
      value: balanceSheetReportList?.assetsSummery?.bankAmount,
      key: "bankAmount",
      icon: <RiBankLine className="text-green-500 mr-2" />
    },
    {
      label: "Cash Balance",
      value: balanceSheetReportList?.assetsSummery?.CashBookAmount,
      key: "CashBookAmount",
      icon: <BsCashCoin className="text-green-500 mr-2" />
    },
    {
      label: "TDS Receivable",
      value: balanceSheetReportList?.assetsSummery?.receiptTDSAmount,
      key: "receiptTDSAmount",
      icon: <FiDollarSign className="text-green-500 mr-2" />
    },
    {
      label: "Vendor Advances",
      value: balanceSheetReportList?.assetsSummery?.vendorAdvanceAmount,
      key: "vendorAdvanceAmount",
      icon: <RiMoneyDollarCircleLine className="text-green-500 mr-2" />
    },
  ];

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] sm:space-y-0 space-y-1 sm:flex justify-between items-center">
          <div className="sm:flex  grid grid-cols-1 gap-1.5 sm:flex-wrap text-[14px]">
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
                handleSubmit();
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={() => {
                handleSubmit();
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
      ></Collapse>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {balanceSheetReport_loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : balanceSheetReportList ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liabilities Column */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-blue-200 mb-4">
                <h2 className="text-lg font-semibold text-blue-700 flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Liabilities
                </h2>
                <span className="text-xs text-gray-500">Debts & Obligations</span>
              </div>

              <div className="space-y-4">
                {liabilityItems.map((item, index) => (
                  <div
                    key={`liability-${index}`}
                    className="flex justify-between items-center p-3 hover:bg-blue-50 rounded transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-blue-700">
                        {convertIntoAmount(item.value) || '0.00'}
                      </span>
                      <InfoIcon keys={item.key} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between items-center bg-blue-100 px-4 py-3 rounded">
                  <span className="font-semibold text-blue-800">Total Liabilities</span>
                  <span className="font-bold text-blue-900">
                    {convertIntoAmount(balanceSheetReportList?.liabilityTotal) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Assets Column */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-green-200 mb-4">
                <h2 className="text-lg font-semibold text-green-700 flex items-center">
                  <FiTrendingDown className="mr-2" />
                  Assets
                </h2>
                <span className="text-xs text-gray-500">Resources & Properties</span>
              </div>

              <div className="space-y-4">
                {assetItems.map((item, index) => (
                  <div
                    key={`asset-${index}`}
                    className="flex justify-between items-center p-3 hover:bg-green-50 rounded transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-700">
                        {convertIntoAmount(item.value) || '0.00'}
                      </span>
                      <InfoIcon keys={item.key} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between items-center bg-green-100 px-4 py-3 rounded">
                  <span className="font-semibold text-green-800">Total Assets</span>
                  <span className="font-bold text-green-900">
                    {convertIntoAmount(balanceSheetReportList?.assetTotal) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FiCreditCard className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Balance Sheet Data</h3>
            <p className="text-gray-500 mt-1 max-w-md">
              {!branchId
                ? 'Please select a branch to view the balance sheet'
                : 'No balance sheet data available for the selected criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
      <BalanceSheetModal isOpen={isOpen} onClose={() => { setIsOpen(false) }} alldata={alldata} keys={keys} />



    </GlobalLayout>
  );
};

export default BalanceSheetReport;
