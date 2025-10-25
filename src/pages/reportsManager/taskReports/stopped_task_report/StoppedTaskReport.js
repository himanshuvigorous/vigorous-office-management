import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
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
import { stoppedTaskReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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

function StoppedTaskReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    stoppedTaskReportList,
    stoppedTaskReportFunc_loading,
    totalstoppedTaskCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [empArray, setEmpArray] = useState([]);
  const [empModal, setEmpModal] = useState(false);
  const handleEmployeeModal = (element) => {
    setEmpArray(element ? element : []);
    setEmpModal(true);
  };

  const { taskTypeList, loading: taskTypeListLoading } = useSelector((state) => state.taskType);
  const { clientList, loading: clientListLoading } = useSelector((state) => state.client);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
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
    defaultValue: dayjs().subtract(1, "month"),
  });
  const endDate = useWatch({
    control,
    name: "endDate",
    defaultValue: dayjs(),
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
    defaultValue: [],
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
        clientIds: client,
        employeIds: [],
        taskTypeIds: [],
        groupIds: [],
        startDate: "",
        endDate: "",
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
        clientId: "",
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
    dispatch(stoppedTaskReportFunc(requestPayLoadReturn(true)));
  };

  useEffect(() => { }, []);

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

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("StopTaskReport");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Department", key: "department", width: 25 },
      { header: "Task Name", key: "taskName", width: 30 },
      { header: "Employee Name", key: "name", width: 30 },
      { header: "Financial Year", key: "financialYear", width: 20 },
      { header: "Month Name", key: "monthName", width: 20 },
      { header: "Month Quaters", key: "monthQuarter", width: 20 },
      { header: "Status", key: "status", width: 15 },
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

    const response = await reportsServices?.stoppedTaskReportFunc(
      requestPayLoadReturn(false)
    );


    if (!stoppedTaskReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        clientName: data?.clientData?.fullName || "-",
        department: data?.departmentData?.name || "-",
        taskName: data?.taskName || "-",
        name: Array.isArray(data?.employeData)
          ? data.employeData.map((emp) => emp?.fullName || "-").join(", ")
          : data?.employeData || "-",
        financialYear: data?.financialYear || "-",
        monthName: data?.monthName || "-",
        monthQuarter: data?.monthQuaters || "-",
        status: data?.status || "-",
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
      link.download = "StopTaskReport.xlsx";
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
      " Client Name",
      "Department",
      "Task Name",
      "Employee Name",
      "financial Year",
      "Month Name",
      "Month Quaters",
      "Status",
    ];
    const response = await reportsServices?.stoppedTaskReportFunc(
      requestPayLoadReturn(false)
    );

    if (!stoppedTaskReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.clientData?.fullName || "-",
        data?.departmentData?.name || "-",
        data?.taskName || "-",
        Array.isArray(data?.employeData)
          ? data.employeData.map((emp) => emp?.fullName || "-").join(", ")
          : data?.employeData || "-",
        data?.financialYear || "-",
        data?.monthName || "-",
        data?.monthQuaters || "-",

        data?.status || "-",
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
    doc.save(`StopTaskReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 2xl:flex justify-between items-center">
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
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Select
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport "
                    placeholder="Please select employee"
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
            {/* <div>
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
            </div> */}

            {/* <div>
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
                    {financialYears.map((year, index) => (
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
                    className='inputAntdSelectClassNameFilterReport'
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select month </Select.Option>
                    {combinedMonth.map((month, index) => (
                      <Select.Option key={index} value={month}>
                        {month}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div> */}
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
                name="client"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    className={`inputAntdMultiSelectClassNameFilterReport`}
                    showSearch
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
                          groupId: "",
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
                    placeholder="Select client"
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
            {/* <Controller
  name="groupName"
  control={control}
 
  render={({ field }) => (
    <Select
      {...field}
      className="inputAntdSelectClassNameFilterReport"
      options={[
        { label: "Select Group Type", value: "" },
        ...clientGroupList?.map((el) => ({
          label: `${el.fullName} (${el.groupName})`,
          value: el._id,
        })),
      ]}
      placeholder="Select Group Type"
      onFocus={handleFocusClientGrp}
      classNamePrefix="react-select"
      isSearchable
       onChange={(value) => {
                    field.onChange(value);
                  }}
      value={field?.value
       
      }
    />
  )}
/> */}
            {/* <div>
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
            </div> */}
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PdCompanyId", "");
                setValue("PDBranchId", "");
                setValue("department", "");
                setValue("employeeId", "");
                setValue("task", "");
                setValue("client", []);
                // setValue("status", "");
                // setValue("daterange", "");
                // setValue("shift", "");
                // setValue("workType", "");
                // setValue("startDate", "");
                // setValue("endDate", "");
                // setValue("priority", "");
                // setValue("financialYear", "");
                // setValue("month", "");
                // setValue("groupName", "");
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
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Department
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Task Name
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">
                  Employee Name
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">financial Year</div>
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Month Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Month Quaters
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">
                  Status
                </th>
              </tr>
            </thead>
            {stoppedTaskReportFunc_loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={15}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {stoppedTaskReportList && stoppedTaskReportList?.length > 0 ? (
                  stoppedTaskReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>

                      {/* <td className="whitespace-nowrap text-center border-none p-2">
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
                          <div> {element?.employeData[0]?.fullName}</div>{" "}
                          {element?.employeData?.length > 1 ? (
                            <div className="text-header flex justify-center items-center gap-1 rounded-full  text-semibold text-sm">
                              {" "}
                              +{" "}
                              <div
                                onClick={() => {
                                  handleEmployeeModal(element?.employeData);
                                }}
                                className="border justify-center items-center flex h-7 w-7 bg-header  text-white text-[12px] rounded-full "
                              >
                                {element?.employeData?.length - 1}{" "}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.financialYear || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.monthName || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.monthQuaters || "-"}
                      </td>

                      <td className="whitespace-nowrap border-none p-2">
                        <span
                          className={`
                                            ${element?.status === "Assigned"
                              ? "bg-blue-500 text-white"
                              : element?.status === "Accepted"
                                ? "bg-green-500 text-white"
                                : element?.status ===
                                  "Pending_at_client"
                                  ? "bg-yellow-300 text-black"
                                  : element?.status ===
                                    "Pending_at_department"
                                    ? "bg-purple-300 text-black"
                                    : element?.status ===
                                      "Pending_at_colleague"
                                      ? "bg-teal-300 text-black"
                                      : element?.status ===
                                        "Pending_at_manager"
                                        ? "bg-orange-300 text-black"
                                        : element?.status ===
                                          "Work_in_progress"
                                          ? "bg-indigo-500 text-white"
                                          : element?.status ===
                                            "Pending_for_approval"
                                            ? "bg-pink-300 text-black"
                                            : element?.status ===
                                              "Pending_for_fees"
                                              ? "bg-gray-400 text-black"
                                              : element?.status ===
                                                "Completed"
                                                ? "bg-green-600 text-white"
                                                : element?.status ===
                                                  "Task_Stop"
                                                  ? "bg-red-600 text-white"
                                                  : element?.status ===
                                                    "reAssign_to_other"
                                                    ? "bg-cyan-700 text-white"
                                                    : "bg-white text-black"
                            } border-header border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                        // onClick={() => handleStatusClick(element)}
                        >
                          {element?.status
                            ?.replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                          {/* {statusMapping[element?.status] ||
                                              "Unknown Status"} */}
                        </span>
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
                    colSpan={15}
                    className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {empArray && empArray?.length > 0 ? (
                    empArray?.map((element, index) => (
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
          </Modal>
        </div>
        <CustomPagination
          totalCount={totalstoppedTaskCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default StoppedTaskReport;
