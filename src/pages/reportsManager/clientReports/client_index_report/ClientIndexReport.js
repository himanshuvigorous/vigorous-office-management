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
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { clientIndexReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CLIENT_TASK_STATUS_ARR,
  PRIORITY,
} from "../../../../constents/ActionConstent";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import {
  clientSearch,
  getClientList,
} from "../../../client/clientManagement/clientFeatures/_client_reducers";
import { taskTypeSearch } from "../../../taskManagement/taskType/taskFeatures/_task_reducers";
import { clientGrpSearch } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { FaEye } from "react-icons/fa";
import { orgTypeSearch } from "../../../organizationType/organizationTypeFeatures/_org_type_reducers";
import Loader from "../../../../global_layouts/Loader";
import { indusSearch } from "../../../global/other/Industry/IndustryFeature/_industry_reducers";

function ClientIndexReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();


  const [departmentData, setDepartmentData] = useState({})

  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    clientIndexReportList,
    clientIndexReportFunc_loading,
    totalClientIndexCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const { clientList, totalEmployeCount, loading } = useSelector(
    (state) => state.client
  );
  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  //  const { clientList } = useSelector((state) => state.client);
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
    defaultValue: "",
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

  const handleFocusClientGrp = () => {
    dispatch(
      clientGrpSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? watch("PDCompanyId")
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? watch("PDBranchId")
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );
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
    fetchClientServiceTaskReport(debouncedFilterText);
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
    dispatch(clientIndexReportFunc(requestPayLoadReturn(true)));
  };

  const [clientModalOpen, setClientModalOpen] = useState(false);

  const handleClientModal = (element) => {
    setDepartmentData(element)
    setClientModalOpen(true);
    let reqData = {
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

      departmentId: element?._id,
      isPagination: false,
    };
    dispatch(clientSearch(reqData));
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
    const worksheet = workbook.addWorksheet("Clie");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Group Name", key: "groupName", width: 30 },

      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 30 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Created By", key: "createdBy", width: 25 },
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

    // const response = await reportsServices?.clientIndexReportFunc(
    //   requestPayLoadReturn(false)
    // );


    if (!clientList && !clientList) return;
    const apiData = clientList?.map((data, index) => {
      return {
        sno: index + 1,
        groupName: data?.groupName || '-',
        clientName: data?.fullName || "-",
        email: data?.email || "N/A",
        mobile: (data?.mobile?.code + " " + data?.mobile?.number) || "N/A",
        createdAt: data?.createdAt
          ? dayjs(data?.createdAt).format("DD-MM-YYYY hh:mm A")
          : "-",
        createdBy: data?.createdBy || "-",
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
      link.download = "ClientIndexReport.xlsx";
      link.click();
    });
  };
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });
    doc.setFontSize(16);

    doc.text(`Department - ${departmentData?.name}`, 40, 40);
    doc.text(`${departmentData?.email ?? ""} ${(departmentData?.email && departmentData?.mobile?.number && departmentData?.mobile?.code) ? '/' : ''} ${(departmentData?.mobile?.code || '') + (departmentData?.mobile?.number || '')}`, 40, 60);

    const headers = [
      "S.No.",
      "Group Name",
      "Client Name",
      "Email",
      "Mobile",
      "Created At",
      "Created By",

    ];
    const response = await reportsServices?.clientIndexReportFunc(
      requestPayLoadReturn(false)
    );

    if (!clientList && !response) return;
    const body = clientList?.map((data, index) => {
      return [
        index + 1,
        data?.groupName || 'N/A',
        data?.fullName || "N/A",
        data?.email || "N/A",
        (data?.mobile?.code + " " + data?.mobile?.number) || "N/A",
        dayjs(data?.createdAt).format("DD-MM-YYYY hh:mm") || "N/A",
        data?.createdBy || "N/A",
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
    doc.save(`ClientIndexReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] sm:flex justify-between items-center space-y-1">
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
            {/* <Controller
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

            <Controller
              name="groupName"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="inputAntdSelectClassNameFilterReport"
                  options={[
                    { label: "Select Group Type", value: "" },
                    ...(Array.isArray(clientGroupList)
                      ? clientGroupList.map((el) => ({
                          label: `${el?.fullName} (${el?.groupName})`,
                          value: el?._id,
                        }))
                      : []),
                  ]}
                  placeholder="Select Group Type"
                  onFocus={handleFocusClientGrp}
                  classNamePrefix="react-select"
                  isSearchable
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field?.value}
                />
              )}
            /> */}
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
          ></Collapse>
          <div className="space-y-1.5 flex justify-between items-center pt-1">
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

            {/* <div className="flex justify-end items-center gap-2">
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
            </div> */}
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
                  Department
                </th>

                {/* <th className="border-none p-2 whitespace-nowrap ">Email</th>
                <th className="border-none p-2 whitespace-nowrap ">Mobile</th> */}

                <th className="border-none p-2 whitespace-nowrap ">
                  Created At
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Created By
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Clients
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {clientIndexReportFunc_loading ? (
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
                {clientIndexReportList && clientIndexReportList?.length > 0 ? (
                  clientIndexReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>

                      {/* <td className="whitespace-nowrap  border-none p-2">
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
                      </td> */}

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.name}
                      </td>

                      {/* <td className="whitespace-nowrap  border-none p-2">
                        {element?.email || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.mobile?.code || "-"}{" "}
                        {element?.mobile?.number || "-"}
                      </td> */}

                      <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.createdBy}
                      </td>
                      <td className="tableData ">
                        {(
                          <div className="flex justify-center items-center gap-1">
                            <span>{element?.clientCount}</span>
                            <span className="flex justify-center items-center cursor-pointer">
                              <FaEye
                                onClick={() => handleClientModal(element)}
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={14}
                              />
                            </span>
                          </div>
                        ) || "-"}
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
            title={`Department / ${departmentData?.name} `}

            open={clientModalOpen}
            onCancel={() => setClientModalOpen(false)}
            footer={null}
          >
            <div>
              {departmentData?.email ?? ""} {(departmentData?.email && departmentData?.mobile?.number && departmentData?.mobile?.code) ? '/' : ''} {(departmentData?.mobile?.code || '') + (departmentData?.mobile?.number || '')}
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
            <div className="w-full overflow-auto">
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

                    <th className="border-none p-2 whitespace-nowrap ">Email</th>
                    <th className="border-none p-2 whitespace-nowrap ">Mobile</th>

                    <th className="border-none p-2 whitespace-nowrap ">
                      Created At
                    </th>
                    <th className="border-none p-2 whitespace-nowrap ">
                      Created By
                    </th>
                  </tr>
                </thead>
                {clientIndexReportFunc_loading ? (
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
                    {clientList && clientList?.length > 0 ? (
                      clientList?.map((element, index) => (
                        <tr
                          className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                          <td className="whitespace-nowrap  border-none p-2">
                            {index + 1}
                          </td>

                          {/* <td className="whitespace-nowrap  border-none p-2">
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
                      </td> */}
                          <td className="w-[150px]  border-none p-2">
                            {element?.groupName}
                          </td>

                          <td className=" w-[150px]  border-none p-2">
                            {element?.fullName}
                          </td>

                          <td className=" w-[140px]  border-none p-2">
                            {element?.email || "-"}
                          </td>

                          <td className=" w-[150px]  border-none p-2">
                            {element?.mobile?.code || "-"}{" "}
                            {element?.mobile?.number || "-"}
                          </td>

                          <td className="whitespace-nowrap  border-none p-2">
                            {dayjs(element?.createdAt).format(
                              "DD-MM-YYYY hh:mm a"
                            )}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.createdBy}
                          </td>
                          {/* <td className="whitespace-nowrap text-center  border-none p-2">
                        <div onClick={()=>{handleClientModal(element)}} className="flex justify-center items-center rounded-md h-10 w-10 border-2 border-cyan-500">
                          {element?.departmentData?.length || 0}
                        </div>
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
                  </tbody>
                )}
              </table>
            </div>
          </Modal>
        </div>
        <CustomPagination
          totalCount={totalClientIndexCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default ClientIndexReport;
