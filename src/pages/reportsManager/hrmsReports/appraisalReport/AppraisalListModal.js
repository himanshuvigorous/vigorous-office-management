import React, { useEffect, useRef } from "react";
import { FaUser, FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { Modal, Button } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


function AppraisalListModal({ appraisalData, isOpen, onClose, employeData }) {
  const dispatch = useDispatch();
  // const { appraisalData, loading } = useSelector((state) => state.client);
  const tableRef = useRef(null);

  const handleCancel = () => {
    onClose();
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Appraisal Report');

    const headers = [
      'S.No.',
      'Employee Name',
      'Previous Package',
      'Previous Monthly Salary',
      'Previous PerDay Salary',
      'New Package',
      'New Monthly Salary',
      'New PerDay Salary',
      'Increment Date',
      'Increment Percentage',
      'Increment Amount',
      'Is Percentage',
    ];
    worksheet.addRow(headers);

    appraisalData?.forEach((element, index) => {
      const rowData = [
        index + 1,
        employeData?.fullName || '-',
        element?.previousPackage || '-',
        element?.previousMonthlySalary || '-',
        element?.previousPerDaySalary || '-',
        element?.newPackage || '-',
        element?.newMonthlySalary || '-',
        element?.newPerDaySalary || '-',
        element?.incrementDate ? dayjs(element.incrementDate).format('DD-MM-YYYY hh:mm a') : '-',
        element?.incrementPercentage || '-',
        element?.incrementAmount || '-',
        element?.isPercentage ? 'Yes' : 'No',
      ];
      worksheet.addRow(rowData);
    });

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Style all rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Apply auto-filter
    worksheet.autoFilter = {
      from: 'A1',
      to: `L${appraisalData.length + 1}`,
    };

    // Auto column width
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Export file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Appraisal_Report_${employeData?.fullName || 'Employee'}.xlsx`;
      link.click();
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
    });

    // Title & employee info (if available)
    doc.setFontSize(16);
    doc.text(`Appraisal Report - ${employeData?.fullName || '-'}`, 40, 40);
    doc.setFontSize(12);

    // Table headers
    const headers = [
      'S.No.',
      'Employee Name',
      'Previous Package',
      'Previous Monthly Salary',
      'Previous PerDay Salary',
      'New Package',
      'New Monthly Salary',
      'New PerDay Salary',
      'Increment Date',
      'Increment Percentage',
      'Increment Amount',
      'Is Percentage',
    ];

    // Table rows
    const body = appraisalData.map((element, index) => [
      index + 1,
      employeData?.fullName || '-', // Assuming employeData is shared
      element?.previousPackage || '-',
      element?.previousMonthlySalary || '-',
      element?.previousPerDaySalary || '-',
      element?.newPackage || '-',
      element?.newMonthlySalary || '-',
      element?.newPerDaySalary || '-',
      element?.incrementDate ? dayjs(element.incrementDate).format('DD-MM-YYYY hh:mm a') : '-',
      element?.incrementPercentage || '-',
      element?.incrementAmount || '-',
      element?.isPercentage ? 'Yes' : 'No',
    ]);

    // Create table using autoTable
    autoTable(doc, {
      startY: 80,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 6,
        fontSize: 9,
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
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 20);
      },
    });

    doc.save(`Appraisal_Report_${employeData?.fullName || 'Employee'}.pdf`);
  };


  return (
    <Modal
      title={`Appraisal Details / ${employeData?.fullName}`}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width="95%"
      contentBg="#f3f4f6"
      style={{ top: 20 }}
      className="antmodalclassName"
    >
      <div className="flex justify-end items-center mb-1">
        {/* <div>
          {appraisalData?.email ?? "-"} / {appraisalData?.mobile?.code + appraisalData?.mobile?.number}
        </div> */}
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<FaFileExcel />}
            onClick={exportToExcel}
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<FaFilePdf />}
            onClick={exportToPDF}
            className="flex items-center bg-red-600 hover:bg-red-700"
          >
            Export PDF
          </Button>
        </div>
      </div>
      <div className="w-full p-1">
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl" ref={tableRef}>
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>S.No.</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Employee Name</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Previous Package</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Previous Monthly Salary</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Previous PerDay Salary</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>New Package</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>New Monthly Salary</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>New PerDay Salary</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Increment Date</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Increment Percentage</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Increment Amount</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Is Percentage</span>
                  </div>
                </th>
              </tr>
            </thead>
            {/* {loading ? (
              <tr className="bg-white bg-opacity-5">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : ( */}
            <tbody>
              {appraisalData && appraisalData?.length > 0 ? (
                appraisalData?.map((element, index) => (
                  <tr
                    className={`${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                    key={index}
                  >
                    <td className="whitespace-nowrap border-none p-2">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {employeData?.fullName}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.previousPackage || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.previousMonthlySalary || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.previousPerDaySalary || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.newPackage || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.newMonthlySalary || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.newPerDaySalary || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {dayjs(element?.incrementDate).format('DD-MM-YYYY hh:mm a') || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.incrementPercentage || '-'}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.incrementAmount}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.isPercentage ? "Yes" : "No"}
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
            </tbody>
            {/* )
            } */}
          </table>
        </div>
      </div>
    </Modal>
  );
}

export default AppraisalListModal;