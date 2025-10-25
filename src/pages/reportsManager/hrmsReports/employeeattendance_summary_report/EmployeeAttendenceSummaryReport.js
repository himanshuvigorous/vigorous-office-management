import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { convertMinutesToHoursAndMinutes, customDayjs, domainName, pazeSizeReport, sortByPropertyAlphabetically } from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { employePenaltyReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { penaltyTypeSearch } from "../../../global/other/interviewRoundName copy/penaltyFeatures/_penalty_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import { reportsServices2 } from "../../../../redux/_services/_reports_services2";
import { employeeAttendanceSummaryReportFunc } from "../../../../redux/_reducers/_reports_reducers2";
import { Option } from "antd/es/mentions";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";

function EmployeeAttendenceSummaryReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { employeeAttendanceSummaryReportList, employeeAttendanceSummaryReport_loading, employeeAttendanceSummaryReportCount, } = useSelector((state) => state.report2);
  const { penaltyListData, loading: penaltyListLoading } = useSelector((state) => state.penalty);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });

  const employeeId = useWatch({ control, name: "employeeId", defaultValue: '' });
  const startDate = useWatch({ control, name: "startDate", defaultValue: null, });
  const endDate = useWatch({ control, name: "endDate", defaultValue: null, });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: null, });
  const PDDepartmentId = useWatch({ control, name: 'departmentId', defaultValue: '' })
  const isResigned = useWatch({ control, name: 'isResigned', defaultValue: '' })
  const isTerminated = useWatch({ control, name: 'isTerminated', defaultValue: '' })

  const [pageSize, setPageSize] = useState(10);

  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(Number(1));
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

  const handleDepartmentChange = () => {

    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        departmentId: PDDepartmentId,
        companyId: userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      })
    );
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
    setValue('startDate', '');
    setValue('endDate', '');
  }, []);

  useEffect(() => {
    fetchPenaltyListData();
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

  const getpenalty = () => {
    const data = {
      currentPage: "",
      pageSize: "",
      reqData: {
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
      },
    };
    dispatch(penaltyTypeSearch(data));
  };

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
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        // "employeId": employeeId,
        "employeIds": [],
        "departmentId": PDDepartmentId,
        "departmentIds": [],
        "designationId": designationId,
        "designationIds": [],
        "roleKey": "",
        "isTerminated": isTerminated == 'true' ? true : isTerminated == 'false' ? false : "",
        "isResigned": isResigned == 'true' ? true : isResigned == 'false' ? false : "",
        "startDate": customDayjs(startDate),
        "endDate": customDayjs(endDate)

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
        // departmentId: departmentId ? departmentId : '',
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: false,
        isDirector: false,
      })
    )
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const fetchPenaltyListData = () => {
    dispatch(employeeAttendanceSummaryReportFunc(requestPayLoadReturn(true)));
  };

  const onChange = (e) => {
    setSearchText(e);
  }

  const handleSubmit = async () => {
    fetchPenaltyListData()
  }

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee_Attendance_Summary_Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Employee UserName", key: "empUserName", width: 30 },
      { header: "Employee Name", key: "empName", width: 30 },
      { header: "Email", key: "email", width: 20 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Department Name", key: "deptName", width: 20 },
      { header: "Designation Name", key: "desName", width: 20 },
      { header: "Holiday", key: "holidayCount", width: 15 },
      { header: "OFF", key: "offCount", width: 15 },
      { header: "Present", key: "presentCount", width: 15 },
      { header: "First Half", key: "FirstHalfCount", width: 15 },
      { header: "Second Half", key: "SecondHalfCount", width: 15 },
      { header: "isHr", key: "isHr", width: 15 },
      { header: "isTL", key: "isTl", width: 15 },
      { header: "isTerminated", key: "isTerminated", width: 15 },
      { header: "isResigned", key: "isResigned", width: 15 },
      { header: "Created At", key: "createdAt", width: 15 },
      { header: "Created By", key: "createdBy", width: 15 },

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

    const response = await reportsServices2?.employeeAttendanceSummaryReportFunc(requestPayLoadReturn(false));
    if (!employeeAttendanceSummaryReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {

      return {
        sno: index + 1,
        empUserName: data?.userName || 'N/A',

        empName: data?.fullName || 'N/A',

        email: data?.email || 'N/A',

        mobile: (data?.mobile?.code + data?.mobile?.number) || 'N/A',
        deptName: data?.departmentData?.name || 'N/A',
        desName: data?.designationData?.name || 'N/A',
        desName: data?.designationData?.name || 'N/A',
        holidayCount: data?.holidayCount || 0,
        offCount: data?.offCount || 0,
        presentCount: data?.presentCount || 0,
        FirstHalfCount: data?.firstHalfCount || 0,
        SecondHalfCount: data?.secondHalfCount || 0,
        isHr: data?.isHR ? 'Yes' : 'NO',
        isTl: data?.isTl ? 'Yes' : 'NO',
        isResigned: data?.isResigned ? 'Yes' : 'NO',
        isTerminated: data?.isTerminated ? "Yes" : 'NO',
        createdAt: dayjs(data?.createdAt).format("DD-MM-YYYY"),
        createdBy: data?.createdBy || 'N/A',
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
      link.download = "Employee_Attendance_Summary_Report.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);
    const headers = ['S.No.', 'Employee UserName', 'Employee Name', 'Email', 'Mobile', 'Department Name', 'Designation Name', 'Holiday', 'Off', 'Present', 'First Half', 'Second Half', 'isHr', 'isTl', 'CreatedAt', 'CreatedBy', 'Status'];
    const response = await reportsServices2?.employeeAttendanceSummaryReportFunc(requestPayLoadReturn(false));
    if (!employeeAttendanceSummaryReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.userName || 'N/A',

        data?.fullName || 'N/A',

        data?.email || 'N/A',

        (data?.mobile?.code + data?.mobile?.number) || 'N/A',
        data?.departmentData?.name || 'N/A',
        data?.designationData?.name || 'N/A',
        data?.designationData?.name || 'N/A',
        data?.holidayCount || 0,
        data?.offCount || 0,
        data?.presentCount || 0,
        data?.firstHalfCount || 0,
        data?.secondHalfCount || 0,
        data?.isHR ? 'Yes' : 'NO',
        data?.isTl ? 'Yes' : 'NO',
        data?.isResigned ? 'Yes' : 'NO',
        data?.isTerminated ? "Yes" : 'NO',
        dayjs(data?.createdAt).format("DD-MM-YYYY"),
        data?.createdBy || 'N/A',
        data?.status,

        // data?.employeData?.fullName || 'N/A',
        // dayjs(data?.attendanceDate).format('DD-MM-YYYY') || 'N/A',
        // dayjs(data?.checkInTime).format('HH:mm A') || 'N/A',
        // dayjs(data?.checkOutTime).format('HH:mm A') || 'N/A',
        // convertMinutesToHoursAndMinutes(data?.workedHRS) || 'N/A',
        // convertMinutesToHoursAndMinutes(data?.pendingHRS) || 'N/A',
        // convertMinutesToHoursAndMinutes(data?.overtimeHRS) || 'N/A',
        // data?.isPresentDay ? 'Present' : 'Absent'
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
    doc.save(`Employee_Attendance_Summary_Report.pdf`);
  }

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
            {/* <div className="">
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Select
                    // mode="multiple"
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

            </div> */}
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
            {/* <div>
              <Controller
                name="isResigned"
                control={control}
                rules={{}}
                render={({ field }) => (

                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Status"
                    options={[
                      { label: 'Select isResigned', value: '', },
                      { label: 'Yes', value: 'true', },
                      { value: 'false', label: 'No', },
                      
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="isTerminated"
                control={control}
                rules={{}}
                render={({ field }) => (

                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select isTerminated"
                    options={[
                      { label: 'Select isTerminated', value: '', },
                      { label: 'Yes', value: 'true', },
                      { value: 'false', label: 'No', },
                      
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div> */}
            <div>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    report={true}
                    errors={errors}
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
            <div>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    field={{
                      ...field,
                      value: field.value,
                      onChange: (val) => {
                        // Transform only here
                        const lastDate = val ? dayjs(val).endOf("month") : null;
                        field.onChange(lastDate);
                      },
                    }}
                    report={true}
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
                setValue("PdDesignationId", "");
                setValue("status", "");
                setValue("employeeId", "");
                setValue("daterange", "");
                setValue("shift", "");
                setValue("workType", "");
                setValue("startDate", '');
                setValue("endDate", '');
                setValue("issueDate", dayjs());
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
                <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap  w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Profile</span>
                  </div>

                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Employee userName
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Employee Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Email
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Mobile
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Department Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Designation Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Holiday
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  off
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Present
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  FirstHalf
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  SecondHalf
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap ">
                 Is Hr
                </th>
                  <th className="border-none p-2 whitespace-nowrap ">
                 Is TL
                </th> */}
                {/* <th className="border-none p-2 whitespace-nowrap ">
                  createdAt
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  createdBy
                </th> */}
                {/* <th className="border-none p-2 whitespace-nowrap ">
                  <div className="flex gap-1">Status</div>
                </th> */}



              </tr>
            </thead>

            {employeeAttendanceSummaryReport_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employeeAttendanceSummaryReportList &&
                  employeeAttendanceSummaryReportList?.length > 0 ? (
                  employeeAttendanceSummaryReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >

                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
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
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.userName}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.fullName}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.email}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.mobile?.code}{" "} {element?.mobile?.number}
                      </td>



                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.departmentData?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.designationData?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.holidayCount}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.offCount}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.presentCount}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.firstHalfCount}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.secondHalfCount}
                      </td>
                      {/* <td className="whitespace-nowrap  border-none p-2">
                        {element?.isHR ? 'Yes' : 'No'}
                      </td>
                       <td className="whitespace-nowrap  border-none p-2">
                        {element?.isTL ? 'Yes' : 'No'}
                      </td> */}



                      {/* <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
                      </td>
                      
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.createdBy}
                      </td> */}

                      {/* <td className="whitespace-nowrap  border-none p-2">
                        <span
                          className={`${element?.status === 'Resolved'
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status === 'Resolved' ? "Resolved" : "Pending" ?? "-"}
                        </span>
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
              </tbody>}
          </table>
        </div>
        <CustomPagination
          totalCount={employeeAttendanceSummaryReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployeeAttendenceSummaryReport;
