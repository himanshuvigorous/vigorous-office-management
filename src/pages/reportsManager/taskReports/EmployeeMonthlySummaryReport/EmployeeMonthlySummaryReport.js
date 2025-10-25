import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertMinutesToHoursAndMinutes,
  correctTaskStatus,
  customDayjs,
  domainName,
  pazeSizeReport,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { useEffect, useState, useRef } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Modal, Select, Switch, Tooltip, Table } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";

import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import { clientGrpSearch } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { employeSummaryReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";

function EmployeeMonthlySummaryReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [pageSize, setPageSize] = useState(10);
  const tableRef = useRef(null);

  const dispatch = useDispatch();
  const {
    employeeSummaryReportList,
    employeSummaryReportFunc_loading,
    employeSummaryCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );
  const { designationList, loading: designationListLoading } = useSelector((state) => state.designation);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const startDate = useWatch({ control, name: "startDate", defaultValue: '' });
  const endDate = useWatch({ control, name: "endDate", defaultValue: '' });
  const department = useWatch({ control, name: "department", defaultValue: "" });
  const designation = useWatch({ control, name: "PdDesignationId", defaultValue: "" });
  const [percentage, setPercentage] = useState(false);



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


  const requestPayLoadReturn = (pagination = true) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
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
        "departmentIds": department ? [department] : [],
        "designationIds": designation ? [designation] : [],
        startDate: startDate ? customDayjs(startDate) : null,
        endDate: endDate ? customDayjs(endDate) : null,
        text: debouncedFilterText,
        sort: true,

        "isPagination": pagination
      },
    };
  };

  useEffect(() => {
    if(!startDate || !endDate ) return
    fetchOverAllTaskReport(debouncedFilterText);
  }, [currentPage, debouncedFilterText, pageSize,startDate,endDate,department,designation]);



  const fetchOverAllTaskReport = () => {
    dispatch(employeSummaryReportFunc(requestPayLoadReturn(true)));
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
    fetchOverAllTaskReport();
  };

  // Prepare table data with proper formatting
  const prepareTableData = (data) => {
    return data?.map((element, index) => {
      const taskSummary = element?.taskSummary || {};
      const percentageData = taskSummary?.percentage || {};
      return {
        key: element?._id || index,
        sno: index + 1 + (currentPage - 1) * pageSize,
        fullName: element?.fullName || "-",
        email: element?.email || "-",
        totalTasks: taskSummary?.totalTask || 0,
        completed: percentage
          ? `${Number(percentageData?.completed || 0).toFixed(2)}%`
          : taskSummary?.completed || 0,
        assigned: percentage
          ? `${Number(percentageData?.assigned || 0).toFixed(2)}%`
          : taskSummary?.assigned || 0,
        accepted: percentage
          ? `${Number(percentageData?.accepted || 0).toFixed(2)}%`
          : taskSummary?.accepted || 0,
        workInProgress: percentage
          ? `${Number(percentageData?.workInProgress || 0).toFixed(2)}%`
          : taskSummary?.workInProgress || 0,
        restart: percentage
          ? `${Number(percentageData?.restart || 0).toFixed(2)}%`
          : taskSummary?.restart || 0,
        reassigned: percentage
          ? `${Number(percentageData?.reassigned || 0).toFixed(2)}%`
          : taskSummary?.reassigned || 0,
        reqRejected: percentage
          ? `${Number(percentageData?.reqRejected || 0).toFixed(2)}%`
          : taskSummary?.reqRejected || 0,
        reassignToOther: percentage
          ? `${Number(percentageData?.reassignToOther || 0).toFixed(2)}%`
          : taskSummary?.reassignToOther || 0,
        pendingAtClient: percentage
          ? `${Number(percentageData?.pendingAtClient || 0).toFixed(2)}%`
          : taskSummary?.pendingAtClient || 0,
        pendingAtDepartment: percentage
          ? `${Number(percentageData?.pendingAtDepartment || 0).toFixed(2)}%`
          : taskSummary?.pendingAtDepartment || 0,
        pendingAtColleague: percentage
          ? `${Number(percentageData?.pendingAtColleague || 0).toFixed(2)}%`
          : taskSummary?.pendingAtColleague || 0,
        pendingAtManager: percentage
          ? `${Number(percentageData?.pendingAtManager || 0).toFixed(2)}%`
          : taskSummary?.pendingAtManager || 0,
        pendingForApproval: percentage
          ? `${Number(percentageData?.pendingForApproval || 0).toFixed(2)}%`
          : taskSummary?.pendingForApproval || 0,
        pendingForFee: percentage
          ? `${Number(percentageData?.pendingForFee || 0).toFixed(2)}%`
          : taskSummary?.pendingForFee || 0,
        stop: percentage
          ? `${Number(percentageData?.stop || 0).toFixed(2)}%`
          : taskSummary?.stop || 0,
        rawData: element // Keep raw data for export
      };
    }) || [];
  };

  // Table columns configuration
  const tableColumns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      key: "sno",
      width: 70,
      fixed: 'left',
      align: 'center',
    },
    {
      title: "Employee Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      fixed: 'left',
      align: 'center',
    },
    
    {
      title: "Total Tasks",
      dataIndex: "totalTasks",
      key: "totalTasks",
      width: 100,
      align: 'center',
    },
    {
      title: "Completed Task",
      dataIndex: "completed",
      key: "completed",
      width: 120,
      align: 'center',
    },
    {
      title: "Assigned Task",
      dataIndex: "assigned",
      key: "assigned",
      width: 120,
      align: 'center',
    },
    {
      title: "Accepted Task",
      dataIndex: "accepted",
      key: "accepted",
      width: 120,
      align: 'center',
    },
    {
      title: "Work In Progress",
      dataIndex: "workInProgress",
      key: "workInProgress",
      width: 140,
      align: 'center',
    },
    {
      title: "ReStart",
      dataIndex: "restart",
      key: "restart",
      width: 100,
      align: 'center',
    },
    {
      title: "ReAssigned",
      dataIndex: "reassigned",
      key: "reassigned",
      width: 120,
      align: 'center',
    },
    {
      title: "Request To Accept",
      dataIndex: "reqRejected",
      key: "reqRejected",
      width: 140,
      align: 'center',
    },
    {
      title: "ReAssigned To Others",
      dataIndex: "reassignToOther",
      key: "reassignToOther",
      width: 160,
      align: 'center',
    },
    {
      title: "Pending at Client",
      dataIndex: "pendingAtClient",
      key: "pendingAtClient",
      width: 140,
      align: 'center',
    },
    {
      title: correctTaskStatus("Pending_at_department"),
      dataIndex: "pendingAtDepartment",
      key: "pendingAtDepartment",
      width: 160,
      align: 'center',
    },
    {
      title: correctTaskStatus("Pending_at_colleague"),
      dataIndex: "pendingAtColleague",
      key: "pendingAtColleague",
      width: 160,
      align: 'center',
    },
    {
      title: correctTaskStatus("Pending_at_manager"),
      dataIndex: "pendingAtManager",
      key: "pendingAtManager",
      width: 160,
      align: 'center',
    },
    {
      title: correctTaskStatus("Pending_for_approval"),
      dataIndex: "pendingForApproval",
      key: "pendingForApproval",
      width: 160,
      align: 'center',
    },
    {
      title: correctTaskStatus("Pending_for_fees"),
      dataIndex: "pendingForFee",
      key: "pendingForFee",
      width: 140,
      align: 'center',
    },
    {
      title: correctTaskStatus("Task_Stop"),
      dataIndex: "stop",
      key: "stop",
      width: 120,
      align: 'center',
    },
  ];

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Monthly Summary Report");

    // Define columns based on current percentage state
    const columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "User Name", key: "fullName", width: 30 },
      { header: "Employee Name", key: "email", width: 30 },
      { header: "Total Tasks", key: "totalTasks", width: 15 },
      { header: "Completed Task", key: "completed", width: 15 },
      { header: "Assigned Task", key: "assigned", width: 15 },
      { header: "Accepted Task", key: "accepted", width: 15 },
      { header: "Work In Progress Task", key: "workInProgress", width: 20 },
      { header: "ReStart", key: "restart", width: 12 },
      { header: "ReAssigned", key: "reassigned", width: 15 },
      { header: "Request To Accept", key: "reqRejected", width: 18 },
      { header: "ReAssigned To Others", key: "reassignToOther", width: 20 },
      { header: "Pending at Client", key: "pendingAtClient", width: 18 },
      { header: correctTaskStatus("Pending_at_department"), key: "pendingAtDepartment", width: 22 },
      { header: correctTaskStatus("Pending_at_colleague"), key: "pendingAtColleague", width: 22 },
      { header: correctTaskStatus("Pending_at_manager"), key: "pendingAtManager", width: 22 },
      { header: correctTaskStatus("Pending_for_approval"), key: "pendingForApproval", width: 22 },
      { header: correctTaskStatus("Pending_for_fees"), key: "pendingForFee", width: 20 },
      { header: correctTaskStatus("Task_Stop"), key: "stop", width: 15 },
    ];

    worksheet.columns = columns;

    // Style header row
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
    const response = await reportsServices?.employeSummaryReportFunc(
      requestPayLoadReturn(false)
    );
    if (!response?.data?.docs?.length) return;

    // Get data for export (use current table data)
    const tableData = prepareTableData(response?.data?.docs);

    // Add data rows
    tableData.forEach((item, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        fullName: item.fullName,
        email: item.email,
        totalTasks: item.totalTasks,
        completed: item.completed,
        assigned: item.assigned,
        accepted: item.accepted,
        workInProgress: item.workInProgress,
        restart: item.restart,
        reassigned: item.reassigned,
        reqRejected: item.reqRejected,
        reassignToOther: item.reassignToOther,
        pendingAtClient: item.pendingAtClient,
        pendingAtDepartment: item.pendingAtDepartment,
        pendingAtColleague: item.pendingAtColleague,
        pendingAtManager: item.pendingAtManager,
        pendingForApproval: item.pendingForApproval,
        pendingForFee: item.pendingForFee,
        stop: item.stop,
      });

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
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
      to: `${String.fromCharCode(65 + columns.length - 1)}1`,
    };

    // Export
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Employee_Monthly_Summary_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // Title
    doc.setFontSize(16);
    doc.text("Employee Monthly Summary Report", 40, 30);
    doc.setFontSize(10);
    doc.text(`Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`, 40, 50);
    const response = await reportsServices?.employeSummaryReportFunc(
      requestPayLoadReturn(false)
    );
    if (!response?.data?.docs?.length) return;
    const tableData = prepareTableData(response?.data?.docs);

    const headers = tableColumns.map(col => col.title);
    const body = tableData.map(item => [
      item.sno,
      item.fullName,
      item.email,
      item.totalTasks,
      item.completed,
      item.assigned,
      item.accepted,
      item.workInProgress,
      item.restart,
      item.reassigned,
      item.reqRejected,
      item.reassignToOther,
      item.pendingAtClient,
      item.pendingAtDepartment,
      item.pendingAtColleague,
      item.pendingAtManager,
      item.pendingForApproval,
      item.pendingForFee,
      item.stop,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [headers],
      body: body,
      styles: {
        fontSize: 7,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [182, 215, 168],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { horizontal: 10 },
    });

    doc.save(`Employee_Monthly_Summary_Report_${moment().format('YYYY-MM-DD')}.pdf`);
  };

  const onTogglePercent = () => {
    setPercentage((prev) => !prev);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 2xl:flex justify-between items-center">
          <div className="sm:flex grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">
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
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`inputAntdSelectClassNameFilterReport`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onFocus={() => {
                      dispatch(
                        deptSearch({
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
                          branchId: [
                            "admin",
                            "company",
                            "companyDirector",
                          ].includes(userInfoglobal?.userType)
                            ? BranchId
                            : userInfoglobal?.userType === "companyBranch"
                              ? userInfoglobal?._id
                              : userInfoglobal?.branchId,
                        })
                      );
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    placeholder="Select Department"
                  >
                    <Select.Option value="">Select Department</Select.Option>
                    {depLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(departmentListData)?.map(
                        (element) => (
                          <Select.Option key={element?._id} value={element?._id}>
                            {element?.name}
                          </Select.Option>
                        )
                      )
                    )}
                  </Select>
                )}
              />
            </div>
            <div className="">
              <Controller
                control={control}
                name="PdDesignationId"
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    onFocus={() => {
                      dispatch(
                        designationSearch({
                          text: "",
                          sort: true,
                          status: true,
                          departmentId: department,
                          companyId: CompanyId,
                        })
                      );
                    }}
                    className="inputAntdMultiSelectClassNameFilterReport"
                  >
                    <Select.Option value="">Select Designation</Select.Option>
                    {designationListLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(designationList)?.map(
                        (type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.name}
                          </Select.Option>
                        )
                      )
                    )}
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
                    errors={errors}
                    picker="month"
                    allowClear={false}
                    field={{
                      ...field,
                      value: field.value,
                      onChange: (val) => {
                        const firstDay = val ? dayjs(val).startOf("month") : null;
                        field.onChange(firstDay);
                      },
                    }}
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
                    field={{
                      ...field,
                      value: field.value,
                      onChange: (val) => {
                        const lastDate = val ? dayjs(val).endOf("month") : null;
                        field.onChange(lastDate);
                      },
                    }}
                    report={true}
                    errors={errors}
                    picker="month"
                    allowClear={false}  
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", "");
                setValue("PdCompanyId", "");
                setValue("status", "");
                setValue("employeeId", "");
                setValue("daterange", "");
                setValue("shift", "");
                setValue("workType", "");
                setValue("startDate", dayjs().subtract(1, "month"));
                setValue("endDate", dayjs());
                setValue("priority", "");
                setValue("financialYear", "");
                setValue("month", "");
                setValue("department", "");
                setValue("PdDesignationId", "");
                setValue("client", "");
                setValue("task", "");
                setValue("groupName", "");
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
                {pazeSizeReport.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={generatePDF}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export PDF</span>
              </button>
              <button
                onClick={generateExcel}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 w-full mb-2">
          <span className="text-header text-[12px]">Convert Task to Percentage</span>
          <Switch onChange={onTogglePercent} checked={percentage} />
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          <Table
            ref={tableRef}
            columns={tableColumns}
            dataSource={prepareTableData(employeeSummaryReportList)}
            loading={employeSummaryReportFunc_loading}
            scroll={{ x: 2000, y: 'calc(100vh - 300px)' }}
            pagination={false}
            size="small"
            locale={{
              emptyText: employeSummaryReportFunc_loading ? <Loader2 /> : "Record Not Found"
            }}
          />
        </div>

        <CustomPagination
          totalCount={employeSummaryCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployeeMonthlySummaryReport;