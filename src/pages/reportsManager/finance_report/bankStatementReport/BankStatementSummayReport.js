import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {convertIntoAmount, domainName,} from "../../../../constents/global";
import { useEffect, useMemo, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, DatePicker } from "antd";
import dayjs from "dayjs";
import { bankStatementReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams } from "react-router-dom";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";

function BankStatementSummayReport() {

  
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { bankId } = useParams()

  const [pageSize, setPageSize] = useState(10);
 
  const [bankfinalSettledData, setBankFinalSettledData] = useState(0)

  
  const dispatch = useDispatch();
  const {
    bankStatementReportList,
    bankStatementReport_loading,
    bankStatementReportCount,
  } = useSelector((state) => state.reports);
  const time = useWatch({
    control,
    name: "time",
    defaultValue: [],
  });

  const openingBalance = useMemo(() => {
    if (
      bankStatementReportList?.allTransactions &&
      bankStatementReportList.allTransactions.length > 0
    ) {
      return bankStatementReportList.allTransactions[0].previousBalance;
    }
    return undefined;
  }, [bankStatementReportList]);


  const FormattindataFuncton = (initialData) =>{
      if (!Array.isArray(initialData?.allTransactions) || initialData?.allTransactions?.length === 0) {
        return [];
  }

        let acc = initialData[0]?.openingBalance ?? 0;
    let mapOutput = [];

    initialData?.allTransactions.forEach((element) => {
    
      const output = {
         key:"statement",
        clientName: element?.clientName ? element?.clientName : element?.groupName ? element?.groupName : '-',
        date: element?.createdAt ? dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') : '-',
        dateofValue: element?.date ? dayjs(element?.date).format('DD-MM-YYYY hh:mm a') : '-',
        amountDebit: element?.debit_credit=='debit' ? element?.amount : 0,
        amountCredit: element?.debit_credit=='credit' ? element?.amount : 0,
        acc: element?.currentBalance,
        Description: element?.naration || "-",
        reference: element?.references ? `${element?.references} ${element?.references === 'receipt' ? element?.receiptNumber : ''}` : "-"
      };

      mapOutput.push(output);
    });
    
    mapOutput.push({
      key:"total",
          clientName: "Total",
          date: null,
          dateofValue: null,
          amountDebit:initialData?.summary?.totalDebit,
          amountCredit:  initialData?.summary?.totalCredit  ,
          acc:initialData?.summary?.closingBalance  ,
          Description: "",
          reference: ''
        });

        return mapOutput
      }







 useEffect(() => {

    setBankFinalSettledData(FormattindataFuncton(bankStatementReportList))
 
}, [bankStatementReportList]);
  const { RangePicker } = DatePicker;
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
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

  const requestPayLoadReturn = (pagination = true) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        "companyId": "",
        "directorId": "",
        "branchId": "",
        "clientIds": [],
        "groupIds": '',
        "bankId": bankId,
        startDate: time?.length > 0 ? dayjs(time[0]).format("YYYY-MM-DD") : '',
        endDate: time?.length > 0 ?  dayjs(time[1]).format("YYYY-MM-DD"): '',
        "references": "",
        "debit_credit": "",
        "amountFrom": "",
        "amountTo": "",
        "text": "",
        "sort": false,
        "isPagination": pagination

      },

    };
  };
  useEffect(() => {
    fetchClientServiceTaskReport(debouncedFilterText);
  }, [currentPage, debouncedFilterText, pageSize]);
  const fetchClientServiceTaskReport = () => {
    dispatch(bankStatementReportFunc(requestPayLoadReturn(true)));
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
    const worksheet = workbook.addWorksheet("BankSummaryDetails");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Entry Date", key: "entryDate", width: 20 },
      { header: "value Date", key: "valueDate", width: 20 },
      { header: "Group/Client", key: "groupClient", width: 40 },
      { header: "Description", key: "description", width: 20 },
      { header: "Reference", key: "reference", width: 25 },
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
    const response = await reportsServices?.bankStatementReportFunc?.(
      requestPayLoadReturn(false)
    );

  const transactions = FormattindataFuncton(response?.data) || [];
    transactions?.forEach((element, index) => {
      worksheet.addRow({
        sno: index + 1 ,
        entryDate:element?.date ?? "-",
        valueDate: element?.dateofValue ?? "-",
        groupClient: element?.clientName ?? "-",
        description: element?.Description ?? "-",
        reference: element?.reference ?? "-",
        debit: element.amountDebit,
        credit: element.amountCredit,
        balance: element.acc,
      });

    });



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
      link.download = "BankSummaryDetails.xlsx";
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
      "Group/Client",
      "Description",
      "Reference",
      "Debit",
      "Credit",
      "Balance",
    ];

    const response = await reportsServices?.bankStatementReportFunc(
      requestPayLoadReturn(false)
    );

    const transactions = FormattindataFuncton(response?.data)?? [];
   const body =  transactions?.map((element, index) => {
    return [  index + 1 ,
        element?.date ?? "-",
         element?.dateofValue ?? "-",
        element?.clientName ?? "-",
        element?.Description ?? "-",
       element?.reference ?? "-",
        element?.amountDebit,
      element?.amountCredit,
       element?.acc,]
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

    doc.save("BankSummaryDetails.pdf");
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec]">
          <div className="sm:flex  grid grid-cols-1  gap-2 sm:flex-wrap text-[14px]">
            {/* {(userInfoglobal?.userType === "admin" ||
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
            )} */}

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
                setValue('time', [])
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
        <div className="max-w-[300px] rounded overflow-hidden shadow-md p-2 mb-2 bg-white">
      <h2 className="text-md font-semibold mb-1">Bank Details</h2>
      <div className="mb-1">
        <span className="font-bold text-[14px] text-header">Bank Name: </span>
        <span className="text-gray-800 text-[13px]">{bankStatementReportList?.bankName}</span>
      </div>
      <div className="mb-1">
        <span className="font-bold text-[14px] text-header">Bankholder: </span>
        <span className="text-gray-800 text-[13px]">{bankStatementReportList?.bankholderName}</span>
      </div>
      <div className="mb-1">
        <span className="font-bold text-[14px] text-header">IFSC: </span>
        <span className="text-gray-800 text-[13px]">{bankStatementReportList?.ifscCode}</span>
      </div>
      <div className="mb-1">
        <span className="font-bold text-[14px] text-header">Branch Name: </span>
        <span className="text-gray-800 text-[13px]">{bankStatementReportList?.branchName}</span>
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

                <th className="border-none p-2 whitespace-nowrap ">Group/Client</th>
                <th className="border-none p-2 whitespace-nowrap ">Description	</th>
                <th className="border-none p-2 whitespace-nowrap ">References</th>

                <th className="border-none p-2 whitespace-nowrap ">
                  Debit
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Credit
                </th>
                <th className="border-none p-2 whitespace-nowrap ">
                  Balance
                </th>
              </tr>
            </thead>
            {bankStatementReport_loading ? (
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
                {bankfinalSettledData &&
                  bankfinalSettledData?.length > 0 ? (
                  bankfinalSettledData?.map((element, index) => {
                    return <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap  border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>


                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.date ??  '-'}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.dateofValue ?? '-'}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.clientName ?? "--"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.Description || "-"}
                      </td>

                      <td className="whitespace-nowrap  border-none p-2">
                        {element?.reference ?? "-"}
                      </td>
                      <td className="whitespace-nowrap text-center  border-none p-2">
                        {convertIntoAmount(element?.amountDebit) ?? '-'}
                      </td>
                      <td className="whitespace-nowrap  text-center border-none p-2">
                        {convertIntoAmount(element?.amountCredit) ?? '-'}
                      </td>
                      <td className="whitespace-nowrap  text-center border-none p-2">
                        { element?.acc ? element?.acc.toFixed(2) : '-'}
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
          totalCount={bankStatementReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        /> */}
      </div>
    </GlobalLayout>
  );
}

export default BankStatementSummayReport;
