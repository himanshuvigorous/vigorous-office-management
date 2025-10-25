import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
  getDefaultFinacialYear,
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
import { overAllTaskReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import { useSearchParams } from "react-router-dom";

function AllTaskReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  function getValidDayjsDate(dateString) {
  if (!dateString) return null;

  const trimmed = dateString.trim(); 
  const parsedDate = dayjs(trimmed);

  return parsedDate.isValid() ? parsedDate : null;
}



 function getStartAndEndDateFromFilter(filterType) {
  const today = dayjs();

  if (!filterType) return { startDate: null, endDate: null };

  const type = filterType.trim().toLowerCase();
  let startDate = null;
  let endDate = null;

  switch (type) {
    case 'today':
      startDate = today.startOf('day');
      endDate = today.endOf('day');
      break;

    case 'last week': {
      const lastWeek = today.subtract(1, 'week');
      const weekday = lastWeek.day(); // 0 (Sun) to 6 (Sat)
      startDate = lastWeek.subtract(weekday, 'day').startOf('day');
      endDate = startDate.add(6, 'day').endOf('day');
      break;
    }

    case 'last month':
      startDate = today.subtract(1, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'last year':
      startDate = today.subtract(1, 'year').startOf('year');
      endDate = today.subtract(1, 'year').endOf('year');
      break;

    default:
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
}


const [pageSize, setPageSize] = useState(10);
const [searchParams,setSearchParams]=useSearchParams()
const filterDate = searchParams.get('filterDate');
const taskToDate = getValidDayjsDate(searchParams.get('toDateNew'));
const taskFromDate = getValidDayjsDate(searchParams.get('fromDateNew'));
const filteredDate  =getStartAndEndDateFromFilter(filterDate)



  const dispatch = useDispatch();
  const {
    overAllTaskReportList,
    overAllTaskReportFunc_loading,
    totaloverAllTaskCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const { taskTypeList, loading: taskTypeListLoading } = useSelector((state) => state.taskType);
  const { clientGroupList, groupSearchLoading } = useSelector((state) => state.clientGroup);
  const { clientList, loading: clientListLoading } = useSelector((state) => state.client);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
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
  const daterange = useWatch({
    control,
    name: "daterange",
    defaultValue: "",
  });
  // const employeeIds = useWatch({
  //   control,
  //   name: "employeeId",
  //   defaultValue: [],
  // });

  const employeeId = useWatch({
    control,
    name: "employeeId",
    defaultValue: "",
  });
  const startDate = useWatch({
    control,
    name: "startDate",
    defaultValue: filterDate !=='Custom Date' ? filteredDate?.startDate:filterDate =='Custom Date'? taskFromDate :dayjs().subtract(1, "month"),
  });
  const endDate = useWatch({
    control,
    name: "endDate",
    defaultValue: filterDate !=='Custom Date' ? filteredDate?.endDate:filterDate =='Custom Date'? taskToDate :dayjs(),
  });

  const priority = useWatch({
    control,
    name: "priority",
    defaultValue: "",
  });

  const financialYear = useWatch({
    control,
    name: "financialYear",
    defaultValue: "",
  });

  const month = useWatch({
    control,
    name: "month",
    defaultValue: "",
  });
  const department = useWatch({
    control,
    name: "department",
    defaultValue: "",
  });

  const client = useWatch({
    control,
    name: "client",
    defaultValue: "",
  });

  const task = useWatch({
    control,
    name: "task",
    defaultValue: "",
  });

  const groupName = useWatch({
    control,
    name: "groupName",
    defaultValue: "",
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

  const [empArray, setEmpArray] = useState([])
  const [empModal, setEmpModal] = useState(false)
  const handleEmployeeModal = (element) => {
    setEmpArray(element ? element : [])
    setEmpModal(true)
  }

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

  const combinedMonth = [...months, ...quarter];

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
        departmentIds: [],
        clientIds: [],
        employeIds: [],
        taskTypeIds: [],
        groupIds: [],
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
        dateRange: daterange,
        status: Status,
        priority: priority,
        monthName: months.find((data) => {
          return data == month;
        })
          ? month
          : "",
        monthQuaters: quarter.find((data) => {
          return data == month;
        })
          ? month
          : "",
        financialYear: financialYear,
        departmentId: department,
        clientId: client,
        employeId: employeeId,
        taskTypeId: task,
        groupId: groupName,
      },
    };
  };
  useEffect(() => {
    fetchOverAllTaskReport(debouncedFilterText);
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

  const fetchOverAllTaskReport = () => {
    dispatch(overAllTaskReportFunc(requestPayLoadReturn(true)));
  };

  useEffect(() => { 
    setValue('startDate',filterDate !=='Custom Date' ? filteredDate?.startDate:filterDate =='Custom Date'? taskFromDate :dayjs().subtract(1, "month"))
    setValue('endDate',filterDate !=='Custom Date' ? filteredDate?.endDate:filterDate =='Custom Date'? taskToDate :dayjs())
  }, []);

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
    // setValue("startDate", dayjs().subtract(1, "month"));
    // setValue("endDate", dayjs());
  }, []);

  const onChange = (e) => {
    setSearchText(e);
  };

  const handleSubmit = async () => {
    fetchOverAllTaskReport();
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AllTaskReport");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Date", key: "date", width: 15 },
      { header: "Task ID", key: "taskId", width: 20 },
      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Department Name", key: "department", width: 25 },
      { header: "Task Name", key: "taskName", width: 30 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "F.Y.", key: "financialYear", width: 15 },
      { header: "Period", key: "period", width: 25 },
      { header: "Due Date", key: "dueDate", width: 15 },
      { header: "Overdue Period", key: "overduePeriod", width: 20 },
      { header: "Latest Status", key: "status", width: 20 },
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

    const response = await reportsServices?.overAllTaskReportFunc(
      requestPayLoadReturn(false)
    );


    if (!overAllTaskReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        date: data?.createdAt ? dayjs(data.createdAt).format("DD-MM-YYYY") : "-",
        taskId: data?.code || data?._id?.substring(0, 8) + "..." || "-",
        clientName: data?.clientData?.fullName || "-",
        department: data?.departmentData?.name || "-",
        taskName: data?.taskName || "-",
        assignedTo: Array.isArray(data?.employeData) ? data.employeData.map(emp => emp?.fullName || "-").join(", ") : data?.employeData || "-",
        financialYear: data?.financialYear || "-",
        period: data?.monthName ? `${data.monthName} (${data?.monthQuaters || ""})` : data?.type || "-",
        dueDate: data?.dueDate ? dayjs(data.dueDate).format("DD-MM-YYYY") : "-",
        overduePeriod: data?.isOverDue ? 
          (data?.dueDate ? 
            `${dayjs().diff(dayjs(data.dueDate), 'days')} days` : 
            "Overdue"
          ) : 
          (data?.dueDate ? 
            (dayjs().isAfter(dayjs(data.dueDate)) ? 
              `${dayjs().diff(dayjs(data.dueDate), 'days')} days` : 
              "Not Overdue"
            ) : "-"
          ),
        status: data?.status
          ?.replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase()) || "-"
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
      link.download = "AllTaskReport.xlsx";
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
      "Date",
      "Task ID",
      "Client Name",
      "Department Name",
      "Task Name",
      "Assigned To",
      "F.Y.",
      "Period",
      "Due Date",
      "Overdue Period",
      "Latest Status",
    ];
    const response = await reportsServices?.overAllTaskReportFunc(
      requestPayLoadReturn(false)
    );
    if (!overAllTaskReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.createdAt ? dayjs(data.createdAt).format("DD-MM-YYYY") : "N/A",
        data?.code || data?._id?.substring(0, 8) + "..." || "N/A",
        data?.clientData?.fullName || "N/A",
        data?.departmentData?.name || "N/A",
        data?.taskName || "N/A",
        Array.isArray(data?.employeData) ? data.employeData.map(emp => emp?.fullName || "-").join(", ") : data?.employeData || "N/A",
        data?.financialYear || "N/A",
        data?.monthName ? `${data.monthName} (${data?.monthQuaters || ""})` : data?.type || "N/A",
        data?.dueDate ? dayjs(data.dueDate).format("DD-MM-YYYY") : "N/A",
        data?.isOverDue ? 
          (data?.dueDate ? 
            `${dayjs().diff(dayjs(data.dueDate), 'days')} days` : 
            "Overdue"
          ) : 
          (data?.dueDate ? 
            (dayjs().isAfter(dayjs(data.dueDate)) ? 
              `${dayjs().diff(dayjs(data.dueDate), 'days')} days` : 
              "Not Overdue"
            ) : "N/A"
          ),
        data?.status
          ?.replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase()) || "N/A",
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
    doc.save(`AllTaskReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1">
          <div className="sm:flex  grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">
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
                name="groupName"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="inputAntdSelectClassNameFilterReport"
                    showSearch
                    placeholder="Select Group"
                    onFocus={() => {
                      dispatch(
                        clientGrpSearch({
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
                          branchId: ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType)
                            ? BranchId
                            : userInfoglobal?.userType === "companyBranch"
                              ? userInfoglobal?._id
                              : userInfoglobal?.branchId,
                          groupId: "",
                        })
                      );
                    }}
                    onChange={(value) => field.onChange(value)}
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Group</Select.Option>
                    {groupSearchLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(clientGroupList)?.map((element) => (
                        <Select.Option key={element?._id} value={element?._id}>
                          {element?.fullName} ({element?.groupName})
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>
            <div>
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
            <div>
              <Controller
                name="client"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`inputAntdSelectClassNameFilterReport`}
                    showSearch
                    placeholder="Select Client"
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onFocus={() => {
                      dispatch(
                        clientSearch({
                          companyId:
                            userInfoglobal?.userType === "company"
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
                          groupId: groupName,
                          directorId: "",
                          organizationId: "",
                          industryId: "",
                          // departmentId: department,
                          text: "",
                          sort: true,
                          status: true,
                          isPagination: false,
                        })
                      );
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <Select.Option value=""> Select Client</Select.Option>
                    {clientListLoading ?
                      <Select.Option disabled><ListLoader /></Select.Option> :
                      (sortByPropertyAlphabetically(clientList)?.map((element, index) => (
                        <Select.Option key={element?._id} value={element?._id}>
                          {element?.fullName}
                        </Select.Option>
                      )))}
                  </Select>
                )}
              />
            </div>
            <div className="">
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Select
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport "
                    placeholder="Select Employee"
                    onFocus={handleEmployeeFocus}
                    options={employeList?.map((data) => {
                      return { value: data._id, label: data.fullName };
                    })}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-sm">
                  {errors.employeeId.message}
                </p>
              )}
            </div>
            <div>
              <Controller
                control={control}
                name="task"
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    onFocus={() => {
                      dispatch(
                        taskTypeSearch({
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
                          // departmentId: watch("PDDepartmentId")?.value,
                          departmentId: "",
                          directorId: "",
                          text: "",
                          sort: true,
                          status: true,
                          isPagination: false,
                        })
                      );
                    }}
                    className="inputAntdSelectClassNameFilterReport"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value=""> Select Task Name</Select.Option>
                    {taskTypeListLoading ?
                      <Select.Option disabled><ListLoader /></Select.Option> :
                      (sortByPropertyAlphabetically(taskTypeList)?.map((type, index) => (
                        <Select.Option value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      )))}
                  </Select>
                )}
              />
            </div>
            <div>
              <Controller
                name="status"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Please select Task Status"
                    options={CLIENT_TASK_STATUS_ARR?.map((array) => {
                      return { value: array, label: array };
                    })}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="priority"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`inputAntdSelectClassNameFilterReport `}
                    placeholder="Select Priority"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Priority</Select.Option>
                    {PRIORITY?.map((array) => {
                      return (
                        <Select.Option value={array}>{array}</Select.Option>
                      );
                    })}
                  </Select>
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="financialYear"
                rules={{ required: "Financial year is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={filterDate ? '' :getDefaultFinacialYear()}
                    placeholder={"Select Financial year"}
                    className={`inputAntdSelectClassNameFilterReport`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">
                      Select Financial year
                    </Select.Option>
                    {financialYears?.map((year, index) => (
                      <Select.Option key={index} value={year}>
                        {year}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="month"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select month "
                    className="inputAntdSelectClassNameFilterReport"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select month </Select.Option>
                    {combinedMonth?.map((month, index) => (
                      <Select.Option key={index} value={month}>
                        {month}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
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
                setValue("PDCompanyId", "");
                setValue("status", "");
                setValue("employeeId", "");
                setValue("daterange", "");
                setValue("shift", "");
                setValue("workType", "");
                setValue("startDate", null);
                setValue("endDate", null);
                setValue("priority", "");
                setValue("financialYear", "");
                setValue("month", "");
                setValue("department", "");
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
                <th className="border-none p-2 whitespace-nowrap text-center w-[5%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Date
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Task ID
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Department Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Task Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Assigned To
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  F.Y.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Period
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Due Date
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Overdue Period
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Latest Status
                </th>
              </tr>
            </thead>
            {overAllTaskReportFunc_loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={12}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {overAllTaskReportList && overAllTaskReportList?.length > 0 ? (
                  overAllTaskReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.createdAt ? dayjs(element.createdAt).format("DD-MM-YYYY") : "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.code || element?._id?.substring(0, 8) + "..." || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.clientData?.fullName || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.departmentData?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.taskName || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        <div className="flex gap-2">
                          <div> {element?.employeData?.[0]?.fullName || "-"}</div>  
                          {element?.employeData?.length > 1 ? (
                            <div className="text-header flex justify-center items-center gap-1 rounded-full text-semibold text-sm"> 
                              + <div onClick={() => { handleEmployeeModal(element?.employeData) }} className="border justify-center items-center flex h-5 w-5 bg-header text-white text-[12px] rounded-full cursor-pointer">
                                {element?.employeData?.length - 1} 
                              </div>
                            </div>
                          ) : ''}
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.financialYear || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.monthName ? `${element.monthName} (${element?.monthQuaters || ""})` : element?.type || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.dueDate ? dayjs(element.dueDate).format("DD-MM-YYYY") : "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.isOverDue ? 
                          (element?.dueDate ? 
                            `${dayjs().diff(dayjs(element.dueDate), 'days')} days` : 
                            "Overdue"
                          ) : 
                          (element?.dueDate ? 
                            (dayjs().isAfter(dayjs(element.dueDate)) ? 
                              `${dayjs().diff(dayjs(element.dueDate), 'days')} days` : 
                              "Not Overdue"
                            ) : "-"
                          )
                        }
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          element?.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                          element?.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          element?.status?.toLowerCase() === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          element?.status?.toLowerCase() === 'in_review' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {element?.status
                            ?.replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase()) || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={12}
                      className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
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
            title="Employees"
            open={empModal}
            onCancel={() => setEmpModal(false)}
            footer={null}
          >
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                    S.No.
                  </th>

                  <th className="border-none p-2 whitespace-nowrap ">
                    Employee Name
                  </th>

                  <th className="border-none p-2 whitespace-nowrap ">Email</th>
                  <th className="border-none p-2 whitespace-nowrap ">Mobile</th>


                </tr>
              </thead>
              {empArray.length == 0 ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={12}
                    className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {empArray &&
                    empArray?.length > 0 ? (
                    empArray?.map(
                      (element, index) => (
                        <tr
                          className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                          <td className="whitespace-nowrap  border-none p-2">
                            {index + 1}
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
                            {element?.fullName}
                          </td>

                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.email || "-"}
                          </td>

                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.mobile?.code || "-"}{" "}
                            {element?.mobile?.number || "-"}
                          </td>


                          {/* <td className="whitespace-nowrap text-center  border-none p-2">
                                  <div onClick={()=>{handleDepartmentModal(element)}} className="flex justify-center items-center rounded-md h-10 w-10 border-2 border-cyan-500">
                                    {element?.departmentData?.length || 0}
                                  </div>
                                </td> */}
                        </tr>
                      )
                    )
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={12}
                        className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </Modal>
        </div>
        <CustomPagination
          totalCount={totaloverAllTaskCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default AllTaskReport;