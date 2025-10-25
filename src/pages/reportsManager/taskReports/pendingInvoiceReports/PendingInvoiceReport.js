import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
} from "../../../../constents/global";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Modal, Select, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa6";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { pendingInvoiceReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { Option } from "antd/es/mentions";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { clientSearch, getClientList } from "../../../client/clientManagement/clientFeatures/_client_reducers";
import { getTaskTypeList, taskTypeSearch } from "../../../taskManagement/taskType/taskFeatures/_task_reducers";
import { clientGrpSearch, getClientGroupList } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import * as ExcelJS from 'exceljs';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { FaEye, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { useSearchParams } from "react-router-dom";
import { encrypt } from "../../../../config/Encryption";


function PendingInvoiceReport() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Get URL parameters
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');
  const fromDashboard = searchParams.get('fromDashboard');

  // Function to calculate start and end dates based on month and year
  const getDateRangeFromParams = () => {
    if (monthParam && yearParam) {
      const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];

      const monthIndex = monthNames.indexOf(monthParam.toLowerCase());
      if (monthIndex !== -1) {
        const year = parseInt(yearParam);
        const startDate = dayjs().year(year).month(monthIndex).startOf('month');
        const endDate = dayjs().year(year).month(monthIndex).endOf('month');
        return { startDate, endDate };
      }
    }
    return null;
  };

  const urlDateRange = getDateRangeFromParams();

  const { pendingInvoiceReportList, totalpendingInvoiceCount, pendingInvoiceReportFunc_loading, totalFeePendingInvoiceCount } = useSelector(
    (state) => state.reports
  );
  const [EmployeeViewModal, setEmployeeViewModal] = useState({
    isOpen: false,
    data: null
  });

  const [searchText, setSearchText] = useState("");
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const hasInitiallyLoaded = useRef(false);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { clientGroupList, totalClientGroupCount } = useSelector(
    (state) => state.clientGroup
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");

  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const { taskTypeList, totalTaskTypeCount } = useSelector(
    (state) => state.taskType
  );
  const { clientList, totalCompanyCount, loading } = useSelector(
    (state) => state.client
  );
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

  const workType = useWatch({
    control,
    name: "workType",
    defaultValue: "",
  });
  const shift = useWatch({
    control,
    name: "shift",
    defaultValue: "",
  });
  const daterange = useWatch({
    control,
    name: "daterange",
    defaultValue: "",
  });
  const employeeId = useWatch({
    control,
    name: "employeeId",
    defaultValue: "",
  });
  const isTL = useWatch({
    control,
    name: "isTL",
  });
  const isHR = useWatch({
    control,
    name: "isHR",
  });

  const department = useWatch({
    control,
    name: "PDDepartmentId",
  });

  const designation = useWatch({
    control,
    name: "designation",
  });
  const ClientList = useWatch({
    control,
    name: "clientList",
    defaultValue: "",
  });

  const taskType = useWatch({
    control,
    name: "taskType",
    defaultValue: "",
  });

  const groupType = useWatch({
    control,
    name: "groupType",
    defaultValue: "",
  });

  const startDate = useWatch({
    control,
    name: "startDate",
    defaultValue: urlDateRange?.startDate || dayjs().subtract(1, "month"),
  });

  const endDate = useWatch({
    control,
    name: "endDate",
    defaultValue: urlDateRange?.endDate || dayjs(),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);
  useEffect(() => {
    if (CompanyId) {
      setValue("PDBranchId", "");
    }
  }, [CompanyId]);

  const handleDepartmentChange = (event) => {
    setValue("PDDepartmentId", event);
    setValue("PDDesignationId", "");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        departmentId: event,
        companyId: CompanyId,
      })
    );
  };

  const handleFocusDepartment = () => {
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: CompanyId,
        branchId: BranchId,
      })
    );
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(1);
  };

  // Set form values from URL parameters
  useEffect(() => {
    if (urlDateRange) {
      setValue("startDate", urlDateRange.startDate);
      setValue("endDate", urlDateRange.endDate);
    }
  }, [urlDateRange, setValue]);

  // Call API on page change, page size change, search text change, and initial load
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      // Initial load
      hasInitiallyLoaded.current = true;
      fetchPendingInvoiceList("");
    } else {
      // Subsequent calls for pagination, search, etc.
      fetchPendingInvoiceList(debouncedFilterText);
    }
  }, [
    currentPage,
    pageSize,
    debouncedFilterText,
  ]);

  const fetchPendingInvoiceList = (debouncedFilterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: searchText,
        status: Status,
        sort: true,
        isPagination: true,
        clientId: ClientList,
        directorId: "",
        departmentId: department,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        groupId: groupType,
        taskTypeId: taskType,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
      },
    };
    dispatch(pendingInvoiceReportFunc(reqData));
  };


  useEffect(() => {
    if (
      CompanyId ||
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
  }, [CompanyId]);
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  const onChange = (e) => {
    setSearchText(e);
  };

  useEffect(() => {
    fetchClientListData();
  }, []);

  const fetchClientListData = () => {
    let reqData = {

      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,

      directorId: "",
      organizationId: "",
      industryId: "",
      // "groupId": "67767fff396eb5feb6c7ceb6",
      text: "",
      sort: true,
      status: true,
      isPagination: false,

    };
    dispatch(clientSearch(reqData));
  };

  useEffect(() => {
    fetTaskTypeList();
  }, [CompanyId, BranchId]);

  const fetTaskTypeList = () => {
    const reqListData = {

      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      directorId: "",
      text: "",
      sort: true,
      status: "",
      isPagination: false,

    };
    dispatch(taskTypeSearch(reqListData));
  };

  useEffect(() => {
    fetchClientGroupList();
  }, [currentPage, BranchId, CompanyId]);

  const fetchClientGroupList = () => {
    const reqData = {

      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      directorId: "",
      text: "",
      sort: true,
      status: true,
      isPagination: false,

    };
    dispatch(clientGrpSearch(reqData));
  };

  // Shared function to get report data
  const getReportData = async () => {
    const response = await reportsServices?.pendingInvoiceReportFunc({
      currentPage: 1,
      pageSize: 1,
      reqPayload: {
        text: searchText,
        status: Status,
        sort: true,
        isPagination: false,
        clientId: ClientList,
        directorId: "",
        departmentId: department,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        groupId: groupType,
        taskTypeId: taskType,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
      }
    });

    if (!response || !response?.data) return null;
    return response.data.docs;
  };

  const generateExcel = async () => {
    setIsExportingExcel(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pending Invoice Report");
      worksheet.columns = [
        { header: "S.No.", key: "sno", width: 10 },
        { header: "Completed Date", key: "completedDate", width: 25 },
        { header: "Client Name", key: "clientName", width: 30 },
        { header: "Department Name", key: "departmentName", width: 25 },
        { header: "Task Name", key: "taskName", width: 30 },
        { header: "Assign To", key: "assignTo", width: 30 },
        { header: "Created Date", key: "createdDate", width: 25 },
        { header: "Gross Amount", key: "grossAmount", width: 20 },
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
      const reportData = await getReportData();
      if (!reportData) return;

      // Calculate total amount
      const totalAmount = reportData.reduce((sum, data) => {
        return sum + (parseFloat(data?.fee) || 0);
      }, 0);

      const apiData = reportData.map((data, index) => ({
        sno: index + 1,
        completedDate: data?.taskCompletedAt ? dayjs(data.taskCompletedAt).format('DD-MM-YYYY hh:mm a') : '-',
        clientName: data?.clientData?.fullName || "-",
        departmentName: data?.departmentData?.name || "-",
        taskName: data?.taskName || "-",
        assignTo: Array.isArray(data?.employeData) ? data.employeData.map(emp => emp?.fullName || "-").join(", ") : data?.employeData || "-",
        createdDate: data?.createdAt ? dayjs(data.createdAt).format('DD-MM-YYYY hh:mm a') : '-',
        grossAmount: data?.fee ? `₹${parseFloat(data.fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"
      }));

      // Add total row at the top
      const totalRow = worksheet.addRow({
        sno: "TOTAL",
        completedDate: "",
        clientName: "",
        departmentName: "",
        taskName: "",
        assignTo: "",
        createdDate: "",
        grossAmount: `₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      });

      // Style the total row
      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD4E5F7" },
        };
        cell.font = { bold: true, size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thick" },
          left: { style: "thin" },
          bottom: { style: "thick" },
          right: { style: "thin" },
        };
      });

      // Add empty row for spacing
      worksheet.addRow({});

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
        to: "H1",
      };

      // Export
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Pending_Invoice_Report.xlsx";
        link.click();
        setIsExportingExcel(false);
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      setIsExportingExcel(false);
    }
  };

  const generatePDF = async () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
      });
      doc.setFontSize(16);

      const headers = [
        "S.No.",
        "Completed Date",
        "Client Name",
        "Department Name",
        "Task Name",
        "Assign To",
        "Created Date",
        "Gross Amount",
      ];

      const reportData = await getReportData();
      if (!reportData) return;

      // Calculate total amount
      const totalAmount = reportData.reduce((sum, data) => {
        return sum + (parseFloat(data?.fee) || 0);
      }, 0);

      const body = reportData.map((data, index) => [
        index + 1,
        data?.taskCompletedAt ? dayjs(data.taskCompletedAt).format('DD-MM-YYYY hh:mm') : '-',
        data?.clientData?.fullName || "-",
        data?.departmentData?.name || "-",
        data?.taskName || "-",
        Array.isArray(data?.employeData) ? data.employeData.map(emp => emp?.fullName || "-").join(", ") : data?.employeData || "-",
        data?.createdAt ? dayjs(data.createdAt).format('DD-MM-YYYY hh:mm') : '-',
        data?.fee ? `₹${parseFloat(data.fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"
      ]);

      // Add total row at the beginning of body
      const totalRow = [
        "TOTAL",
        "",
        "",
        "",
        "",
        "",
        "",
        `₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ];

      // Insert total row at the beginning
      body.unshift(totalRow);

      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: body,
        margin: { horizontal: 10 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 40 }, // S.No.
          1: { halign: 'center', cellWidth: 80 }, // Completed Date
          2: { halign: 'left', cellWidth: 100 },  // Client Name
          3: { halign: 'left', cellWidth: 80 },   // Department Name
          4: { halign: 'left', cellWidth: 120 },  // Task Name
          5: { halign: 'left', cellWidth: 100 },  // Assign To
          6: { halign: 'center', cellWidth: 80 }, // Created Date
          7: { halign: 'right', cellWidth: 80 },  // Gross Amount
        },
        styles: {
          cellPadding: 6,
          fontSize: 9,
          valign: "middle",
          halign: "left",
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
          lineWidth: 0.5,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didParseCell: function (data) {
          // Style the total row (first row after header)
          if (data.row.index === 1) { // 0 is header, 1 is first data row (total row)
            data.cell.styles.fillColor = [212, 229, 247]; // Light blue background
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.halign = 'center';
            data.cell.styles.textColor = [0, 0, 0];
            data.cell.styles.lineWidth = 1; // Thicker borders for total row
            // Override any alternating row styles
            return;
          }
        },
      });

      doc.save(`Pending_Invoice_Report.pdf`);
      setIsExportingPDF(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsExportingPDF(false);
    }
  };


  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1">
          <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-2 flex-wrap text-[14px] rounded-md">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <Controller
                  name="PDCompanyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Company"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())}
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyList?.map((element) => (
                        <Select.Option value={element?._id}>
                          {" "}
                          {element?.fullName}{" "}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>
            )}
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
                        className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Select Branch"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())}
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchList?.map((element) => (
                          <Select.Option value={element?._id}>
                            {" "}
                            {element?.fullName}{" "}
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
            <div className="">
              <Controller
                name="PDDepartmentId"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassNameFilter} ${errors.PDDepartmentId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    onChange={(value) => {
                      field.onChange(value);
                      handleDepartmentChange(value);
                    }}
                    onFocus={handleFocusDepartment}
                    placeholder="Select Department"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())}
                  >
                    <Option value="">Select Department</Option>
                    {departmentListData?.map((element) => (
                      <Option key={element?._id} value={element?._id}>
                        {element?.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-sm">
                  {errors.employeeId.message}
                </p>
              )}
            </div>
            <div className="">
              <Controller
                name="clientList"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select client"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())}
                  >
                    <Select.Option value="">Select Client </Select.Option>
                    {clientList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {" "}
                        {element?.fullName}{" "}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="">
              <Controller
                name="taskType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Task Type"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())}
                  >
                    <Select.Option value="">Select Task Type </Select.Option>
                    {taskTypeList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {" "}
                        {element?.name}{" "}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="">
              <Controller
                name="groupType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassNameFilter} ${errors.groupType ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Group Type"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())}
                  >
                    <Select.Option value="">Select Group Type </Select.Option>
                    {clientGroupList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {" "}
                        {element?.fullName}{" "}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    report={true}
                    defaultValue={urlDateRange?.startDate || dayjs().subtract(1, "month")}
                    size={"middle"}
                    field={field}
                    errors={errors}
                    placeholder="Start Date"
                  />
                )}
              />
            </div>
            <div className="">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    report={true}
                    defaultValue={urlDateRange?.endDate || dayjs()}
                    size={"middle"}
                    field={field}
                    errors={errors}
                    placeholder="End Date"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDCompanyId", "");
                setValue("PDBranchId", "");
                setValue("PDDepartmentId", "");
                setValue("clientList", "");
                setValue("taskType", "");
                setValue("groupType", "");
                setValue("startDate", null);
                setValue("endDate", null);
                setCurrentPage(1); // Reset to first page
                fetchPendingInvoiceList(""); // Call API with empty search
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage(1); // Reset to first page when applying filters
                fetchPendingInvoiceList(debouncedFilterText);
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
        {/* Total Fee Pending Invoice Count Display */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Pending Invoice Amount</h3>
                <p className="text-sm text-gray-600">Sum of all pending invoice fees</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {totalFeePendingInvoiceCount ? `₹${parseFloat(totalFeePendingInvoiceCount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "₹0.00"}
              </div>
              <div className="text-sm text-gray-500">
                {totalpendingInvoiceCount} {totalpendingInvoiceCount === 1 ? 'record' : 'records'}
              </div>
            </div>
          </div>
        </div>

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
                <Select.Option value={10}>10</Select.Option>
                <Select.Option value={25}>25</Select.Option>
                <Select.Option value={50}>50</Select.Option>
                <Select.Option value={100}>100</Select.Option>
              </Select>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  generateExcel();
                }}
                disabled={isExportingExcel || isExportingPDF}
                className={`py-2 my-0.5 rounded-md flex px-6 justify-center items-center text-white transition-colors duration-200 ${isExportingExcel || isExportingPDF
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {isExportingExcel ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <FaFileExcel className="mr-2 text-[14px]" />
                )}
                <span className="text-[12px]">
                  {isExportingExcel ? "Exporting Excel..." : "Excel"}
                </span>
              </button>
              <button
                onClick={() => {
                  generatePDF();
                }}
                disabled={isExportingExcel || isExportingPDF}
                className={`py-2 my-0.5 rounded-md flex px-6 justify-center items-center text-white transition-colors duration-200 ${isExportingExcel || isExportingPDF
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {isExportingPDF ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <FaFilePdf className="mr-2 text-[14px]" />
                )}
                <span className="text-[12px]">
                  {isExportingPDF ? "Exporting PDF..." : "PDF"}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap text-left w-[5%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-left">Completed Date</th>
                <th className="border-none p-2 whitespace-nowrap text-left">Client name</th>
                <th className="border-none p-2 whitespace-nowrap text-left">Department Name</th>
                <th className="border-none p-2 whitespace-nowrap text-left">Task Name</th>
                <th className="border-none p-2 whitespace-nowrap text-left">Assign To</th>
                <th className="border-none p-2 whitespace-nowrap text-left">Created Date</th>
                <th className="border-none p-2 whitespace-nowrap text-right">Gross Amount</th>
                <th className="border-none p-2 whitespace-nowrap text-right">Actions</th>
              </tr>

            </thead>
            {pendingInvoiceReportFunc_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={12}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {pendingInvoiceReportList &&
                  pendingInvoiceReportList?.length > 0 ? (
                  pendingInvoiceReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >

                      <td className="whitespace-nowrap text-left border-none px-2 py-3">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-2 py-3">
                        {element?.taskCompletedAt ? dayjs(element?.taskCompletedAt).format('DD-MM-YYYY hh:mm a') : '-'}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-2 py-3">
                        {element?.clientData.fullName || "-"}
                      </td>

                      <td className="whitespace-nowrap text-left border-none px-2 py-3">
                        {element?.departmentData?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-2 py-3">
                        {element?.taskName || "-"}
                      </td>




                      <td className="p-2 text-left min-w-[125px]">
                        <div className="flex gap-1 items-center">
                          <span>{element?.employeData?.[0]?.fullName}</span>
                          {element?.employeData?.length > 1 && (
                            <span className="text-header flex items-center gap-1">
                              +
                              <span className="h-5 w-5 bg-header text-white text-[12px] rounded-full flex items-center justify-center">
                                {element?.employeData?.length - 1}
                              </span>
                            </span>
                          )}
                          <FaEye
                            className="text-[#374151] text-[14px] cursor-pointer"
                            onClick={() =>
                              setEmployeeViewModal({ isOpen: true, data: element })
                            }
                          />
                        </div>
                      </td>



                      <td className="whitespace-nowrap text-left border-none px-2 py-3">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? '-'}
                      </td>
                      <td className="whitespace-nowrap text-right border-none px-2 py-3 font-medium">
                        {element?.fee ? `₹${parseFloat(element.fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-2 py-3">

                        <button
                          onClick={() => {
                            // Encrypt task data to pass in URL
                            const taskData = {
                              _id: element?._id,
                              taskName: element?.taskName,
                              clientId: element?.clientData?._id,
                              clientName: element?.clientData?.fullName,
                              fee: element?.fee,
                              financialYear: element?.financialYear,
                              type: element?.type,
                              branchId: element?.branchId,
                              companyId: element?.companyId,
                              taskTypeId: element?.taskTypeId,
                            }

                            const encryptedTaskData = encrypt(JSON.stringify(taskData));
                            navigate(`/admin/invoice/create?taskData=${encryptedTaskData}`);
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white border-green-600 border-[1.5px] transition-colors duration-200"
                          type="button"
                        >
                          <FaPlus
                            className="text-white"
                            size={16}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={15}
                      className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        <CustomPagination
          totalCount={totalpendingInvoiceCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
      <Modal
        title="Employee List"
        visible={EmployeeViewModal?.isOpen}
        onCancel={() => setEmployeeViewModal({
          isOpen: false,
          employee: null,
        })}
        className="antmodalclassName"
        footer={[
          <button
            key="close"
            onClick={() => setEmployeeViewModal({
              isOpen: false,
              employee: null,
            })}
            className=" capitalize px-2 py-1 rounded-sm bg-header text-white"
          >
            Close
          </button>
        ]}
        width={800}
        centered
      >
        <div className="flex items-center">

          <div className="flex gap-3 flex-wrap ] overflow-y-auto">
            {EmployeeViewModal?.data?.employeData?.map((element) => (
              <div
                key={element.id}

                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-all shadow-sm hover:shadow-md border border-gray-100"
              >
                {/* Avatar with subtle ring */}


                {/* Name + Role (if available) */}
                <div className="text-center">
                  <p className="font-medium text-gray-800 truncate max-w-[100px]">
                    {element.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{element.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </Modal>

    </GlobalLayout>
  );
}

export default PendingInvoiceReport;
