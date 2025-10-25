import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Select, Dropdown, Button, Space } from "antd";
import dayjs from "dayjs";
import usePermissions from "../../../config/usePermissions";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { encrypt } from "../../../config/Encryption";
import Swal from "sweetalert2";
import {
  deleteLeadmanagementFeatureFunc,
  getLeadmanagementFeatureList,
  LeadmanagementFeatureStatus,
} from "./LeadmanagementFeature/_LeadmanagementFeature_reducers";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { leadManagementStatus } from "../../../constents/ActionConstent";
import { getLeadCategoryList } from "../LeadsManagementCategory/LeadCategoryFeatures/_LeadCategory_reducers";
import {
  customDayjs,
  inputAntdSelectClassNameFilter,
  pageSizeLead,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import ListLoader from "../../../global_layouts/ListLoader";
import { DatePicker } from "antd";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { FaEdit, FaEye } from "react-icons/fa";
import { domainName } from "../../../constents/global";
import { useForm } from "react-hook-form";
import { BiDownArrowAlt, BiTransfer } from "react-icons/bi";
import TransferReaquestCreateModal from "./TransferReaquestCreateModal";
import { LeadmanagementFeatureServices } from "./LeadmanagementFeature/_LeadmanagementFeature_services";
import * as ExcelJS from "exceljs";
import "jspdf-autotable";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";

import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
function LeadManagement() {
  const { RangePicker } = DatePicker;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const {
    LeadCategoryListData,
    totalLeadCategoryCount,
    loading: categoryLoading,
  } = useSelector((state) => state.leadCategory);

  const {
    LeadmanagementFeatureListData,
    totalLeadmanagementFeatureCount,
    loading,
  } = useSelector((state) => state.LeadmanagementFeature);

  const [transferModal, setTransferModal] = useState({
    isOpen: false,
    leadId: null,
    portal: "",
  });
  const handlecloseTransferModal = () => {
    setTransferModal({
      isOpen: false,
      leadId: null,
      portal: "",
    });
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  const handlePageSizeChange = (e) => {
    setLimit(Number(e));
    setCurrentPage(Number(1));
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = parseInt(searchParams.get("limit")) || 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSubCategory = searchParams.get("subCategory") || "";
  const initialTime1 = searchParams.get("time1") || null;
  const initialTime2 = searchParams.get("time2") || null;


  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [time, setTime] = useState([
    (initialTime1 && initialTime1 != null) ? dayjs(initialTime1) : null,
    (initialTime2 && initialTime2 != null) ? dayjs(initialTime2) : null,
  ]);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [isPDFLoading, setIsPDFLoading] = useState(false);



  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (time?.length > 0) {
      params.set("time1", time[0] && dayjs(time[0]).isValid() ? dayjs(time[0]).format("YYYY-MM-DD") : "");
      params.set("time2", time[1] && dayjs(time[1]).isValid() ? dayjs(time[1]).format("YYYY-MM-DD") : "");
    }
    if (limit) params.set("limit", limit);
    if (categoryId) params.set("categoryId", categoryId);
    if (subCategory) params.set("subCategory", subCategory);
    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [
    branchId,
    status,
    searchText,
    categoryId,
    subCategory,
    currentPage,
    time,
    limit,
  ]);
  useEffect(() => {
    fetchLeadmanagementFeatureList();
  }, [
    branchId,
    status,
    searchText,
    categoryId,
    subCategory,
    currentPage,
    time,
    limit,
  ]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setCategoryId("");
    setSubCategory("");
    setStatus("");
    setTime([]);
    setLimit(10);
    setSearchText("");
  };
  const onChange = (e) => {
    setSearchText(e);
  };

  const onPaginationChange = (page) => setCurrentPage(page);
  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };
  const handleCategoryIdChange = (value) => {
    setCategoryId(value);
    setCurrentPage(1);
  };
  const handleSubCategoryChange = (value) => {
    setSubCategory(value);
    setCurrentPage(1);
  };
  const handleFilterStatus = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };
  const handleFilterTime = (value) => {
    setTime(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e, _id) => {
    const finalPayload = {
      _id: _id,
      status: e,
    };

    dispatch(LeadmanagementFeatureStatus(finalPayload)).then((data) => {
      if (!data?.error) {
        fetchLeadmanagementFeatureList();
      }
    });
  };

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

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
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, []);

  const fetchLeadmanagementFeatureList = () => {
    const reqListData = {
      limit: limit,
      page: currentPage,
      reqPayload: {
        assignedToId: "",
        leadCategoryId: categoryId,
        leadSubCategoryId: subCategory,
        startDate: time?.length > 0 && time[0] ? customDayjs(time[0]) : null,
        endDate: time?.length > 1 && time[1] ? customDayjs(time[1]) : null,
        text: searchText,
        sort: true,
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        isPagination: true,
        status: status,
      },
    };
    dispatch(getLeadmanagementFeatureList(reqListData));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };

    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLeadmanagementFeatureFunc(reqData)).then((data) => {
          if (currentPage > 1 && LeadmanagementFeatureListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));
          } else {
            !data.error && fetchLeadmanagementFeatureList();
          }
        });
      }
    });
  };

  useEffect(() => {
    dispatch(
      getLeadCategoryList({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
    );
  }, []);
  const generateExcel = async () => {
    try {
      setIsExcelLoading(true)
      // Create workbook with metadata
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Lead Management System';
      workbook.lastModifiedBy = 'Lead Management System';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Create worksheet with frozen headers
      const worksheet = workbook.addWorksheet("Leads Report", {
        views: [{ state: 'frozen', ySplit: 1 }],
        properties: { tabColor: { argb: 'FF4472C4' } }
      });

      // Define columns with all requested fields
      worksheet.columns = [
        { header: "No.", key: "sno", width: 8 },
        { header: "Lead Name", key: "name", width: 25 },
        { header: "Created Date", key: "createdAt", width: 18 },
        { header: "Mobile Number", key: "mobile", width: 18 },
        { header: "Email", key: "email", width: 30 },
        { header: "Location", key: "location", width: 25 },
        { header: "Source", key: "source", width: 15 },
        { header: "Interested In", key: "intrested", width: 20 },
        { header: "Category", key: "categoryName", width: 20 },
        { header: "Subcategory", key: "subCategoryName", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Remark", key: "remark", width: 30 },
        { header: "Assigned To", key: "assignedTo", width: 30 },
      ];

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.height = 25;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF2F5496" } // Dark blue
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }, // White text
          size: 11,
          name: 'Calibri'
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } }
        };
      });

      // Fetch data from API
      const response = await LeadmanagementFeatureServices?.getLeadmanagementFeatureSearch({
        assignedToId: "",
        leadCategoryId: categoryId,
        leadSubCategoryId: subCategory,
        startDate: time?.length > 0 && time[0] ? customDayjs(time[0]) : null,
        endDate: time?.length > 1 && time[1] ? customDayjs(time[1]) : null,
        text: searchText,
        sort: true,
        companyId: userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        isPagination: false,
        status: status,
      });

      if (!response?.data?.docs) {
        console.error("No data received from API");
        return;
      }

      // Format data for Excel
      const apiData = response.data.docs.map((lead, index) => ({
        sno: index + 1,
        name: lead.name || "-",
        createdAt: lead.createdAt
          ? dayjs(lead.createdAt).format('DD-MM-YYYY HH:mm')
          : "-",
        mobile: lead.mobile
          ? `${lead.mobile.code || ''} ${lead.mobile.number || ''}`.trim()
          : "-",
        email: lead.email || "-",
        location: lead.location || "-",
        source: lead.source || "-",
        intrested: lead.intrested || "-",
        categoryName: lead.categoryName || "-",
        subCategoryName: lead.subCategoryName || "-",
        status: lead.status || "-",
        remark: lead.remark || "-",
        assignedTo: lead.userData
          ? `${lead.userData.fullName}\n(${lead.userData.designationName})`
          : "-",

      }));

      // Add data rows with styling
      apiData.forEach((item) => {
        const row = worksheet.addRow(item);

        // Alternate row coloring
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: row.number % 2 === 0 ? "FFF2F2F2" : "FFFFFFFF" }
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true
          };
          cell.border = {
            top: { style: "thin", color: { argb: "FFD9D9D9" } },
            left: { style: "thin", color: { argb: "FFD9D9D9" } },
            bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
            right: { style: "thin", color: { argb: "FFD9D9D9" } }
          };
          cell.font = { size: 10, name: 'Calibri' };
        });

        // Style status column based on value
        const statusCell = row.getCell('status');
        const statusColorMap = {
          'new': { bg: 'FFE3E8EA', text: 'FF2D3E50' },
          'contacted': { bg: 'FFE6F7FF', text: 'FF0078D4' },
          'converted': { bg: 'FFE6F6E6', text: 'FF107C10' },
          'lost': { bg: 'FFFDE7E9', text: 'FFA4262C' },
          'follow up': { bg: 'FFFFF4CE', text: 'FF8C6D00' }
        };

        const statusKey = statusCell.value?.toString().toLowerCase();
        if (statusKey && statusColorMap[statusKey]) {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: statusColorMap[statusKey].bg }
          };
          statusCell.font.color = { argb: statusColorMap[statusKey].text };
        }
      });

      // Add auto-filter for all columns
      worksheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(64 + worksheet.columns.length)}1`
      };

      // Auto-size columns based on content
      worksheet.columns.forEach(column => {
        let maxLength = column.header.length;
        column.eachCell({ includeEmpty: true }, cell => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = Math.min(Math.max(maxLength + 2, 10), 50);
      });

      // Add title section
      const titleRow = worksheet.insertRow(1, ['LEADS EXPORT']);
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + worksheet.columns.length)}1`);
      titleRow.height = 30;
      titleRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      titleRow.getCell(1).font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 16,
        name: 'Calibri'
      };
      titleRow.getCell(1).alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };

      // Add filter instructions
      const filterNoteRow = worksheet.addRow([]);
      const filterNoteCell = worksheet.mergeCells(`A${filterNoteRow.number}:${String.fromCharCode(64 + worksheet.columns.length)}${filterNoteRow.number}`);
      filterNoteRow.getCell(1).value = 'Use the dropdown filters in the header row to filter data. You can search for specific values in the filter dropdowns.';
      filterNoteRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF808080' } };
      filterNoteRow.getCell(1).alignment = { horizontal: 'left' };

      // Add export metadata footer
      const footerRow = worksheet.addRow([]);
      const footerCell = worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(64 + worksheet.columns.length)}${footerRow.number}`);
      footerRow.getCell(1).value = `Exported by ${userInfoglobal?.fullName || 'System'} on ${dayjs().format('DD-MM-YYYY HH:mm')}`;
      footerRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF808080' } };
      footerRow.getCell(1).alignment = { horizontal: 'right' };

      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Leads_Export_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.log("Error generating Excel:", error);
      // Add user notification here if needed
      alert('Failed to generate Excel report. Please try again or contact support.');
    } finally {
      setIsExcelLoading(false)

    }
  };


  // Modern PDF Export Function
  const generatePDF = async () => {
    try {
      setIsPDFLoading(true)
      // Fetch data from API
      const response = await LeadmanagementFeatureServices?.getLeadmanagementFeatureSearch({
        assignedToId: "",
        leadCategoryId: categoryId,
        leadSubCategoryId: subCategory,
        startDate: time?.length > 0 && time[0] ? customDayjs(time[0]) : null,
        endDate: time?.length > 1 && time[1] ? customDayjs(time[1]) : null,
        text: searchText,
        sort: true,
        companyId: userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        isPagination: false,
        status: status,
      });

      if (!response?.data?.docs) {
        console.error("No data received from API");
        return;
      }

      // Format data for PDF
      const pdfData = response.data.docs.map((lead, index) => [
        index + 1,
        lead.name || "-",
        lead.createdAt ? dayjs(lead.createdAt).format('DD-MM-YYYY HH:mm') : "-",
        lead.mobile ? `${lead.mobile.code || ''} ${lead.mobile.number || ''}`.trim() : "-",
        lead.email || "-",
        lead.location || "-",
        lead.source || "-",
        lead.intrested || "-",
        lead.categoryName || "-",
        lead.status || "-",
        lead.remark || "-",
        lead.userData ? `${lead.userData.fullName} (${lead.userData.designationName})` : "-",
      ]);

      // Create PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(40, 53, 147);
      doc.text('LEADS REPORT', 140, 15, { align: 'center' });

      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exported by: ${userInfoglobal?.fullName || 'System'}`, 20, 25);
      doc.text(`Export date: ${dayjs().format('DD-MM-YYYY HH:mm')}`, 260, 25, { align: 'right' });
      autoTable(doc, {
        startY: 30,
        head: [
          [
            'No.', 'Lead Name', 'Created Date', 'Mobile', 'Email',
            'Location', 'Source', 'Interested In', 'Category',
            'Status', 'Remark', 'Assigned To'
          ]
        ],
        body: pdfData,
        theme: 'grid',
        headStyles: {
          fillColor: [47, 84, 150], // Dark blue
          textColor: 255, // White text
          fontStyle: 'bold',
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [242, 242, 242] // Light gray
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 12 }, // No.
          1: { cellWidth: 25 }, // Name
          2: { cellWidth: 18 }, // Date
          3: { cellWidth: 18 }, // Mobile
          4: { cellWidth: 30 }, // Email
          5: { cellWidth: 25 }, // Location
          6: { cellWidth: 18 }, // Source
          7: { cellWidth: 20 }, // Interested
          8: { cellWidth: 20 }, // Category
          9: { cellWidth: 18 }, // Status
          10: { cellWidth: 30 }, // Remark
          11: { cellWidth: 30 } // Assigned
        },
        didDrawCell: (data) => {
          // Color code status cells
          if (data.section === 'body' && data.column.index === 10) {
            const status = data.cell.raw.toString().toLowerCase();
            const colors = {
              'new': { bg: [227, 232, 234], text: [45, 62, 80] },
              'contacted': { bg: [230, 247, 255], text: [0, 120, 212] },
              'converted': { bg: [230, 246, 230], text: [16, 124, 16] },
              'lost': { bg: [253, 231, 233], text: [164, 38, 44] },
              'follow up': { bg: [255, 244, 206], text: [140, 109, 0] }
            };

            if (colors[status]) {
              doc.setFillColor(...colors[status].bg);
              doc.setTextColor(...colors[status].text);
              doc.rect(
                data.cell.x,
                data.cell.y,
                data.cell.width,
                data.cell.height,
                'F'
              );
              doc.text(
                data.cell.raw,
                data.cell.x + data.cell.padding('left'),
                data.cell.y + data.cell.height / 2 + 3
              );
              return false; // Prevent default drawing
            }
          }
        }
      });


      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      }

      // Download PDF
      doc.save(`Leads_Report_${dayjs().format('YYYY-MM-DD_HH-mm')}.pdf`);

    } catch (error) {
      console.log("Error generating PDF:", error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsPDFLoading(false)
    }
  };
  const ExportButtons = () => (
    <div className="flex justify-end items-center gap-2">
      <button
        onClick={generatePDF}
        disabled={isPDFLoading}
        className={`py-2 px-4 rounded-md flex items-center text-white text-sm transition-colors ${isPDFLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
      >
        {isPDFLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </>
        )}
      </button>

      <button
        onClick={generateExcel}
        disabled={isExcelLoading}
        className={`py-2 px-4 rounded-md flex items-center text-white text-sm transition-colors ${isExcelLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {isExcelLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </>
        )}
      </button>
    </div>
  );
  function showSwal(message) {
    Swal.fire({
      title: false,
      text: message || 'No message provided',
      icon: false,
      confirmButtonText: 'OK',
    });
  }
  return (
    <GlobalLayout>
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-5 2xl:grid-cols-7 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-4 w-full items-center">
        {(userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "companyDirector") && (
            <div className="relative md:flex justify-center items-center space-x-2  text-[14px] rounded-md">
              <Select
                defaultValue={""}
                disabled={loading}
                onChange={handleBranchChange}
                value={branchId}
                className={`${inputAntdSelectClassNameFilter} `}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Select.Option value="">Select Branch</Select.Option>
                {branchListloading ? (
                  <Select.Option disabled>
                    <ListLoader />
                  </Select.Option>
                ) : (
                  branchList?.map((type) => (
                    <Select.Option key={type?._id} value={type?._id}>
                      {type?.fullName}
                    </Select.Option>
                  ))
                )}
              </Select>
            </div>
          )}

        <div className="w-full">
          <Select
            onChange={handleCategoryIdChange}
            value={categoryId}
            onFocus={() => {
              setValue("subCategory", "");
            }}
            className={` ${inputAntdSelectClassNameFilter}`}
            placeholder="Select Category"
            showSearch
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            <Select.Option value="">Select Category</Select.Option>
            {categoryLoading ? (
              <Select.Option disabled>
                <ListLoader />
              </Select.Option>
            ) : (
              sortByPropertyAlphabetically(LeadCategoryListData, "name")?.map(
                (element) => (
                  <Select.Option value={element?._id}>
                    {" "}
                    {element?.name}{" "}
                  </Select.Option>
                )
              )
            )}
          </Select>
        </div>
        <div className="w-full">
          <Select
            onChange={handleSubCategoryChange}
            value={subCategory}
            className={` ${inputAntdSelectClassNameFilter}`}
            placeholder="Select SubCategory"
            showSearch
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            <Select.Option value="">Select SubCategory</Select.Option>
            {categoryLoading ? (
              <Select.Option disabled>
                <ListLoader />
              </Select.Option>
            ) : (
              sortByPropertyAlphabetically(LeadCategoryListData, "name")
                ?.find((element) => element?._id == categoryId)
                ?.leadSubCategoryData?.map((element) => (
                  <Select.Option value={element?._id}>
                    {" "}
                    {element?.name}{" "}
                  </Select.Option>
                ))
            )}
          </Select>
        </div>

        <div className="">
          <Select
            className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.status ? "border-[1px] " : "border-gray-300"
              }`}
            placeholder="Select Status"
            value={status}
            showSearch
            onChange={handleFilterStatus}
            disabled={loading}
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            <Select.Option value="">Select Status</Select.Option>
            {leadManagementStatus?.map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="w-full">
          <RangePicker
            value={time ? time : null}
            onChange={handleFilterTime}
            format="YYYY-MM-DD"
            getPopupContainer={() => document.body} // important: avoids layout issues
            popupClassName="vertical-range-calendar"
            className="custom-range-picker"
          />
        </div>
        <div className="flex justify-end  items-center">
          <button
            onClick={() => {
              handleResetFilters();
            }}
            className="bg-header w-full  py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
          >
            <span className="text-[12px]">Reset</span>
          </button>
        </div>
        {canCreate && (
          <Tooltip placement="topLeft" title="Add Leads">
            <button
              onClick={() => navigate("/admin/lead-management/create")}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Add Leads</span>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center p-2 gap-2">
        <span className="text-sm font-light text-gray-500">Rows per page:</span>
        <Select
          value={limit}
          onChange={handlePageSizeChange}
          className="text-sm font-light text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
        >
          {pageSizeLead.map((size) => (
            <Select.Option key={size} value={size}>
              {size}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="flex justify-end items-center gap-2">
        {ExportButtons()}
      </div>
      {loading ? (
        <Loader2 />
      ) : (
        <>
          <div className="bg-[#ffffff] w-full overflow-x-auto rounded-xl mt-1">
            {canRead && (
              <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                <thead className="">
                  <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                    <th className="border-none p-2 whitespace-nowrap w-[10%]">
                      S.No.
                    </th>
                    {/* <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Follow Up Date</span>
                      </div>
                    </th> */}
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Lead </span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Category </span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Mobile </span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Email </span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Interest </span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Sourse </span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Last Remark </span>
                      </div>
                    </th>
                    {/* 
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>created At</span>
                      </div>
                    </th> */}

                    {canUpdate && <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Status</span>
                      </div>
                    </th>}
                    {
                      <th className="border-none p-2 whitespace-nowrap w-[10%]">
                        Action
                      </th>
                    }
                  </tr>
                </thead>
                {loading ? (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={10}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      <Loader2 />
                    </td>
                  </tr>
                ) : (
                  <tbody>
                    {LeadmanagementFeatureListData &&
                      LeadmanagementFeatureListData?.length > 0 ? (
                      LeadmanagementFeatureListData?.map((element, index) => (
                        <tr
                          key={index}
                          className={` ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                          <td className="whitespace-nowrap border-none p-2 ">
                            {index + 1 + (currentPage - 1) * limit}
                          </td>

                          <td className="tableData whitespace-nowrap border-none p-2 ">
                            {element?.name ?? "-"}
                          </td>
                          <td className="tableData whitespace-nowrap border-none p-2 ">
                            {element?.categoryName ?? "-"}
                          </td>
                          <td className="tableData  whitespace-nowrap">
                            {element?.mobile?.number ? `${element?.mobile?.code}  ${element?.mobile?.number}` : '-'}{" "}
                          </td>
                          <td className="tableData whitespace-nowrap ">
                            {(element?.email) || '-'}
                          </td>
                          <td className="max-w-[200px] min-w-[200px] border-none p-2 ">
                            {element?.intrested ?? "-"}
                          </td>
                          <td className="whitespace-nowrap border-none p-2 ">
                            {element?.source ?? "-"}
                          </td>

                          <td className="max-w-[200px] min-w-[200px] border-none p-2 ">
                            {element?.latestFollowUp?.remark ? `${element?.latestFollowUp?.remark} -${element?.latestFollowUp?.type} ` : "-"}
                          </td>
                          {/* <td className="whitespace-nowrap border-none p-2 ">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td> */}

                          {canUpdate && (
                            <td className="whitespace-nowrap text-center border-none p-2">
                              <Dropdown
                                menu={{
                                  items: leadManagementStatus.map(status => ({
                                    key: status,
                                    label: status,
                                    onClick: () => handleStatusChange(status, element?._id)
                                  })),
                                  selectable: true,
                                  defaultSelectedKeys: [element?.status]
                                }}
                                trigger={['click']}
                                placement="topLeft"
                              >
                                <Button type="text" size="small">
                                  <Space>
                                    {element?.status}
                                    <BiDownArrowAlt />
                                  </Space>
                                </Button>
                              </Dropdown>
                            </td>
                          )}


                          <td className="whitespace-nowrap border-none p-2">
                            {element?.companyId === "null" ||
                              element?.companyId === null ? (
                              <span className="py-1.5 text-black "> - </span>
                            ) : (
                              <span className="py-1.5 flex justify-start items-center space-x-2">
                                <Tooltip placement="topLeft" title='view'>
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/admin/lead-management/view/${encrypt(
                                          element?._id
                                        )}`
                                      );
                                    }}
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <FaEye
                                      className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>
                                <Dropdown
                                  menu={{
                                    items: [
                                      {
                                        key: "created-at",
                                        label: (
                                          <span
                                            onClick={() =>
                                              showSwal(
                                                dayjs(element?.createdAt).format(
                                                  "DD-MM-YYYY hh:mm a"
                                                ) || "Data not available"
                                              )
                                            }
                                            className="flex items-center text-teal-800 hover:text-teal-700"
                                          >
                                            <GrValidate
                                              className="mr-2"
                                              size={16}
                                            />
                                            Created At
                                          </span>
                                        ),
                                      },
                                      {
                                        key: "created-by",
                                        label: (
                                          <span
                                            onClick={() =>
                                              showSwal(
                                                element?.createdBy ||
                                                "Data not available"
                                              )
                                            }
                                            className="flex items-center text-sky-800 hover:text-sky-700"
                                          >
                                            <TbPencilMinus
                                              className="mr-2"
                                              size={16}
                                            />
                                            Created By
                                          </span>
                                        ),
                                      },
                                      canDelete && {
                                        key: "delete",
                                        label: canDelete ? (
                                          <span

                                            className="flex items-center text-red-600 hover:text-red-500"
                                          >
                                            <RiDeleteBin5Line
                                              className="mr-2"
                                              size={16}
                                            />
                                            Delete
                                          </span>
                                        ) : (
                                          <span className="flex items-center text-gray-500 cursor-not-allowed">
                                            <RiDeleteBin5Line
                                              className="mr-2"
                                              size={16}
                                            />
                                            Delete (No Actions)
                                          </span>
                                        ),
                                        onClick: () => {
                                          canDelete && handleDelete(element?._id)
                                        }
                                      },
                                      canUpdate && {
                                        key: "update",
                                        label: canUpdate ? (
                                          <span

                                            className="flex items-center text-teal-600 hover:text-teal-500"
                                          >
                                            <FaEdit
                                              className="mr-2"
                                              size={16}
                                            />
                                            Edit
                                          </span>
                                        ) : (
                                          <span className="flex items-center text-gray-500 cursor-not-allowed">
                                            <FaEdit
                                              className="mr-2"
                                              size={16}
                                            />
                                            Edit (No Actions)
                                          </span>
                                        ),
                                        onClick: () => {
                                          canUpdate && navigate(
                                            `/admin/lead-management/edit/${encrypt(
                                              element?._id
                                            )}`
                                          );
                                        }
                                      },
                                      canUpdate && {
                                        key: "update",
                                        label: canUpdate ? (
                                          <span

                                            className="flex items-center text-cyan-600 hover:text-cyan-500"
                                          >
                                            <BiTransfer
                                              className="mr-2"
                                              size={16}
                                            />
                                            Transfer Lead
                                          </span>
                                        ) : (
                                          <span className="flex items-center text-gray-500 cursor-not-allowed">
                                            <BiTransfer
                                              className="mr-2"
                                              size={16}
                                            />
                                            Transfer Lead (No Actions)
                                          </span>
                                        ),
                                        onClick: () => {
                                          canUpdate && setTransferModal({
                                            isOpen: true,
                                            leadId: element,
                                            portal: "manager"
                                          })
                                        }
                                      },


                                      {
                                        key: "view-desc",
                                        label: (
                                          <span
                                            onClick={() =>
                                              showSwal(
                                                element?.userData?.fullName ||
                                                "Data not available"
                                              )
                                            }
                                            className="flex items-center text-blue-800 hover:text-blue-700"
                                          >
                                            <BsPerson
                                              className="mr-2"
                                              size={16}
                                            />
                                            Assigned To
                                          </span>
                                        ),
                                      },
                                    ],
                                  }}
                                  trigger={["click"]}
                                >
                                  <Tooltip placement="topLeft" title="More Actions">
                                    <button
                                      className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                      type="button"
                                    >
                                      <PiDotsThreeOutlineVerticalBold
                                        className="hover:text-[#337ab7] text-[#3c8dbc]"
                                        size={16}
                                      />
                                    </button>
                                  </Tooltip>
                                </Dropdown>

                                {/* {canUpdate && <Tooltip placement="topLeft" title='Edit'>
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/admin/lead-management/edit/${encrypt(
                                          element?._id
                                        )}`
                                      );
                                    }}
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <FaPenToSquare
                                      className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>} */}
                                {/* {canDelete && <Tooltip placement="topLeft" title='Delete'>
                                  <button
                                    onClick={() => handleDelete(element?._id)}
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <RiDeleteBin5Line
                                      className="text-red-600 hover:text-red-500"
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>} */}
                                {/* {canRead && <Tooltip placement="topLeft" title='Tranfer Lead'>
                                  <button
                                    onClick={() => {
                                      setTransferModal({
                                        isOpen: true,
                                        leadId: element,
                                        portal: "manager"
                                      })
                                    }}
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <BiTransfer
                                      className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>} */}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white bg-opacity-5 ">
                        <td
                          colSpan={8}
                          className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                        >
                          Record Not Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            )}
          </div>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <CustomPagination
              totalCount={totalLeadmanagementFeatureCount}
              pageSize={limit}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />
          </div>
        </>
      )
      }
      <TransferReaquestCreateModal
        transferModal={transferModal}
        onclose={handlecloseTransferModal}
        LeadmanagementtransferLoading={loading}
      />
    </GlobalLayout >
  );
}

export default LeadManagement;
