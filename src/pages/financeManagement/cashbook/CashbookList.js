import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPeopleGroup } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { convertIntoAmount, customDayjs, domainName, inputAntdSelectClassNameFilter, showSwal } from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deletecashbook, getcashbookDetails, getcashbookList, statuscashbook } from "./cashbookFeature/_cashbook_reducers";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { BiCheckDouble } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { FaEye, FaFilePdf, FaImages, FaIndustry, FaRegAddressCard, FaUserAlt } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";
import ListLoader from "../../../global_layouts/ListLoader";
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";
import CustomDatePickerFilter from "../../../global_layouts/DatePicker/CustomDatePickerFilter";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineTags } from "react-icons/ai";
import { DocumentViewerModal } from "./DocumentViewerModal";

function CashbookList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cashbookListData, cashbookDetails, totalcashbookListCount, loading } = useSelector(
    (state) => state.cashbook
  );

  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    cashbook: {}
  });

  const [visitorModal, setVisitorModal] = useState({
    isOpen: false,
    data: {}
  });

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialStartDate = searchParams.get("startDate") || null;
  const initialEndDate = searchParams.get("endDate") || null;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";

  const [startDate, setStartDate] = useState(
    initialStartDate ? dayjs(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? dayjs(initialEndDate) : null
  );
  const [limit, setLimit] = useState(initialLimit);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [branchId, setBranchId] = useState(initialBranchId);
  const [status, setStatus] = useState(initialStatus || "Pending")

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (limit !== 10) params.set("limit", limit);
    if (branchId) params.set("branchId", branchId);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (status) params.set("status", status)
    setSearchParams(params);
  }, [currentPage, branchId, limit, startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const onChange = (e) => {
    setSearchText(e);
  };

  useEffect(() => {
    getCashbookrequest();
  }, [currentPage, branchId, limit, startDate, endDate, searchText, status]);

  const getCashbookrequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
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
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
        "startDate": customDayjs(startDate),
        "endDate": customDayjs(endDate),
      }
    };
    dispatch(getcashbookList(data));
  };

  const handleView = (element) => {
    dispatch(getcashbookDetails({
      _id: element?._id
    }));
    setViewOpen(true);
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
        dispatch(deletecashbook(reqData)).then((data) => {
          if (currentPage > 1 && cashbookListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));
          } else {
            getCashbookrequest();
          }
        });
      }
    });
  };

  useEffect(() => {
    if (userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, []);

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

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <DocumentViewerModal isOpen={modal.isOpen}
          onClose={() => setModal({ open: false, data: {} })}
          employeeName={modal?.data.employeName}
          attachments={modal?.data.attachment} />
        {/* Visitor Modal */}
        <Modal
          className="antmodalclassName"
          title="Visitor Details"
          width={800}
          footer={false}
          open={visitorModal.isOpen}
          onCancel={() => setVisitorModal({ isOpen: false, data: {} })}
        >
          <div className="w-full overflow-auto">
            <table className="w-full rounded-lg shadow-md overflow-hidden bg-white">
              <tbody className="text-sm text-gray-700">
                <tr className="hover:bg-indigo-50">
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonSharp className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Visitor Name
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {visitorModal.data?.name || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <AiOutlineTags className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Mobile Number
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {visitorModal.data?.mobile?.number ?
                        `${visitorModal.data?.mobile?.code} ${visitorModal.data?.mobile?.number}` :
                        "N/A"}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-indigo-50">
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaIndustry className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Check In Time
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {visitorModal.data?.checkInTime ?
                        dayjs(visitorModal.data?.checkInTime).format("DD-MM-YYYY hh:mm A") :
                        "N/A"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaRegAddressCard className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Check Out Time
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {visitorModal.data?.checkOutTime ?
                        dayjs(visitorModal.data?.checkOutTime).format("DD-MM-YYYY hh:mm A") :
                        "N/A"}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-indigo-50">
                  <td className="p-3 text-gray-600" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <FaPeopleGroup className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Address
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {visitorModal.data?.address?.street || "N/A"}
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-indigo-50">
                  <td className="p-3 text-gray-600" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <FaIndustry className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Reason for Visit
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {visitorModal.data?.reason || "N/A"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>

        <div className="flex justify-start items-center my-1">
          <button
            className={`bg-header border-header text-white px-3 py-2 border rounded-l-md flex justify-center items-center space-x-2`}
          >
            <span className="text-[12px]">Approval View</span>
          </button>
          <button
            className={`text-black px-3 py-2 border rounded-l-md flex justify-center items-center space-x-2`}
            onClick={() => { navigate("/admin/cashbook/listView") }}
          >
            <span className="text-[12px]">Employee View</span>
          </button>
        </div>

        <div className="">
          <div className="xl:flex justify-between items-center xl:space-y-0 space-y-2 py-1">
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 items-center md:gap-3 gap-1.5">
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
                <div className="">
                  <Select
                    value={branchId}
                    onChange={handleBranchChange}
                    defaultValue=""
                    disabled={loading}
                    className={`${inputAntdSelectClassNameFilter}`}
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
              }
              <div className="">
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  defaultValue=""
                  disabled={loading}
                  className={`${inputAntdSelectClassNameFilter}`}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder={"Select Search"}
                >
                  <Select.Option value="">Select Status</Select.Option>
                  {
                    ["Pending", "Approved", "Paid", "Reject"]?.map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>

                    ))}
                </Select>
              </div>
              <div>
                <CustomDatePickerFilter
                  value={startDate}
                  onChange={handleStartDateChange}
                  disabled={loading}
                  report={true}
                  size={"middle"}
                />
              </div>
              <div>
                <CustomDatePickerFilter
                  value={endDate}
                  onChange={handleEndDateChange}
                  disabled={loading}
                  report={true}
                  size={"middle"}
                />
              </div>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setBranchId("");
                  setStatus("")
                }}
                className="bg-header py-1.5 rounded-md flex px-10 justify-center items-center text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate &&
                <Tooltip placement="topLeft" title='Add Cashbook'>
                  <button
                    onClick={() => {
                      navigate("/admin/cashbook/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center whitespace-nowrap space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Cashbook</span>
                  </button>
                </Tooltip>
              }
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead &&
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                  <th className="tableHead w-[10%]">S.No.</th>
                  <th className="tableHead">Employee</th>
                  <th className="tableHead text-right">Amount</th>
                  <th className="tableHead">Expense Type</th>
                  <th className="tableHead">Bill Date</th>
                  <th className="tableHead">Client Name</th>
                  <th className="tableHead">Status</th>
                  <th className="tableHead">Created At</th>
                  <th className="tableHead">Created By</th>
                  <th className="tableHead">Approved By</th>
                  {(canDelete || canUpdate) && <th className="tableHead w-[10%]">Action</th>}
                </tr>
              </thead>
              {loading ?
                <tr className="bg-white bg-opacity-5">
                  <td colSpan={10} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">
                    <Loader2 />
                  </td>
                </tr>
                :
                <tbody>
                  {cashbookListData && cashbookListData?.length > 0 ? (
                    cashbookListData?.map((element, index) => (
                      <tr key={index} className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} border-b-[1px] border-[#DDDDDD]`}>
                        <td className="tableData"> {index + 1 + ((currentPage - 1) * limit)} </td>
                        <td
                          onClick={() => {
                            navigate(`/admin/cashbook/employee/${encrypt(element?.companyId)}/${encrypt(element?.branchId)}/${encrypt(element?.employeData?._id)}`)
                          }}
                          className="tableData"
                        >
                          {element?.employeData?.fullName}
                        </td>
                        <td className="tableData text-right">{convertIntoAmount(element?.amount || "-")}</td>
                        <td className="tableData">{element?.expenseTypeData?.name || "N/A"}</td>
                        <td className="tableData">{element?.date ? dayjs(element?.date).format("DD-MM-YYYY") : '-'}</td>
                        <td className="tableData">{element?.visitorData?.name || "-"}</td>
                        <td className="tableData">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${element?.status === 'Approved'
                              ? 'bg-cyan-100 border border-cyan-600 text-cyan-800'
                              : element?.status === 'Reject' || element?.status === 'Rejected'
                                ? 'bg-rose-100 border border-rose-600 text-rose-800'
                                : element?.status === 'Paid'
                                  ? 'bg-green-100 border border-green-600 text-green-800'
                                  : 'bg-yellow-100 border border-yellow-600 text-yellow-800'
                              }`}
                          >
                            {element?.status}
                          </span>
                        </td>
                        <td className="tableData">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}</td>
                        <td className="tableData">{element?.createdBy}</td>
                        <td className="tableData">{ element?.status !== 'Pending' ? (element.updatedBy || element.createdBy) : "-"}</td>
                        {(canDelete || canUpdate) &&
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2.5">
                              {/* View Button */}
                              <button
                                onClick={() => handleView(element)}
                                className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                                type="button"
                              >
                                <FaEye className="hover:text-[#337ab7] text-[#3c8dbc]" />
                              </button>



                              {/* Visitor Button (if visitorId exists) */}
                              {element?.visitorId && (
                                <button
                                  onClick={() => setVisitorModal({ isOpen: true, data: element?.visitorData })}
                                  className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                                  type="button"
                                >
                                  <FaUserAlt className="hover:text-[#337ab7] text-[#3c8dbc]" />
                                </button>
                              )}

                              {/* Approve Button */}
                              {canUpdate &&
                                <Tooltip placement="topLeft" title={element?.status === "Pending" ? "Approve" : `No Actions (${element?.status})`}>
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: 'Are You Sure to Approve?',
                                        showCancelButton: true,
                                        confirmButtonText: `Approve`,
                                        cancelButtonText: 'Cancel',
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                          dispatch(statuscashbook({
                                            _id: element?._id,
                                            status: "Approved"
                                          })).then((data) => {
                                            if (!data?.error) {
                                              getCashbookrequest();
                                              Swal.fire('Successfully Approved', 'Status updated', 'success');
                                            }
                                          });
                                        }
                                      });
                                    }}
                                    className={`px-2 py-1.5 text-xs rounded-md border border-muted ${element?.status === "Pending"
                                      ? "bg-transparent hover:bg-blue-100"
                                      : "bg-gray-200"
                                      }`}
                                    type="button"
                                    disabled={element?.status !== "Pending"}
                                  >
                                    <BiCheckDouble
                                      className={`${element?.status === "Pending"
                                        ? "text-[#3c8dbc] hover:text-[#337ab7]"
                                        : "text-gray-400"
                                        }`}
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>
                              }

                              {/* Reject Button */}
                              {canUpdate &&
                                <Tooltip placement="topLeft" title={element?.status === "Pending" ? "Reject" : `No Actions (${element?.status})`}>
                                  <button
                                    onClick={() => {
                                      Swal.fire({
                                        title: 'Provide Remark',
                                        input: 'textarea',
                                        inputLabel: 'Remark (Mandatory)',
                                        inputPlaceholder: 'Type your remark here...',
                                        showCancelButton: true,
                                        confirmButtonText: `Update as Rejected`,
                                        cancelButtonText: 'Cancel',
                                        inputValidator: (value) => {
                                          if (!value || value.trim() === '') {
                                            return 'Remark cannot be empty';
                                          }
                                          return null;
                                        },
                                        preConfirm: () => {
                                          const popup = Swal.getPopup();
                                          const feedback = popup.querySelector('textarea')?.value.trim();
                                          if (!feedback) {
                                            Swal.showValidationMessage('Remark is required');
                                            return false;
                                          }
                                          return { feedback };
                                        },
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                          const { feedback } = result.value;
                                          dispatch(statuscashbook({
                                            _id: element?._id,
                                            status: "Reject",
                                            remark: feedback,
                                          })).then((data) => {
                                            if (!data?.error) {
                                              getCashbookrequest();
                                              Swal.fire('Successfully Rejected', 'Status updated', 'success');
                                            }
                                          });
                                        }
                                      });
                                    }}
                                    className={`px-2 py-1.5 text-xs rounded-md border border-muted ${element?.status === "Pending"
                                      ? "bg-transparent hover:bg-blue-100"
                                      : "bg-gray-200"
                                      }`}
                                    type="button"
                                    disabled={element?.status !== "Pending"}
                                  >
                                    <RxCross2
                                      className={`${element?.status === "Pending"
                                        ? "text-rose-800 hover:text-rose-900"
                                        : "text-gray-400"
                                        }`}
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>
                              }

                              {/* Dropdown for other actions */}
                              <Dropdown
                                menu={{
                                  items: [

                                    canUpdate && {
                                      key: 'edit',
                                      label: (
                                        <span
                                          onClick={() => {
                                            if (element?.status === "Pending") {
                                              navigate(`/admin/cashbook/edit/${encrypt(element?._id)}`);
                                            }
                                          }}
                                          className={`flex items-center ${element?.status === "Pending"
                                            ? "text-[#3c8dbc] hover:text-[#337ab7]"
                                            : "text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                          <FaPenToSquare className="mr-2" size={16} />
                                          {element?.status === "Pending" ? "Edit" : `No Actions (${element?.status})`}
                                        </span>
                                      ),
                                      disabled: element?.status !== "Pending",
                                    },
                                    canDelete && {
                                      key: 'delete',
                                      label: (
                                        <span
                                          onClick={() => {
                                            if (element?.status === "Pending") {
                                              handleDelete(element?._id);
                                            }
                                          }}
                                          className={`flex items-center ${element?.status === "Pending"
                                            ? "text-red-600 hover:text-red-500"
                                            : "text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                          <RiDeleteBin5Line className="mr-2" size={16} />
                                          {element?.status === "Pending" ? "Delete" : `No Actions (${element?.status})`}
                                        </span>
                                      ),
                                      disabled: element?.status !== "Pending",
                                    },
                                  ].filter(Boolean),
                                }}
                                trigger={['click']}
                              >
                                <button
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <PiDotsThreeOutlineVerticalBold
                                    className="text-[#3c8dbc] hover:text-[#337ab7]"
                                    size={16}
                                  />
                                </button>
                              </Dropdown>
                            </span>
                          </td>
                        }
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
              }
            </table>
          }

          <Modal
            className="antmodalclassName"
            visible={viewOpen}
            onCancel={() => setViewOpen(false)}
            footer={null}
            title={false}
            width={1200}
            height={600}
          >
            <div className="w-full overflow-auto">
              <table className="w-full rounded-lg shadow-md overflow-hidden bg-white">
                <thead>
                  <tr>
                    <th className="text-header">
                      <div className="mt-2 ml-2">
                        Cashbook Details
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr className="hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoPersonSharp className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Employee Name
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.employeData?.fullName || "N/A"}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <AiOutlineTags className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Expense Type
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.expenseTypeData?.name || "N/A"}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaPeopleGroup className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Naration
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.naration || "N/A"}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaIndustry className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Amount
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.totalAmount || "N/A"}
                      </span>
                    </td>
                  </tr>
                  {cashbookDetails?.attachment?.length > 0 && <tr className="hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaRegAddressCard className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Document
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.attachment?.length > 0 && (
                          <button
                            onClick={() => setModal({ isOpen: true, data: cashbookDetails })}
                            className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                            type="button"
                          >
                            <FaImages className="hover:text-[#337ab7] text-[#3c8dbc]" />
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>}
                </tbody>
              </table>
            </div>
          </Modal>
        </div>

        {cashbookListData?.length > 0 &&
          <CustomPagination
            totalCount={totalcashbookListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        }
      </>
    </GlobalLayout>
  );
}

export default CashbookList;