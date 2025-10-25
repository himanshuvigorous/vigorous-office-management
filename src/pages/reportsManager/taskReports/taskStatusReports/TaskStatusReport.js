import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
} from "../../../../constents/global";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Select, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa6";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { pendingInvoiceReportFunc, taskStatusReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { Option } from "antd/es/mentions";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { clientSearch, getClientList } from "../../../client/clientManagement/clientFeatures/_client_reducers";
import { getTaskTypeList, taskTypeSearch } from "../../../taskManagement/taskType/taskFeatures/_task_reducers";
import { clientGrpSearch, getClientGroupList } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import getUserIds from "../../../../constents/getUserIds";
import * as ExcelJS from 'exceljs';
import jsPDF from "jspdf";
import Loader2 from "../../../../global_layouts/Loader/Loader2";



function TaskStatusReport() {


  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const { taskStatusReportList, totalTaskStatusCount, taskStatusReportFunc_loading } = useSelector(
    (state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);

  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { clientGroupList, totalClientGroupCount } = useSelector(
    (state) => state.clientGroup
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const pageSize = 10;
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
  const startDate = useWatch({
    control,
    name: "startDate",
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
      })
    );
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTaskStatusList(debouncedFilterText);
  }, [
    currentPage,
    debouncedFilterText,
    CompanyId,
    BranchId,
    searchText,
    Status,
    workType,
    shift,
    daterange,
    employeeId,
    startDate,
    isTL,
    isHR,
    ClientList,
    department,
    taskType,
    groupType,
  ]);

  const fetchTaskStatusList = (debouncedFilterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        //     "companyId": "",
        // "directorId": "",
        // "branchId": "",
        // "departmentId": "",
        // "clientId": "",
        // "employeId": "",
        // "taskTypeId": "",
        // "groupId": "",
        // "text": "",
        // "sort": true,
        // "status": "",
        // "isPagination": true,
        // "startDate": "",
        // "endDate": "",
        // "dateRange": ""

        text: "",

        status: Status,
        sort: true,
        isPagination: true,
        clientId: ClientList,

        directorId: "",

        departmentId: department,
        designationId: designation,
        reporting_to: "",
        roleKey: "",
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
      },
    };
    dispatch(taskStatusReportFunc(reqData));
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


  const CLIENT_TASK_STATUSES = {
    ASSIGNED: "Assigned",
    ACCEPTED: "Accepted",
    REASSIGN_TO_OTHER: "reAssign_to_other",
    PENDING_AT_CLIENT: "Pending_at_client",
    PENDING_AT_DEPARTMENT: "Pending_at_department",
    PENDING_AT_COLLEAGUE: "Pending_at_colleague",
    PENDING_AT_MANAGER: "Pending_at_manager",
    WORK_IN_PROGRESS: "Work_in_progress",
    PENDING_FOR_APPROVAL: "Pending_for_approval",
    PENDING_FOR_FEE: "Pending_for_fees",
    COMPLETED: "Completed",
    STOP: "Task_Stop",
  };

  const STATUS_STYLES = {
    [CLIENT_TASK_STATUSES.ASSIGNED]: "bg-blue-200 border-blue-500",
    [CLIENT_TASK_STATUSES.ACCEPTED]: "bg-green-200 border-green-500",
    [CLIENT_TASK_STATUSES.REASSIGN_TO_OTHER]: "bg-yellow-200 border-yellow-500",
    [CLIENT_TASK_STATUSES.PENDING_AT_CLIENT]: "bg-orange-200 border-orange-500",
    [CLIENT_TASK_STATUSES.PENDING_AT_DEPARTMENT]: "bg-orange-300 border-orange-600",
    [CLIENT_TASK_STATUSES.PENDING_AT_COLLEAGUE]: "bg-orange-400 border-orange-700",
    [CLIENT_TASK_STATUSES.PENDING_AT_MANAGER]: "bg-orange-500 border-orange-800",
    [CLIENT_TASK_STATUSES.WORK_IN_PROGRESS]: "bg-purple-200 border-purple-500",
    [CLIENT_TASK_STATUSES.PENDING_FOR_APPROVAL]: "bg-indigo-200 border-indigo-500",
    [CLIENT_TASK_STATUSES.PENDING_FOR_FEE]: "bg-red-200 border-red-500",
    [CLIENT_TASK_STATUSES.COMPLETED]: "bg-green-300 border-green-600",
    [CLIENT_TASK_STATUSES.STOP]: "bg-gray-300 border-gray-500",
  };

  const DEFAULT_STYLE = "bg-gray-200 border-gray-400";

  const getStatusStyle = (status) => STATUS_STYLES[status] || DEFAULT_STYLE;


  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('API Data');
    const apiData = taskStatusReportList?.map((element) => {
      return {
        taskName: element?.taskName,
        remarks: element?.remarks,
        clientName: element?.clientData?.fullName || "-",
        groupName: element?.groupData?.fullName || "-",

        isInvoiceGenerated: element?.isInvoiceGenerated ? "Yes" : "No",
        monthName: element?.monthName,
        monthQuaters: element?.monthQuaters,
        HSNCode: element?.taskTypeData?.HSNCode,
        type: element?.type,
        dueDate: dayjs(element?.dueDate).format("YYYY-MM-DD") || "-",
        fee: element?.fee || "-",
        financialYear: element?.financialYear || "-",
        isOverDue: element?.isOverDue ? 'YES' : "NO",




        status: element?.status
      }
    })


    worksheet.columns = [
      { header: 'Task Name', key: 'taskName', width: 50 },
      { header: 'Remark', key: 'remarks', width: 50 },

      { header: 'Client Name', key: 'clientName', width: 30 },
      { header: 'Group name', key: 'groupName', width: 50 },
      { header: 'isInvoiceGenerated.', key: 'isInvoiceGenerated', width: 50 },
      { header: 'Month Name', key: 'monthName', width: 50 },
      { header: 'Month Quaters', key: 'monthQuaters', width: 50 },
      { header: 'HSN Code', key: 'HSNCode', width: 50 },
      { header: 'Type', key: 'type', width: 50 },
      { header: 'Due Date', key: 'dueDate', width: 50 },
      { header: 'Fees', key: 'fee', width: 50 },
      { header: 'Financial Year', key: 'financialYear', width: 50 },
      { header: 'Is Over Due', key: 'isOverDue', width: 50 },
      { header: 'Status', key: 'status', width: 50 },
    ];

    const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFB6D7A8' }, // Light green
            };
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

         worksheet.autoFilter = {
            from: 'A1',
            to: 'I1',
        };

    apiData.forEach(item => {
      worksheet.addRow(item);
    });


    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'api_data.xlsx';
      link.click();
    });
  };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <div className="grid grid-cols-1 justify-between items-center space-y-1.5">
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
                      className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
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
              <div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${errors.status ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Status"
                       showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())}
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      {["Assigned", "Accepted", "reAssign_to_other", "Pending_at_client", "Pending_at_department", "Pending_at_colleague", "Pending_at_manager", "Work_in_progress", "Pending_for_approval", "Pending_for_fees", "Completed", "Task_Stop"]?.map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("taskType", "");
                  setValue("groupType", "");
                  setValue("clientList", "");
                  setValue("PDDepartmentId", "");
                  setValue("status", "");
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              <button
                onClick={() => {
                  generateExcel();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export</span>
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
                  Task Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">Remarks</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Client Name</th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Group name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">isInvoiceGenerated</div>
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">Month Name</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Month Quaters</th>
                <th className="border-none p-2 whitespace-nowrap text-center">HSN Code</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Type</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Due Date</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Fees</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Financial Year</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Is Over Due</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Created At</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Created By</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            {
              taskStatusReportFunc_loading ?
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={20}
                    className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr> :
                <tbody>
                  {taskStatusReportList &&
                    taskStatusReportList?.length > 0 ? (
                    taskStatusReportList?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {index + 1 + ((currentPage - 1) * pageSize)}
                        </td>

                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.taskName || "-"}
                        </td>

                        <td className="break-words border-none whitespace-normal  px-2 py-3 max-w-[200px] ">
                          {element?.remarks || "-"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.clientData?.fullName || "-"}
                        </td>

                        {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                      {element?.officeEmail || "-"}
                    </td> */}
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.groupData?.fullName || "-"}
                        </td>
                        {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                      {element?.departmentData?.name || "-"}
                    </td> */}
                        {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                      {element?.designationData?.name || "-"}
                    </td> */}
                        {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                      {element?.designationData?.roleKey || "-"}
                    </td> */}

                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.isInvoiceGenerated ? "Yes" : "No"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.monthName || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.monthQuaters || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.taskTypeData?.HSNCode || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.type || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {dayjs(element?.dueDate).format("DD-MM-YYYY hh:mm a") || "-"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.fee || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.financialYear || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.isOverDue ? 'YES' : "NO"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? '-'}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          {element?.createdBy || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none px-2 py-3">
                          <span
                            className={`${getStatusStyle(element?.status)} border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status || "Unknown"}
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
                </tbody>}
          </table>
        </div>
        <CustomPagination
          totalCount={totalTaskStatusCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default TaskStatusReport;