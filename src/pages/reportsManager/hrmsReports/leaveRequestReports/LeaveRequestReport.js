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
import { leaveRequestReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { leaveTypeSearch } from "../../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

function LeaveRequestReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { leaveRequestReportList, leaveRequestReportFunc_loading, totalleaveRequestReportCount, } = useSelector((state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { leaveListData } = useSelector((state) => state.leaveType);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const dayType = useWatch({ control, name: "dayType" });
  const status = useWatch({ control, name: "status", defaultValue: "", });
  const leaveType = useWatch({ control, name: "leaveType", defaultValue: "", });
  const isPaid = useWatch({ control, name: "isPaid", defaultValue: "", });
  const employeeId = useWatch({ control, name: "employeeId", });
  const departmentId = useWatch({ control, name: "departmentId", });
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month"), });
  const endDate = useWatch({ control, name: "endDate", defaultValue: dayjs(), });
  const [pageSize, setPageSize] = useState(10);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
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

        "text": debouncedFilterText,
        "status": status,
        "sort": true,
        "isPagination": pagination,
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


        "employeId": '',
        "employeIds": employeeId ? employeeId : [],
        "startDate": startDate ? dayjs(startDate).format("YYYY-MM-DD") : '',
        "endDate": endDate ? dayjs(endDate).format("YYYY-MM-DD") : '',
        "type": dayType ? [dayType] : [],
        "startDateBreakDown": "",
        "endDateBreakDown": "",
        departmentIds: departmentId ? [departmentId] : [],

        "leaveTypeId": "",
        "leaveTypeIds": (leaveType && leaveType?.length > 0) ? leaveType : [],
        "isPaid": isPaid == "Yes" ? true : false,


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
      leaveTypeSearch({
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
    dispatch(leaveRequestReportFunc(requestPayLoadReturn(true)));
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
      { header: "Date of Application", key: "createdAt", width: 10 },
      { header: "Employee Name", key: "name", width: 30 },
      { header: "Leave Type", key: "leaveType", width: 20 },
      { header: "Start Date", key: "startDate", width: 20 },
      { header: "End Date", key: "enddate", width: 20 },

      { header: "Paid", key: "isPaid", width: 20 },
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

    const response = await reportsServices?.leaveRequestReportFunc(requestPayLoadReturn(false));
    if (!leaveRequestReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        createdAt: dayjs(data?.createdAt).format('DD-MM-YYYY hh:mm a'),
        name: data?.employeData?.fullName || "-",
        leaveType: data?.leaveType,

        startDate: dayjs(data?.startDate).format("DD-MM-YYYY"),

        enddate: dayjs(data?.endDate).format("DD-MM-YYYY"),
        // dayType: data?.type,
        isPaid: data?.isPaid ? "Yes" : "No",
        // startDateBreakDown: data?.startDateBreakDown,
        // endDateBreakDown: data?.endDateBreakDown,
        status: data?.status,
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
      link.download = "Employee_Leave_Report.xlsx";
      link.click();
    });
  };
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);

    const headers = ['S.No.', 'Date Of Application', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Paid', 'Status'];
    const response = await reportsServices?.leaveRequestReportFunc(requestPayLoadReturn(false));
    if (!leaveRequestReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        dayjs(data?.createdAt).format('DD-MM-YYYY hh:mm a'),
        data?.employeData?.fullName || "-",
        data?.leaveType,
        dayjs(data?.startDate).format("DD-MM-YYYY"),
        dayjs(data?.endDate).format("DD-MM-YYYY"),

        data?.isPaid ? "Yes" : "No",
        data?.status,
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
    doc.save(`Leave_Report.pdf`);
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
                        <ListLoader/>
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
                name="dayType"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Type"
                    options={[
                      { label: 'Multiple Day', value: 'Multiple', },
                      { value: 'Single', label: 'Single Day', },
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="leaveType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Leave Type"
                    onFocus={handleShiftFilter}
                    options={leaveListData?.map((shift) => {
                      return {
                        value: shift?._id,
                        label: shift?.name,
                      };
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
                    mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select status"
                    options={[
                      { value: "Pending", label: "Pending" },
                      { value: "Approved", label: "Approved" },
                      { value: "Rejected", label: "Rejected" },
                      { value: "Cancelled", label: "Cancelled" },
                    ]}
                    value={field.value || []} // ensures it's always an array
                    onChange={(val) => field.onChange(val)} // handle change properly
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="isPaid"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select isPaid"
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
                setValue("departmentId", '');
                setValue("employeeId", "");
                setValue("status", "");
                setValue("dayType", "");
                setValue("leaveType", "");
                setValue("isPaid", "");
                setValue("startDate", dayjs().subtract(1, "month"));
                setValue("endDate", dayjs());
                handleSubmit()
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white">
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
          <div className="space-y-1.5 sm:flex grid grid-cols-1 justify-between items-center">
            <div className="flex py-1 items-center gap-2">
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
        <div className="bg-white w-full overflow-x-auto mt-1 rounded-xl shadow-sm">
          <table className="w-full max-w-full rounded-xl overflow-x-auto border-collapse">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[13px] bg-header text-white font-[600] h-[45px]">
                <th className="border-none px-4 py-3 whitespace-nowrap text-center w-[60px]">
                  S.No.
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-left w-[140px]">
                  <div className="flex items-center">
                    <span>Date Of Application</span>
                  </div>
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-left min-w-[180px]">
                  Employee Name
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-left min-w-[140px]">
                  Leave Type
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-center min-w-[120px]">
                  Start Date
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-center min-w-[120px]">
                  End Date
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-left w-[250px] min-w-[250px] max-w-[250px]">
                  <div className="flex items-center">
                    <span>Reason</span>
                  </div>
                </th>
                {/* <th className="border-none px-4 py-3 whitespace-nowrap text-center">
                  Type
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-center">
                  Start Date Break Down
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-center">
                  End Date Break Down
                </th> */}
                <th className="border-none px-4 py-3 whitespace-nowrap text-center min-w-[100px]">
                  Paid / UnPaid
                </th>
                <th className="border-none px-4 py-3 whitespace-nowrap text-center min-w-[100px]">Status</th>
              </tr>
            </thead>
            {leaveRequestReportFunc_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {leaveRequestReportList && leaveRequestReportList?.length > 0 ? (
                  leaveRequestReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] hover:bg-gray-50 ${index % 2 === 0 ? "bg-[#f8f9fa]" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-4 py-3">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-4 py-3 font-medium">
                        {element?.employeData?.fullName || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap text-left border-none px-4 py-3">
                        {element?.leaveType || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {moment(element?.startDate).format("DD-MM-YYYY") || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {moment(element?.endDate).format("DD-MM-YYYY") || 'N/A'}
                      </td>
                      <td className="w-[250px] min-w-[250px] max-w-[250px] text-left border-none px-4 py-3">
                        <Tooltip 
                          title={element?.reason || 'N/A'} 
                          placement="topLeft"
                          overlayStyle={{ maxWidth: '500px' }}
                        >
                          <div className="truncate cursor-help">
                            {element?.reason || 'N/A'}
                          </div>
                        </Tooltip>
                      </td>
                      {/* <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {element?.type || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {element?.startDateBreakDown || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {element?.endDateBreakDown || 'N/A'}
                      </td> */}
                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        <span className={`${element?.isPaid ? 'text-green-600' : 'text-red-600'} font-medium`}>
                          {(element?.isPaid ? 'Paid' : 'UnPaid') || 'N/A'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap text-center border-none px-4 py-3">
                        {<span
                          className={`${element?.status === "Approved"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : element?.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : element?.status === "Rejected"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : element?.status === "Cancelled"
                                  ? "bg-gray-100 text-gray-800 border-gray-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            } border px-3 py-1 rounded-full text-xs font-medium`}
                        >
                          {element?.status ? element.status : "N/A"}
                        </span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={9}
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
          totalCount={totalleaveRequestReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default LeaveRequestReport;