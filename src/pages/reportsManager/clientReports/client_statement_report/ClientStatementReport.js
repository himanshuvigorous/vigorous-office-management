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
import { Collapse, DatePicker, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { clientStatementReportFunc } from "../../../../redux/_reducers/_reports_reducers";
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
import { useNavigate, useParams } from "react-router-dom";
import { encrypt } from "../../../../config/Encryption";

function ClientStatementReport() {
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
    clientStatementReportList,
    clientStatementReportFunc_loading,
    clientStatementCount,
  } = useSelector((state) => state.reports);



  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );
  const navigate = useNavigate();
  const [departmentModalData, setDepartmentModalData] = useState({});

  const { taskTypeList } = useSelector((state) => state.taskType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
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

  // const openingBalance = useMemo(() => {
  //   if (
  //     clientStatementReportList?.allTransactions &&
  //     clientStatementReportList.allTransactions.length > 0
  //   ) {
  //     return clientStatementReportList.allTransactions[0].previousBalance;
  //   }
  //   return undefined;
  // }, [clientStatementReportList]);
  const [formattedData, setFormattedData] = useState(0)

  const formatDataFunction = (data) => {

    let mapOutput = []

    data?.allTransactions?.forEach((element, index) => {

      const output = {
        key: '',
        entryDate: element?.createdAt ? dayjs(element?.createdAt).format('DD-MM-YYYY') : '-',
        valueDate: element?.createdAt ? dayjs(element?.createdAt).format('DD-MM-YYYY') : '-',
        particulars: (element?.type == 'invoice' ? 'invoice Generated' : element?.naration) || "-",
        refNo: (element?.typeOf == 'invoice' ? (element?.refNumber) : (element?.typeOf == 'receipt' ? `Receipt ${element?.refNumber}` : '')) || element?.refNumber,
        debit: element?.debit_credit == 'debit' ? element?.amount : 0,
        credit: element?.debit_credit == 'credit' ? element?.amount : 0,
        balance: element?.currentBalance || 0,
        typeOf: element?.typeOf || '',
        _id: element?._id || '',
        invoicePDFPath: `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.PDFPath}`
      }

      mapOutput.push(output)
    })


    mapOutput?.push({
      key: 'totalBalance',
      entryDate: '',
      valueDate: '',
      particulars: 'Total Balance',
      refNo: '',

      debit: data?.summary?.totalDebit,
      credit: data?.summary?.totalCredit,
      balance: data?.summary?.closingBalance,
    })

    return mapOutput;
  }



  useEffect(() => {
    setFormattedData(formatDataFunction(clientStatementReportList))
  }, [clientStatementReportList])


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
    dispatch(clientStatementReportFunc(requestPayLoadReturn(true)));
  };


  const time = useWatch({
    control,
    name: "time",
    defaultValue: [],
  });



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
    setValue("startDate", '');
    setValue("endDate", '');
  }, []);

  const onChange = (e) => {
    setSearchText(e);
  };

  const handleSubmit = async () => {
    fetchClientServiceTaskReport();
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Client Statement");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Entry Date", key: "entryDate", width: 25 },
      { header: "Value Date", key: "valueDate", width: 25 },

      { header: "Particulars", key: "particulars", width: 30 },
      { header: "Ref No.", key: "refNo", width: 20 },
      { header: "Debit", key: "debit", width: 15 },
      { header: "Credit", key: "credit", width: 15 },
      { header: "Balance", key: "balance", width: 20 },
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

    const response = await reportsServices?.clientStatementReportFunc(
      requestPayLoadReturn(false)
    );

    if (!clientStatementReportList?.allTransactions) return;


    const apiData = formatDataFunction(response?.data)?.map((data, index) => {


      return {
        sno: index + 1,
        entryDate: data?.entryDate,
        valueDate: data?.valueDate,
        particulars: data?.particulars,
        refNo: data?.refNo,
        debit: data?.debit ? Number(data?.debit).toFixed(2) : 0,
        credit: data?.credit ? Number(data?.credit).toFixed(2) : 0,
        balance: data?.balance,
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

    worksheet.autoFilter = {
      from: "A1",
      to: "G1",
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ClientLedgerStatement.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });

    doc.setFontSize(16);
    doc.text("Client Statement Report", 40, 30);

    const headers = [
      "S.No.",
      "Entry Date",
      "Value Date",
      "Particulars",
      "Ref No.",
      "Debit",
      "Credit",
      "Balance",
    ];

    const response = await reportsServices?.clientStatementReportFunc(
      requestPayLoadReturn(false)
    );

    if (!clientStatementReportList?.allTransactions) return;



    const body = formatDataFunction(response?.data)?.map((data, index) => {

      return [
        index + 1,
        data?.entryDate,
        data?.valueDate,
        data?.particulars,
        data?.refNo,
        data?.debit ? Number(data?.debit).toFixed(2) : 0,
        data?.credit ? Number(data?.credit).toFixed(2) : 0,
        data?.balance,
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [headers],
      body,
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

    doc.save("ClientLedgerStatement.pdf");
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec]">
          <div className="sm:flex  grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">


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

  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <Collapse
            className="custom-collapse"
            items={items}
            defaultActiveKey={[]}
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
          <div className="space-y-1.5 flex justify-end items-center">
            {/* <div className="flex items-center gap-2">
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
            </div> */}

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
                  Entry Date
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Value Date
                </th>
                <th className="border-none p-2 whitespace-nowrap ">particulars</th>
                <th className="border-none p-2 whitespace-nowrap ">	Ref no.</th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Debit
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Credit
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Balance
                </th>
                {/* <th className="border-none p-2 whitespace-nowrap ">
                  Status
                </th> */}
              </tr>
            </thead>
            {clientStatementReportFunc_loading ? (
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
                        {element?.typeOf == "invoice" ? "Invoice Raised" : element?.particulars}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        <div className="text-blue-500 cursor-pointer underline"
                          onClick={() => {
                            if (element?.typeOf === "invoice") {
                              navigate(
                                `/admin/viewInvoice?invoiceId=${encrypt(element?._id)}&type=invoice&downloadPdfPath=${element?.invoicePDFPath ? encrypt(element?.invoicePDFPath) : ''
                                }`
                              );
                            } else if (element?.typeOf === "receipt") {
                              navigate(
                                `/admin/viewInvoice?invoiceId=${encrypt(element?._id)}&type=receipt&downloadPdfPath=${element?.invoicePDFPath ? encrypt(element?.invoicePDFPath) : ''
                                }`
                              );
                            }
                          }}
                        >
                          {element?.refNo}

                        </div>
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {convertIntoAmount(element?.debit)}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {convertIntoAmount(element?.credit)}
                      </td>
                      <td className="tableData ">
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
          totalCount={clientStatementCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        /> */}
      </div>
    </GlobalLayout>
  );
}

export default ClientStatementReport;
