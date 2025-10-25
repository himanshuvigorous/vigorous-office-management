import { Controller, useForm, } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { convertIntoAmount } from "../../../constents/global";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";

function EmployeeCashbook({ cashbookDetailsListdata, control, errors }) {
  const { setValue } = useForm();
  const [pageSize, setPageSize] = useState(10);
  const [employeeCashbookList, setEmployeeCashbookList] = useState([])
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");




  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);
  const employeeDetails = useMemo(() => ({
    name: cashbookDetailsListdata?.fullName,
    email: cashbookDetailsListdata?.branchData?.email,
    number: `${cashbookDetailsListdata?.branchData?.mobile?.code || ''} ${cashbookDetailsListdata?.branchData?.mobile?.number || ''}`.trim(),
    userName: cashbookDetailsListdata?.branchData?.userName,
    outstandingAmount: cashbookDetailsListdata?.summary?.closingBalance
  }), [cashbookDetailsListdata]);
  // Filtered data based on search text
  const filteredCashbookList = useMemo(() => {
    if (!debouncedFilterText) return employeeCashbookList;

    return employeeCashbookList.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(debouncedFilterText.toLowerCase())
      )
    );
  }, [employeeCashbookList, debouncedFilterText]);
  // Enhanced Excel generation with filters and styling
  const generateExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("EmployeeCashbookDetails");

    // Define columns with proper styling
    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 8 },
      { header: "Entry Date", key: "entryDate", width: 20 },
      { header: "Value Date", key: "valueDate", width: 15 },
      { header: "Description", key: "description", width: 30 },
      { header: "Reference", key: "reference", width: 20 },
      { header: "Debit", key: "debit", width: 15 },
      { header: "Credit", key: "credit", width: 15 },
      { header: "Balance", key: "balance", width: 15 },
      { header: "Updated By", key: "updatedBy", width: 20 },
    ];

    // Add title and employee details
    worksheet.mergeCells('A1:I1');
    worksheet.getCell('A1').value = 'Employee Cashbook Report';
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add employee details
    worksheet.addRow([]); // Empty row
    worksheet.addRow(['Employee Details:', '', '', '', '', '', '', '', '']);
    worksheet.addRow(['Name:', employeeDetails.name]);
    worksheet.addRow(['Email:', employeeDetails.email]);
    worksheet.addRow(['Phone:', employeeDetails.number]);
    worksheet.addRow(['Username:', employeeDetails.userName]);
    worksheet.addRow(['Outstanding Amount:', employeeDetails.outstandingAmount]);
    worksheet.addRow([]); // Empty row

    // Add date range
    const currentDate = dayjs().format('DD/MM/YYYY');
    worksheet.addRow(['Report Date:', currentDate]);
    worksheet.addRow(['Date Range:', `${dayjs().startOf('month').format('DD/MM/YYYY')} - ${dayjs().endOf('month').format('DD/MM/YYYY')}`]);
    worksheet.addRow([]); // Empty row

    // Header row
    const headerRow = worksheet.addRow([
      'S.No.', 'Entry Date', 'Value Date', 'Description', 'Reference',
      'Debit', 'Credit', 'Balance', 'Updated By'
    ]);

    // Style header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2E86AB" }, // Professional blue color
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows
    filteredCashbookList.forEach((element, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        entryDate: element?.date ?? "-",
        valueDate: element?.dateofValue ?? "-",
        description: element?.Description ?? "-",
        reference: element?.reference ?? "-",
        debit: convertIntoAmount(element.amountDebit),
        credit: convertIntoAmount(element.amountCredit),
        balance: convertIntoAmount(element.acc),
        updatedBy: element?.updatedBy ?? "-"
      });

      // Style data rows
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Highlight total row
        if (element.key === "total") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF0F0F0" },
          };
          cell.font = { bold: true };
        }
      });
    });

    // Add summary row
    const summaryRow = worksheet.addRow([]);
    worksheet.addRow(['Summary:', '', '', '', '', '', '', '', '']);

    const totalDebit = cashbookDetailsListdata?.summary?.totalDebit || 0;
    const totalCredit = cashbookDetailsListdata?.summary?.totalCredit || 0;
    const closingBalance = cashbookDetailsListdata?.summary?.closingBalance || 0;

    worksheet.addRow(['Total Debit:', '', '', '', '', convertIntoAmount(totalDebit)]);
    worksheet.addRow(['Total Credit:', '', '', '', '', '', convertIntoAmount(totalCredit)]);
    worksheet.addRow(['Closing Balance:', '', '', '', '', '', '', convertIntoAmount(closingBalance)]);

    // Apply autofilter to data range (excluding header and summary)
    const dataRange = `A${headerRow.number}:I${headerRow.number + filteredCashbookList.length}`;
    worksheet.autoFilter = dataRange;

    // Freeze header row
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: headerRow.number }
    ];

    // Export file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Employee_Cashbook_${dayjs().format('DD-MM-YYYY')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredCashbookList, employeeDetails, cashbookDetailsListdata]);

  // PDF generation
  const generatePDF = useCallback(async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });

    // Title
    doc.setFontSize(16);
    doc.text("Employee Cashbook Report", 40, 30);

    // Employee details
    doc.setFontSize(10);
    let yPosition = 60;
    doc.text(`Employee: ${employeeDetails.name}`, 40, yPosition);
    doc.text(`Date: ${dayjs().format('DD/MM/YYYY')}`, 300, yPosition);
    yPosition += 20;
    doc.text(`Period: ${dayjs().startOf('month').format('DD/MM/YYYY')} - ${dayjs().endOf('month').format('DD/MM/YYYY')}`, 40, yPosition);

    const headers = [
      "S.No.",
      "Entry Date",
      "Value Date",
      "Description",
      "Reference",
      "Debit",
      "Credit",
      "Balance",
      "Updated By"
    ];

    const body = filteredCashbookList.map((element, index) => [
      index + 1,
      element?.date ?? "-",
      element?.dateofValue ?? "-",
      element?.Description ?? "-",
      element?.reference ?? "-",
      convertIntoAmount(element?.amountDebit),
      convertIntoAmount(element?.amountCredit),
      convertIntoAmount(element?.acc),
      element?.updatedBy ?? "-"
    ]);

    autoTable(doc, {
      startY: yPosition + 20,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 6,
        fontSize: 8,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [46, 134, 171], // Matching blue color
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawCell: (data) => {
        // Highlight total row
        if (data.cell.raw === "Total") {
          doc.setFillColor(240, 240, 240);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setTextColor(0, 0, 0);
          doc.setFont(undefined, 'bold');
        }
      },
    });

    doc.save(`Employee_Cashbook_${dayjs().format('DD-MM-YYYY')}.pdf`);
  }, [filteredCashbookList, employeeDetails]);




  useEffect(() => {
    setEmployeeCashbookList(FormattindataFuncton(cashbookDetailsListdata))
  }, [cashbookDetailsListdata])

  const FormattindataFuncton = (initialData) => {
    if (!Array.isArray(initialData?.allTransactions) || initialData?.allTransactions?.length === 0) {
      return [];
    }


    let mapOutput = [
    ];

    initialData?.allTransactions.forEach((element) => {

      const output = {
        key: "statement",

        date: element?.createdAt ? dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') : '-',
        dateofValue: element?.date ? dayjs(element?.date).format('DD-MM-YYYY') : '-',
        amountDebit: element?.debit_credit == 'debit' ? element?.amount : 0,
        amountCredit: element?.debit_credit == 'credit' ? element?.amount : 0,
        acc: element?.currentBalance,
        Description: element?.naration || "-",
        reference: element?.referanceBy || "-"
      };

      mapOutput.push(output);
    });

    mapOutput.push({
      key: "total",

      date: null,
      dateofValue: null,
      amountDebit: initialData?.summary?.totalDebit,
      amountCredit: initialData?.summary?.totalCredit,
      acc: initialData?.summary?.closingBalance,
      Description: "Total",
      reference: ''
    });

    return mapOutput
  }






  return (

    <div className="bg-grey-100 w-full p-1">
      <div className="">

        <div className="space-y-1.5 flex justify-end items-center">



        </div>
      </div>

      <div className="max-w-[300px] rounded overflow-hidden shadow-md p-2 mb-2 bg-white">
        <h2 className="text-md font-semibold mb-1">Employee Details</h2>
        <div className="mb-1">
          <span className="font-bold text-[14px] text-header">Employee Name: </span>
          <span className="text-gray-800 text-[13px]">{cashbookDetailsListdata?.fullName}</span>
        </div>
        <div className="mb-1">
          <span className="font-bold text-[14px] text-header">Email: </span>
          <span className="text-gray-800 text-[13px]">{cashbookDetailsListdata?.branchData?.email}</span>
        </div>
        <div className="mb-1">
          <span className="font-bold text-[14px] text-header">Number: </span>
          <span className="text-gray-800 text-[13px]">{cashbookDetailsListdata?.branchData?.mobile?.code} {cashbookDetailsListdata?.branchData?.mobile?.number}</span>
        </div>
        <div className="mb-1">
          <span className="font-bold text-[14px] text-header">UserName: </span>
          <span className="text-gray-800 text-[13px]">{cashbookDetailsListdata?.branchData?.userName}</span>
        </div>
        <div className="mb-1">
          <span className="font-bold text-[14px] text-header">Outstanding Amount : </span>
          <span className="text-gray-800 text-[13px]">{cashbookDetailsListdata?.summary?.closingBalance}</span>
        </div>
      </div>

      <div className="flex flex-row w-full flex-wrap gap-2  ">

        <div className="sm:w-auto w-full">
          <Controller
            name="startDate"
            control={control}

            render={({ field }) => (
              <CustomDatePicker
                report={true}
               
                size={"middle"} field={field} errors={errors} />
            )}
          />
        </div>
        <div className="sm:w-auto w-full">
          <Controller
            name="endDate"
            report={true}
            control={control}

            render={({ field }) => (
              <CustomDatePicker size={"middle"}
            
                report={true} field={field} errors={errors} />
            )}
          />
        </div>


      </div>
      <div>
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
              <th className="border-none p-2 whitespace-nowrap ">
                Updated By
              </th>
            </tr>
          </thead>
          {!cashbookDetailsListdata ? (
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
              {employeeCashbookList &&
                employeeCashbookList?.length > 0 ? (
                employeeCashbookList?.map((element, index) => {
                  return <tr
                    className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151] text-[14px]`}
                  >
                    <td className="whitespace-nowrap  border-none p-2">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>


                    <td className="whitespace-nowrap  border-none p-2">
                      {element?.date ?? '-'}
                    </td>
                    <td className="whitespace-nowrap  border-none p-2">

                      {element?.dateofValue ?? '-'}
                    </td>


                    <td className=" max-w-[350px] min-w-[200px] border-none p-2">
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
                      {element?.acc ? element?.acc.toFixed(2) : '-'}
                    </td>
                    <td className=" max-w-[350px] min-w-[200px] border-none p-2">
                      {element?.updatedBy || "-"}
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

    </div>

  );
}

export default EmployeeCashbook;
