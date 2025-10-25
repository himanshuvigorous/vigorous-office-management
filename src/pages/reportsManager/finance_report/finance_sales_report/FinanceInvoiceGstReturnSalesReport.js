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
import { invoiceGstReturnSalesReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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

import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;


function FinanceInvoiceGstReturnSalesReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { RangePicker } = DatePicker;
  const onOk = value => {

  };

  const [pageSize, setPageSize] = useState(10);



  const dispatch = useDispatch();
  const {
    invoiceGstReturnSalesReportList,
    invoiceGstReturnSalesReportFunc_loading,
    invoiceGstReturnSalesReportCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [departmentModalData, setDepartmentModalData] = useState({});
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




  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(Number(1))
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
        startDate: time?.length > 0 && time[0] ? dayjs(time[0]).format("YYYY-MM-DD") : '',
        endDate: time?.length > 1 && time[1] ? dayjs(time[1]).format("YYYY-MM-DD") : '',




      },
    };
  };



  useEffect(() => {
    fetchClientServiceTaskReport(debouncedFilterText);
  }, [currentPage, debouncedFilterText, pageSize]);
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
    dispatch(invoiceGstReturnSalesReportFunc(requestPayLoadReturn(true)));
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
    const worksheet = workbook.addWorksheet("FinanceInvoiceGstReturnSalesReport");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Layout Name", key: "layoutName", width: 30 },
      { header: "Invoice Number", key: "invoiceNumber", width: 30 },
      { header: "Client Name", key: "clientName", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "HSNCODE", key: "HSNCode", width: 30 },
      { header: "After Discount Amount", key: "afterDiscountAmount", width: 20 },
      { header: "Rate of Gst", key: "rateOfGst", width: 20 },
      { header: "IGST", key: "igst", width: 20 },
      { header: "CGST", key: "cgst", width: 15 },
      { header: "SGST", key: "sgst", width: 15 },
      { header: "Total/Invoice Amount", key: "totalInvoiceAmount", width: 15 },


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

    const response = await reportsServices?.invoiceGstReturnSalesReportFunc(
      requestPayLoadReturn(false)
    );


    if (!invoiceGstReturnSalesReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {

      return {
        sno: index + 1,
        // name: data?.employeData[0].fullName || "-",
        layoutName: data?.invoiceLayoutData?.firmName || "-",
        invoiceNumber: data?.invoiceNumber || "-",
        clientName: data?.clientName || "-",
        description: data?.task?.taskName || "-",
        HSNCode: data?.task?.HSNCode || "-",
        afterDiscountAmount: data?.grandTotal || "-",
        rateOfGst: data?.task?.GSTRate || "-",
        igst: data?.IGST || "-",
        cgst: data?.CGST || "-",
        sgst: data?.SGST || "-",
        totalInvoiceAmount: data?.totalAmount || "-",
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
      link.download = "FinanceInvoiceGstReturnSalesReport.xlsx";
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
      "Layout Name",
      "Invoice Number",
      "Client Name",
      "Description",
      "HSNCODE",
      "After Discount Amount",
      "Rate of Gst",
      "IGST",
      "CGST",
      "SGST",
      "Total/Invoice Amount"
    ]
    const response = await reportsServices?.invoiceGstReturnSalesReportFunc(
      requestPayLoadReturn(false)
    );

    if (!invoiceGstReturnSalesReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        // name: data?.employeData[0].fullName || "-",
        data?.invoiceLayoutData?.firmName || "-",
        data?.invoiceNumber || "-",
        data?.clientName || "-",
        data?.task?.taskName || "-",
        data?.task?.HSNCode || "-",
        data?.grandTotal || "-",
        data?.task?.GSTRate || "-",
        data?.IGST || "-",
        data?.CGST || "-",
        data?.SGST || "-",
        data?.totalAmount || "-",
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
    doc.save(`FinanceInvoiceGstReturnSalesReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 sm:flex justify-between items-center ">
          <div>
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
                setValue('time', '')

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
        <div className="">
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
          <div className="space-y-1.5 sm:flex grid grid-cols-1 justify-between items-center">
            <div className="flex py-1 items-center gap-2">
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
                  Entry Date
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Layout Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Invoice Number
                </th>
                <th className="border-none p-2 whitespace-nowrap ">Client Name </th>
                <th className="border-none p-2 whitespace-nowrap ">Description </th>

                <th className="border-none p-2 whitespace-nowrap ">HSN CODE </th>


                <th className="border-none p-2 whitespace-nowrap text-right">
                  After Discount Amount
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  Rate of GST
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  IGST
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  CGST
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  SGST
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  Total/Invoice Amount
                </th>

                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {invoiceGstReturnSalesReportFunc_loading ? (
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
                {invoiceGstReturnSalesReportList &&
                  invoiceGstReturnSalesReportList?.length > 0 ? (
                  invoiceGstReturnSalesReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
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
                      <td className="whitespace-nowrap   border-none p-2">
                        {element?.invoiceLayoutData?.firmName || '-'}
                      </td>


                      <td className="border-none p-2">
                        <div className="max-w-[150px] overflow-hidden text-ellipsis">
                          <Tooltip title={element?.invoiceNumber || '-'}>
                            <span className="whitespace-nowrap">{element?.invoiceNumber || '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2">
                        <div className="max-w-[150px] overflow-hidden text-ellipsis">
                          <Tooltip title={element?.clientName || '-'}>
                            <span className="whitespace-nowrap capitalize">{element?.clientName || '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2">
                        <div className="max-w-[200px] overflow-hidden text-ellipsis">
                          <Tooltip title={element?.task?.taskName || '-'}>
                            <span className="whitespace-nowrap">{element?.task?.taskName || '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2">
                        <div className="max-w-[100px] overflow-hidden text-ellipsis">
                          <Tooltip title={element?.task?.HSNCode || '-'}>
                            <span className="whitespace-nowrap">{element?.task?.HSNCode || '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2 text-right">
                        <div className="max-w-[120px] overflow-hidden text-ellipsis">
                          <Tooltip title={convertIntoAmount(element?.grandTotal) || '-'}>
                            <span className="whitespace-nowrap">{convertIntoAmount(element?.grandTotal) || '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2 text-right">
                        <div className="max-w-[80px] overflow-hidden text-ellipsis">
                          <Tooltip title={`${element?.task?.GSTRate} %` || '-'}>
                            <span className="whitespace-nowrap">{`${element?.task?.GSTRate} %` || '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2 text-right">
                        <div className="max-w-[100px] overflow-hidden text-ellipsis">
                          <Tooltip title={element?.isIGST ? convertIntoAmount(element?.IGST) ? convertIntoAmount(element?.IGST) : "-" : '-'}>
                            <span className="whitespace-nowrap">{element?.isIGST ? convertIntoAmount(element?.IGST) ? convertIntoAmount(element?.IGST) : "-" : '-'}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2 text-right">
                        <div className="max-w-[100px] overflow-hidden text-ellipsis">
                          <Tooltip title={(!element?.isIGST && element?.CGST) ? convertIntoAmount(element?.CGST) : "-"}>
                            <span className="whitespace-nowrap">{(!element?.isIGST && element?.CGST) ? convertIntoAmount(element?.CGST) : "-"}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2 text-right">
                        <div className="max-w-[100px] overflow-hidden text-ellipsis">
                          <Tooltip title={(!element?.isIGST && element?.SGST) ? convertIntoAmount(element?.SGST) : "-"}>
                            <span className="whitespace-nowrap">{(!element?.isIGST && element?.SGST) ? convertIntoAmount(element?.SGST) : "-"}</span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="border-none p-2 text-right">
                        <div className="max-w-[120px] overflow-hidden text-ellipsis">
                          <Tooltip title={convertIntoAmount(element?.totalAmount) || '-'}>
                            <span className="whitespace-nowrap">{convertIntoAmount(element?.totalAmount) || '-'}</span>
                          </Tooltip>
                        </div>
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


        </div>
        <CustomPagination
          totalCount={invoiceGstReturnSalesReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default FinanceInvoiceGstReturnSalesReport;
