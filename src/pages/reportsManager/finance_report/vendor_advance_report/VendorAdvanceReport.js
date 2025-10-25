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
import { vendorAdvanceReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import VendorList from "../../../financeManagement/vendor/VendorList";
const { RangePicker } = DatePicker;


function VendorAdvanceReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { RangePicker } = DatePicker;

  const [pageSize, setPageSize] = useState(10);



  const dispatch = useDispatch();
  const {
    vendorAdvanceReportList,
    vendorAdvanceReportFunc_loading,
    vendorAdvanceCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [vendorListData, setVendorListData] = useState({});


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





  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
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
        startDate: time?.length > 0 ? dayjs(time[0]).format("YYYY-MM-DD") : '',
        endDate: time?.length > 0 ? dayjs(time[1]).format("YYYY-MM-DD") : '',



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
    dispatch(vendorAdvanceReportFunc(requestPayLoadReturn(true)));
  };

  const [vendorAdvanceModalOpen, setVendorAdvanceModalOpen] = useState(false);

  const handleVendorAdvanceModal = (element) => {
    setVendorAdvanceModalOpen(true);
    setVendorListData(element);
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
    const worksheet = workbook.addWorksheet("vendorAdvanceReport");

    worksheet.columns = [

      { header: "S.No.", key: "sno", width: 10 },
      { header: "Date of Entry", key: "dateofEntry", width: 30 },
      { header: "Value Date", key: "valueDate", width: 30 },
      { header: "Vendor Name", key: "vendorName", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "Amount", key: "amount", width: 30 },
      { header: "Payment Mode", key: "paymentMode", width: 30 },
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



    if (!vendorListData && !vendorListData?.advanceData) return;
    const body = vendorListData?.advanceData?.map((data, index) => {

      return {
        sno: index + 1,




        dateofEntry: dayjs(data?.createdAt).format('DD-MM-YYYY') || "-",
        valueDate: dayjs(data?.date).format('DD-MM-YYYY') || "-",
        vendorName: vendorListData?.fullName || "-",
        description: data?.naration || "-",
        amount: data?.amount || "-",
        paymentMode: data?.type || "-",
      };
    });
    body?.forEach((item) => {
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
      link.download = "vendorAdvanceReport.xlsx";
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
      "Value Date",
      "Vendor Name",
      "Description",
      "Amount",
      "Payment Mode",

    ]
    // const response = await reportsServices?.vendorAdvanceReportFunc(
    //   requestPayLoadReturn(false)
    // );

    if (!vendorListData && !vendorListData?.advanceData) return;
    const body = vendorListData?.advanceData?.map((data, index) => {
      return [
        index + 1,
        dayjs(data?.createdAt).format('DD-MM-YYYY') || "-",
        dayjs(data?.date).format('DD-MM-YYYY') || "-",
        vendorListData?.fullName || "-",
        data?.naration || "-",
        data?.amount || "-",
        data?.type || "-",
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
    doc.save(`vendorAdvanceReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] sm:space-y-0 space-y-1 sm:flex justify-between items-center">
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

                  getPopupContainer={() => document.body}
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
          <div className="space-y-1.5 flex justify-between items-center py-1">
            <div className="flex items-center gap-2">
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

            {/* <div className="flex justify-end items-center gap-2">
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
                  Vendor Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Email
                </th>
                     <th className="border-none p-2 whitespace-nowrap text-right ">
                  Total Amount
                </th>


                <th className="border-none p-2 whitespace-nowrap ">Entries</th>




                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {vendorAdvanceReportFunc_loading ? (
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
                {vendorAdvanceReportList &&
                  vendorAdvanceReportList?.length > 0 ? (
                  vendorAdvanceReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
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
                        {element?.fullName || '-'}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.email || '-'}
                      </td>
                      <td className="text-right ">
                        {Number(element?.advanceData?.reduce((acc, curr) => acc + curr.amount, 0) || 0).toFixed(2)}
                      </td>



                      <td className="tableData ">
                        {(
                          <div className="flex justify-center items-center gap-1">
                            <span>{element?.advanceData?.length}</span>
                            <span className="flex justify-center items-center cursor-pointer">
                              <FaEye
                                onClick={() => handleVendorAdvanceModal(element)}
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
                                onClick={() => handleVendorAdvanceModal(element)}
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
            title={`Vendor List / ${vendorListData?.fullName} `}
            open={vendorAdvanceModalOpen}
            onCancel={() => setVendorAdvanceModalOpen(false)}
            footer={null}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                {vendorListData?.email ?? "-"} / {vendorListData?.mobile?.code + vendorListData?.mobile?.number}
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

                    <th className="border-none p-2 whitespace-nowrap ">Value Date</th>
                    <th className="border-none p-2 whitespace-nowrap ">Vendor Name</th>
                    <th className="border-none p-2 whitespace-nowrap ">
                      Description
                    </th>
                    <th className="border-none p-2 whitespace-nowrap ">
                      Amount
                    </th>
                    <th className="border-none p-2 whitespace-nowrap ">
                      Payment Mode
                    </th>

                  </tr>
                </thead>
                {
                  <tbody>
                    {vendorListData?.advanceData &&
                      vendorListData?.advanceData.length > 0 ? (
                      vendorListData?.advanceData?.map(
                        (element, index) => (
                          <tr
                            className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                              } border-[#DDDDDD] text-[#374151] text-[14px]`}
                          >
                            <td className="whitespace-nowrap  border-none p-2">
                              {index + 1 }
                            </td>
                            <td className="whitespace-nowrap  border-none p-2">
                              {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}
                            </td>


                            <td className="whitespace-nowrap  border-none p-2">
                              {dayjs(element?.date).format('DD-MM-YYYY hh:mm a')}
                            </td>

                            <td className="whitespace-nowrap  border-none p-2">
                              {vendorListData?.fullName || "-"}
                            </td>

                            <td className="whitespace-nowrap  border-none p-2">
                              {element?.naration || "-"}
                            </td>

                            <td className="whitespace-nowrap  border-none p-2">
                              {convertIntoAmount(element?.amount) || "-"}
                            </td>
                            <td className="whitespace-nowrap  border-none p-2">
                              {element?.type}
                            </td>
                            {/* <td className="whitespace-nowrap text-center  border-none p-2">
                        <div onClick={()=>{handleVendorAdvanceModal(element)}} className="flex justify-center items-center rounded-md h-10 w-10 border-2 border-cyan-500">
                          {element?.departmentData?.length || 0}
                        </div>
                      </td> */}
                          </tr>
                        )
                      )
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
          totalCount={vendorAdvanceCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default VendorAdvanceReport;
