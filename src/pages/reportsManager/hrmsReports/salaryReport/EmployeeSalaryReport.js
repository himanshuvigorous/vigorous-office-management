import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { convertMinutesToHoursAndMinutes, domainName, pazeSizeReport, sortByPropertyAlphabetically } from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { employeeSalaryReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import ListLoader from "../../../../global_layouts/ListLoader";

function EmployeeSalaryReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { employeeSalaryReportList, employeeSalaryReportFunc_loading, totalemployeeSalaryReportCount, } = useSelector((state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { timeSlotsListData } = useSelector((state) => state.timeSlots);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const status = useWatch({ control, name: "status", defaultValue: "", });
  const departmentId = useWatch({ control, name: "departmentId", });
  const employeeId = useWatch({ control, name: "employeeId", });
  const isTerminated = useWatch({ control, name: "isTerminated", });
  const isResigned = useWatch({ control, name: "isResigned", });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: "", });
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month"), });
  const amountFrom = useWatch({ control, name: "amountFrom", defaultValue: 0 });
  const amountTo = useWatch({ control, name: "amountTo", defaultValue: 0 });
  const endDate = useWatch({ control, name: "endDate", defaultValue: dayjs(), });
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(Number(1))
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
    fetchEmpSalaryListData();
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
        startDate: startDate
          ? dayjs(startDate).format("YYYY-MM-DD")
          : '',
        endDate: endDate
          ? dayjs(endDate).format("YYYY-MM-DD")
          : '',
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
        "amountFrom": Number(amountFrom) ?? '',
        "amountTo": Number(amountTo) ?? '',
        "status": '',
        departmentId: departmentId,
        employeIds: employeeId,
        "departmentIds": [],
        "designationId": designationId,
        "designationIds": [],
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

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const fetchEmpSalaryListData = () => {
    dispatch(employeeSalaryReportFunc(requestPayLoadReturn(true)));
  };
  const onChange = (e) => {
    setSearchText(e);
  }
  const handleSubmit = async () => {
    fetchEmpSalaryListData()
  }
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Salary");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 8 },
      { header: "Month", key: "month", width: 15 },
      { header: "Employee Name", key: "employeeName", width: 20 },
      { header: "Department Name", key: "departmentName", width: 20 },
      { header: "Standard Salary", key: "standardSalary", width: 18 },
      { header: "Total Days", key: "totalDays", width: 14 },
      { header: "No of Present Days", key: "presentDays", width: 20 },
      { header: "Actual Salary", key: "actualSalary", width: 18 },
      { header: "Deductions", key: "deductions", width: 16 },
      { header: "Final Salary", key: "finalSalary", width: 18 },
    ];

    const response = await reportsServices?.employeeSalaryReportFunc(requestPayLoadReturn(false));
    if (!employeeSalaryReportList && !response) return;

    const apiData = response?.data?.docs?.map((data, index) => ({
      sno: index + 1 + (currentPage - 1) * pageSize,
      month: data?.monthName || "N/A",
      employeeName: data?.employeName || "N/A",
      departmentName: data?.departmentName || "N/A",
      standardSalary: data?.standerdPayroll?.netSalary || "N/A",
      totalDays: dayjs(data?.payrollData?.endDate).diff(dayjs(data?.payrollData?.startDate), 'day') + 1,
      presentDays: data?.payrollData?.totalAttendance,
      actualSalary: data?.payrollData?.currentSalaryPerMonth || "-",
      deductions: data?.payrollData?.payrollTotal?.totalDeductions || "-",
      finalSalary: data?.payrollData?.netSalary,
    }));

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

    worksheet.autoFilter = {
      from: "A1",
      to: "K1",
    };

    // Header styling
    worksheet.getRow(1).eachCell((cell) => {
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

    // Export
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Employee_Salary_Report.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });

    doc.setFontSize(16);
    doc.text("Employee Salary Report", 40, 30);

    const headers = [
      "S.No.",
      "Month",
      "Employee Name",
      "Department Name",
      "Standard Salary",
      "Total Days",
      "No of Present Days",
      "Actual Salary",
      "Deductions",
      "Final Salary",
    ];

    const response = await reportsServices?.employeeSalaryReportFunc(requestPayLoadReturn(false));
    if (!employeeSalaryReportList && !response) return;

    const body = response?.data?.docs?.map((data, index) => ([
      index + 1,
      data?.monthName || "N/A",
      data?.employeName || "N/A",
      data?.departmentName || "N/A",
      data?.standerdPayroll?.netSalary || "N/A",
      dayjs(data?.payrollData?.endDate).diff(dayjs(data?.payrollData?.startDate), 'day') + 1,
      data?.payrollData?.totalAttendance,
      data?.payrollData?.currentSalaryPerMonth || "-",
      data?.payrollData?.payrollTotal?.totalDeductions || "-",
      data?.payrollData?.netSalary
    ]));

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 5,
        fontSize: 9,
        valign: 'middle',
        halign: 'left',
      },
      headStyles: {
        fillColor: [80, 130, 200],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("Employee_Salary_Report.pdf");
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1">
          <div className="sm:flex grid grid-cols-1 gap-1.5 sm:flex-wrap text-[14px]">
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
            <div>
              <Controller
                name="departmentId"
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
                name="PdDesignationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="inputAntdSelectClassNameFilterReport"
                    showSearch
                    placeholder="Select Designation"
                    onFocus={() => {
                      dispatch(
                        designationSearch({
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
                        })
                      );
                    }}
                    onChange={(value) => field.onChange(value)}
                    filterOption={(input, option) =>
                      String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Designation</Select.Option>
                    {designationloading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(designationList)?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      ))
                    )}
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
            {/* <div>
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
            </div> */}
            {/* <div>
              <Controller
                name="isTerminated"
                control={control}
                render={({ field }) => (

                  <Select
                    {...field}
                    
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select isTerminated"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)} 
                  />
                )}
              />
            </div> */}
            {/* <div>
              <Controller
                name="isResigned"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}

                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select isResigned"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    value={field.value || []} 
                    onChange={(val) => field.onChange(val)} 
                  />
                )}
              />
            </div> */}
            <div>
              <Controller
                name="amountFrom"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    value={field?.value}
                    onChange={(val) => field.onChange(val)}
                    className={`inputAntdMultiSelectClassNameFilterReport`}
                    placeholder="Enter amountFrom "
                  />


                )}
              />
            </div>
            <div>
              <Controller
                name="amountTo"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    value={field?.value}
                    onChange={(val) => field.onChange(val)}
                    className={`inputAntdMultiSelectClassNameFilterReport`}
                    placeholder="Enter amountTo "
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
                setValue("departmentId", "");
                setValue("PdDesignationId", "")
                setValue("amountTo", "")
                setValue("amountFrom", "")
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
          <div className="space-y-1.5 sm:flex justify-between items-center ">
            <div className="flex items-center gap-2 sm:pt-0 pt-1">
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
                  Month
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Employee Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Department Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Standard Salary
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Total Days
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  No of Present Days
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Actual Salary
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Deductions
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Final Salary
                </th>
              </tr>

            </thead>
            {employeeSalaryReportFunc_loading ? (
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
                {employeeSalaryReportList &&
                  employeeSalaryReportList?.length > 0 ? (
                  employeeSalaryReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.monthName || "N/A"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.employeName || "N/A"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.departmentName || "N/A"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.standerdPayroll?.netSalary || "N/A"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {(dayjs(element?.payrollData?.endDate).diff(dayjs(element?.payrollData?.startDate), 'day') + 1) || "N/A"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.payrollData?.totalAttendance}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.payrollData?.currentSalaryPerMonth || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.payrollData?.payrollTotal?.totalDeductions || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.payrollData?.netSalary}
                      </td>
                      {/* <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.isTL ? "Yes" : "No"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-2 py-3">
                        {element?.isHR ? "Yes" : "No"}
                      </td> */}

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
          totalCount={totalemployeeSalaryReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployeeSalaryReport;
