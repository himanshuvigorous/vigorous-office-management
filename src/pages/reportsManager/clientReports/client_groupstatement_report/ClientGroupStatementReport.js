import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertIntoAmount,
  convertMinutesToHoursAndMinutes,
  domainName,
  organizationTypes,
  pazeSizeReport,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { useEffect, useMemo, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, DatePicker, Descriptions, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { clientGroupStatementReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import { useParams } from "react-router-dom";

function ClientGroupStatementReport() {
  const { RangePicker } = DatePicker;

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { ledgerId } = useParams()

  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    clientGroupStatementReportList,
    clientGroupStatementReportFunc_loading,
    clientGroupStatementCount,
  } = useSelector((state) => state.reports);

  const openingBalance = useMemo(() => {
    if (
      clientGroupStatementReportList?.allTransections &&
      clientGroupStatementReportList.allTransections.length > 0
    ) {
      return clientGroupStatementReportList.allTransections[0].previousBalance;
    }
    return undefined;
  }, [clientGroupStatementReportList]);




  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );

  const [departmentModalData, setDepartmentModalData] = useState({});

  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  const { clientList } = useSelector((state) => state.client);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
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



  const [formattedData, setFormattedData] = useState(0)

  const formatDataFunction = (data) => {
    let balance = Number(data?.openingBalance) || 0
    let mapOutput = []

    data?.allTransections?.forEach((element, index) => {

      const output = {
        key: '',
        entryDate: element?.createdAt ? dayjs(element?.createdAt).format('DD-MM-YYYY') : '-',
        valueDate: element?.createdAt ? dayjs(element?.createdAt).format('DD-MM-YYYY') : '-',
        particulars: (element?.type == 'invoice' ? 'invoice Generated' : element?.naration) || "-",
        refNo: (element?.typeOf == 'invoice' ? (element?.refNumber) : (element?.typeOf == 'receipt' ? `Receipt ${element?.refNumber}` : '')) || element?.refNumber,

        clientName: element?.clientName,
        debit: element?.debit_credit == 'debit' ? element?.amount : 0,
        credit: element?.debit_credit == 'credit' ? element?.amount : 0,
        balance: element?.currentBalance || 0,
      }

      mapOutput.push(output)
    })


    mapOutput?.push({
      key: 'totalBalance',
      entryDate: '',
      valueDate: '',
      particulars: 'Total Balance',
      refNo: '',
      clientName: '',
      debit: data?.summary?.totalDebit,
      credit: data?.summary?.totalCredit,
      balance: data?.summary?.closingBalance,
    })

    return mapOutput;
  }


  useEffect(() => {
    setFormattedData(formatDataFunction(clientGroupStatementReportList))
  }, [clientGroupStatementReportList])






  const time = useWatch({
    control,
    name: "time",
    defaultValue: [],
  });
  const requestPayLoadReturn = (pagination = true) => {
    return {
      "_id": ledgerId,
      startDate: time?.length > 0 ? dayjs(time[0]).format('YYYY-MM-DD') : '',
      endDate: time?.length > 0 ? dayjs(time[1]).format('YYYY-MM-DD') : '',

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
    dispatch(clientGroupStatementReportFunc(requestPayLoadReturn(true)));
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
    // setValue("startDate", dayjs().subtract(1, "month"));
    // setValue("endDate", dayjs());
  }, []);

  const onChange = (e) => {
    setSearchText(e);
  };

  const handleSubmit = async () => {
    fetchClientServiceTaskReport();
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ClientGroupStatement");

    // Columns matching your table
    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Entry Date", key: "entryDate", width: 20 },
      { header: "Value Date", key: "valueDate", width: 20 },
      { header: "Particulars", key: "particulars", width: 40 },
      { header: "Ref No.", key: "refNo", width: 20 },
      { header: "Client Name", key: "clientName", width: 25 },
      { header: "Debit", key: "debit", width: 15 },
      { header: "Credit", key: "credit", width: 15 },
      { header: "Balance", key: "balance", width: 15 },
    ];

    // Header styling
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

    // API Call
    const response = await reportsServices?.clientGroupStatementReportFunc?.(
      requestPayLoadReturn(false)
    );
    const transactions = formatDataFunction(response?.data) || [];





    transactions?.forEach((data, index) => {

      worksheet.addRow({
        sno: index + 1,
        entryDate: data?.entryDate,
        valueDate: data?.valueDate,
        particulars: data?.particulars,
        refNo: data?.refNo,
        clientName: data?.clientName,
        debit: data?.debit ? Number(data?.debit).toFixed(2) : 0,
        credit: data?.credit ? Number(data?.credit).toFixed(2) : 0,
        balance: data?.balance,
      });
    });

    // Style body rows
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

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

    // Enable autofilter
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
      link.download = "ClientGroupStatement.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });

    doc.setFontSize(16);
    doc.text("Client Group Statement Report", 40, 30);

    const headers = [
      "S.No.",
      "Entry Date",
      "Value Date",
      "Particulars",
      "Ref No.",
      "Client Name",
      "Debit",
      "Credit",
      "Balance",
    ];

    const response = await reportsServices?.clientGroupStatementReportFunc(
      requestPayLoadReturn(false)
    );

    const transactions = formatDataFunction(response?.data);
    if (!transactions || transactions.length === 0) return;

    let runningBalance = Number(openingBalance || 0);

    // Initial Opening Balance Row


    const body = formatDataFunction(response?.data)?.map((data, index) => {

      return [
        index + 1,
        data?.entryDate,
        data?.valueDate,
        data?.particulars,
        data?.refNo,
        data?.clientName,
        data?.debit ? Number(data?.debit).toFixed(2) : 0,
        data?.credit ? Number(data?.credit).toFixed(2) : 0,
        data?.balance || 0,
      ];
    });


    autoTable(doc, {
      startY: 50,
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
        fillColor: [64, 64, 64],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("Client_Group_Statement_Report.pdf");
  };


  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 sm:flex justify-between items-center">
          <div className="sm:flex  grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">
            <div className="">
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <RangePicker
                    {...field}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    format="YYYY-MM-DD"
                    // onOk={onOk}
                    getPopupContainer={() => document.body} // important: avoids layout issues
                    popupClassName="vertical-range-calendar"
                    className="custom-range-picker"

                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue('time', '')
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

  //     key: "1",
  //     label: <span className="text-white">Advance Filters</span>,
  //     children: (
  //       <div className="bg-[#ececec]">
  //         <div className="sm:flex  grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">
  //           {(userInfoglobal?.userType === "admin" ||
  //             userInfoglobal?.userType === "company" ||
  //             userInfoglobal?.userType === "companyDirector") && (
  //             <div className="">
  //               <Controller
  //                 name="PDBranchId"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     {...field}
  //                     className={`inputAntdSelectClassNameFilterReport `}
  //                     placeholder="Select Branch"
  //                     showSearch
  //                     filterOption={(input, option) =>
  //                       String(option?.children)
  //                         .toLowerCase()
  //                         .includes(input.toLowerCase())
  //                     }
  //                   >
  //                     <Select.Option value="">Select Branch</Select.Option>
  //                     {branchList?.map((element) => (
  //                       <Select.Option value={element?._id}>
  //                         {" "}
  //                         {element?.fullName}{" "}
  //                       </Select.Option>
  //                     ))}
  //                   </Select>
  //                 )}
  //               />
  //               {errors.PDBranchId && (
  //                 <p className="text-red-500 text-sm">
  //                   {errors.PDBranchId.message}
  //                 </p>
  //               )}
  //             </div>
  //           )}
  //           <Controller
  //             control={control}
  //             name="PDOrganizationType"
  //             rules={{ required: "Organization is required" }}
  //             render={({ field }) => (
  //               <Select
  //                 {...field}
  //                 defaultValue={""}
  //                 className={`inputAntdSelectClassNameFilterReport `}
  //                 showSearch
  //                 onFocus={() => handleFocusOrgType()}
  //                 filterOption={(input, option) =>
  //                   String(option?.children)
  //                     .toLowerCase()
  //                     .includes(input.toLowerCase())
  //                 }
  //               >
  //                 <Select.Option value="">
  //                   Select Organization Type
  //                 </Select.Option>
  //                 {orgSearchloading ? (
  //                   <Select.Option disabled>
  //                     <ListLoader />
  //                   </Select.Option>
  //                 ) : (
  //                   orgTypeList?.map((type) => (
  //                     <Select.Option key={type?._id} value={type?._id}>
  //                       {type?.name}
  //                     </Select.Option>
  //                   ))
  //                 )}
  //               </Select>
  //             )}
  //           />

  //           <Controller
  //             control={control}
  //             name="PDindustrytype"
  //             rules={{ required: "Industry type is required" }}
  //             render={({ field }) => (
  //               <Select
  //                 {...field}
  //                 defaultValue={""}
  //                 onFocus={() => {
  //                   handleFocusIndustry();
  //                 }}
  //                 showSearch
  //                 filterOption={(input, option) =>
  //                   String(option?.children)
  //                     .toLowerCase()
  //                     .includes(input.toLowerCase())
  //                 }
  //                 className={`inputAntdSelectClassNameFilterReport `}
  //               >
  //                 <Select.Option value=""> Select Industry Type</Select.Option>
  //                 {indusSearchloading ? (
  //                   <Select.Option disabled>
  //                     <Loader />
  //                   </Select.Option>
  //                 ) : (
  //                   industryListData?.map((type) => (
  //                     <Select.Option key={type?._id} value={type?._id}>
  //                       {type?.name}
  //                     </Select.Option>
  //                   ))
  //                 )}
  //               </Select>
  //             )}
  //           />

  //           <div>
  //             <Controller
  //               name="status"
  //               control={control}
  //               rules={{}}
  //               render={({ field }) => (
  //                 <Select
  //                   {...field}
  //                   className={`inputAntdSelectClassNameFilterReport `}
  //                   placeholder="Select Status"
  //                   showSearch
  //                   filterOption={(input, option) =>
  //                     String(option?.children)
  //                       .toLowerCase()
  //                       .includes(input.toLowerCase())
  //                   }
  //                 >
  //                   <Select.Option value="">Select Status</Select.Option>
  //                   {[
  //                     { label: "Active", value: "true" },
  //                     { label: "InActive", value: "false" },
  //                   ]?.map((array) => {
  //                     return (
  //                       <Select.Option value={array?.value}>
  //                         {array?.label}
  //                       </Select.Option>
  //                     );
  //                   })}
  //                 </Select>
  //               )}
  //             />
  //           </div>

  //           <Controller
  //             name="department"
  //             control={control}
  //             render={({ field }) => (
  //               <Select
  //                 {...field}
  //                 className={`inputAntdSelectClassNameFilterReport`}
  //                 showSearch
  //                 filterOption={(input, option) =>
  //                   String(option?.children)
  //                     .toLowerCase()
  //                     .includes(input.toLowerCase())
  //                 }
  //                 onFocus={() => {
  //                   dispatch(
  //                     deptSearch({
  //                       text: "",
  //                       sort: true,
  //                       status: true,
  //                       isPagination: false,
  //                       companyId:
  //                         userInfoglobal?.userType === "admin"
  //                           ? CompanyId
  //                           : userInfoglobal?.userType === "company"
  //                           ? userInfoglobal?._id
  //                           : userInfoglobal?.companyId,
  //                       branchId: [
  //                         "admin",
  //                         "company",
  //                         "companyDirector",
  //                       ].includes(userInfoglobal?.userType)
  //                         ? BranchId
  //                         : userInfoglobal?.userType === "companyBranch"
  //                         ? userInfoglobal?._id
  //                         : userInfoglobal?.branchId,
  //                     })
  //                   );
  //                 }}
  //                 onChange={(value) => {
  //                   field.onChange(value);
  //                 }}
  //                 placeholder="Select Department"
  //               >
  //                 <Select.Option value="">Select Department</Select.Option>
  //                 {depLoading ? (
  //                   <Select.Option disabled>
  //                     <ListLoader />
  //                   </Select.Option>
  //                 ) : (
  //                   sortByPropertyAlphabetically(departmentListData)?.map(
  //                     (element) => (
  //                       <Select.Option key={element?._id} value={element?._id}>
  //                         {element?.name}
  //                       </Select.Option>
  //                     )
  //                   )
  //                 )}
  //               </Select>
  //             )}
  //           />

  //           <Controller
  //             name="groupName"
  //             control={control}
  //             render={({ field }) => (
  //               <Select
  //                 {...field}
  //                 className="inputAntdSelectClassNameFilterReport"
  //                 options={[
  //                   { label: "Select Group Type", value: "" },
  //                   ...(Array.isArray(clientGroupList)
  //                     ? clientGroupList.map((el) => ({
  //                         label: `${el?.fullName} (${el?.groupName})`,
  //                         value: el?._id,
  //                       }))
  //                     : []),
  //                 ]}
  //                 placeholder="Select Group Type"
  //                 onFocus={handleFocusClientGrp}
  //                 classNamePrefix="react-select"
  //                 isSearchable
  //                 onChange={(value) => {
  //                   field.onChange(value);
  //                 }}
  //                 value={field?.value}
  //               />
  //             )}
  //           />
  //         </div>
  //         <div className="flex justify-end items-center gap-2">
  //           <button
  //             onClick={() => {
  //               setValue("PDCompanyId", "");
  //               setValue("PDBranchId", "");
  //               setValue("status", "");
  //               setValue("PDOrganizationType", "");
  //               setValue("PDindustrytype", "");
  //               setValue("department", "");
  //               setValue("groupName", "");

  //               handleSubmit();
  //             }}
  //             className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
  //           >
  //             <span className="text-[12px]">Reset</span>
  //           </button>
  //           <button
  //             onClick={() => {
  //               handleSubmit();
  //             }}
  //             className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
  //           >
  //             <span className="text-[12px]">Submit</span>
  //           </button>
  //         </div>
  //       </div>
  //     ),
  //   },
  // ];

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
          <div className="space-y-1.5 flex justify-between items-center md:flex-row flex-col mt-2">


<Descriptions column={2} size="small" bordered>
  <Descriptions.Item label="Group Name">
    {clientGroupStatementReportList?.fullName || '-'}
  </Descriptions.Item>
  <Descriptions.Item label="Group ID">
    {clientGroupStatementReportList?.groupName || '-'}
  </Descriptions.Item>
</Descriptions>


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
                  Entry  Date
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Value  Date
                </th>
                <th className="border-none p-2 whitespace-nowrap ">particulars</th>
                <th className="border-none p-2 whitespace-nowrap ">	Ref no.</th>
                <th className="border-none p-2 whitespace-nowrap ">Client Name</th>

                <th className="border-none p-2 whitespace-nowrap text-right">
                  Debit
                </th>
                <th className="border-none p-2 whitespace-nowrap ext-right">
                  Credit
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  Balance
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {clientGroupStatementReportFunc_loading ? (
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

                {formattedData &&
                  formattedData?.length > 0 ? (
                  formattedData?.map((element, index) => {


                    return <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.entryDate}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.valueDate}
                      </td>


                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.particulars || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.refNo}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.clientName || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2 text-right">
                        {convertIntoAmount(element?.debit)}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2 text-right">
                        {convertIntoAmount(element?.credit)}
                      </td>
                      <td className="tableData text-right">
                        {convertIntoAmount(element?.balance)}
                      </td>
                    </tr>
                  })
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
        {/* <CustomPagination
          totalCount={clientGroupStatementCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        /> */}
      </div>
    </GlobalLayout>
  );
}

export default ClientGroupStatementReport;
