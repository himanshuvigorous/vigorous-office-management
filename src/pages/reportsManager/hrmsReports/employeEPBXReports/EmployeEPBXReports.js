import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Collapse, Select, Tooltip, Tag } from "antd";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs";
import dayjs from "dayjs";
import { MdKeyboardArrowDown, MdPhone, MdEmail, MdChair } from "react-icons/md";

// Constants and Utilities
import { domainName, inputAntdSelectClassNameFilter, pazeSizeReport, sortByPropertyAlphabetically } from "../../../../constents/global";

// Components
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import ListLoader from "../../../../global_layouts/ListLoader";

// Redux Actions
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { employeEPBXReport } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch, getDesignationRole } from "../../../designation/designationFeatures/_designation_reducers";
import { reportsServices } from "../../../../redux/_services/_reports_services";

const { Option } = Select;

function EmployeEPBXReports() {
  const { control, formState: { errors }, setValue, reset } = useForm();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Redux Selectors
  const { 
    employeEPBXReportList, 
    employeEPBXReportFunc_loading, 
    employeEPBXReportCount 
  } = useSelector((state) => state.reports);
  
  const { employeList } = useSelector((state) => state.employe);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { designationRoleData } = useSelector((state) => state?.designation);

  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [debouncedFilterText, setDebouncedFilterText] = useState("");

  // User Info
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const urlStatus = searchParams.get('status');

  // Form Watchers
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const status = useWatch({ control, name: "status", defaultValue: urlStatus ? 'true' : '' });
  const employeeId = useWatch({ control, name: "employeeId" });
  const departmentId = useWatch({ control, name: "departmentId" });
  const designationRole = useWatch({ control, name: "designationRole" });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: "" });

  // Default payload for reset
  const getDefaultPayload = useCallback((pagination = true) => ({
    currentPage: pagination ? 1 : 1,
    pageSize: pagination ? pageSize : 1000,
    reqPayload: {
      text: "",
      status: urlStatus ? true : '',
      sort: true,
      isPagination: pagination,
      companyId: userInfoglobal?.userType === "admin" ? "" : 
                userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                userInfoglobal?.companyId,
      branchId: ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType) ? "" : 
               userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : 
               userInfoglobal?.branchId,
      employeIds: [],
      departmentId: "",
      designationId: "",
      roleKey: '',
      isTL: "",
      isManager: "",
      isHR: "",
      isReceptionist: "",
      reporting_to: '',
      departmentIds: [],
      designationIds: [],
      isTerminated: '',
      isResigned: '',
    },
  }), [userInfoglobal, pageSize, urlStatus]);

  // Current payload for normal operations
  const requestPayLoadReturn = useCallback((pagination = true) => ({
    currentPage: pagination ? currentPage : 1,
    pageSize: pagination ? pageSize : 1000,
    reqPayload: {
      text: debouncedFilterText,
      status: status === "true" ? true : status === "false" ? false : '',
      sort: true,
      isPagination: pagination,
      companyId: userInfoglobal?.userType === "admin" ? CompanyId : 
                userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                userInfoglobal?.companyId,
      branchId: ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType) ? BranchId : 
               userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : 
               userInfoglobal?.branchId,
      employeIds: employeeId ? [employeeId] : [],
      departmentId: departmentId,
      designationId: designationId,
      roleKey: designationRole || '',
      isTL: "",
      isManager: "",
      isHR: "",
      isReceptionist: "",
      reporting_to: '',
      departmentIds: [],
      designationIds: [],
      isTerminated: '',
      isResigned: '',
    },
  }), [
    currentPage, pageSize, debouncedFilterText, status, CompanyId, BranchId, 
    employeeId, departmentId, designationId, designationRole, userInfoglobal
  ]);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Initial Data Fetch
  useEffect(() => {
    if (userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") {
      dispatch(branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : 
                  userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                  userInfoglobal?.companyId,
      }));
    }
    
    dispatch(deptSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
    }));

    dispatch(getDesignationRole({ text: '' }));

    if (urlStatus) {
      setValue('status', 'true');
    }

    // Load initial data with default payload
    fetchDefaultEmployeeList();
  }, []);

  // Fetch Data when dependencies change
  useEffect(() => {
    if (currentPage === 1 && !debouncedFilterText && !status && !employeeId && !departmentId && !designationId && !designationRole && !CompanyId && !BranchId) {
      // This is essentially the default state, use default payload
      fetchDefaultEmployeeList();
    } else {
      // Use current payload for filtered searches
      fetchEmployeeList();
    }
  }, [currentPage, debouncedFilterText, pageSize, urlStatus]);

  // Data Fetching Functions
  const fetchEmployeeList = () => {
    dispatch(employeEPBXReport(requestPayLoadReturn(true)));
  };

  const fetchDefaultEmployeeList = () => {
    dispatch(employeEPBXReport(getDefaultPayload(true)));
  };

  const handleEmployeeFocus = () => {
    dispatch(employeSearch({
      companyId: userInfoglobal?.userType === "admin" ? CompanyId : 
                userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                userInfoglobal?.companyId,
      branchId: ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType) ? BranchId : 
               userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : 
               userInfoglobal?.branchId,
      departmentId: departmentId || '',
      text: "",
      sort: true,
      status: true,
      isPagination: false,
    }));
  };

  // Event Handlers
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = () => {
    setCurrentPage(1);
    fetchEmployeeList();
  };

  const handleReset = () => {
    // Reset form values
    reset({
      PDBranchId: "",
      PDCompanyId: "",
      departmentId: "",
      PdDesignationId: "",
      status: urlStatus ? 'true' : '',
      employeeId: '',
      designationRole: "",
    });
    
    // Reset search text
    setSearchText("");
    setDebouncedFilterText("");
    
    // Reset pagination
    setCurrentPage(1);
    
    // Fetch data with default payload
    fetchDefaultEmployeeList();
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee EPBX Report");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Employee Name", key: "fullName", width: 25 },
      { header: "Department Name", key: "department", width: 20 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "Seat Number", key: "seat", width: 15 },
      { header: "EPBX Number", key: "epbx", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Mobile No", key: "mobile", width: 20 },
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

    // Use default payload for exports when in reset state, otherwise use current
    const payload = (!debouncedFilterText && !status && !employeeId && !departmentId && !designationId && !designationRole && !CompanyId && !BranchId) 
      ? getDefaultPayload(false) 
      : requestPayLoadReturn(false);

    const response = await reportsServices?.employeEPBXReport(payload);
    if (!response?.data?.docs) return;
    
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        fullName: data?.fullName || "-",
        department: data?.departmentName || "-",
        designation: data?.designationName || "-",
        seat: data?.seatNumber || "-",
        epbx: data?.landlineNumber || "-",
        email: data?.email || "-",
        mobile: `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`
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
      to: "H1",
    };

    // Export
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Employee_EPBX_Report.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);

    const headers = ['S.No.', 'Employee Name', 'Department Name', 'Designation', 'Seat Number', 'EPBX Number', 'Email', 'Mobile No'];
    
    // Use default payload for exports when in reset state, otherwise use current
    const payload = (!debouncedFilterText && !status && !employeeId && !departmentId && !designationId && !designationRole && !CompanyId && !BranchId) 
      ? getDefaultPayload(false) 
      : requestPayLoadReturn(false);

    const response = await reportsServices?.employeEPBXReport(payload);
    if (!response?.data?.docs) return;
    
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.fullName || "-",
        data?.departmentName || "-",
        data?.designationName || "-",
        data?.seatNumber || "-",
        (data?.landlineNumber || "-"),
        data?.email || "-",
        `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`
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
    doc.save(`Employee_EPBX_Report.pdf`);
  }

  // Filter Items for Collapse
  const filterItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center space-x-2">
          <span className="text-black font-semibold">Advanced Filters</span>
          <Tag color="blue" className="ml-2">
            {employeEPBXReportCount || 0} Records
          </Tag>
        </div>
      ),
      children: (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Branch Filter */}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <Controller
                  name="PDBranchId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Branch"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      size="large"
                    >
                      <Option value="">All Branches</Option>
                      {branchList?.map((element) => (
                        <Option key={element?._id} value={element?._id}>
                          {element?.fullName}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    onFocus={() => {
                      dispatch(deptSearch({
                        text: "",
                        sort: true,
                        status: true,
                        isPagination: false,
                        companyId: userInfoglobal?.userType === "admin" ? CompanyId : 
                                  userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                                  userInfoglobal?.companyId,
                        branchId: ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType) ? BranchId : 
                                 userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : 
                                 userInfoglobal?.branchId,
                      }));
                    }}
                    placeholder="Select Department"
                    size="large"
                    loading={depLoading}
                  >
                    <Option value="">All Departments</Option>
                    {depLoading ? (
                      <Option disabled><ListLoader /></Option>
                    ) : (
                      sortByPropertyAlphabetically(departmentListData)?.map((element) => (
                        <Option key={element?._id} value={element?._id}>
                          {element?.name}
                        </Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>

            {/* Designation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <Controller
                name="PdDesignationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    showSearch
                    placeholder="Select Designation"
                    onFocus={() => {
                      dispatch(designationSearch({
                        text: "",
                        sort: true,
                        status: true,
                        isPagination: false,
                        companyId: userInfoglobal?.userType === "admin" ? CompanyId : 
                                  userInfoglobal?.userType === "company" ? userInfoglobal?._id : 
                                  userInfoglobal?.companyId,
                        branchId: ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType) ? BranchId : 
                                 userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : 
                                 userInfoglobal?.branchId,
                      }));
                    }}
                    filterOption={(input, option) =>
                      String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                    }
                    size="large"
                    loading={designationloading}
                  >
                    <Option value="">All Designations</Option>
                    {designationloading ? (
                      <Option disabled><ListLoader /></Option>
                    ) : (
                      sortByPropertyAlphabetically(designationList)?.map((type) => (
                        <Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Controller
                name="designationRole"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Role"
                    size="large"
                  >
                    <Option value="">All Roles</Option>
                    {designationRoleData?.map((type) => (
                      <Option key={type?._id} value={type?.name}>
                        {type?.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </div>

            {/* Employee Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    className="w-full"
                    placeholder="Select Employee"
                    onFocus={handleEmployeeFocus}
                    options={employeList?.map((element) => ({
                      label: element.fullName,
                      value: element._id,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    size="large"
                  />
                )}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    placeholder="Select Status"
                    options={[
                      { value: '', label: "All Status" },
                      { value: 'true', label: "Active" },
                      { value: 'false', label: "Inactive" },
                    ]}
                    size="large"
                  />
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Reset Filters</span>
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-header text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <GlobalLayout onChange={setSearchText}>
      <div className="bg-gray-50 p-6">
        <div className="mx-auto space-y-6">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Collapse
              className="professional-collapse"
              items={filterItems}
              defaultActiveKey={['1']}
              expandIcon={({ isActive }) => (
                <MdKeyboardArrowDown
                  size={20}
                  className="text-white transition-transform duration-300"
                  style={{ transform: isActive ? "rotate(-180deg)" : "rotate(0deg)" }}
                />
              )}
            />
          </div>

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
                onClick={generatePDF}
                className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
              >
                <span className="text-[12px]">Export PDF</span>
              </button>
              <button
                onClick={generateExcel}
                className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
              >
                <span className="text-[12px]">Export Excel</span>
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-header text-white">
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider w-16">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[180px]">Employee</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[120px]">Department</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[120px]">Designation</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider w-32">Seat No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider w-32">EPBX No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[200px]">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider w-28">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employeEPBXReportFunc_loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12">
                        <div className="flex justify-center">
                          <Loader2 />
                        </div>
                      </td>
                    </tr>
                  ) : employeEPBXReportList?.length > 0 ? (
                    employeEPBXReportList?.map((element, index) => (
                      <tr key={element?._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {index + 1 + ((currentPage - 1) * pageSize)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {element?.fullName || "-"}
                              </div>
                              {element?.employeeId && (
                                <div className="text-xs text-gray-500">
                                  ID: {element.employeeId}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {element?.departmentName || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {element?.designationName || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {element?.seatNumber ? (
                            <div className="flex items-center space-x-1 text-blue-600">
                              <MdChair size={14} />
                              <span className="text-sm font-medium">{element.seatNumber}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {element?.landlineNumber ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <MdPhone size={14} />
                              <span className="text-sm font-mono">{element.landlineNumber}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <Tooltip title={element?.email || "No email"}>
                              <div className="flex items-center space-x-1 text-sm">
                                <MdEmail size={12} className="text-gray-400" />
                                <span className="text-gray-600 truncate max-w-[180px]">
                                  {element?.email || "-"}
                                </span>
                              </div>
                            </Tooltip>
                            {element?.mobile?.number && (
                              <Tooltip title={`${element.mobile.code} ${element.mobile.number}`}>
                                <div className="flex items-center space-x-1 text-sm">
                                  <MdPhone size={12} className="text-gray-400" />
                                  <span className="text-gray-600 font-mono">
                                    {element.mobile.code} {element.mobile.number}
                                  </span>
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Tag color={element?.status ? "green" : "red"} className="rounded-full">
                            {element?.status ? "Active" : "Inactive"}
                          </Tag>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500 text-lg font-medium">No records found</div>
                        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Section */}
          {employeEPBXReportCount > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <CustomPagination
                totalCount={employeEPBXReportCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onChange={onPaginationChange}
              />
            </div>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
}

export default EmployeEPBXReports;