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
import { clientReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { Option } from "antd/es/mentions";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { FaEye } from "react-icons/fa";
import { clientGrpSearch, getClientGroupList } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import * as ExcelJS from 'exceljs';
import jsPDF from "jspdf";
import { Group } from "antd/es/avatar";
import Loader2 from "../../../../global_layouts/Loader/Loader2";

function ClientReport() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { clientReportList, totalclientReportCount, clientReportFunc_loading } = useSelector(
    (state) => state.reports
  );
  const { clientGroupList, totalClientGroupCount, loading } = useSelector(state => state.clientGroup)
  const { employeList } = useSelector((state) => state.employe);

  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const pageSize = 10;
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
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

  const clientGroup = useWatch({
    control,
    name: "clientGroup",
  });



  useEffect(() => {
    fetchClientGroupList()
  }, [currentPage, BranchId, CompanyId])


  const fetchClientGroupList = () => {
    const reqData = {


      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          :
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
      "directorId": "",
      "text": "",
      "sort": true,
      "status": true,
      "isPagination": false,

    }
    dispatch(clientGrpSearch(reqData))
  }


 


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
        companyId: userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
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
        companyId: userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" ||
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
    fetchClientReport(debouncedFilterText);
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
    clientGroup,
    department,
  ]);

  // useEffect(() => {
  //     fetchEmployeListData();
  // }, [

  // ]);

  // const fetchEmployeListData = () => {
  //     const reqPayload = {
  //       text: "",
  //       status: true,
  //       sort: true,
  //       isTL: "",
  //       isHR: "",
  //       isPagination: true,
  //       departmentId: "",
  //       designationId: "",
  //       companyId: userInfoglobal?.companyId,
  //       branchId: userInfoglobal?.branchId,
  //     };

  //     dispatch(employeSearch(reqPayload));
  //   };

  const fetchClientReport = (debouncedFilterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        // "companyId": "",
        // "directorId": "",
        // "branchId": "",
        // "organizationId": "",
        // "departmentId": "",
        // "industryId": "",
        // "groupId": "",
        // "taskId": "",
        // "text": "",
        // "sort": true,
        // "status": "",
        // "isPagination": true

        text: "",
        isTL: isTL === "YES" ? true : isTL === "NO" ? false : "",
        isManager: "",
        isReceptionist: "",
        isHR: isHR === "YES" ? true : isHR === "NO" ? false : "",
        status: Status === "Active" ? true : Status === "InActive" ? false : "",
        sort: true,
        isPagination: true,

        directorId: "",

        departmentId: department,
        groupId: clientGroup,
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
      },
    };
    dispatch(clientReportFunc(reqData));
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
    ;
    setSearchText(e);
  };

  const [taskData, setTaskData] = useState("");
  const [viewTask, setViewTask] = useState(false);
  const handleTaskView = (data) => {
    setTaskData(data);

    setViewTask((prev) => !prev);
  };


  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('API Data');
    const apiData = clientReportList?.map((element) => {
      return {
        name: element?.fullName,
        group: element?.clientGroupData?.fullName || "-",
        email: element?.email,
        mobileNo: `${element?.mobile?.code || "-"}  ${element?.mobile?.number || "-"}`,
        gstNumber: element?.clientProfile?.GSTNumber,
        panNumber: element?.clientProfile?.penNumber,
        aadharNumber: element?.clientProfile?.adharNumber,
        dateOfJoining: `${dayjs(element.clientProfile.dateOfJoining).format("YYYY-MM-DD")}`,
        // taskName:element?.hasTask?.taskName,
        // fee:element?.hasTask?.fee,
        // dueDate:dayjs(element?.hasTask?.dueDate).format("YYYY-MM-DD") || "-",
        // financialYear:element?.hasTask?.financialYear || "-",
        // monthName:element?.hasTask?.monthName || "-",
        // monthQuaters:element?.hasTask?.monthQuaters || "-",
        // type:element?.hasTask?.type || "-" || "-",
        // taskStatus:element?.hasTask?.status || "-" || "-",



        status: element?.status ? "Active" : "Inactive" ?? "-"
      }
    })


    worksheet.columns = [
      { header: 'Client Name', key: 'name', width: 50 },
      { header: 'Group', key: 'group', width: 30 },
      { header: 'Email', key: 'email', width: 50 },
      { header: 'Mobile No.', key: 'mobileNo', width: 50 },
      { header: 'Gst Number', key: 'gstNumber', width: 50 },
      { header: 'Pan Number', key: 'panNumber', width: 50 },
      { header: 'Aadhar Number', key: 'aadharNumber', width: 50 },
      { header: 'dateOfJoining', key: 'dateOfJoining', width: 50 },
      // { header: 'Task Name', key: 'taskName', width: 50 },
      // { header: 'Fees', key: 'fee', width: 50 },
      // { header: 'Due Date', key: 'dueDate', width: 50 },
      // { header: 'financialYear', key: 'financialYear', width: 50 },
      // { header: 'Month Name', key: 'monthName', width: 50 },
      // { header: 'monthQuaters', key: 'monthQuaters', width: 50 },
      // { header: 'Type', key: 'type', width: 50 },
      // { header: 'Task Status', key: 'taskStatus', width: 50 },
      { header: 'status', key: 'status', width: 50 },
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
          <div className="xl:flex justify-between items-center space-y-1.5">
            <div className="grid 2xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-2 flex-wrap text-[14px] rounded-md">
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
                        handleDepartmentChange(value); // Custom handler if needed
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
                  name="clientGroup"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select clientGroup"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())}
                    >
                      <Select.Option value="">Select clientGroup</Select.Option>
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
              {/* <div>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                                                }`}
                                            placeholder="Select Status"
                                            showSearch
                                        >
                                            <Select.Option value="">Select Status</Select.Option>

                                            <Select.Option value="Present"> Present </Select.Option>
                                            <Select.Option value="firstHalf">
                                                {" "}
                                                First Half{" "}
                                            </Select.Option>
                                            <Select.Option value="secondHalf">
                                                {" "}
                                                Second Half{" "}
                                            </Select.Option>
                                        </Select>
                                    )}
                                />
                            </div> */}
              {/* <div>
                <Controller
                  name="isTL"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${
                        errors.shift ? "border-[1px] " : "border-gray-300"
                      }`}
                      placeholder="Select TL"
                    >
                      <Select.Option value="">Select TL</Select.Option>
                      {["YES", "NO"]?.map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div> */}
              {/* 
              <div>
                <Controller
                  name="isHR"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${
                        errors.shift ? "border-[1px] " : "border-gray-300"
                      }`}
                      placeholder="Select HR"
                    >
                      <Select.Option value="">Select HR</Select.Option>
                      {["YES", "NO"]?.map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div> */}
              <div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${errors.shift ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Status"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())}
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      {["Active", "InActive"]?.map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>

              {/* <div>
                                <Controller
                                    name="workType"
                                    control={control}

                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            className={`${inputAntdSelectClassNameFilter} ${errors.workType ? '' : 'border-gray-300'}`}
                                            placeholder="Select Work Type"
                                        >
                                            <Select.Option value="">Select Work Type</Select.Option>
                                            {[
                                                { key: "work_from_office", value: "Work From Office" },
                                                { key: "work_from_home", value: "Work From Home" },
                                                { key: "hybrid", value: "Hybrid" },
                                                { key: "remote", value: "Remote" }
                                            ]?.map((type) => (
                                                <Select.Option key={type.key} value={type.key}>
                                                    {type.value}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div> */}
              {/* <div>
                                <Controller
                                    name="daterange"
                                    control={control}

                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            className={`${inputAntdSelectClassNameFilter} ${errors.daterange ? '' : 'border-gray-300'}`}
                                            placeholder="Select Date Range"
                                        >
                                            <Select.Option value="">Select Date Range</Select.Option>
                                            {[
                                                { key: "thisWeek", value: "This Week" },
                                                { key: "lastWeek", value: "Last Week" },
                                                { key: "lastMonth", value: "Last Month" },
                                                { key: "last3Months", value: "Last 3 Months" },
                                                { key: "last6Months", value: "last 6 Months" },
                                                { key: "lastYear", value: "Last Year" }
                                            ]?.map((type) => (
                                                <Select.Option key={type.key} value={type.key}>
                                                    {type.value}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div> */}
              <div>
                {/* <Controller
                    name="startDate"
                    control={control}
        
                    render={({ field }) => (
                      <CustomDatePicker defaultValue={dayjs().subtract(1, 'month')} size={"middle"} field={field} errors={errors} />
                    )}
                  /> */}
              </div>

              {/* <div>
                  <Controller
                    name="endDate"
                    control={control}
        
                    render={({ field }) => (
                      <CustomDatePicker defaultValue={dayjs()} size={"middle"} field={field} errors={errors} />
                    )}
                  />
                </div> */}
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("isTL", "");
                  setValue("isHR", "");
                  setValue("clientGroup", "");
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
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Group
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">Email</th>
                {/* <th className="border-none p-2 whitespace-nowrap text-center">User Name</th> */}
                {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Office Email
                </th> */}
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Mobile No.
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Department
                </th> */}
                {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Designation
                </th> */}

                {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">Role Key</div>
                </th> */}

                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">Gst Number</div>
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Pan Number
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">Aadhar Number</th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  dateOfJoining
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">createdAt</th>
                <th className="border-none p-2 whitespace-nowrap text-center">createdBy</th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Task Details
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            {clientReportFunc_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {clientReportList && clientReportList.length > 0 ? (
                  clientReportList.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
              
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.fullName || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.clientGroupData?.fullName || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.email || "-"}
                      </td>

                      {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                      {element?.userName || "-"}
                    </td> */}

                      {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                      {element?.officeEmail || "-"}
                    </td> */}
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.mobile?.code || "-"}{" "}
                        {element?.mobile?.number || "-"}
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
                        {element?.clientProfile?.GSTNumber || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.clientProfile?.penNumber || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.clientProfile?.adharNumber || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.clientProfile?.dateOfJoining
                          ? dayjs(element.clientProfile.dateOfJoining).format(
                            "DD-MM-YYYY hh:mm a"
                          )
                          : "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.createdBy || "-"}
                      </td>
                      <td className="flex justify-center  items-center">
                        <Tooltip placement="topLeft"  title={"View Task Details"}>
                          <button
                            onClick={() => {
                              handleTaskView(element);
                            }}
                            className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                            type="button"
                          >
                            <FaEye
                              className={`${" hover:text-[#337ab7] text-[#3c8dbc]"}`}
                            />
                          </button>
                        </Tooltip>
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        <span
                          className={`${element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
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

        {viewTask && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560] lg:p-20"
            onClick={handleTaskView}
          >
            <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl  m-2" onClick={(e) => {
              e.stopPropagation();

            }} >
              <table className="w-full max-w-full rounded-xl overflow-x-auto">
                <thead>
                  <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                    <th className="border-none p-2 whitespace-nowrap text-center w-[5%]">
                      S.No.
                    </th>

                    <th className="border-none p-2 whitespace-nowrap text-center">
                      Task Name
                    </th>

                    <th className="border-none p-2 whitespace-nowrap text-center">Fees</th>
                    {/* <th className="border-none p-2 whitespace-nowrap text-center">User Name</th> */}
                    {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Office Email
                </th> */}
                    <th className="border-none p-2 whitespace-nowrap text-center">
                      Due Date
                    </th>
                    {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Department
                </th> */}
                    {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Designation
                </th> */}

                    {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">Role Key</div>
                </th> */}

                    <th className="border-none p-2 whitespace-nowrap text-center">
                      <div className="flex gap-1">financialYear</div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap text-center">
                      Month Name
                    </th>
                    <th className="border-none p-2 whitespace-nowrap text-center">
                      monthQuaters
                    </th>
                    <th className="border-none p-2 whitespace-nowrap text-center">Type</th>
                    <th className="border-none p-2 whitespace-nowrap text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {taskData?.hasTask && taskData?.hasTask?.length > 0 ? (
                    taskData?.hasTask?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >

                        <td className="whitespace-nowrap text-center border-none p-2">
                          {index + 1}
                        </td>

                        <td className="whitespace-nowrap text-center border-none p-2">
                          {element?.taskName || "-"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none p-2">
                          {element?.fee || "-"}
                        </td>

                        {/* <td className="whitespace-nowrap text-center border-none p-2">
                      {element?.userName || "-"}
                    </td> */}

                        {/* <td className="whitespace-nowrap text-center border-none p-2">
                      {element?.officeEmail || "-"}
                    </td> */}
                        <td className="whitespace-nowrap text-center border-none p-2">
                          {dayjs(element?.dueDate).format("DD-MM-YYYY hh:mm a") || "-"}
                        </td>
                        {/* <td className="whitespace-nowrap text-center border-none p-2">
                      {element?.departmentData?.name || "-"}
                    </td> */}
                        {/* <td className="whitespace-nowrap text-center border-none p-2">
                      {element?.designationData?.name || "-"}
                    </td> */}
                        {/* <td className="whitespace-nowrap text-center border-none p-2">
                      {element?.designationData?.roleKey || "-"}
                    </td> */}

                        <td className="whitespace-nowrap text-center border-none p-2">
                          {element?.financialYear || "-"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none p-2">
                          {element?.monthName || "-"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none p-2">
                          {element?.monthQuaters || "-"}
                        </td>
                        <td className="whitespace-nowrap text-center border-none p-2">
                          {element?.type || "-"}
                        </td>

                        <td className="whitespace-nowrap text-center border-none p-2">
                          <span
                            className={`${element?.status === "Completed"
                              ? "bg-[#E0FFBE] border-green-500"
                              : "bg-red-200 border-red-500"
                              } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status === "Completed"
                              ? "Completed"
                              : "Pending" ?? "-"}
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
              </table>
            </div>
          </div>
        )}
        <CustomPagination
          totalCount={totalclientReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default ClientReport;
