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
import { employePenaltyReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import { penaltyTypeSearch } from "../../../global/other/interviewRoundName copy/penaltyFeatures/_penalty_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

function EmployePenaltyReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { employePenaltyReportList, employePenaltyReportFunc_loading, totalpenaltyReportCount, } = useSelector((state) => state.reports);
  const { penaltyListData, loading: penaltyListLoading } = useSelector((state) => state.penalty);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const status = useWatch({ control, name: "status", defaultValue: "", });
  const penaltyId = useWatch({ control, name: "penaltyId", defaultValue: "", });
  const employeeId = useWatch({ control, name: "employeeId", defaultValue: '' });
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month"), });
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
        "employeId": employeeId,
        "employeIds": [],
        "penaltyId": penaltyId,
        "penaltyIds": [],
        "status": status ? [status] : [],
        "startDate": startDate
          ? dayjs(startDate).format("YYYY-MM-DD")
          : '',
        "endDate": endDate
          ? dayjs(endDate).format("YYYY-MM-DD")
          : '',
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
    dispatch(employePenaltyReportFunc(requestPayLoadReturn(true)));
  };

  const onChange = (e) => {
    setSearchText(e);
  }

  const handleSubmit = async () => {
    fetchPenaltyListData()
  }

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Attendance");

    worksheet.columns = [
      { header: 'S.No.', key: 'sno', width: 10 },
      { header: 'Date', key: 'date', width: 25 },
      { header: 'Department Name', key: 'departmentName', width: 25 },
      { header: 'Employee Name', key: 'employeeName', width: 25 },
      { header: 'Penalty Name', key: 'penaltyName', width: 25 },
      { header: 'Penalty Amount', key: 'penaltyAmount', width: 15 },
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

    const response = await reportsServices?.employePenaltyReportFunc(requestPayLoadReturn(false));


    if (!employePenaltyReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        date: data?.issueDate
          ? dayjs(data.issueDate).format("DD-MM-YYYY hh:mm a")
          : "-",
        departmentName: data?.employeData?.departmentName || 'NA',
        employeeName: data?.employeData?.fullName || '-',
        penaltyName: data?.penaltyName || "-",
        penaltyAmount: data?.amount || "-"
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
      link.download = "Employee_Penalty_Report.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);
    const headers = ['S.No.', "date", 'Department Name', 'Employee Name', 'Penalty Name', "Penalty Amount"];
    const response = await reportsServices?.employePenaltyReportFunc(requestPayLoadReturn(false));
    if (!employePenaltyReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1, // S.No
        data?.issueDate
          ? dayjs(data.issueDate).format("DD-MM-YYYY hh:mm a")
          : "-", // Issue Date
        data?.employeData?.departmentName || 'NA', // Department
        data?.employeData?.fullName || '-', // Employee Name
        data?.penaltyName || "-", // Penalty Name
        data?.amount || "-" // Amount
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
    doc.save(`Employee_Penalty_Report.pdf`);
  }

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 2xl:flex justify-between items-center">
          <div className="sm:flex  grid grid-cols-1 gap-1.5 sm:flex-wrap text-[14px]">
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
            </div> */}
            <div className="">
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
            </div>
            <div>
              <Controller
                name="penaltyId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="inputAntdMultiSelectClassNameFilterReport "
                    onFocus={() => getpenalty()}
                    placeholder="Select penalty Name "
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }                  >
                    <Select.Option value="">Select Penalty Name </Select.Option>
                    {penaltyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(penaltyListData)?.map((element, index) => (
                      <Select.Option key={index} value={element?._id}>
                        {element?.name}
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
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Status"
                    options={[
                      { label: 'Select Status', value: '', },
                      { label: 'Pending', value: 'Pending', },
                      { value: 'Resolved', label: 'Resolved', },
                      { value: 'WaivedOff', label: 'WaivedOff', },
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
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
                    size={"middle"}
                    defaultValue={dayjs().subtract(1, "month")}
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
                    size={"middle"}
                    defaultValue={dayjs()}
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
                setValue("penaltyId", "");
                setValue("status", "");
                setValue("employeeId", "");
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
          <table className="w-full max-w-full rounded-xl overflow-x-auto table-fixed">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap text-left w-[60px]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-left w-[180px]">
                  Date
                </th>
                <th className="border-none p-2 whitespace-nowrap text-left w-[200px]">
                  Department Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-left w-[200px]">
                  Employee Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-left w-[200px]">
                  Penalty Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-left w-[120px]">
                  Penalty Amount
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap text-center">
                  Reason
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  createdAt
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  createdBy
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">Status</div>
                </th> */}



              </tr>
            </thead>

            {employePenaltyReportFunc_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employePenaltyReportList &&
                  employePenaltyReportList?.length > 0 ? (
                  employePenaltyReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >

                      <td className="whitespace-nowrap text-left border-none p-2">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>

                      <td className="whitespace-nowrap text-left border-none p-2">
                        <div className="max-w-[180px] truncate">
                          {element?.issueDate
                            ? dayjs(element.issueDate).format("DD-MM-YYYY hh:mm a")
                            : "-"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap text-left border-none p-2">
                        <Tooltip title={element.employeData?.departmentName || 'NA'}>
                          <div className="max-w-[200px] truncate">
                            {element.employeData?.departmentName || 'NA'}
                          </div>
                        </Tooltip>
                      </td>

                      <td className="whitespace-nowrap text-left border-none p-2">
                        <Tooltip title={element.employeData?.fullName || '-'}>
                          <div className="max-w-[200px] truncate">
                            {element.employeData?.fullName || '-'}
                          </div>
                        </Tooltip>
                      </td>

                      <td className="whitespace-nowrap text-left border-none p-2">
                        <Tooltip title={element?.penaltyName || "-"}>
                          <div className="max-w-[200px] truncate">
                            {element?.penaltyName || "-"}
                          </div>
                        </Tooltip>
                      </td>

                      <td className="whitespace-nowrap text-left border-none p-2">
                        <div className="max-w-[120px] truncate">
                          {Number(element.amount).toFixed(2) || "-"}
                        </div>
                      </td>
                      {/* 
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.reason}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.createdBy}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
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
          totalCount={totalpenaltyReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployePenaltyReport;
