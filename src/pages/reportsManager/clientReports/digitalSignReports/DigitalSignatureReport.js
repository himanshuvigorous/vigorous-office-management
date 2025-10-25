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
import { digitalSignReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { Option } from "antd/es/mentions";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { clientSearch, getClientList } from "../../../client/clientManagement/clientFeatures/_client_reducers";
import * as ExcelJS from 'exceljs';
import jsPDF from "jspdf";
import Loader2 from "../../../../global_layouts/Loader/Loader2";


function DigitalSignatureReport() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { digitalSignReportList, totalDigitalSignReportCount, digitalSignReportFunc_loading } = useSelector(
    (state) => state.reports
  );

  const { clientList, totalCompanyCount, loading } = useSelector(
    (state) => state.client
  );

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
  const ClientList = useWatch({
    control,
    name: "clientList",
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

  useEffect(() => {
    fetchDigitalSignData(debouncedFilterText);
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
    designation,
    department,
    ClientList,
  ]);

  const fetchDigitalSignData = (debouncedFilterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        //     "companyId": "",
        // "directorId": "",
        // "branchId": "",
        // "clientId":"",
        // "text" : "",
        // "sort": true,
        // "status": "",
        // "isPagination": true
        text: "",
        status: Status === "Active" ? true : Status === "InActive" ? false : "",
        sort: true,
        isPagination: true,
        directorId: "",
        departmentId: department,
        designationId: designation,

        clientId: ClientList,
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
    dispatch(digitalSignReportFunc(reqData));
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
          status: true, isPagination: false,
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

      text: "",
      sort: true,
      status: true,
      isPagination: false,

    };
    dispatch(clientSearch(reqData));
  };


  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('API Data');
    const apiData = digitalSignReportList?.map((element) => {
      return {
        name: element?.name,
        startDate: dayjs(element?.startDate).format("YYYY-MM-DD"),
        expiryDate: dayjs(element?.expiryDate).format("YYYY-MM-DD"),





        status: element?.status ? "Active" : "Inactive" ?? "-"
      }
    })


    worksheet.columns = [
      { header: 'Client Name', key: 'name', width: 50 },
      { header: 'Start Date', key: 'startDate', width: 50 },

      { header: 'Expiry Date', key: 'expiryDate', width: 30 },



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
          <div className="grid grid-cols-1 justify-between items-center space-y-1.5">
            <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2 flex-wrap text-[14px] rounded-md">
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
                  setValue("designation", "");
                  setValue("PDDepartment", "");
                  setValue("clientList", '')
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
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  Start Date
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap">User Name</th> */}
                {/* <th className="border-none p-2 whitespace-nowrap">
                  Office Email
                </th> */}
                <th className="border-none p-2 whitespace-nowrap">
                  Expiry Date
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  createdAt
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  createdBy
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  Status
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap">
                  Department
                </th> */}
                {/* <th className="border-none p-2 whitespace-nowrap">
                  Designation
                </th> */}
                {/* <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex gap-1">Role Key</div>
                </th> */}
              </tr>
            </thead>
            {digitalSignReportFunc_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {digitalSignReportList && digitalSignReportList?.length > 0 ? (
                  digitalSignReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
         
                      <td className="whitespace-nowrap border-none px-2 py-3">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap border-none px-2 py-3">
                        {element?.name || "-"}
                      </td>

                      <td className="whitespace-nowrap border-none px-2 py-3">
                        {dayjs(element?.startDate).format("DD-MM-YYYY") || "-"}
                      </td>
                      {/* <td className="whitespace-nowrap border-none px-2 py-3">
                      {element?.userName || "-"}
                    </td> */}

                      {/* <td className="whitespace-nowrap border-none px-2 py-3">
                      {element?.officeEmail || "-"}
                    </td> */}
                      <td className="whitespace-nowrap border-none px-2 py-3">
                        {dayjs(element?.expiryDate).format("DD-MM-YYYY") || "-"}
                      </td>
                      <td className="whitespace-nowrap border-none px-2 py-3">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || "-"}
                      </td>
                      <td className="whitespace-nowrap border-none px-2 py-3">
                        {element?.createdBy || "-"}
                      </td>
                      <td className="whitespace-nowrap border-none px-2 py-3">
                        <span
                          className={`${element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
                        </span>
                      </td>

                      {/* <td className="whitespace-nowrap border-none px-2 py-3">
                      {element?.departmentData?.name || "-"}
                    </td> */}
                      {/* <td className="whitespace-nowrap border-none px-2 py-3">
                      {element?.designationData?.name || "-"}
                    </td> */}
                      {/* <td className="whitespace-nowrap border-none px-2 py-3">
                      {element?.designationData?.roleKey || "-"}
                    </td> */}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={15}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        <CustomPagination
          totalCount={totalDigitalSignReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default DigitalSignatureReport;
