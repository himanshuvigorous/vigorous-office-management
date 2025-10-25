import React, { useEffect, useRef } from "react";
import { FaUser, FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { Modal, Button } from "antd";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { clientSearch } from "../clientManagement/clientFeatures/_client_reducers";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


function ClientListModal({ groupId, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { clientList, loading } = useSelector((state) => state.client);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchClientListData();
  }, [groupId]);

  const fetchClientListData = () => {
    let reqData = {
      companyId: groupId?.companyId,
      branchId: groupId?.branchId,
      groupId: groupId?._id,
      directorId: "",
      organizationId: "",
      industryId: "",
      text: "",
      sort: true,
      status: "",
      isPagination: false,
    };
   if(groupId?.companyId && groupId?.branchId && groupId?._id){
    dispatch(clientSearch(reqData));
   }
  };

  const handleCancel = () => {
    onClose();
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Client Report');

    // Add headers
    const headers = [
      'S.No.',
      'Client ID',
      'Client Name',
      'Organization',
      'Mobile No.',
      'Email ID',
      'PAN Number',
      'Created At',
      'Created By',
      'Status'
    ];
    worksheet.addRow(headers);

    // Add data rows
    clientList.forEach((element, index) => {
      const rowData = [
        index + 1,
        element?.userName || '-',
        element?.fullName || '-',
        element?.organizationName || '-',
        element?.mobile?.code + element?.mobile?.number || '-',
        element?.email || '-',
        element?.clientProfile?.penNumber || '-',
        dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-',
        element?.createdBy || '-',
        element?.status ? "Active" : "InActive"
      ];
      worksheet.addRow(rowData);
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
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

    // Auto filter
    worksheet.autoFilter = {
      from: 'A1',
      to: `J${clientList.length + 1}`,
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
      link.download = `Client_Report_${groupId?.groupName || 'Group'}.xlsx`;
      link.click();
    });
  };

  const exportToPDF = () => {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt'
    });
  
    // Title
    doc.setFontSize(16);
    doc.text(`Client List - ${groupId?.fullName} / ${groupId?.groupName}`, 40, 40);
    doc.text(`${groupId?.email ?? "-"} / ${groupId?.mobile?.code + groupId?.mobile?.number}`, 40, 60);
  
    // Table data - prepare headers and body
    const headers = [
      'S.No.', 
      'Client ID', 
      'Client Name', 
      'Organization', 
      'Mobile No.', 
      'Email ID', 
      'PAN Number', 
      'Created At', 
      'Status'
    ];
  
    const body = clientList.map((element, index) => [
      index + 1,
      element?.userName || '-',
      element?.fullName || '-',
      element?.organizationName || '-',
      element?.mobile?.code + element?.mobile?.number || '-',
      element?.email || '-',
      element?.clientProfile?.penNumber || '-',
      dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-',
      element?.status ? "Active" : "InActive"
    ]);
  
    autoTable(doc, {
      startY: 80,
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
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(10);
        const pageCount = doc.internal.getNumberOfPages();
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 20);
      }
    });
    doc.save(`Client_Report_${groupId?.groupName || 'Group'}.pdf`);
  };

  return (
    <Modal
      title={`Client List / ${groupId?.fullName} / ${groupId?.groupName}`}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width="95%"
      contentBg="#f3f4f6"
      style={{ top: 20 }}
      className="antmodalclassName"
    >
      <div className="sm:flex grid grid-cols-1 sm:justify-between  w-full items-center mb-4">
        <div>
          {groupId?.email ?? "-"} / {groupId?.mobile?.code + groupId?.mobile?.number}
        </div>
        <div className="flex justify-end sm:p-0 p-1 space-x-2">
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
                    <span>Profile Image</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Client Id</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Client Name</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Organization</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Mb. No.</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Email Id</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>PAN Number</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>CreatedAt</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>CreatedBy</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>status</span>
                  </div>
                </th>
              </tr>
            </thead>
            {loading ? (
              <tr className="bg-white bg-opacity-5">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {clientList && clientList?.length > 0 ? (
                  clientList?.map((element, index) => (
                    <tr
                      className={`${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                      key={index}
                    >
                      <td className="whitespace-nowrap border-none p-2">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {element.profileImage ? (
                          <img
                            alt=""
                            src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                            <FaUser className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.userName || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.fullName || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.organizationName || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.mobile?.code + element?.mobile?.number || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.email || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.clientProfile?.penNumber || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.createdBy || '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.status ? "Active" : "InActive"}
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
            )}
          </table>
        </div>
      </div>
    </Modal>
  );
}

export default ClientListModal;