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
import {
  employeePerformanceFunc,
  employeReportFunc,
} from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { Option } from "antd/es/mentions";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import * as ExcelJS from 'exceljs';
import jsPDF from "jspdf";
import Loader2 from "../../../../global_layouts/Loader/Loader2";

function EmployePerformanceReport() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaveRequestReportList, totalemployeeAttendanceReportCount } =
    useSelector((state) => state.reports);
  const { employeePerformanceList, totalemployeeReportCount, employeePerformance_loading } = useSelector(
    (state) => state.reports
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
  const rating = useWatch({
    control,
    name: "rating",
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

   useEffect(() => {
   handleDepartmentChange();
  }, []);

  const handleDepartmentChange = (event) => {
    setValue("PDDepartmentId", event);
    setValue("PDDesignationId", "");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        departmentId: '',
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
    fetchEmployeePerformance(debouncedFilterText);
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
    rating,
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

  const fetchEmployeePerformance = (debouncedFilterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: "",
        isTL: isTL === "YES" ? true : isTL === "NO" ? false : "",
        isManager: "",
        isReceptionist: "",
        isHR: isHR === "YES" ? true : isHR === "NO" ? false : "",
        status: Status === "Active" ? true : Status === "InActive" ? false : "",
        sort: true,
        isPagination: true,
        averageTaskRating: rating === '' ? '' : Number(rating),
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
      },
    };
    dispatch(employeePerformanceFunc(reqData));
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


  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('API Data');
    const apiData = employeePerformanceList?.map((element) => {
      return {
        name: element?.fullName,
        email: element?.email,
        userName: element?.userName,
        officeEmail: element?.officeEmail || "-",
        mobileNo: `${element?.mobile?.code || "-"} ${element?.mobile?.number || "-"}`,
        department: element?.departmentData?.name || "-",
        designation: element?.designationData?.name || "-",
        roleKey: element?.designationData?.roleKey || "-",
        averageRating: element?.averageTaskRating || 0,
        isTL: element?.isTL ? "Yes" : "No",
        isHR: element?.isHR ? "Yes" : "No",
        status: element?.status ? "Active" : "Inactive" ?? "-"
      }
    })


    worksheet.columns = [
      { header: 'Employee Name', key: 'name', width: 50 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'User Name', key: 'userName', width: 50 },
      { header: 'Office Email', key: 'officeEmail', width: 50 },
      { header: 'Mobile No.', key: 'mobileNo', width: 50 },
      { header: 'Department', key: 'department', width: 50 },
      { header: 'Designation', key: 'designation', width: 50 },
      { header: 'Role Key', key: 'roleKey', width: 50 },
      { header: 'Average Rating', key: 'averageRating', width: 50 },
      { header: 'is TL', key: 'isTL', width: 50 },
      { header: 'is Hr', key: 'isHR', width: 50 },
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
          <div className="space-y-1.5">
            <div className="grid 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-2 flex-wrap text-[14px] rounded-md">
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
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
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
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
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
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Designation"
                       showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    >
                      <Select.Option value="">Select Designation</Select.Option>
                      {designationList?.map((element) => (
                        <Select.Option value={element?._id}>
                          {" "}
                          {element?.name}{" "}
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
              <div>
                <Controller
                  name="isTL"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${errors.shift ? "border-[1px] " : "border-gray-300"
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
              </div>
              <div>
                <Controller
                  name="isHR"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${errors.shift ? "border-[1px] " : "border-gray-300"
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
              </div>
              <div>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${errors.shift ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Rating"
                    >
                      <Select.Option value="">Select Rating</Select.Option>
                      {["1", "2", "3", "4", "5"]?.map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
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
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("isTL", "");
                  setValue("isHR", "");
                  setValue("designation", "");
                  setValue("PDDepartmentId", "");
                  setValue("status", "");
                  setValue("rating", "");
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
                  Employee Name
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">Email</th>
                <th className="border-none p-2 whitespace-nowrap text-center">User Name</th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Office Email
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Mobile No.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Department
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Designation
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">Role Key</div>
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">averageTaskRating</div>
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">is TL</div>
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">is Hr</th>
                <th className="border-none p-2 whitespace-nowrap text-center">createdAt</th>
                <th className="border-none p-2 whitespace-nowrap text-center">createdBy</th>
                <th className="border-none p-2 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            {employeePerformance_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employeePerformanceList && employeePerformanceList?.length > 0 ? (
                  employeePerformanceList?.map((element, index) => (
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
                        {element?.email || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.userName || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.officeEmail || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.mobile?.code || "-"}{" "}
                        {element?.mobile?.number || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.departmentData?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.designationData?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.designationData?.roleKey || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.averageTaskRating ? Array.from(
                          { length: element?.averageTaskRating || 0 },
                          (_, i) => (
                            <span key={i}>⭐</span>
                          )
                        ) : '0'}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.isTL ? "Yes" : "No"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.isHR ? "Yes" : "No"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.createdBy || "-"}
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
        <CustomPagination
          totalCount={totalemployeeAttendanceReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        
      </div>
    </GlobalLayout>
  );
}

export default EmployePerformanceReport;
