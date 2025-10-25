import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
  organizationTypes,
  pazeSizeReport,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Modal, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { AllClientReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

import { clientGrpSearch } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";

import { orgTypeSearch } from "../../../organizationType/organizationTypeFeatures/_org_type_reducers";
import Loader from "../../../../global_layouts/Loader";
import { indusSearch } from "../../../global/other/Industry/IndustryFeature/_industry_reducers";
import { useSearchParams } from "react-router-dom";

function AllClientReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    allClientReportList,
    AllClientReportFunc_loading,
    totalAllClientCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [searchParams,setSearchParams]=useSearchParams();
  const urlStatus = searchParams.get('status')

  const [departmentModalData, setDepartmentModalData] = useState({});

  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList, groupSearchLoading } = useSelector((state) => state.clientGroup);
  const { clientList } = useSelector((state) => state.client);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { industryListData, indusSearchloading } = useSelector(
    (state) => state.industry
  );
  const { orgTypeList, orgSearchloading } = useSelector(
    (state) => state.orgType
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
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
    defaultValue: urlStatus ? 'true' :'',
  });

  const PDOrganizationType = useWatch({
    control,
    name: "PDOrganizationType",
    defaultValue: "",
  });

  const PDindustrytype = useWatch({
    control,
    name: "PDindustrytype",
    defaultValue: "",
  });

  const department = useWatch({
    control,
    name: "department",
    defaultValue: "",
  });

  const groupName = useWatch({
    control,
    name: "groupName",
    defaultValue: "",
  });

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(Number(1))
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleFocusOrgType = () => {
    if (!orgTypeList?.length) {
      dispatch(
        orgTypeSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  };



  const handleFocusIndustry = () => {
    // if (!industryListData?.length) {
    dispatch(
      indusSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
    // }
  };

  const generateFinancialYears = () => {
    const startYear = 2005;
    const endYear = 2034;
    const financialYears = [];
    for (let year = startYear; year <= endYear; year++) {
      financialYears.push(`${year}-${year + 1}`);
    }
    return financialYears;
  };

  const financialYears = generateFinancialYears();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const quarter = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

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
        directorId: "",
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,

        status: Status == "true" ? true : Status == "false" ? false : "",
        organizationId: PDOrganizationType,
        organizationIds: [],
        departmentId: department,
        departmentIds: [],
        industryId: PDindustrytype,
        industryIds: [],
        groupId: groupName,
        groupIds: [],


      },
    };
  };
  useEffect(() => {
    if(urlStatus){
      setValue('status','true')
     
    }

    else{fetchClientServiceTaskReport(debouncedFilterText);}
  }, [currentPage, debouncedFilterText, pageSize]);

  useEffect(() => {
    if(urlStatus){
   
       fetchClientServiceTaskReport(debouncedFilterText);
    }else{}
  }, [currentPage, debouncedFilterText, pageSize]);

  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId: ["admin", "company", "companyDirector"].includes(
          userInfoglobal?.userType
        )
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        departmentId: "",
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: true,
        isDirector: false,
      })
    );
  };

  const fetchClientServiceTaskReport = () => {
    dispatch(AllClientReportFunc(requestPayLoadReturn(true)));
  };

  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);

  const handleDepartmentModal = (element) => {
    setDepartmentModalOpen(true);
    setDepartmentModalData(element);
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
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
    setValue("startDate", dayjs().subtract(1, "month"));
    setValue("endDate", dayjs());
  }, []);

  const onChange = (e) => {
    setSearchText(e);
  };

  const handleSubmit = async () => {
    fetchClientServiceTaskReport();
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AllClientTask");
    // Title

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: " Group Name", key: "clientGroupName", width: 25 },
      { header: "Client Name", key: "clientName", width: 25 },
      { header: "Organization Name", key: "organizationName", width: 25 },
      { header: "Industry Name", key: "industryName", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Date of Joining", key: "dateOfJoining", width: 25 },
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

    const response = await reportsServices?.AllClientReportFunc(
      requestPayLoadReturn(false)
    );

    if (!response && !response?.data?.docs) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1 + (currentPage - 1) * pageSize,
        clientGroupName: data?.clientGroupData?.fullName || "-",
        clientName: data?.fullName || "-",
        organizationName: data?.organizationName || "-",
        industryName: data?.industryName || "-",
        email: data?.email || "-",
        mobile: `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`,
        dateOfJoining: data?.clientProfile?.dateOfJoining
          ? dayjs(data.clientProfile.dateOfJoining).format("DD-MM-YYYY hh:mm a")
          : "-",
        status: data?.status ? "Active" : "InActive",

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
      link.download = "allClientReport.xlsx";
      link.click();
    });
  };
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });



    doc.setFontSize(16);
    
    const headers = [
      "S.No",
      "Client Group Name",
      "Client Name",
      "Organization Name",
      "Industry",
      "Email",
      "Mobile",
      "Date of Joining",
      "Status"

    ];
    const response = await reportsServices?.AllClientReportFunc(
      requestPayLoadReturn(false)
    );

    if (!response && !response?.data?.docs) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1 + (currentPage - 1) * pageSize,
        data?.clientGroupData?.fullName || "-",
        data?.fullName || "-",
        data?.organizationName || "-",
        data?.industryName || "-",
        data?.email || "-",
        `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`,
        data?.clientProfile?.dateOfJoining
          ? dayjs(data.clientProfile.dateOfJoining).format("DD-MM-YYYY hh:mm a")
          : "-",
        data?.status ? "Active" : "InActive"

      ];
    });
    autoTable(doc, {
      startY: 70,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 8,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    doc.save(`AllClientTask.pdf`);
  };

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
            <div>
              <Controller
                control={control}
                name="PDOrganizationType"
                rules={{ required: "Organization is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={`inputAntdSelectClassNameFilterReport `}
                    showSearch
                    onFocus={() => handleFocusOrgType()}
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">
                      Select Organization Type
                    </Select.Option>
                    {orgSearchloading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      orgTypeList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="PDindustrytype"
                rules={{ required: "Industry type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    onFocus={() => {
                      handleFocusIndustry();
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    className={`inputAntdSelectClassNameFilterReport `}
                  >
                    <Select.Option value=""> Select Industry Type</Select.Option>
                    {indusSearchloading ? (
                      <Select.Option disabled>
                        <Loader />
                      </Select.Option>
                    ) : (
                      industryListData?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
            </div>
            
            <div>
              <Controller
                name="department"
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
                name="groupName"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="inputAntdSelectClassNameFilterReport"
                    showSearch
                    placeholder="Select Group"
                    onFocus={() => {
                      dispatch(
                        clientGrpSearch({
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
                          groupId: "",
                        })
                      );
                    }}
                    onChange={(value) => field.onChange(value)}
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Group</Select.Option>
                    {groupSearchLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(clientGroupList)?.map((element) => (
                        <Select.Option key={element?._id} value={element?._id}>
                          {element?.fullName} ({element?.groupName})
                        </Select.Option>
                      ))
                    )}
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
                    className={`inputAntdSelectClassNameFilterReport `}
                    placeholder="Select Status"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    {[
                      { label: "Active", value: "true" },
                      { label: "InActive", value: "false" },
                    ]?.map((array) => {
                      return (
                        <Select.Option value={array?.value}>
                          {array?.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDCompanyId", "");
                setValue("PDBranchId", "");
                setValue("status", "");
                setValue("PDOrganizationType", "");
                setValue("PDindustrytype", "");
                setValue("department", "");
                setValue("groupName", "");

                handleSubmit();
              }}
              className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={() => {
                handleSubmit();
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
              <span
                htmlFor="pageSize"
                className="text-sm font-light text-gray-500"
              >
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
                <th className="border-none p-2 whitespace-nowrap ">
                  Group Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Client Name
                </th>


                <th className="border-none p-2 whitespace-nowrap ">
                  organization Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Industry Name
                </th>

                <th className="border-none p-2 whitespace-nowrap ">Email</th>
                <th className="border-none p-2 whitespace-nowrap ">Mobile</th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Date of Joining
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th>
                
              </tr>
            </thead>
            {AllClientReportFunc_loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={15}
                  className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {allClientReportList &&
                  allClientReportList?.length > 0 ? (
                  allClientReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>

                     

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.clientGroupData?.fullName}
                      </td>


                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.fullName}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.organizationName || '-'}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.industryName || '-'}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.email || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.mobile?.code || "-"}{" "}
                        {element?.mobile?.number || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.clientProfile?.dateOfJoining ? dayjs(element?.clientProfile?.dateOfJoining).format("DD-MM-YYYY hh:mm a") :'-'}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.status ? 'Active' : 'InActive'}
                      </td>
                  
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
              </tbody>
            )}
          </table>

          <Modal
            className="antmodalclassName !w-[60%] !h-[50%]"
            title={`Client / ${departmentModalData?.fullName} `}
            open={departmentModalOpen}
            onCancel={() => setDepartmentModalOpen(false)}
            footer={null}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                {departmentModalData?.email ?? "-"} / {departmentModalData?.mobile?.code + departmentModalData?.mobile?.number}
              </div>

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
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                    S.No.
                  </th>

                  <th className="border-none p-2 whitespace-nowrap ">
                    Department Name
                  </th>

                 
                </tr>
              </thead>
              {AllClientReportFunc_loading ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={15}
                    className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {departmentModalData?.departmentData &&
                    departmentModalData?.departmentData.length > 0 ? (
                    departmentModalData?.departmentData?.map(
                      (element, index) => (
                        <tr
                          className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                          <td className="whitespace-nowrap  border-none p-2">
                            {index + 1 + (currentPage - 1) * pageSize}
                          </td>

                        

                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.name}
                          </td>
                         
                        </tr>
                      )
                    )
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
                </tbody>
              )}
            </table>
          </Modal>
        </div>
        <CustomPagination
          totalCount={totalAllClientCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default AllClientReport;
