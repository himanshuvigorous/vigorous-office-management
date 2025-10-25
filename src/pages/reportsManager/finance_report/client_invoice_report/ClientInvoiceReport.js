import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertIntoAmount,
  convertMinutesToHoursAndMinutes,
  domainName,
  organizationTypes,
  pazeSizeReport,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { clientInvoiceReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CLIENT_TASK_STATUS_ARR,
  PRIORITY,
} from "../../../../constents/ActionConstent";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import { clientSearch } from "../../../client/clientManagement/clientFeatures/_client_reducers";
import { taskTypeSearch } from "../../../taskManagement/taskType/taskFeatures/_task_reducers";
import { clientGrpSearch } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { FaEye } from "react-icons/fa";
import { orgTypeSearch } from "../../../organizationType/organizationTypeFeatures/_org_type_reducers";
import Loader from "../../../../global_layouts/Loader";
import { indusSearch } from "../../../global/other/Industry/IndustryFeature/_industry_reducers";

import { DatePicker, Space } from "antd";
import { useSearchParams } from "react-router-dom";
const { RangePicker } = DatePicker;

function getMonthNumber(monthName) {
  const monthMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };
  return monthMap[monthName?.toLowerCase()] || null;
}

function getFirstAndLastDateOfMonth(month, year) {
  if (!month || !year) return { firstDate: null, lastDate: null };

  const firstDate = dayjs(`${year}-${month}-01`)
    .startOf("month")
    .format("YYYY-MM-DD");
  const lastDate = dayjs(`${year}-${month}-01`)
    .endOf("month")
    .format("YYYY-MM-DD");

  return { firstDate, lastDate };
}

function ClientInvoiceReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { RangePicker } = DatePicker;
  const onOk = (value) => {};

  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    clientInvoiceReportList,
    clientInvoiceReportFunc_loading,
    clientInvoiceReportCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [clientInvoiceModalOpen, setclientInvoiceModalOpen] = useState(false);

  const [clientInvoiceData, setclientInvoiceData] = useState({});

  const handleVendorAdvanceModal = (element) => {
    setclientInvoiceModalOpen(true);
    setclientInvoiceData(element);
  };
  const [departmentModalData, setDepartmentModalData] = useState({});

  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  const { clientList } = useSelector((state) => state.client);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { industryListData, indusSearchloading } = useSelector(
    (state) => state.industry
  );
  const { orgTypeList, orgSearchloading } = useSelector(
    (state) => state.orgType
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const Status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });

  const PDOrganizationType = useWatch({
    control,
    name: "PDOrganizationType",
    defaultValue: "",
  });

  const PDindustrytype = useWatch({
    control,
    name: "PDindustrytype",
    defaultValue: "",
  });

  const department = useWatch({
    control,
    name: "department",
    defaultValue: "",
  });

  const groupName = useWatch({
    control,
    name: "groupName",
    defaultValue: "",
  });

  const time = useWatch({
    control,
    name: "time",
    defaultValue: [],
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const month = searchParams.get("month")
    ? getMonthNumber(searchParams.get("month"))
    : null;
  const year = searchParams.get("year") ? +searchParams.get("year") : null;
  const fromDashboard = searchParams.get("fromDashboard")
    ? searchParams.get("fromDashboard")
    : null;
  const dateRangeFromUrl = getFirstAndLastDateOfMonth(month, year);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(Number(1));
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleFocusOrgType = () => {
    if (!orgTypeList?.length) {
      dispatch(
        orgTypeSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  };

  const handleFocusClientGrp = () => {
    dispatch(
      clientGrpSearch({
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
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );
  };

  const handleFocusIndustry = () => {
    // if (!industryListData?.length) {
    dispatch(
      indusSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
    // }
  };

  const generateFinancialYears = () => {
    const startYear = 2005;
    const endYear = 2034;
    const financialYears = [];
    for (let year = startYear; year <= endYear; year++) {
      financialYears.push(`${year}-${year + 1}`);
    }
    return financialYears;
  };

  const financialYears = generateFinancialYears();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const quarter = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

  const requestPayLoadReturn = (pagination = true) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: debouncedFilterText,
        sort: true,
        isPagination: pagination,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        directorId: "",
        branchId:
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,

        status: Status == "true" ? true : Status == "false" ? false : "",
        organizationId: PDOrganizationType,
        organizationIds: [],
        departmentId: department,
        departmentIds: [],
        industryId: PDindustrytype,
        industryIds: [],
        groupId: groupName,
        groupIds: [],
        startDate: time.length > 0 ?  dayjs(time[0]).format("YYYY-MM-DD") : "",
        endDate:  time.length > 0 ?  dayjs(time[1]).format("YYYY-MM-DD") : "",
      },
    };
  };



  useEffect(() => {
    if (fromDashboard == "dashboard") {
      setValue("time", [
        dayjs(dateRangeFromUrl?.firstDate),
        dayjs(dateRangeFromUrl?.lastDate),
      ]);
    } else {
      fetchClientServiceTaskReport(debouncedFilterText);
    }
  }, [currentPage, debouncedFilterText, pageSize]);
  useEffect(() => {
    if (fromDashboard == "dashboard" && time[0] && 
        time[1]) {
      fetchClientServiceTaskReport(debouncedFilterText);
    } else {
     
    }
  }, [currentPage, debouncedFilterText, pageSize , time]);


  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId: ["admin", "company", "companyDirector"].includes(
          userInfoglobal?.userType
        )
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
        departmentId: "",
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: true,
        isDirector: false,
      })
    );
  };

  const fetchClientServiceTaskReport = () => {
    dispatch(clientInvoiceReportFunc(requestPayLoadReturn(true)));
  };

  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);

  const handleDepartmentModal = (element) => {
    setDepartmentModalOpen(true);
    setDepartmentModalData(element);
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
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
    setValue("startDate", dayjs().subtract(1, "month"));
    setValue("endDate", dayjs());
  }, []);

  const onChange = (e) => {
    setSearchText(e);
  };

  const handleSubmit = async () => {
    fetchClientServiceTaskReport();
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("clientInvoiceReport");

    worksheet.columns = [
      { header: "S.No.", key: "sno" },
      { header: "Date of Entry", key: "createdAt" },
      { header: "Invoice Number", key: "invoiceNumber" },
      { header: "CGST", key: "CGST" },
      { header: "IGST", key: "IGST" },
      { header: "SGST", key: "SGST" },
      { header: "Amount", key: "grandTotal" },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB6D7A8" },
      };
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // const response = await reportsServices?.clientInvoiceReportFunc(
    //   requestPayLoadReturn(false)
    // );

    if (!clientInvoiceData && !clientInvoiceData?.invoiceData) return;
    const apiData = clientInvoiceData?.invoiceData?.map((element, index) => {
      return {
        sno: index + 1,
        createdAt: dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a"),
        invoiceNumber: element?.invoiceNumber || "-",
        CGST: element?.CGST || "-",
        IGST: element?.IGST || "-",
        SGST: element?.SGST || "-",
        grandTotal: element?.grandTotal || "-",
      };
    });
    apiData?.forEach((item) => {
      const row = worksheet.addRow(item);
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Add auto-filter
    worksheet.autoFilter = {
      from: "A1",
      to: "I1",
    };

    // Export
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "clientInvoiceReport.xlsx";
      link.click();
    });
  };
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });
    doc.setFontSize(16);
    const headers = [
      "S.No.",
      "Date of Entry",
      "Invoice Number",
      "CGST",
      "IGST",
      "SGST",
      "Amount",
    ];
    // const response = await reportsServices?.clientInvoiceReportFunc(
    //   requestPayLoadReturn(false)
    // );

    if (!clientInvoiceData && !clientInvoiceData?.invoiceData) return;
    const body = clientInvoiceData?.invoiceData?.map((element, index) => {
      return [
        index + 1,
        dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a"),
        element?.invoiceNumber || "-",
        element?.CGST || "-",
        element?.IGST || "-",
        element?.SGST || "-",
        element?.grandTotal || "-",
      ];
    });
    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 8,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    doc.save(`clientInvoiceReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 sm:flex justify-between items-center">
          <div className="">
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <RangePicker
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  format="YYYY-MM-DD"
                  onOk={onOk}
                  getPopupContainer={() => document.body} // important: avoids layout issues
                  popupClassName="vertical-range-calendar"
                  className="custom-range-picker"
                />
              )}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDCompanyId", "");
                setValue("PDBranchId", "");
                setValue("status", "");
                setValue("PDOrganizationType", "");
                setValue("PDindustrytype", "");
                setValue("department", "");
                setValue("groupName", "");
                setValue("time", "");

                handleSubmit();
              }}
              className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
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
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="space-y-1">
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
          <div className="space-y-1.5 flex justify-between items-center">
            <div className="flex items-center gap-2 py-1">
              <span
                htmlFor="pageSize"
                className="text-sm font-light text-gray-500"
              >
                Rows per page:
              </span>
              <Select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="text-sm font-light text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                {pazeSizeReport.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>
            {/* 
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  generatePDF();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export PDF</span>
              </button>
              <button
                onClick={() => {
                  generateExcel();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export Excel</span>
              </button>
            </div> */}
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                  S.No.
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Group Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Client Invoice
                </th>

                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {clientInvoiceReportFunc_loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={15}
                  className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {clientInvoiceReportList &&
                clientInvoiceReportList?.length > 0 ? (
                  clientInvoiceReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${
                        index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>

                      {/* <td className="whitespace-nowrap  border-none p-2">
                        {element.profileImage ? (
                          <img
                            alt=""
                            src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        ) : (
                          <img
                            alt=""
                            src={`/images/avatar.jpg`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        )}
                      </td> */}
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.groupName || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.fullName || "-"}
                      </td>

                      <td className="tableData ">
                        {(
                          <div className="flex justify-center items-center gap-1">
                            <span>{element?.advanceData?.length}</span>
                            <span className="flex justify-center items-center cursor-pointer">
                              <FaEye
                                onClick={() =>
                                  handleVendorAdvanceModal(element)
                                }
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={14}
                              />
                            </span>
                          </div>
                        ) || "-"}
                      </td>

                      {/* <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.createdBy}
                      </td> */}
                      {/* <td className="tableData ">
                        {(
                          <div className="flex justify-center items-center gap-1">
                            <span>{element?.departmentData?.length}</span>
                            <span className="flex justify-center items-center cursor-pointer">
                              <FaEye
                                onClick={() => handleDepartmentModal(element)}
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={14}
                              />
                            </span>
                          </div>
                        ) || "-"}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={15}
                      className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          <Modal
            className="antmodalclassName !w-[60%] !h-[50%]"
            title={`Invoice List / ${clientInvoiceData?.fullName} `}
            open={clientInvoiceModalOpen}
            onCancel={() => setclientInvoiceModalOpen(false)}
            footer={null}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                {clientInvoiceData?.email ?? "-"} /{" "}
                {clientInvoiceData?.mobile?.code +
                  clientInvoiceData?.mobile?.number}
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  generatePDF();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export PDF</span>
              </button>
              <button
                onClick={() => {
                  generateExcel();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export Excel</span>
              </button>
            </div>
            <div className="w-full overflow-auto">
              <table className="w-full max-w-full rounded-xl overflow-x-auto">
                <thead>
                  <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                    <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                      S.No.
                    </th>

                    <th className="border-none p-2 whitespace-nowrap ">
                      Date of Entry
                    </th>

                    <th className="border-none p-2 whitespace-nowrap ">
                      invoiceNumber
                    </th>
                    <th className="border-none p-2 whitespace-nowrap ">CGST</th>
                    <th className="border-none p-2 whitespace-nowrap ">IGST</th>
                    <th className="border-none p-2 whitespace-nowrap ">SGST</th>

                    <th className="border-none p-2 whitespace-nowrap ">
                      Amount
                    </th>
                  </tr>
                </thead>
                {
                  <tbody>
                    {clientInvoiceData?.invoiceData &&
                    clientInvoiceData?.invoiceData.length > 0 ? (
                      clientInvoiceData?.invoiceData?.map((element, index) => (
                        <tr
                          className={`border-b-[1px] ${
                            index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                          <td className="whitespace-nowrap  border-none p-2">
                            {index + 1 + (currentPage - 1) * pageSize}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {dayjs(element?.createdAt).format(
                              "DD-MM-YYYY hh:mm a"
                            )}
                          </td>

                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.invoiceNumber || "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {convertIntoAmount(element?.CGST) || "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {convertIntoAmount(element?.IGST) || "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {convertIntoAmount(element?.SGST) || "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {convertIntoAmount(element?.grandTotal) || "-"}
                          </td>

                          {/* <td className="whitespace-nowrap text-center  border-none p-2">
                                <div onClick={()=>{handleVendorAdvanceModal(element)}} className="flex justify-center items-center rounded-md h-10 w-10 border-2 border-cyan-500">
                                  {element?.departmentData?.length || 0}
                                </div>
                              </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white bg-opacity-5">
                        <td
                          colSpan={15}
                          className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                        >
                          Record Not Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                }
              </table>
            </div>
          </Modal>
        </div>
        <CustomPagination
          totalCount={clientInvoiceReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default ClientInvoiceReport;
