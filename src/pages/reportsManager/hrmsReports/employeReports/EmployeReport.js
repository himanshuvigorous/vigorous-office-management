import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { domainName, inputAntdSelectClassNameFilter, pazeSizeReport, sortByPropertyAlphabetically } from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Descriptions, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { employeReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import { designationSearch, getDesignationRole } from "../../../designation/designationFeatures/_designation_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import { useSearchParams } from "react-router-dom";

function EmployeReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { employeReportList, employeReportFunc_loading, totalemployeeReportCount, empoloyeReportListTotalCount } = useSelector((state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { leaveListData } = useSelector((state) => state.leaveType);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { designationRoleData } = useSelector((state) => state?.designation);
  const [searchParams, setSearchParams] = useSearchParams()
  const urlStatus = searchParams.get('status')
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const status = useWatch({ control, name: "status", defaultValue: urlStatus ? 'true' : '', });
  const employeeId = useWatch({ control, name: "employeeId", });
  const departmentId = useWatch({ control, name: "departmentId", });
  const designationRole = useWatch({control,name:"designationRole"})
  const isTerminated = useWatch({ control, name: "isTerminated", });
  const isResigned = useWatch({ control, name: "isResigned", });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: "", });


  //  useEffect(()=>{
  //   if(urlStatus=='true'){
  //     setValue('status', urlStatus)

  //   }
  //  },[urlStatus])



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
    if (urlStatus) {
      setValue('status', 'true')
    }
    else {

      fetchEmployeeList();
    }

  }, [
    currentPage,
    debouncedFilterText,
    pageSize
  ]);

  useEffect(() => {
    if (urlStatus) {
      fetchEmployeeList()
    }
    else {

    }

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
        "status": status == "true" ? true : status == "false" ? false : '',
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

        "isTL": "",
        "isManager": "",
        "isHR": "",
        "isReceptionist": "",
        employeIds: employeeId ? [employeeId] : [],
        "reporting_to": '',
        departmentId: departmentId,
        "departmentIds": [],
        designationId: designationId,
        "designationIds": [],
        "roleKey": designationRole? designationRole :'',
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
        isBranch: false,
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
  const fetchEmployeeList = () => {
    dispatch(employeReportFunc(requestPayLoadReturn(true)));
  };
  const onChange = (e) => {
    setSearchText(e);
  }
  const handleSubmit = async () => {
    fetchEmployeeList()
  }

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Attendance");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Employee Name", key: "fullName", width: 25 },
      { header: "Department Name", key: "department", width: 20 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "Role", key: "role", width: 15 },
      { header: "Reporting Manager", key: "manager", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Mobile No", key: "mobile", width: 20 },
      { header: "Date of Joining", key: "joiningDate", width: 18 },
      { header: "Date of Birth", key: "dob", width: 18 },
      { header: "Address", key: "address", width: 40 },
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

    const response = await reportsServices?.employeReportFunc(requestPayLoadReturn(false));
    if (!employeReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        fullName: data?.fullName || "-",
        department: data?.departmentData?.name || "-",
        designation: data?.designationData?.name || "-",
        role: data?.designationData?.roleKey || "-",
        manager: data?.departmentManager?.[0]?.name || "-",
        email: data?.email || "-",
        mobile: `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`,
        joiningDate: data?.onboardingData?.dateOfJoining
          ? dayjs(data.onboardingData.dateOfJoining).format('DD-MM-YYYY')
          : "-",
        dob: data?.onboardingData?.dateOfBirth
          ? dayjs(data.onboardingData.dateOfBirth).format('DD-MM-YYYY')
          : "-",
        address: data?.addresses?.primary
          ? `${data.addresses.primary.street || ""}, ${data.addresses.primary.city || ""}, ${data.addresses.primary.country || ""}, ${data.addresses.primary.state || ""}, ${data.addresses.primary.pinCode || ""}`
          : "-"
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
      link.download = "Employee_Report.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
    doc.setFontSize(16);

    const headers = ['S.No.', 'Employee Name', 'Department Name', 'Designation', 'Role', 'Reporting Manager.', 'Email', 'Mobile No', 'Date of Joining', 'Date of Joining', 'Address'];
    const response = await reportsServices?.employeReportFunc(requestPayLoadReturn(false));
    if (!employeReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [

        index + 1,
        data?.fullName || "-",
        data?.departmentData?.name || "-",
        data?.designationData?.name || "-",
        data?.designationData?.roleKey || "-",
        (data?.departmentManager?.[0]?.name || "-"),
        data?.email || "-",
        `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`,
        dayjs(data?.onboardingData?.dateOfJoining).format('DD-MM-YYYY') || "-",
        dayjs(data?.onboardingData?.dateOfBirth).format('DD-MM-YYYY') || "-",
        `${data?.addresses?.primary?.street}, ${data?.addresses?.primary?.city}, ${data?.addresses?.primary?.country}, ${data?.addresses?.primary?.state}, ${data?.addresses?.primary?.pinCode}` || "-" // Address
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
    doc.save(`Employee_Report.pdf`);
  }

  useEffect(() => {
    let reqData = {
      text: ''
    }
    dispatch(getDesignationRole(reqData))
  }, [])
  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 2xl:flex justify-between items-center">
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
                name="designationRole"
                control={control}
                render={({ field }) => (
              <Select
               
                defaultValue=""
                {...field}
                className={`${inputAntdSelectClassNameFilter} `}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Select.Option value="">Select Role</Select.Option>
                {designationRoleData?.map((type) => (
                  <Select.Option key={type?._id} value={type?.name}>
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
            {/* <div>
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
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", "");
                setValue("PdCompanyId", "");
                setValue("departmentId", "");
                setValue("PdDesignationId", "")
                setValue("status", "");
                setValue("employeeId", '');
                setValue("isTerminated", "");
                setValue("isResigned", "");
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
      <div className="bg-grey-100 w-full p-1">roleData
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
          <Descriptions
            title="User Role Summary"
            bordered
            column={1}
            size="middle"
          >
            {empoloyeReportListTotalCount?.map((item, index) => (
              <Descriptions.Item
                key={index}
                label={item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unassigned'}
              >
                {item.count}
              </Descriptions.Item>
            ))}
          </Descriptions>
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
                <th className="border-none p-2 w-[50px] text-left">S.No.</th>
                <th className="border-none p-2 max-w-[150px] min-w-[100px] text-left">Employee Name</th>
                <th className="border-none p-2 max-w-[120px] min-w-[70px] text-left">Department</th>
                <th className="border-none p-2 max-w-[120px] min-w-[70] text-left">Designation</th>
                <th className="border-none p-2 max-w-[100px] min-w-[60px] text-left">Role</th>
                <th className="border-none p-2 max-w-[150px] min-w-[70px] text-left">Reporting Manager</th>
                <th className="border-none p-2 w-[200px] text-left">Email</th>
                <th className="border-none p-2 w-[150px] text-left">Mobile No.</th>
                <th className="border-none p-2 w-[120px] text-left">Date Of Joining</th>
                <th className="border-none p-2 max-w-[120px] min-w-[60px] text-left">Date Of Birth</th>
                <th className="border-none p-2 max-w-[200px] min-w-[100px] text-left">Address</th>
              </tr>
            </thead>
            {employeReportFunc_loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={15}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employeReportList &&
                  employeReportList?.length > 0 ? (
                  employeReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className=" border-none px-2 py-3">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>
                      <td className=" border-none px-2 py-3">
                        {element?.fullName || "-"}
                      </td>
                      <td className=" border-none px-2 py-3">
                        {element?.departmentData?.name || "-"}
                      </td>
                      <td className=" border-none px-2 py-3">
                        {element?.designationData?.name || "-"}
                      </td>
                      <td className=" border-none px-2 py-3">
                        {element?.designationData?.roleKey || "-"}
                      </td>

                      <td className=" border-none px-2 py-3">
                        {element?.reportingManager || "-"}
                      </td>

                      <td className="border-none px-2 py-3">
                        <Tooltip title={element?.email || "-"}>
                          <div className="max-w-[200px] truncate">
                            {element?.email || "-"}
                          </div>
                        </Tooltip>
                      </td>
                      <td className="border-none px-2 py-3">
                        <Tooltip title={`${element?.mobile?.code || "-"} ${element?.mobile?.number || "-"}`}>
                          <div className="max-w-[150px] truncate">
                            {element?.mobile?.code || "-"}{" "}
                            {element?.mobile?.number || "-"}
                          </div>
                        </Tooltip>
                      </td>


                      <td className=" border-none px-2 py-3">
                        {dayjs(element?.onboardingData?.dateOfJoining).format('DD-MM-YYYY') || "-"}
                      </td>

                      <td className=" border-none px-2 py-3">
                        {dayjs(element?.onboardingData?.dateOfBirth).format('DD-MM-YYYY') || "-"}
                      </td>
                      <td className="border-none px-2 py-3">
                        <Tooltip title={`${element?.addresses?.primary?.street} , ${element?.addresses?.primary?.city} , ${element?.addresses?.primary?.country}  ,${element?.addresses?.primary?.state} , ${element?.addresses?.primary?.pinCode}` || "-"}>
                          <div className="max-w-[200px] truncate">
                            {`${element?.addresses?.primary?.street} , ${element?.addresses?.primary?.city} , ${element?.addresses?.primary?.country}  ,${element?.addresses?.primary?.state} , ${element?.addresses?.primary?.pinCode}` || "-"}
                          </div>
                        </Tooltip>
                      </td>



                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={11}
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
          totalCount={totalemployeeReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployeReport;
