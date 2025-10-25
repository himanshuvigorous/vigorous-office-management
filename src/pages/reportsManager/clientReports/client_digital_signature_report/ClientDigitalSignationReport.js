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
import { clientDigitalSignatureReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import { clientSearch } from "../../../client/clientManagement/clientFeatures/_client_reducers";
import { taskTypeSearch } from "../../../taskManagement/taskType/taskFeatures/_task_reducers";
import { clientGrpSearch } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { FaEye } from "react-icons/fa";
import { orgTypeSearch } from "../../../organizationType/organizationTypeFeatures/_org_type_reducers";
import Loader from "../../../../global_layouts/Loader";
import { indusSearch } from "../../../global/other/Industry/IndustryFeature/_industry_reducers";
import { DigitalSignatureTypeSearch } from "../../../clientService/sigantureServiceFeatures/_digital_signature_type_reducers";

function ClientDigitalSignationReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    clientDigitalSignatureReportList,
    clientDigitalSignatureReportFunc_loading,
    totalDigitalSignatureIndexCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [departmentModalData, setDepartmentModalData] = useState({});
  const { DigitalSignatureTypeList, loading: digitSignLoading } = useSelector(
    (state) => state.digitalSignatureType
  );
  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  const { clientList, loading: clientListLoading } = useSelector((state) => state.client);
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

  const clientName = useWatch({
    control,
    name: "client",
    defaultValue: "",
  });

  const digitalSignatureType = useWatch({
    control,
    name: "digitalSignatureType",
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

  const handleDigitalSignatureType = () => {
    dispatch(
      DigitalSignatureTypeSearch({
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
      }))
  }


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
        "clientId": clientName,
        "signatureTypeId": digitalSignatureType,


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
    dispatch(clientDigitalSignatureReportFunc(requestPayLoadReturn(true)));
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
    const worksheet = workbook.addWorksheet("OverDueTasks");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Group Name", key: "groupName", width: 30 },
      { header: "Signature Type Name", key: "signatureType", width: 30 },
      { header: "Director Name", key: "directorName", width: 30 },
      { header: "Start Date", key: "startDate", width: 20 },
      { header: "Expiry Date", key: "expiryDate", width: 20 },
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

    const response = await reportsServices?.clientDigitalSignatureReportFunc(
      requestPayLoadReturn(false)
    );


    if (!clientDigitalSignatureReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      return {
        sno: index + 1,
        clientName: data?.clientData?.fullName || "N/A",
        groupName: data?.clientData?.groupName || "N/A",
        signatureType: data?.signatureTypeData?.name || "N/A",
        directorName: data?.directorData?.fullName || "N/A",
        startDate: data?.startDate
          ? dayjs(data?.startDate).format("DD-MM-YYYY")
          : "N/A",
        expiryDate: data?.expiryDate
          ? dayjs(data?.expiryDate).format("DD-MM-YYYY")
          : "N/A",
        createdAt: data?.createdAt
          ? dayjs(data?.createdAt).format("DD-MM-YYYY hh:mm A")
          : "N/A",
        createdBy: data?.createdBy || "N/A",
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
      link.download = "DigitalSignatureReport.xlsx";
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
      "S.No.",
      "Client Name",
      "Group Name",
      "Signature Type Name",
      "Director Name",
      "Start Date",
      "Expiry Date",
      "Created At",
      "Created By",
    ];
    const response = await reportsServices?.clientDigitalSignatureReportFunc(
      requestPayLoadReturn(false)
    );

    if (!clientDigitalSignatureReportList && !response) return;
    const body = response?.data?.docs?.map((data, index) => {
      return [
        index + 1,
        data?.clientData?.fullName || "N/A",
        data?.clientData?.groupName || "N/A",
        data?.signatureTypeData?.name || "N/A",
        data?.directorData?.fullName || "N/A",
        data?.startDate ? dayjs(data?.startDate).format("DD-MM-YYYY") : "N/A",
        data?.expiryDate ? dayjs(data?.expiryDate).format("DD-MM-YYYY") : "N/A",
        data?.createdAt
          ? dayjs(data?.createdAt).format("DD-MM-YYYY hh:mm A")
          : "N/A",
        data?.createdBy || "N/A",
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
    doc.save("DigitalSignatureReport.pdf");
  };

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
                name="client"
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
                        clientSearch({
                          companyId:
                            userInfoglobal?.userType === "company"
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
                          groupId: "",
                          directorId: "",
                          organizationId: "",
                          industryId: "",
                          // departmentId: department,
                          text: "",
                          sort: true,
                          status: true,
                          isPagination: false,
                        })
                      );
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    placeholder="Select Client"
                  >
                    <Select.Option value=""> Select Client</Select.Option>
                    {clientListLoading ?
                      <Select.Option disabled><ListLoader /></Select.Option> :
                      (sortByPropertyAlphabetically(clientList)?.map((element, index) => (
                        <Select.Option key={element?._id} value={element?._id}>
                          {element?.fullName}
                        </Select.Option>
                      )))}
                  </Select>
                )}
              />
            </div>
            <div>
              <Controller
                name="digitalSignatureType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field?.value}
                    className={`inputAntdSelectClassNameFilterReport`}
                    onFocus={() => {
                      handleDigitalSignatureType()
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    placeholder="Select Signature Type"
                    showSearch
                  >
                    <Select.Option value="">Select Signature Type</Select.Option>
                    {digitSignLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : sortByPropertyAlphabetically(DigitalSignatureTypeList?.docs)?.map((type) => (
                      <Select.Option key={type._id} value={type._id}>
                        {type.name}
                      </Select.Option>
                    ))}
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
                    className={`inputAntdSelectClassNameFilterReport`}
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
                setValue("client", "");
                setValue("PDindustrytype", "");
                setValue("department", "");
                setValue("groupName", "");
                setValue("digitalSignatureType", "");

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
          <div className="space-y-1.5 sm:flex grid grid-cols-1 justify-between items-center">
            <div className="flex py-1  items-center gap-2">
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
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Group Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Signature Type Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Director Name
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Start Date
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Expiry Date
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Created At
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Created By
                </th>
              </tr>
            </thead>
            {clientDigitalSignatureReportFunc_loading ? (
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
                {clientDigitalSignatureReportList &&
                  clientDigitalSignatureReportList?.length > 0 ? (
                  clientDigitalSignatureReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.clientData?.fullName || "N/A"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.clientData?.groupName || "N/A"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.signatureTypeData?.name || "N/A"}{" "}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.directorData?.fullName || "N/A"}{" "}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.startDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.expiryDate).format(
                          "DD-MM-YYYY"
                        )}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.createdBy || "N/A"}
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
        </div>
        <CustomPagination
          totalCount={totalDigitalSignatureIndexCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default ClientDigitalSignationReport;
