import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { convertMinutesToHoursAndMinutes, domainName, pazeSizeReport, sortByPropertyAlphabetically } from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Flex, Rate, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { employeePerformanceFunc } from "../../../../redux/_reducers/_reports_reducers";
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

function EmployePerformanceReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { employeePerformanceList, employeePerformance_loading, totalemployeePerformanceReportCount } = useSelector((state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);
  const { designationList ,loading:designationloading} = useSelector((state) => state.designation);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: "", });
  const employeeId = useWatch({ control, name: "employeeId", defaultValue: [], });
  const status = useWatch({ control, name: "status", defaultValue: "", });
  const averageTaskRating = useWatch({ control, name: "averageTaskRating", defaultValue: "", });
  const departmentId = useWatch({ control, name: "departmentId", });
  const directorId = useWatch({ control, name: "PDDirectorId", defaultValue: "", });
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
    fetchPerformanceListData();
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
        departmentIds: [],
        departmentId: departmentId,

        "isTL": "",
        "isManager": "",
        "isReceptionist": "",
        "isHR": "",
        employeIds: employeeId,
        "status": status == "true" ? true : status == "false" ? false : '',
        "directorId": "67b30b81551ce7595c5c2d88",
        "designationId": designationId,
        "departmentIds": [],
        "roleKey": "",
        "averageTaskRating": averageTaskRating,
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
        isBranch: false,
        isDirector: false,
      })
    )
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const fetchPerformanceListData = () => {
    dispatch(employeePerformanceFunc(requestPayLoadReturn(true)));
  };
  const onChange = (e) => {
    setSearchText(e);
  }
  const handleSubmit = async () => {
    fetchPerformanceListData()
  }
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Attendance");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Employee Name", key: "name", width: 30 },
      { header: "Department", key: "departmentName", width: 20 },
      { header: "Task Completed", key: "taskCompleted", width: 20 },
      { header: "Average Rating", key: "avRating", width: 20 },
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

    const response = await reportsServices?.employeePerformanceFunc(requestPayLoadReturn(false));
    if (!employeePerformanceList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        name: data?.fullName || "N/A",
        departmentName: data?.departmentData?.name || "N/A",
        taskCompleted: data?.taskCompleted,
        avRating: data?.averageTaskRating,
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
      link.download = "Employe_Performance_Report.xlsx";
      link.click();
    });
  };
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);
    const headers = ['S.No.', 'Employee Name', "Department Name", 'Total Task Completed', 'Average Task Rating'];
    const response = await reportsServices?.employeePerformanceFunc(requestPayLoadReturn(false));
    if (!employeePerformanceList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.fullName || "N/A",
        data?.departmentData?.name || "N/A",
        data?.taskCompleted,
        data?.averageTaskRating,
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
    doc.save(`Employe_Performance_Report.pdf`);
  }
  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 2xl:flex justify-between items-center">
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
                name="averageTaskRating"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Rating"
                    options={[
                      { label: '0', value: 0 },
                      { label: '1', value: 1 },
                      { label: '2', value: 2 },
                      { label: '3', value: 3 },
                      { label: '4', value: 4 },
                      { label: '5', value: 5 },
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
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
                setValue("employeeId", "");
                setValue("status", "");
                setValue("averageTaskRating", "");
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

                <th className="border-none p-2 whitespace-nowrap ">
                  Employee Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">Department Name</th>
                <th className="border-none p-2 whitespace-nowrap ">Total Task Complete </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Average Task Rating
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap ">
                 Rating by reporting person 
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Rating by admin 
                </th> */}
              </tr>
            </thead>
            {employeePerformance_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
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
                      <td className="whitespace-nowrap  border-none px-2 py-3">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>

                      <td className="whitespace-nowrap  border-none px-2 py-3">
                        {element?.fullName || "N/A"}
                      </td>
                      <td className="whitespace-nowrap  border-none px-2 py-3">
                        {element?.departmentData?.name || "N/A"}
                      </td>



                      <td className="whitespace-nowrap  border-none px-2 py-3">
                        {element?.taskCompleted}
                      </td>
                      <td className="whitespace-nowrap  border-none px-2 py-3">
                        {element?.averageTaskRating}
                      </td>
                      {/* <td className="whitespace-nowrap  border-none px-2 py-3">
                        <Flex gap="middle" vertical>
                          <Rate disabled defaultValue={element?.averageTaskRating || 0} />
                        </Flex>
                      </td>
                      <td className="whitespace-nowrap  border-none px-2 py-3">
                        {element?.designationData?.roleKey || "N/A"}
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
          totalCount={totalemployeePerformanceReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployePerformanceReport;