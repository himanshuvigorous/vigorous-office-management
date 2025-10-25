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
import { Collapse, Modal, Radio, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";

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

import { clientGrpSearch } from "../../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { FaEye } from "react-icons/fa";
import { orgTypeSearch } from "../../../organizationType/organizationTypeFeatures/_org_type_reducers";
import Loader from "../../../../global_layouts/Loader";
import { indusSearch } from "../../../global/other/Industry/IndustryFeature/_industry_reducers";
import { getClientList } from "../../../client/clientManagement/clientFeatures/_client_reducers";
import { clientOwnerDetailsReportFunc } from "../../../../redux/_reducers/_reports_reducers";

function ClientOwnerDetailsReport() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [pageSize, setPageSize] = useState(10);
 
  const [toggleOwner,setToggleOwner] = useState('clientBranch')
  const dispatch = useDispatch();
  const {
    clientList,
    loading,
    totalEmployeCount,
  } = useSelector((state) => state.client);

  const {
    clientOwnerDetailsReportList,
    clientOwnerDetailsReportFunc_loading,
    clientOwnerDetailsReportCount,
  } = useSelector((state) => state.reports);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [departmentModalData, setDepartmentModalData] = useState({});

  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);

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
      page: currentPage,
      limit: pageSize,
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
        "directorId": "",
      

      },
    };
  };
  useEffect(() => {
    fetchClientServiceTaskReport();
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
    dispatch(getClientList(requestPayLoadReturn(true)));
  };

  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);

  const handleDepartmentModal = (element) => {

    const reqData = {
      _id: element?._id,

    }
    setDepartmentModalOpen(true);
    dispatch(
      clientOwnerDetailsReportFunc(reqData)
    )
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
    const worksheet = workbook.addWorksheet("ClientOwnerDetails");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Name", key: "fullName", width: 25 },
      { header: "Type", key: "type", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Date of Birth", key: "dob", width: 20 },
      { header: "Marital Status", key: "maritalStatus", width: 20 },
      { header: "Gender", key: "gender", width: 15 },
    ];

    // Styling the header row
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

    // const response = await reportsServices?.clientOwnerDetailsReportFunc(
    //   requestPayLoadReturn(false)
    // );

    const dataList = clientOwnerDetailsReportList?.branchOwnerData;
    if (!dataList || !dataList.map) return;

    const apiData = dataList?.filter((item)=> {return item?.userType == toggleOwner})?.map((data, index) => {
      const type =
        data?.userType === "clientBranch"
          ? "Branch"
          : data?.userType === "clientOwner"
            ? "Owner"
            : "-";

      return {
        sno: index + 1,
        fullName: data?.fullName || "N/A",
        type,
        email: data?.email || "N/A",
        mobile: `${data?.mobile?.code || "-"} ${data?.mobile?.number || "N/A"}`,
        dob: data?.generalInfo?.dateOfBirth
          ? dayjs(data?.generalInfo?.dateOfBirth).format("DD-MM-YYYY")
          : "N/A",
        maritalStatus: data?.generalInfo?.maritalStatus || "N/A",
        gender: data?.generalInfo?.gender || "N/A",
      };
    });

    // Insert rows
    apiData.forEach((item) => {
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
      to: "H1",
    };

    // Export Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ClientOwnerDetails.xlsx";
      link.click();
    });
  };


  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });

    doc.setFontSize(16);
    doc.text("Client Owner Details Report", 40, 30);

    const headers = [
      "S.No.",
      "Name",
      "Type",
      "Email",
      "Mobile",
      "Date of Birth",
      "Marital Status",
      "Gender",
    ];

    const response = await reportsServices?.clientOwnerDetailsReportFunc(
      requestPayLoadReturn(false)
    );

    const dataList = clientOwnerDetailsReportList?.branchOwnerData;
    if (!dataList || !dataList.map) return;

    const body = dataList?.filter((item)=> {return item?.userType == toggleOwner})?.map((data, index) => {
      const type =
        data?.userType === "clientBranch"
          ? "Branch"
          : data?.userType === "clientOwner"
            ? "Owner"
            : "-";

      return [
        index + 1,
        data?.fullName || "-",
        type,
        data?.email || "-",
        `${data?.mobile?.code || "-"} ${data?.mobile?.number || "-"}`,
        data?.generalInfo?.dateOfBirth
          ? dayjs(data?.generalInfo?.dateOfBirth).format("DD-MM-YYYY")
          : "-",
        data?.generalInfo?.maritalStatus || "-",
        data?.generalInfo?.gender || "-",
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 6,
        fontSize: 9,
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

    doc.save("ClientOwnerDetails.pdf");
  };


  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec]">
          <div className="sm:flex justify-between items-center grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">
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
          <div className="space-y-1.5 flex justify-between items-center">
            <div className="flex items-center gap-2 py-1">
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
                <th className="border-none p-2 whitespace-nowrap ">
                  Owner Details
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {loading ? (
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
                {clientList &&
                  clientList?.length > 0 ? (
                  clientList?.map((element, index) => (
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
                        {element?.fullName}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.email || "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.mobile?.code || "-"}{" "}
                        {element?.mobile?.number || "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.createdBy}
                      </td>
                      <td className="tableData ">
                        {(
                          <div className="flex justify-start items-center gap-1">
                            <span>{element?.departmentData?.length}</span>
                            <Tooltip placement="topLeft"  title='View Details'>
                              <span className="flex justify-center items-center cursor-pointer">
                                <FaEye
                                  onClick={() => handleDepartmentModal(element)}
                                  className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                  size={14}
                                />
                              </span>
                            </Tooltip>
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
            title="Owner Details"
            open={departmentModalOpen}
            onCancel={() => {setToggleOwner('clientBranch'); setDepartmentModalOpen(false);}}
            footer={null}
          >
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

        <div className="my-1">
           <Radio.Group onChange={(e) => setToggleOwner(e.target.value)}
            value={toggleOwner}>
      <Radio.Button value="clientBranch">Branch Owner</Radio.Button>
      <Radio.Button value="clientOwner">Client Owner</Radio.Button>
    </Radio.Group>
        </div>
        <div className=" overflow-x-auto">
            <table className="w-full max-w-full rounded-xl">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                    S.No.
                  </th>
                  <th className="border-none p-2 whitespace-nowrap ">
                    Name
                  </th>
                  <th className="border-none p-2 whitespace-nowrap ">Type</th>
                  <th className="border-none p-2 whitespace-nowrap ">Email</th>
                  <th className="border-none p-2 whitespace-nowrap ">Mobile</th>
                  <th className="border-none p-2 whitespace-nowrap ">Date of Birth</th>
                  <th className="border-none p-2 whitespace-nowrap ">Marital Status </th>
                  <th className="border-none p-2 whitespace-nowrap ">Gender</th>

                  {/* <th className="border-none p-2 whitespace-nowrap ">
                    Created At
                  </th>
                  <th className="border-none p-2 whitespace-nowrap ">
                    Created By
                  </th> */}
                </tr>
              </thead>
              {loading ? (
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
                  {clientOwnerDetailsReportList?.branchOwnerData &&
                    clientOwnerDetailsReportList?.branchOwnerData.length > 0 ? (
                    clientOwnerDetailsReportList?.branchOwnerData?.filter((item)=>{ return item?.userType == toggleOwner})?.map(
                      (element, index) => (
                        <tr
                          className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                    
                          <td className="whitespace-nowrap  border-none p-2">
                            {index + 1 + (currentPage - 1) * pageSize}
                          </td>


                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.fullName}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.userType === "clientBranch" ? "Branch" : element?.userType === "clientOwner" ? "Owner" : "-"}
                          </td>

                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.email || "-"}
                          </td>

                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.mobile?.code || "-"}{" "}
                            {element?.mobile?.number || "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.generalInfo?.dateOfBirth ? moment(element?.generalInfo?.dateOfBirth).format("DD-MM-YYYY") : "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.generalInfo?.maritalStatus ?? "-"}
                          </td>
                          <td className="whitespace-nowrap  border-none p-2">
                            {element?.generalInfo?.gender ?? "-"}
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
        </div>
          </Modal>
        </div>
        <CustomPagination
          totalCount={totalEmployeCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default ClientOwnerDetailsReport;
