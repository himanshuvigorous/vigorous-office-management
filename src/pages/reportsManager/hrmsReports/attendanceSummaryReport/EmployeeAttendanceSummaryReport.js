import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { convertMinutesToHoursAndMinutes, domainName, pazeSizeReport } from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { employeeAttendanceSummaryFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { timeSlotSearch } from "../../../timeSlot/timeSlotsFeatures/_timeSlots_reducers";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";

function EmployeeAttendanceSummaryReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { employeeAttendanceSummaryReportList, employeeAttendanceSummaryFunc_loading, totalemployeeAttendanceSummaryCount, } = useSelector((state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { timeSlotsListData } = useSelector((state) => state.timeSlots);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const { departmentListData } = useSelector((state) => state.department);
  const { designationList } = useSelector((state) => state.designation);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const status = useWatch({ control, name: "status", defaultValue: "", });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: "", });
  const departmentId = useWatch({ control, name: "departmentId", });
  const isTerminated = useWatch({ control, name: "isTerminated", });
  const isResigned = useWatch({ control, name: "isResigned", });
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month"), });
  const endDate = useWatch({ control, name: "endDate", defaultValue: dayjs(), });

  const workType = useWatch({ control, name: "workType", defaultValue: "", });
  const shift = useWatch({ control, name: "shift", defaultValue: "", });
  const daterange = useWatch({ control, name: "daterange", defaultValue: "", });
  const employeeId = useWatch({ control, name: "employeeId", defaultValue: [], });

  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
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
          companyId: userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      })
    )
    setValue('startDate', dayjs().subtract(1, "month"));
    setValue('endDate', dayjs());
  }, []);
  useEffect(() => {
    fetchattendanceListData();
  }, [
    currentPage,
    debouncedFilterText,
    pageSize
  ]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const requestPayLoadReturn = (pagination = true) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: debouncedFilterText,
        sort: true,
        isPagination: pagination,
        "isTL": "",
        "isManager": "",
        "isReceptionist": "",
        "isHR": "",
        "status": status === 'true' ? true : status === 'false' ? false : '',
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
        "directorId": "",
        departmentId: departmentId,
        departmentIds: [],
        "departmentIds": [],
        designationId: designationId,
        employeIds: employeeId,
        startDate: startDate
          ? dayjs(startDate).format("YYYY-MM-DD")
          : '',
        endDate: endDate
          ? dayjs(endDate).format("YYYY-MM-DD")
          : '',
        "roleKey": "",
        "isTerminated": isTerminated == "Yes" ? true : isTerminated == "No" ? false : '',
        "isResigned": isResigned == "Yes" ? true : isResigned == "No" ? false : '',
      },
    };
  }
  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType)
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: departmentId ? departmentId : '',
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: true,
        isDirector: false,
      })
    )
  };
  const handleShiftFilter = () => {
    dispatch(
      timeSlotSearch({
        directorId: "",
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
        text: "",
        sort: true,
        status: "",
        isPagination: false,
      })
    )
  };
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const fetchattendanceListData = () => {
    dispatch(employeeAttendanceSummaryFunc(requestPayLoadReturn(true)));
  };
  const onChange = (e) => {
    setSearchText(e);
  }
  const handleSubmit = async () => {
    fetchattendanceListData()
  }
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Attendance");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Employee Name", key: "name", width: 30 },
      { header: "Date", key: "attendanceDate", width: 20 },
      { header: "Check-In Time", key: "checkInTime", width: 20 },
      { header: "Check-Out Time", key: "checkOutTime", width: 20 },
      { header: "Worked Hours", key: "workedHRS", width: 20 },
      { header: "Pending Hours", key: "pendingHRS", width: 20 },
      { header: "Overtime Hours", key: "overtimeHRS", width: 20 },
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

    const response = await reportsServices?.employeeAttendanceSummaryFunc(requestPayLoadReturn(false));
    if (!employeeAttendanceSummaryReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        name: data?.employeData?.fullName || "-",
        attendanceDate: dayjs(data?.attendanceDate).format("DD-MM-YYYY"),

        status: data?.status,
      };
    });


    // Data row styling
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
      link.download = "Employee_Attendance_Report.xlsx";
      link.click();
    });
  };
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);
    const headers = ['S.No.', 'Employee Name', 'Attendance Date', 'Check-In Time', 'Check-Out Time', 'Worked Hours', 'Pending Hours', 'Overtime Hours', 'Status'];
    const response = await reportsServices?.employeeAttendanceSummaryFunc(requestPayLoadReturn(false));
    if (!employeeAttendanceSummaryReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.employeData?.fullName || 'N/A',
        dayjs(data?.attendanceDate).format('DD-MM-YYYY') || 'N/A',
        dayjs(data?.checkInTime).format('HH:mm A') || 'N/A',
        dayjs(data?.checkOutTime).format('HH:mm A') || 'N/A',
        convertMinutesToHoursAndMinutes(data?.workedHRS) || 'N/A',
        convertMinutesToHoursAndMinutes(data?.pendingHRS) || 'N/A',
        convertMinutesToHoursAndMinutes(data?.overtimeHRS) || 'N/A',
        data?.isPresentDay ? 'Present' : 'Absent'
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
        valign: 'middle',
        halign: 'left',
      },
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    doc.save(`Attendance_Report.pdf`);
  }
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
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Department"
                    onFocus={handleEmployeeFocus}
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={departmentListData?.map((element) => ({
                      label: element.name,
                      value: element._id,
                    }))}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />

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
                          departmentId: departmentId,
                          companyId: CompanyId,
                        })
                      );
                    }}
                    className="inputAntdMultiSelectClassNameFilterReport"
                  >
                    <Select.Option value="">Select Designation</Select.Option>
                    {designationList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.name}
                      </Select.Option>
                    ))}
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
                    mode="multiple"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    className="inputAntdMultiSelectClassNameFilterReport "
                    placeholder="Select Employee"
                    onFocus={handleEmployeeFocus}
                    options={employeList?.map((element) => {
                      return {
                        label: element.fullName,
                        value: element._id,
                      }
                    })}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />


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
                    allowClear
                    // mode="multiple"
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Status"
                    options={[
                      { value: '', label: "Select Status" },
                      { value: 'true', label: "Active" },
                      { value: 'false', label: "Inactive" },
                    ]}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="isTerminated"
                control={control}
                render={({ field }) => (

                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select isTerminated"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    value={field.value || []} // ensures it's always an array
                    onChange={(val) => field.onChange(val)} // handle change properly
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="isResigned"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select isResigned"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    value={field.value || []} // ensures it's always an array
                    onChange={(val) => field.onChange(val)} // handle change properly
                  />
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
                setValue("PdCompanyId", "");
                setValue("PdDesignationId", "")
                setValue("status", "");
                setValue("employeeId", "");
                setValue("isTerminated", "");
                setValue("isResigned", "");
                setValue("startDate", dayjs().subtract(1, "month"));
                setValue("endDate", dayjs());
                handleSubmit()
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={() => {
                handleSubmit()
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
          <div className="space-y-1.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span htmlFor="pageSize" className="text-sm font-light text-gray-500">
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
                  Employee Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Email
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
                  <div className="flex gap-1">is TL</div>
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">is Hr</th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Mobile No.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Created At
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Created By
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Status
                </th>
              </tr>
            </thead>
            {employeeAttendanceSummaryFunc_loading ? (
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
                {employeeAttendanceSummaryReportList &&
                  employeeAttendanceSummaryReportList?.length > 0 ? (
                  employeeAttendanceSummaryReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.fullName}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.email}
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
                        {element?.isTL ? "Yes" : "No"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.isHR ? "Yes" : "No"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.mobile?.code + element?.mobile?.number || '-'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.createdBy}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
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
              </tbody>
            )}
          </table>
        </div>
        <CustomPagination
          totalCount={totalemployeeAttendanceSummaryCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployeeAttendanceSummaryReport;
