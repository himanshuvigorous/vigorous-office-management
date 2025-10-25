import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  domainName,
  inputAntdSelectClassNameFilter,
  showSwal,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import {
  deleteinvoice,
  getinvoiceList,
  invoiceComentCreate,
  invoiceStatusChangeFunc,
} from "./invoiceFeature/_invoice_reducers";
import * as ExcelJS from "exceljs";
import { FaComment, FaDownload, FaEye, FaFileExcel } from "react-icons/fa";
import { Select, Tooltip, Dropdown, Menu, Radio, Space, message } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader";
import { TbPencilMinus } from "react-icons/tb";
import { officeAddressSearch } from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { BiDownArrow, BiDownArrowAlt } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { sendEmailCommon } from "../../hr/onBoarding/onBoardingFeatures/_onBoarding_reducers";
import withReactContent from "sweetalert2-react-content";
import ChatBox from "./ChatBox";
import { invoiceServices } from "./invoiceFeature/_invoice_services";

const MySwal = withReactContent(Swal);

function InvoiceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoiceListData, totalinvoiceListCount, loading } = useSelector(
    (state) => state.invoice
  );
  const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const { departmentListData, loading: departmentListloading } = useSelector((state) => state.department);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [messageModal, setMessagesModal] = useState({
    isOpen: false,
    data: null
  })

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialIsDeleted = searchParams.get("isDeleted") || "false";
  const initialLayoutId = searchParams.get("layoutId") || "";
  const initialDepartmentId = searchParams.get("departmentId") || "";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [isDeleted, setIsDeleted] = useState(initialIsDeleted);
  const [layoutId, setLayoutId] = useState(initialLayoutId);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);


  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);

    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    if (layoutId) params.set("layoutId", layoutId);
    if (departmentId) params.set("departmentId", departmentId);
    if (isDeleted) params.set("isDeleted", isDeleted);
    setSearchParams(params);
  }, [currentPage, limit, branchId, status, layoutId, searchText, departmentId, isDeleted]);
  useEffect(() => {
    getinvoicerequest();
  }, [currentPage, limit, branchId, status, layoutId, searchText, departmentId, isDeleted]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setStatus("");
    setLayoutId("");
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
  const handleIsDeletedChange = (value) => {
    setIsDeleted(value?.target.value || value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };
  const handleLayoutChange = (value) => {
    setLayoutId(value);
    setCurrentPage(1);
  };

  const getinvoicerequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
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
        invoiceLayoutId: layoutId,
        departmentId: departmentId,
        text: searchText,
        sort: true,
        status: status,
        isPagination: true,
        isDeleted: (isDeleted === true || isDeleted === "true") ? true : false,
      },
    };
    dispatch(getinvoiceList(data));
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  // const handleDelete = (id) => {
  //   let reqData = {
  //     _id: id,
  //   };
  //   Swal.fire({
  //     title: "Warning",
  //     text: "Are you sure you want to delete!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     cancelButtonText: "No",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       dispatch(deleteinvoice(reqData)).then((data) => {
  //         getinvoicerequest();
  //       });
  //     }
  //   });
  // };
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Client Report');

    // Add headers
    const headers = [

      'S.No.',
      'Date',
      'Invoice number',
      'Department',
      'Client Name',
      'Invoice Amount',
      'Latest Comment',

    ];
    worksheet.addRow(headers);
    const response = await invoiceServices?.invoiceSearch(
      {
        directorId: "",
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
        invoiceLayoutId: layoutId,
        departmentId: departmentId,
        text: searchText,
        sort: true,
        status: status,
        isPagination: false,
        isDeleted: (isDeleted === true || isDeleted === "true") ? true : false,
      }
    );
    if (!response && !response) return;
    // Add data rows
    response?.data?.docs.forEach((element, index) => {
      const rowData = [
        index + 1,
        dayjs(element?.createdAt).format(
          "DD-MM-YYYY hh:mm a"
        ) || "-",
        element?.invoiceNumber,
        element?.departmentName || "-",
        element?.clientName,
        convertIntoAmount(element?.grandTotal || 0),
        element?.latestCommment?.message || "-",
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
      to: `J${response?.data?.docs.length + 1}`,
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
      link.download = `Report.xlsx`;
      link.click();
    });
  };
  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };

    Swal.fire({
      title: "Select Reason for Deletion",
      html: `
    <select id="remark-select"
      class="swal2-select"
      style="
        width: 250px;
        height: 40px;
        font-size: 14px;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        margin-top: 10px;
        outline: none;
      "
    >
      <option value="">-- Please Select --</option>
      <option value="Invoice wrongly created">Invoice wrongly created</option>
      <option value="Invoice double created">Invoice double created</option>
      <option value="Fee overdue more than 30 days">Fee overdue more than 30 days</option>
    </select>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
      preConfirm: () => {
        const selectedRemark = document.getElementById("remark-select").value;
        if (!selectedRemark) {
          Swal.showValidationMessage("Please select a reason");
          return false;
        }
        return selectedRemark;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const remark = result.value;
        reqData.remark = remark;

        dispatch(deleteinvoice(reqData)).then(() => {
          getinvoicerequest();
        });
      }
    });
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
          companyId: userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        })
      );
    }
  }, []);
  const handleDepartmentChange = (value) => {
    setDepartmentId(value);
    setCurrentPage(1);
  };
  useEffect(() => {
    officeAddresFunction();
  }, [branchId])
  const officeAddresFunction = () => {
    dispatch(
      officeAddressSearch({
        companyId: userInfoglobal?.userType === "company"
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
        directorId: "",
        text: "",
        sort: true,
        status: true,
        type: "invoice",
        isPagination: false,
        bankAccountId: "",
        isGSTEnabled: "",
      })
    );
  }
  useEffect(() => {
    if (

      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector" ||
      userInfoglobal?.userType === "companyBranch" ||
      userInfoglobal?.userType === "employee"
    ) {
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: '',
          isPagination: false,
          companyId: userInfoglobal?.userType === "company"
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
        })
      );
    }
  }, [branchId]);

  const handleChooseDepartment = (department, id, status) => {
    dispatch(invoiceStatusChangeFunc({
      type: "department",
      departmentId: department,
      status: status,
      _id: id
    })).then(data => {
      if (!data?.error) {
        getinvoicerequest()
      }
    })
  }

  const handleEmailSubmit = (emailData) => {

    const htmlContent = `
<div style="font-family: Arial, sans-serif; color: #333;">
<h2>Invoice #${emailData?.invoiceNumber}</h2>
<p>Dear ${emailData?.clientData?.fullName},</p>
<p>Please find your invoice attached.</p>

<!-- Optional: iframe preview (note: most email clients block this) -->
<p><strong>Invoice Preview:</strong></p>
<a href="${emailData?.invoicePDFurl}" target="_blank" style="color: #1a73e8;">View Invoice</a>

<!-- Download Button (styled as link because buttons aren't reliable in email) -->
<p>
<a href="${emailData?.invoicePDFurl}" download style="
display: inline-block;
padding: 10px 15px;
background-color: #4CAF50;
color: white;
text-decoration: none;
border-radius: 5px;
">
Download Invoice PDF
</a>
</p>

<hr>
<p>Thank you<br></p>
</div>
`;

    dispatch(sendEmailCommon({
      content: htmlContent, // HTML from editor or this template
      // to: "himanshu.vigorous@gmail.com",
      to: emailData?.clientData?.email,
      cc: [],
      subject: `Invoice ${emailData?.invoiceNumber}`,
      attachments: [] // Optionally attach the PDF here
    })).then(data => {
      if (!data.error) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent',
          html: `<p>Invoice sent to Client</p>`,
          confirmButtonColor: '#3085d6'
        });
      }
    });
  };

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <Radio.Group
            onChange={handleIsDeletedChange}
            value={isDeleted || ''}
            disabled={loading}
            optionType="button"
            buttonStyle="solid"
            style={{ width: '100%' }}
          >
            {/* <Space direction="horizontal" size="large" style={{ width: '100%', justifyContent: 'center' }}> */}
            <Radio.Button value="false" style={{ flex: 1, textAlign: 'center', fontWeight: '500' }}>
              Active Records
            </Radio.Button>
            <Radio.Button value="true" style={{ flex: 1, textAlign: 'center', fontWeight: '500' }}>
              Deleted Records
            </Radio.Button>
            {/* </Space> */}
          </Radio.Group>

          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid md:flex sm:grid-cols-3 grid-cols-1 flex-wrap md:gap-3 gap-1.5">
              {(userInfoglobal?.userType == "company" ||
                userInfoglobal?.userType == "companyDirector") && (
                  <div>
                    <Select
                      value={branchId}
                      onChange={handleBranchChange}
                      defaultValue=""
                      disabled={loading}
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
              <div className="">
                <Select
                  value={layoutId}
                  onChange={handleLayoutChange}
                  disabled={loading}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  className={`${inputAntdSelectClassNameFilter} `}
                  placeholder="Select Layout"
                  onFocus={() => {

                  }}

                >
                  <Select.Option className="" value="">
                    Select Layout
                  </Select.Option>

                  {officeAddressLoading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (sortByPropertyAlphabetically(officeAddressListData, 'firmName')?.map((element) => (
                    <Select.Option value={element?._id}>
                      {element?.firmName}
                    </Select.Option>
                  )))}
                </Select>
              </div>
              <div>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  disabled={loading}
                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select status</Select.Option>
                  <Select.Option value="PendingPayment">Pending Payment</Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                </Select>
              </div>
              <div className="">
                <Select
                  value={departmentId}
                  onChange={handleDepartmentChange}
                  defaultValue=""
                  disabled={loading}

                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Department</Select.Option>
                  {departmentListloading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (departmentListData?.map((type) => (
                    <Select.Option key={type?._id} value={type?._id}>
                      {type?.name}
                    </Select.Option>
                  )))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2 ">
              <Tooltip placement="topLeft" title="Export Comment Excel">
                  <button
                    onClick={() => {
                      exportToExcel();
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaFileExcel />
                    <span className="text-[12px] whitespace-nowrap">
                      Export Excel
                    </span>
                  </button>
                </Tooltip>
              <button
                onClick={() => {
                  handleResetFilters();
                }}
                className="bg-header py-[6px] rounded-md flex px-5 justify-center items-center text-white"
              >
                <span className="whitespace-nowrap text-[12px]">Reset</span>
              </button>
              {canCreate && (
                <Tooltip placement="topLeft" title="Add Invoice">
                  <button
                    onClick={() => {
                      navigate("/admin/invoice/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px] whitespace-nowrap">
                      Add Invoice
                    </span>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                  <th className="tableHead w-[10%]">S.No.</th>
                  <th className="tableHead">Date</th>
                  <th className="tableHead">Invoice number</th>
                  {canUpdate && isDeleted == 'false' && <th className="tableHead">Department</th>}
                  {/* <th className="tableHead">Layout</th> */}
                  <th className="tableHead">Client Name</th>
                  <th className="tableHead text-right">Invoice Amount</th>
                  {canUpdate && isDeleted == 'false' && <th className="tableHead">Latest Comment</th>}
                  {canUpdate && isDeleted == 'false' && <th className="tableHead">Status</th>}
                  {(canUpdate || canDelete || canRead) && isDeleted == 'false' && (
                    <th className="tableHead w-[10%]">Action</th>
                  )}
                  {isDeleted == 'true' && (
                    <>
                      <th className="tableHead ">Remark</th>
                      <th className="tableHead">Deleted By</th>
                      <th className="tableHead">Deleted At</th>
                    </>
                  )}

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
                  {invoiceListData && invoiceListData?.length > 0 ? (
                    invoiceListData?.map((element, index) => (
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">
                          {dayjs(element?.createdAt).format(
                            "DD-MM-YYYY hh:mm a"
                          ) || "-"}
                        </td>
                        <td className="tableData text-left">{element?.invoiceNumber}</td>
                        {/* <td className="tableData">
{element?.invoiceLayoutData?.firmName}
</td> */}
                        {canUpdate && isDeleted == 'false' && (
                          <td className="whitespace-nowrap text-left border-none p-2">
                            <div>
                              <Select
                                size="small"
                                className="w-[250px] text-[12px]"
                                value={element?.departmentId || ""}
                                placeholder="No department"
                                onChange={(value) =>
                                  handleChooseDepartment(value, element?._id, element?.status)
                                }
                              >
                                <Select.Option value="">No department</Select.Option>
                                {departmentListData?.map((data) => (
                                  <Select.Option key={data?._id} value={data?._id}>
                                    {data?.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </div>
                          </td>
                        )}
                        <td className="tableData">{element?.clientName}</td>
                        <td className="tableData text-right">
                          {convertIntoAmount(element?.grandTotal || 0)}
                        </td>
                        {/* <td className="tableData">{element?.createdBy}</td> */}
                        {canUpdate && isDeleted == 'false' && <td className="tableData">{element?.latestCommment?.message || "-"}</td>}

                        {canUpdate && isDeleted == 'false' && (
                          <td className="tableData">
                            <span
                              className={`px-2 py-1 whitespace-nowrap rounded text-xs font-[500] ${element?.status === "PendingPayment"
                                ? "bg-rose-100 border-[1px] border-rose-400 text-rose-700"
                                : "bg-green-100 border-[1px] border-green-400 text-green-700"
                                }`}
                            >
                              {element?.status === "PendingPayment"
                                ? "Payment Pending"
                                : element?.status}
                            </span>
                          </td>
                        )}
                        {(canUpdate || canDelete || canRead) && isDeleted == 'false' && (
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2.5">
                              <Tooltip placement="topLeft" title="Download Invoice">
                                {canRead && (
                                  <button
                                    onClick={() =>
                                      navigate(`/admin/viewInvoice?invoiceId=${encrypt(element?._id)}&type=invoice&downloadPdfPath=${element?.invoicePDFPath ? encrypt(element?.invoicePDFPath) : ''}`)}
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <FaEye
                                      className="hover:text-header text-header"
                                      size={15}
                                    />
                                  </button>
                                )}
                              </Tooltip>
                              <Tooltip placement="topLeft" title="Comment">
                                {canRead && (
                                  <button
                                    onClick={() =>
                                      setMessagesModal({
                                        isOpen: true,
                                        data: element
                                      })
                                    }
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <FaComment
                                      className="hover:text-header text-header"
                                      size={15}
                                    />
                                  </button>
                                )}
                              </Tooltip>

                              <Tooltip placement="topLeft" title="More Actions">
                                <Dropdown
                                  menu={{
                                    items: [
                                      canUpdate && {
                                        key: "edit",
                                        label:
                                          element?.status ===
                                            "PendingPayment" && canUpdate ? (
                                            <span
                                              onClick={() => {
                                                window.location.href = `/admin/invoice/edit/${encrypt(
                                                  element?._id
                                                )}`;
                                              }}
                                              className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]"
                                            >
                                              <FaPenToSquare
                                                className="mr-2"
                                                size={16}
                                              />
                                              Edit
                                            </span>
                                          ) : (
                                            <span className="flex items-center text-gray-500 cursor-not-allowed">
                                              <FaPenToSquare
                                                className="mr-2"
                                                size={16}
                                              />
                                              Paid (No Actions)
                                            </span>
                                          ),
                                      },
                                      canDelete && {
                                        key: "delete",
                                        label:
                                          element?.status !== "Paid" &&
                                            canDelete ? (
                                            <span
                                              onClick={() =>
                                                handleDelete(element?._id)
                                              }
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
                                              Paid (No Actions)
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
                                      {
                                        key: "send-email",
                                        label: (
                                          <span
                                            onClick={() =>
                                              handleEmailSubmit(element)
                                            }
                                            className="flex items-center text-sky-800 hover:text-sky-700"
                                          >
                                            <MdEmail
                                              className="mr-2"
                                              size={16}
                                            />
                                            send Invoice Mail
                                          </span>
                                        ),
                                      },

                                      {
                                        key: 'View Invoice',
                                        label: (
                                          <span
                                            onClick={() => {
                                              if (element?.invoicePDFPath) {
                                                const pdfLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.invoicePDFPath}`;
                                                const link =
                                                  document.createElement("a");
                                                link.href = pdfLink;
                                                link.target = "_blank";
                                                link.rel = "noopener noreferrer";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                              }
                                            }}


                                            className="flex items-center text-sky-800 hover:text-sky-700"
                                          >
                                            <FaDownload className="mr-2" size={16} />
                                            Downlaod Invoice
                                          </span>
                                        ),
                                      },
                                    ],
                                  }}
                                  trigger={["click"]}
                                >
                                  <button
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <PiDotsThreeOutlineVerticalBold
                                      className="hover:text-[#337ab7] text-[#3c8dbc]"
                                      size={16}
                                    />
                                  </button>
                                </Dropdown>
                              </Tooltip>
                            </span>
                          </td>
                        )}
                        {isDeleted == 'true' && (
                          <>
                            <td className="tableData">
                              {element?.remark ? element?.remark : "-"}
                            </td>
                            <td className="tableData">
                              {element?.updatedBy ? element?.updatedBy : "-"}
                            </td>
                            <td className="tableData">
                              {element?.updatedAt ? dayjs(element?.updatedAt).format("DD-MM-YYYY hh:mm a") : "-"}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={5}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
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
        {invoiceListData?.length > 0 && (
          <CustomPagination
            totalCount={totalinvoiceListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
        <ChatBox
          data={messageModal?.data}
          isOpen={messageModal?.isOpen}
          status={messageModal?.data?.status}
          onToggle={() => setMessagesModal({
            isOpen: false,
            data: null
          })}


        />

      </>
    </GlobalLayout>
  );
}
export default InvoiceList;