import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare, FaFileExcel, FaFilePdf } from "react-icons/fa6"
import { RiDeleteBin5Line, RiEjectFill, RiProfileFill } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, inputAntdSelectClassNameFilter, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../../constents/global";
import { getProposalList, proposalSearch, deleteProposal, sendProposalEmail, updateProposalStatus } from "../proposal/proposalFeatures/_proposal_reducers"
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../../global_layouts/Loader/Loader"
import { MdChangeCircle, MdEmail, MdRemoveCircle } from "react-icons/md"
import SendProposalModal from "./SendProposalModal"
import { BiCheckCircle, BiUserCircle } from "react-icons/bi"
import { Button, Input, Modal, Select, Spin, Tooltip, Dropdown } from "antd"
import usePermissions from "../../../config/usePermissions"
import TextArea from "antd/es/input/TextArea"
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers"
import { FaEye, FaRegFile, FaTimes } from "react-icons/fa"
import { LoadingOutlined } from '@ant-design/icons';
import moment from "moment"
import Loader2 from "../../../global_layouts/Loader/Loader2"
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader"
import * as ExcelJS from "exceljs";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { proposalServices } from "./proposalFeatures/_proposal_services"

function ProposalList() {
  const { register, setValue, control, formState: { errors } } = useForm();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { proposalList, totalProposalCount, loading } = useSelector(state => state.proposal);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [proposalId, setProposalId] = useState(1);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const tableRef = useRef();

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
  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const filters = [BranchId, CompanyId, status, searchText].join("-");

  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      fetchProposalList()
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    fetchProposalList()
  }, [currentPage])

  const fetchProposalList = () => {
    const reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "directorId": "",
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
      }
    }
    dispatch(getProposalList(reqData))
  }

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    }
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProposal(reqData)).then((data) => {
          // fetchProposalList()
          if (currentPage > 1 && proposalList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchProposalList();
          }
        })
      }
    });
  };

  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])

  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  const handleProposalEmail = (emailData) => {
    dispatch(sendProposalEmail(emailData)).then(data => {
      if (!data.error) {

        setIsProposalOpen(false);
        setProposalId([])
        Swal.fire({
          icon: 'success',
          title: 'Proposal Email',
          html: `
                <p>Proposal Email has been send successfully!</p>
              `,
          confirmButtonColor: '#3085d6'
        });
      }
    });
  };

  // Export to Excel function
  const exportToExcel = async () => {
    try {
      if (!proposalList || proposalList.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Data',
          text: 'There is no data to export.',
        });
        return;
      }
  
      // Create workbook with metadata
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Proposal Management System';
      workbook.lastModifiedBy = 'Proposal Management System';
      workbook.created = new Date();
      workbook.modified = new Date();
  
      // Create worksheet with frozen headers
      const worksheet = workbook.addWorksheet("Proposals Report", {
        views: [{ state: 'frozen', ySplit: 1 }],
        properties: { tabColor: { argb: 'FF4472C4' } }
      });
  
      // Define columns with all requested fields
      worksheet.columns = [
        { header: "S.No.", key: "sno", width: 8 },
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Mobile Number", key: "mobile", width: 18 },
        { header: "Proposal Amount", key: "fee", width: 18 },
        { header: "Remarks", key: "description", width: 30 },
        { header: "Finalize Remark", key: "remark", width: 30 },
        { header: "Finalize Amount", key: "finalizedAmount", width: 18 },
        { header: "Updated By", key: "updatedBy", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 20 },
        { header: "Status", key: "status", width: 15 },
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
      const response = await proposalServices?.proposalSearch(
        {companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "directorId": "",
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": false,}
      );
  
      if (!response && !response?.data?.docs) return;
      const excelData = response?.data?.docs?.map((proposal, index) => ({
        sno: index + 1 + ((currentPage - 1) * limit),
        name: proposal?.name || "-",
        email: proposal?.email || "-",
        mobile: proposal?.mobile ? `${proposal.mobile.code || ''}${proposal.mobile.number || ''}`.trim() : "-",
        fee: proposal?.fee || "-",
        description: proposal?.description || "-",
        remark: proposal?.remark || "-",
        finalizedAmount: proposal?.finalizedAmount || "-",
        updatedBy: proposal?.updatedBy || "-",
        updatedAt: proposal?.updatedAt ? moment(proposal.updatedAt).format("DD-MM-YYYY hh:mm a") : "-",
        status: proposal?.status || "-",
      }));
  
      // Add data rows with styling
      excelData.forEach((item) => {
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
          'Pending': { bg: 'FFFFF4CE', text: 'FF8C6D00' }, // Yellow for pending
          'Approved': { bg: 'FFE6F6E6', text: 'FF107C10' }, // Green for approved
          'Cancelled': { bg: 'FFFDE7E9', text: 'FFA4262C' } // Red for cancelled
        };
  
        const statusKey = statusCell.value?.toString();
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
      const titleRow = worksheet.insertRow(1, ['PROPOSALS EXPORT']);
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
  

  
      // Add export metadata footer
      const footerRow = worksheet.addRow([]);
      const footerCell = worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(64 + worksheet.columns.length)}${footerRow.number}`);
      footerRow.getCell(1).value = `Exported by ${userInfoglobal?.fullName || 'System'} on ${moment().format('DD-MM-YYYY HH:mm')}`;
      footerRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF808080' } };
      footerRow.getCell(1).alignment = { horizontal: 'right' };
  
      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Proposals_Export_${moment().format('YYYY-MM-DD_HH-mm')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'Proposals data has been exported to Excel.',
      });
  
    } catch (error) {
      console.log("Error generating Excel:", error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to generate Excel report. Please try again or contact support.',
      });
    }
  };
  // const generateExcel = async () => {
  //   try {
  //     setIsExcelLoading(true)
  //     // Create workbook with metadata
  //     const workbook = new ExcelJS.Workbook();
  //     workbook.creator = 'Lead Management System';
  //     workbook.lastModifiedBy = 'Lead Management System';
  //     workbook.created = new Date();
  //     workbook.modified = new Date();

  //     // Create worksheet with frozen headers
  //     const worksheet = workbook.addWorksheet("Leads Report", {
  //       views: [{ state: 'frozen', ySplit: 1 }],
  //       properties: { tabColor: { argb: 'FF4472C4' } }
  //     });

  //     // Define columns with all requested fields
  //     worksheet.columns = [
  //       { header: "No.", key: "sno", width: 8 },
  //       { header: "Lead Name", key: "name", width: 25 },
  //       { header: "Created Date", key: "createdAt", width: 18 },
  //       { header: "Mobile Number", key: "mobile", width: 18 },
  //       { header: "Email", key: "email", width: 30 },
  //       { header: "Location", key: "location", width: 25 },
  //       { header: "Source", key: "source", width: 15 },
  //       { header: "Interested In", key: "intrested", width: 20 },
  //       { header: "Category", key: "categoryName", width: 20 },
  //       { header: "Subcategory", key: "subCategoryName", width: 20 },
  //       { header: "Status", key: "status", width: 15 },
  //       { header: "Remark", key: "remark", width: 30 },
  //       { header: "Assigned To", key: "assignedTo", width: 30 },
  //     ];

  //     // Style the header row
  //     const headerRow = worksheet.getRow(1);
  //     headerRow.height = 25;
  //     headerRow.eachCell((cell) => {
  //       cell.fill = {
  //         type: "pattern",
  //         pattern: "solid",
  //         fgColor: { argb: "FF2F5496" } // Dark blue
  //       };
  //       cell.font = {
  //         bold: true,
  //         color: { argb: "FFFFFFFF" }, // White text
  //         size: 11,
  //         name: 'Calibri'
  //       };
  //       cell.alignment = {
  //         vertical: "middle",
  //         horizontal: "center",
  //         wrapText: true
  //       };
  //       cell.border = {
  //         top: { style: "thin", color: { argb: "FF000000" } },
  //         left: { style: "thin", color: { argb: "FF000000" } },
  //         bottom: { style: "thin", color: { argb: "FF000000" } },
  //         right: { style: "thin", color: { argb: "FF000000" } }
  //       };
  //     });

  //     // Fetch data from API
  //     const response = await LeadmanagementFeatureServices?.getLeadmanagementFeatureSearch({
  //       assignedToId: "",
  //       leadCategoryId: categoryId,
  //       leadSubCategoryId: subCategory,
  //       startDate: time?.length > 0 && time[0] ? customDayjs(time[0]) : null,
  //       endDate: time?.length > 1 && time[1] ? customDayjs(time[1]) : null,
  //       text: searchText,
  //       sort: true,
  //       companyId: userInfoglobal?.userType === "company"
  //         ? userInfoglobal?._id
  //         : userInfoglobal?.companyId,
  //       branchId: userInfoglobal?.userType === "company" ||
  //         userInfoglobal?.userType === "admin" ||
  //         userInfoglobal?.userType === "companyDirector"
  //         ? branchId
  //         : userInfoglobal?.userType === "companyBranch"
  //           ? userInfoglobal?._id
  //           : userInfoglobal?.branchId,
  //       isPagination: false,
  //       status: status,
  //     });

  //     if (!response?.data?.docs) {
  //       console.error("No data received from API");
  //       return;
  //     }

  //     // Format data for Excel
  //     const apiData = response.data.docs.map((lead, index) => ({
  //       sno: index + 1,
  //       name: lead.name || "-",
  //       createdAt: lead.createdAt
  //         ? dayjs(lead.createdAt).format('DD-MM-YYYY HH:mm')
  //         : "-",
  //       mobile: lead.mobile
  //         ? `${lead.mobile.code || ''} ${lead.mobile.number || ''}`.trim()
  //         : "-",
  //       email: lead.email || "-",
  //       location: lead.location || "-",
  //       source: lead.source || "-",
  //       intrested: lead.intrested || "-",
  //       categoryName: lead.categoryName || "-",
  //       subCategoryName: lead.subCategoryName || "-",
  //       status: lead.status || "-",
  //       remark: lead.remark || "-",
  //       assignedTo: lead.userData
  //         ? `${lead.userData.fullName}\n(${lead.userData.designationName})`
  //         : "-",

  //     }));

  //     // Add data rows with styling
  //     apiData.forEach((item) => {
  //       const row = worksheet.addRow(item);

  //       // Alternate row coloring
  //       row.eachCell((cell) => {
  //         cell.fill = {
  //           type: "pattern",
  //           pattern: "solid",
  //           fgColor: { argb: row.number % 2 === 0 ? "FFF2F2F2" : "FFFFFFFF" }
  //         };
  //         cell.alignment = {
  //           vertical: "middle",
  //           horizontal: "left",
  //           wrapText: true
  //         };
  //         cell.border = {
  //           top: { style: "thin", color: { argb: "FFD9D9D9" } },
  //           left: { style: "thin", color: { argb: "FFD9D9D9" } },
  //           bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
  //           right: { style: "thin", color: { argb: "FFD9D9D9" } }
  //         };
  //         cell.font = { size: 10, name: 'Calibri' };
  //       });

  //       // Style status column based on value
  //       const statusCell = row.getCell('status');
  //       const statusColorMap = {
  //         'new': { bg: 'FFE3E8EA', text: 'FF2D3E50' },
  //         'contacted': { bg: 'FFE6F7FF', text: 'FF0078D4' },
  //         'converted': { bg: 'FFE6F6E6', text: 'FF107C10' },
  //         'lost': { bg: 'FFFDE7E9', text: 'FFA4262C' },
  //         'follow up': { bg: 'FFFFF4CE', text: 'FF8C6D00' }
  //       };

  //       const statusKey = statusCell.value?.toString().toLowerCase();
  //       if (statusKey && statusColorMap[statusKey]) {
  //         statusCell.fill = {
  //           type: 'pattern',
  //           pattern: 'solid',
  //           fgColor: { argb: statusColorMap[statusKey].bg }
  //         };
  //         statusCell.font.color = { argb: statusColorMap[statusKey].text };
  //       }
  //     });

  //     // Add auto-filter for all columns
  //     worksheet.autoFilter = {
  //       from: 'A1',
  //       to: `${String.fromCharCode(64 + worksheet.columns.length)}1`
  //     };

  //     // Auto-size columns based on content
  //     worksheet.columns.forEach(column => {
  //       let maxLength = column.header.length;
  //       column.eachCell({ includeEmpty: true }, cell => {
  //         const cellLength = cell.value ? cell.value.toString().length : 0;
  //         if (cellLength > maxLength) {
  //           maxLength = cellLength;
  //         }
  //       });
  //       column.width = Math.min(Math.max(maxLength + 2, 10), 50);
  //     });

  //     // Add title section
  //     const titleRow = worksheet.insertRow(1, ['LEADS EXPORT']);
  //     worksheet.mergeCells(`A1:${String.fromCharCode(64 + worksheet.columns.length)}1`);
  //     titleRow.height = 30;
  //     titleRow.getCell(1).fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'FF4472C4' }
  //     };
  //     titleRow.getCell(1).font = {
  //       bold: true,
  //       color: { argb: 'FFFFFFFF' },
  //       size: 16,
  //       name: 'Calibri'
  //     };
  //     titleRow.getCell(1).alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center'
  //     };

  //     // Add filter instructions
  //     const filterNoteRow = worksheet.addRow([]);
  //     const filterNoteCell = worksheet.mergeCells(`A${filterNoteRow.number}:${String.fromCharCode(64 + worksheet.columns.length)}${filterNoteRow.number}`);
  //     filterNoteRow.getCell(1).value = 'Use the dropdown filters in the header row to filter data. You can search for specific values in the filter dropdowns.';
  //     filterNoteRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF808080' } };
  //     filterNoteRow.getCell(1).alignment = { horizontal: 'left' };

  //     // Add export metadata footer
  //     const footerRow = worksheet.addRow([]);
  //     const footerCell = worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(64 + worksheet.columns.length)}${footerRow.number}`);
  //     footerRow.getCell(1).value = `Exported by ${userInfoglobal?.fullName || 'System'} on ${dayjs().format('DD-MM-YYYY HH:mm')}`;
  //     footerRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF808080' } };
  //     footerRow.getCell(1).alignment = { horizontal: 'right' };

  //     // Generate and download the file
  //     const buffer = await workbook.xlsx.writeBuffer();
  //     const blob = new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `Leads_Export_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //   } catch (error) {
  //     console.log("Error generating Excel:", error);
  //     // Add user notification here if needed
  //     alert('Failed to generate Excel report. Please try again or contact support.');
  //   } finally {
  //     setIsExcelLoading(false)

  //   }
  // };
  const exportToPDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });



    doc.setFontSize(16);
    
    const headers = [
      "S.No.",
      "Name",
      "Email",
      "Mobile",
      "Proposal Amount",
      "Remarks",
      "Finalize Remark",
      "Finalize Amount",
      "Status"

    ];
    const response = await proposalServices?.proposalSearch(
      {companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          :
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
      "directorId": "",
      "text": searchText,
      "sort": true,
      "status": status,
      "isPagination": false,}
    );

    if (!response && !response?.data?.docs) return;
    const body = response?.data?.docs?.map((item, index) => {
      return [
        index + 1 + ((currentPage - 1) * limit),
        item?.name || "-",
        item?.email || "-",
        item?.mobile?.code + item?.mobile?.number,
        item?.fee || "-",
        item?.description|| "-",
        item?.remark|| "-",
        item?.finalizedAmount || "-",
        item?.status || "-"
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
    doc.save(`AllclientProposal.pdf`);
  };

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    data: null,
    status: ""
  })

  const handleStatusModalOpen = (data, status) => {
    setStatusModal({
      isOpen: true,
      data: data,
      status: status
    })
  }

  const handleStatusModalClose = () => {

    setStatusModal({
      isOpen: false,
      data: null,
      status: ""
    })
  }
  const [remark, setRemark] = useState('');
  const [finalizeAmount, setFinalizeAmount] = useState('');
  const [attachment, setAttachments] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  // Error states for validation
  const [remarkError, setRemarkError] = useState('');
  const [amountError, setAmountError] = useState('');

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
    if (e.target.value) {
      setRemarkError("");
    }
    else {
      setRemarkError("Remark is required.");
    }
  };

  const handleAmountChange = (e) => {
    setFinalizeAmount(e.target.value);
    if (e.target.value) {
      setAmountError("");
    }
    else {
      setAmountError("Finalize Amount is required.");
    }
  };

  const handleSubmit = () => {


    let isValid = true;

    if (!remark) {
      setRemarkError("Remark is required.");
      isValid = false;
    }

    if (!finalizeAmount) {
      setAmountError("Finalize Amount is required.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const payload = {
      "_id": statusModal?.data?._id,
      "status": statusModal?.status,
      "remark": remark,
      "finalizedAmount": finalizeAmount,
      "attachments": attachment,
    };

    dispatch(updateProposalStatus(payload)).then((data) => {
      if (!data?.error) {
        fetchProposalList()
        handleStatusModalClose()
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      e.target.value = null;

      const reqData = {
        filePath: file,
        isVideo: false,
        isMultiple: false,
      };

      dispatch(fileUploadFunc(reqData)).then((res) => {
        if (res?.payload?.data) {
          setAttachments(prev => [...prev, res.payload?.data]);
        }
      });
    }
  };
  const handleRemoveFile = (index) => {
    setAttachments(prev => {
      const updatedAttachments = prev.filter((_, i) => i !== index);
      return updatedAttachments
    });
  };

  const onChange = (e) => {

    setSearchText(e);
  };

  const getMenuItems = (element) => {
    const items = [];

    if (element?.status !== 'Approved' && element?.status !== 'Cancelled') {
      canUpdate && items.push({
        key: 'approve',
        label: (
          <div className="flex items-center gap-2" onClick={() => handleStatusModalOpen(element, 'Approved')}>
            <BiCheckCircle size={16} className="text-[#3c8dbc]" />
            <span>Approve</span>
          </div>
        )
      });

      canUpdate && items.push({
        key: 'edit',
        label: (
          <div className="flex items-center gap-2" onClick={() => navigate(`/admin/proposal/edit/${encrypt(element?._id)}`)}>
            <FaPenToSquare size={16} className="text-[#3c8dbc]" />
            <span>Edit Proposal</span>
          </div>
        )
      });

      canDelete && items.push({
        key: 'delete',
        label: (
          <div className="flex items-center gap-2" onClick={() => handleDelete(element?._id)}>
            <RiDeleteBin5Line size={16} className="text-red-600" />
            <span>Delete</span>
          </div>
        )
      });

      canCreate && items.push({
        key: 'email',
        label: (
          <div className="flex items-center gap-2" onClick={() => { setProposalId(element); setIsProposalOpen(true); }}>
            <MdEmail size={16} className="text-green-600" />
            <span>Send Email</span>
          </div>
        )
      });

      if (element?.status === 'Pending' && canUpdate) {
        items.push({
          key: 'cancel',
          label: (
            <div className="flex items-center gap-2" onClick={() => {
              Swal.fire({
                text: 'Do you want to Reject this proposal?',
                input: 'textarea',
                inputPlaceholder: 'Enter remarks...',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                preConfirm: (remark) => {
                  if (!remark) {
                    Swal.showValidationMessage('Please enter a remark.');
                  }
                  return remark;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  dispatch(updateProposalStatus({
                    _id: element?._id,
                    status: 'Cancelled',
                    remark: result.value
                  }))
                    .then((data) => {
                      if (!data?.error) {
                        Swal.fire({ title: 'Success!', text: 'Proposal has been Rejected.', icon: 'success' });
                        fetchProposalList();
                      } else {
                        Swal.fire({ title: 'Error!', text: 'Failed to Reject proposal. Please try again.', icon: 'error' });
                      }
                    }).catch(() => {
                      Swal.fire({ title: 'Error!', text: 'Unexpected error. Try again later.', icon: 'error' });
                    });
                }
              });
            }}>
              <MdRemoveCircle size={16} className="text-rose-600" />
              <span>Cancel Proposal</span>
            </div>
          )
        });
      }
    }

    if (element?.status === 'Approved') {
      items.push({
        key: 'approved',
        label: (
          <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed">
            <BiCheckCircle size={16} />
            <span>Approved</span>
          </div>
        )
      });

      items.push({
        key: 'view',
        label: (
          <div className="flex items-center gap-2" onClick={() => {
            Swal.fire({
              title: 'Approval Details',
              html: `
              <div>
                <p><strong>Client Name:</strong> ${element?.name}</p>
                <p><strong>Remarks:</strong> ${element?.remark}</p>
                <p><strong>Final Amount:</strong> ${element?.finalizedAmount}</p>
                <div>
                  <strong>Attachments:</strong>
                  <ul>
                    ${element?.attachments?.length > 0 ? element.attachments.map((a) =>
                `<li><a href="${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${a}" target="_blank">${a}</a></li>`
              ).join('') : 'No Attachment Found'}
                  </ul>
                </div>
              </div>
            `,
              confirmButtonText: 'Close',
              confirmButtonColor: '#3085d6',
            });
          }}>
            <FaEye size={16} className="text-[#3c8dbc]" />
            <span>View Approval</span>
          </div>
        )
      });

      items.push(...['delete', 'email'].map(key => ({
        key,
        label: (
          <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed">
            {key === 'delete'
              ? <RiDeleteBin5Line size={16} />
              : <MdEmail size={16} />}
            <span>{key === 'delete' ? 'Delete' : 'Send Email'}</span>
          </div>
        )
      })));

      items.push({
        key: 'client',
        label: (
          <div className="flex items-center gap-2" onClick={() => navigate(`/admin/client/edit/${encrypt(element?.clientData?._id)}`)}>
            <BiUserCircle size={16} className="text-cyan-600" />
            <span>View Client</span>
          </div>
        )
      });
    }

    if (element?.status === 'Cancelled') {
      ['approve', 'edit', 'delete', 'email'].forEach(key => {
        items.push({
          key,
          label: (
            <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed">
              {{
                approve: <BiCheckCircle size={16} />,
                edit: <FaPenToSquare size={16} />,
                delete: <RiDeleteBin5Line size={16} />,
                email: <MdEmail size={16} />
              }[key]}
              <span>{{
                approve: 'Approved',
                edit: 'Edit Proposal',
                delete: 'Delete',
                email: 'Send Email'
              }[key]}</span>
            </div>
          )
        });
      });

      items.push({
        key: 'client',
        label: (
          <div className="flex items-center gap-2 text-gray-600">
            <BiUserCircle size={16} />
            <span>View Client</span>
          </div>
        )
      });
    }

    return items;
  };

  return (
    <GlobalLayout onChange={onChange}>


      <section>
        <div className="xl:flex justify-between items-center xl:space-y-0 space-y-2 py-1">
          <div className="grid md:flex sm:grid-cols-3 grid-cols-1 flex-wrap md:gap-3 gap-1.5">
            {userInfoglobal?.userType === "admin" &&
              <div className="">
                <Controller
                  control={control}
                  name="PDCompanyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}

                      className={`${inputAntdSelectClassNameFilter} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
              <div className="">
                <Controller
                  control={control}
                  name="PDBranchId"
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      disabled={loading}
                      className={`${inputAntdSelectClassNameFilter} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? (<Select.Option disabled>
                        <ListLoader />
                      </Select.Option>) : (branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />
                {errors.PDBranchId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDBranchId.message}
                  </p>
                )}

              </div>}
            <div className="">
              <Controller
                control={control}
                name="status"
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    disabled={loading}
                    className={`${inputAntdSelectClassNameFilter} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Approved">Approved</Select.Option>
                    <Select.Option value="Cancelled">Cancel</Select.Option>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-end gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", '')
                setValue("PDCompanyId", "")
                setValue("status", "")
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
              <span className="text-[12px]">Reset</span>
            </button>
            
            {/* Export buttons */}
            {proposalList && proposalList.length > 0 && (
              <>
                <Tooltip placement="topLeft" title="Export to Excel">
                  <button
                    onClick={exportToExcel}
                    className="bg-green-600 px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaFileExcel />
                    <span className="text-[12px]">Excel</span>
                  </button>
                </Tooltip>
                
                <Tooltip placement="topLeft" title="Export to PDF">
                  <button
                    onClick={exportToPDF}
                    className="bg-red-600 px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaFilePdf />
                    <span className="text-[12px]">PDF</span>
                  </button>
                </Tooltip>
              </>
            )}
            
            {canCreate &&
              <Tooltip placement="topLeft" title='Add Proposal'>
                <button
                  onClick={() => {
                    navigate("/admin/proposal/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Proposal</span>
                </button>
              </Tooltip>
            }
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto " ref={tableRef}>
            <thead className=''>
              <tr className='border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]'>
                <th className='tableHead w-[10%]'>
                  S.No.
                </th>
                <th className='tableHead w-[15%]'>
                  Name
                </th>
                <th className='tableHead'>
                  Email
                </th>
                <th className='tableHead'>
                  Mobile Number
                </th>
                <th className='tableHead'>
                 Proposal Amount
                </th>
                <th className='tableHead'>
                  Remarks
                </th>
                <th className='tableHead'>
                  Finalize Remark
                </th>
                <th className='tableHead'>
                  Finalize Amount
                </th>
                
                <th className='tableHead'>
                  Updated By
                </th>
                <th className='tableHead'>
                  Updated At
                </th>
                <th className='tableHead'>
                  Status
                </th>
                {(canCreate || canDelete || canUpdate) && <th className='tableHead w-[10%]'>
                  Action
                </th>}
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {proposalList && proposalList?.length > 0 ?
                  proposalList?.map((element, index) => (
                    <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151]`}>
                      <td className='tableData '>
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className='tableData '>{element?.name ?? "-"}</td>
                      <td className='tableData '>{element?.email ?? "-"}</td>
                      <td className='tableData '>{element?.mobile?.code + element?.mobile?.number}</td>
                      <td className='tableData '>{element?.fee ?? "-"}</td>
                      <td className='tableData '>{element?.description ?? "-"}</td>
                      <td className='tableData '>{element?.remark ?? "-"}</td>
                      <td className='tableData '>{element?.finalizedAmount ?? "-"}</td>
                      <td className='tableData '>{element?.updatedBy ?? "-"}</td>
                      <td className='tableData '>{moment(element?.updatedAt).format("DD-MM-YYYY hh:mm a") ?? "-"}</td>
                      <td className='tableData '>
                        <span
                          className={`${element?.status === "Approved"
                            ? "bg-[#E0FFBE] border-green-500"
                            : element?.status === "Pending" ? "bg-gray-500 border-gray-500 text-white" : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status}
                        </span>
                      </td>
                      {(canCreate || canDelete || canUpdate) &&
                        <td className='tableData'>

                          <Dropdown
                            trigger={['click']}
                            menu={{ items: getMenuItems(element) }}
                            placement="bottomLeft"
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
                        </td>
                      }
                    </tr>
                  ))
                  : (<tr className="bg-white bg-opacity-5 " >
                    <td colSpan={5} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                  </tr>)}
              </tbody>}
          </table>}
        </div>
        {proposalList?.length > 0 && (
          <CustomPagination
            totalCount={totalProposalCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />)}
      </section>
      {statusModal?.isOpen && (
        <Modal className="antmodalclassName" open={statusModal?.isOpen} footer={null} onCancel={() => handleStatusModalClose()}>
          <div>
            <label className={`${inputLabelClassName}`}>
              Remark <span className="text-red-600">*</span>
            </label>
            <textarea
              id="remark"
              value={remark}
              onChange={handleRemarkChange}
              className={`mt-1 block w-full px-2 py-[12px] min-h-[150px] shadow-sm rounded-xl text-sm bg-gray-50 outline-1 outline-black !border !border-gray-900`}
              placeholder="Enter your remark here"
              required
            />
            {remarkError && <p className="text-red-500 text-sm mt-1">{remarkError}</p>} {/* Error message for remark */}
          </div>

          <div className="mt-4">
            <label className={`${inputLabelClassName}`}>
              Finalize Amount: <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="finalizeAmount"
              value={finalizeAmount}
              onChange={handleAmountChange}
              className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-xl text-sm bg-gray-50 outline-1 outline-black !border !border-gray-900`}
              placeholder="Enter amount"
              required
            />
            {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>} {/* Error message for amount */}
          </div>

          <div className="pt-4 mt-6">
            <div className="font-medium mb-2">Attachments:</div>
            {!isPreview ? (
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                >
                  <FaRegFile className="mr-2" /> Add Attachments
                </label>

                <div className="space-y-2">
                  {attachment?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <a
                        href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                        className="flex items-center space-x-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaRegFile className="text-gray-500" />
                        <span className="text-sm text-gray-600">{file}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2"></div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              {loading ? (
                <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: 'white' }} />
              ) : (
                'Submit'
              )}
            </button>
          </div>

        </Modal>
      )}

      <SendProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        onSubmit={handleProposalEmail}
        proposalData={proposalId}
        setProposalId={setProposalId}
      />

    </GlobalLayout>
  )
}
export default ProposalList;