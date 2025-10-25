import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPeopleGroup } from "react-icons/fa6";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  customDayjs,
  domainName,
  inputAntdSelectClassNameFilter,
  showSwal,
} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import {
  deletepurchaseExpence,
  getpurchaseExpenceDetails,
  getpurchaseExpenceList,
} from "./purchaseandexpenceFeature/_purchaseandexpence_reducers";
import moment from "moment";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import {
  FaEye,
  FaFilePdf,
  FaImages,
  FaIndustry,
  FaRegAddressCard,
} from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineMail, AiOutlineTags } from "react-icons/ai";
import dayjs from "dayjs";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";
import ListLoader from "../../../global_layouts/ListLoader";
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

function PurchaseandexpenceList() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [viewOpen, setViewOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    purchaseExpenceListData,
    purchaseExpenceDetails,
    totalpurchaseExpenceListCount,
    loading,
  } = useSelector((state) => state.purchaseExpence);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    purchaseExpence: {},
  });
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);

    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [currentPage, limit, branchId, status, searchText]);
  useEffect(() => {
    getpurchaseExpencerequest();
  }, [currentPage, limit, branchId, status, searchText]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setStatus("");
    setSearchText("");
  };

  const onPaginationChange = (page) => setCurrentPage(page);
  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const getpurchaseExpencerequest = () => {
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
        text: searchText,
        sort: true,
        status: status,
        isPagination: true,
      },
    };
    dispatch(getpurchaseExpenceList(data));
  };

  const handleView = (element) => {
    dispatch(
      getpurchaseExpenceDetails({
        _id: element?._id,
      })
    );
    setViewOpen(true);
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
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
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

  const onChange = (e) => {
    setSearchText(e);
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
        dispatch(deletepurchaseExpence(reqData)).then((data) => {
          getpurchaseExpencerequest();
        });
      }
    });
  };
  const isPDF = (filename) => filename.toLowerCase().endsWith(".pdf");
  const isImage = (filename) =>
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"].some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid grid-cols-1 md:gap-2 gap-1 md:grid-cols-3 items-center">
              {(userInfoglobal?.userType === "admin" ||
                userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                <div className="">
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
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                </Select>
              </div>
            </div>
            <div className="flex justify-end items-center gap-2 ">
              <button
                onClick={() => {
                  handleResetFilters();
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && (
                <Tooltip placement="topLeft"  title="Add Purchase Expense">
                  <button
                    onClick={() => {
                      navigate("/admin/purchase-expence/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Purchase Expense</span>
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
                  <th className="tableHead w-[10%]">Date Of Entry</th>
                  <th className="tableHead">Bill Date</th> 
                  <th className="tableHead">Vendor Name</th>
                  <th className="tableHead w-[10%]">Type of Asset/Expense</th>
                  {/* <th className="tableHead w-[10%]">Expense Type</th> */}
                  {/* <th className="tableHead"> Asset Name</th>
                  <th className="tableHead">Expense Head</th> */}
                  <th className="tableHead text-right">Amount</th>
                  <th className="tableHead text-right">GST Amount</th>
                  <th className="tableHead text-right">Gross Amount</th>
                  {/* <th className="tableHead">Created By</th> */}
                  <th className="tableHead">Status</th>
                  {(canDelete || canUpdate) && (
                    <th className="tableHead w-[10%]">Action</th>
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
                  {purchaseExpenceListData &&
                  purchaseExpenceListData?.length > 0 ? (
                    purchaseExpenceListData?.map((element, index) => (
                      <tr
                        className={`text-black ${
                          index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">
                        {element?.createdAt ? customDayjs(element?.createdAt) : "-"}
                        </td>
                          <td className="tableData">
                            {moment(element?.purchaseDate)?.format("DD-MM-YYYY")}
                          </td>
                        <td className="tableData">
                        <Tooltip placement="topLeft" 
                            title={`Vendor Name - ${element?.vendorName}`}
                          >
                            {element?.vendorName
                              ? `${element?.vendorName}`
                              : `${element?.vendorOtherName || '-'} `}
                          </Tooltip>
                        </td>
                        {/* <td className="tableData">{element?.purchaseType}</td> */}
                        <td className="tableData">
                          {/* <Tooltip placement="topLeft" 
                            title={`PurchaseType - ${element?.purchaseType}`}
                            >
                            {" "}
                            {element?.purchaseType}{" "}
                          </Tooltip>{" "}
                          */}
                          {/* <Tooltip placement="topLeft" 
                            title={`Vendor Name - ${element?.vendorName}`}
                          >
                            {element?.vendorName
                              ? `    ${element?.vendorName}`
                              : ""}
                          </Tooltip> */}
                          {/* <Tooltip placement="topLeft" 
                            title={
                              element?.purchaseType !== "Other"
                              
                                && `Asset Name -${element?.assetName}`
                                }
                                >
                                {" "}
                                {element?.purchaseType !== "Other"
                                
                                ? element?.assetName : "-"}
                                </Tooltip> */}

                          {element?.purchaseType !== "Other"
                             
                              ? element?.assetName : element?.expenseHeadName}
                        </td>
                                {/* <td className="tableData">
                                <Tooltip placement="topLeft" 
                                    title={`Expense Type - ${element?.purchaseType}`}
                                  >
                                    {" "}
                                    {element?.purchaseType}{" "}
                                  </Tooltip>{" "}
                                </td> */}

                        {/* <td className="tableData">
                        <Tooltip placement="topLeft" 
                            title={
                              element?.purchaseType == "Other"
                              
                                && `Expense Head Name -${element?.expenseHeadName}`
                            }
                          >
                            {" "}
                            {element?.purchaseType === "Other"
                             
                              ? element?.expenseHeadName : "-"}
                          </Tooltip>
                        </td> */}
                        <td className="tableData text-right">
                          {convertIntoAmount(
                            element?.totalAmount ? element?.totalAmount : "-"
                          )}
                        </td>
                        <td className="tableData text-right">
                          {convertIntoAmount(
                            element?.totalGSTAmount
                              ? element?.totalGSTAmount
                              : "-"
                          )}
                        </td>
                        <td className="tableData text-right">
                          {convertIntoAmount(
                            element?.grandTotal ? element?.grandTotal : "-"
                          )}
                        </td>
                        {/* <td className="tableData">{element?.createdBy ? element?.createdBy : "-"}</td> */}
                        <td className="tableData">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              element?.status === "Approved"
                                ? "bg-cyan-100 border border-cyan-600 text-cyan-800"
                                : element?.status === "Reject" ||
                                  element?.status === "Rejected"
                                ? "bg-rose-100 border border-rose-600 text-rose-800"
                                : element?.status === "Paid"
                                ? "bg-green-100 border border-green-600 text-green-800"
                                : "bg-yellow-100 border border-yellow-600 text-yellow-800"
                            }`}
                          >
                            {element?.status}
                          </span>
                          {/* {element?.status} */}
                        </td>
                        {(canDelete || canUpdate) && (
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2.5">
                              <Tooltip placement="topLeft"  title="View Details">
                                <button
                                  onClick={() => {
                                    handleView(element);
                                  }}
                                  className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                                  type="button"
                                >
                                  <FaEye
                                    className={`${" hover:text-[#337ab7] text-[#3c8dbc]"}`}
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
                                    // {
                                    //   key: "view-doc",
                                    //   label: (
                                    //     <span
                                    //       onClick={() =>
                                    //         element?.attachment?.length > 0 &&
                                    //         setModal({
                                    //           isOpen: true,
                                    //           data: element,
                                    //           purchaseExpence: {},
                                    //         })
                                    //       }
                                    //       className={`flex items-center ${
                                    //         element?.attachment?.length > 0
                                    //           ? "text-rose-700 hover:text-rose-700"
                                    //           : "text-gray-400 cursor-not-allowed"
                                    //       }`}
                                    //     >
                                    //       <FaImages
                                    //         className="mr-2"
                                    //         size={16}
                                    //       />
                                    //       View Document
                                    //     </span>
                                    //   ),
                                    //   disabled: !(
                                    //     element?.attachment?.length > 0
                                    //   ),
                                    // },
                                    canUpdate && {
                                      key: "edit",
                                      label: (
                                        <span
                                          onClick={() => {
                                            if (element?.status === "Pending") {
                                              navigate(
                                                `/admin/purchase-expence/edit/${encrypt(
                                                  element?._id
                                                )}`
                                              );
                                            }
                                          }}
                                          className={`flex items-center ${
                                            element?.status === "Pending"
                                              ? "text-[#3c8dbc] hover:text-[#337ab7]"
                                              : "text-gray-400 cursor-not-allowed"
                                          }`}
                                        >
                                          <FaPenToSquare
                                            className="mr-2"
                                            size={16}
                                          />
                                          {element?.status === "Pending"
                                            ? "Edit"
                                            : `No Actions (${element?.status})`}
                                        </span>
                                      ),
                                      disabled: element?.status !== "Pending",
                                    },
                                    canDelete && {
                                      key: "delete",
                                      label: (
                                        <span
                                         
                                          className={`flex items-center ${
                                            element?.status === "Pending"
                                              ? "text-rose-500 hover:text-rose-600"
                                              : "text-gray-400 cursor-not-allowed"
                                          }`}
                                        >
                                          <MdDeleteForever
                                            className="mr-2"
                                            size={16}
                                          />
                                          {element?.status === "Pending"
                                            ? "delete"
                                            : `No Actions (${element?.status})`}
                                        </span>
                                      ),
                                      disabled: element?.status !== "Pending",
                                       onClick:() => {
                                            if (element?.status === "Pending") {
                                              handleDelete(element?._id)
                                            }
                                          }
                                    },
                                  ].filter(Boolean),
                                }}
                                trigger={["click"]}
                              >
                                <Tooltip placement="topLeft"  title="More Actions">
                                  <button
                                    className={`px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted `}
                                    type="button"
                                  >
                                    <PiDotsThreeOutlineVerticalBold
                                      className={`text-[#3c8dbc] hover:text-[#337ab7]`}
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>
                              </Dropdown>
                            </span>
                          </td>
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
        {purchaseExpenceListData?.length > 0 && (
          <CustomPagination
            totalCount={totalpurchaseExpenceListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}

        <Modal
          className="antmodalclassName"
          title={`Attached Docs	For ${modal?.data?.vendorData?.fullName}`}
          width={1000}
          footer={false}
          open={modal.isOpen}
          onOk={() => setModal({ open: false, data: {} })}
          onCancel={() => setModal({ open: false, data: {} })}
        >
          <table className="w-full max-w-full rounded-xl">
            <thead></thead>
            <tbody>
              <tr>
                <td className="tableData">
                  <div className="flex flex-col space-y-4">
                    {modal?.data?.attachment &&
                    Array.isArray(modal?.data?.attachment) ? (
                      modal.data.attachment.map((file, fileIndex) => {
                        const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;

                        if (isImage(file)) {
                          return (
                            <div
                              key={fileIndex}
                              className="flex items-center gap-2"
                            >
                              <p className="font-[500] text-[12px] text-black">
                                ({fileIndex + 1})
                              </p>
                              <CommonImageViewer
                                src={url}
                                alt={`Uploaded ${fileIndex + 1}`}
                              />
                            </div>
                          );
                        } else if (isPDF(file)) {
                          return (
                            <Tooltip placement="topLeft" 
                              title={`PDF Attachment ${fileIndex + 1}`}
                             
                              key={fileIndex}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-[500] text-[12px] text-black">
                                  ({fileIndex + 1})
                                </p>
                                <button
                                  onClick={() => window.open(url, "_blank")}
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                                  type="button"
                                >
                                  <FaFilePdf
                                    className="text-red-600 hover:text-red-700"
                                    size={26}
                                  />
                                </button>
                              </div>
                            </Tooltip>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : modal?.data?.attachment ? (
                      (() => {
                        const file = modal.data.attachment;
                        const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;

                        if (isImage(file)) {
                          return (
                            <CommonImageViewer src={url} alt="Uploaded Image" />
                          );
                        } else if (isPDF(file)) {
                          return (
                            <Tooltip placement="topLeft"  title="PDF Attachment" >
                              <button
                                onClick={() => window.open(url, "_blank")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                                type="button"
                              >
                                <FaFilePdf
                                  className="text-red-600 hover:text-red-700"
                                  size={26}
                                />
                              </button>
                            </Tooltip>
                          );
                        } else {
                          return null;
                        }
                      })()
                    ) : (
                      <span className="text-gray-600 text-sm text-center">
                        No File Attached
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Modal>

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
            <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
              <thead>
                <tr>
                  <th className="text-header ">
                    <div className="mt-2 ml-2">Purchase Expanse Details</div>
                  </th>
                </tr>
              </thead>
              {/* dfvdbdfb */}

              <tbody className="text-sm text-gray-700">
                <tr className=" hover:bg-indigo-50">
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonSharp className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        PurchaseType
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.purchaseType || "N/A"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonSharp className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Expence Head
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.expenseHeadData?.name || "N/A"}
                    </span>
                  </td>
                </tr>
                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <AiOutlineTags className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        purchaseDate
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {dayjs(purchaseExpenceDetails?.date).format(
                        "DD-MM-YYYY"
                      ) || "N/A"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonSharp className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        vendor Name
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.vendorData?.fullName || "N/A"}
                    </span>
                  </td>
                </tr>

                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaPeopleGroup className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Total Amount
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.totalAmount || "N/A"} Rs
                    </span>
                  </td>

                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaIndustry className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Gst Amount
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.totalGSTAmount || "N/A"} Rs
                    </span>
                  </td>
                </tr>
                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaRegAddressCard className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">
                        Grand Total Amount
                      </span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.grandTotal || "N/A"} Rs
                    </span>
                  </td>

                  <td className="p-3  text-gray-600">
                    <div className="flex items-center gap-2">
                      <AiOutlineMail className="size-4 text-header text-lg" />
                      <span className="text-[16px] font-medium">Status</span>
                    </div>
                    <span className="block text-[15px] ml-4 font-light mt-1">
                      {purchaseExpenceDetails?.status || "N/A"}
                    </span>
                  </td>
                </tr>
                <tr className=" hover:bg-indigo-50">
                  <td className="p-3  text-gray-600">
                    <div className="flex flex-col justify-start items-start gap-2">
                      {/* <FaRegAddressCard className="size-4 text-header text-lg" /> */}
                      <span
                          onClick={() =>
                            purchaseExpenceDetails?.attachment?.length > 0 &&
                            setModal({
                              isOpen: true,
                              data: purchaseExpenceDetails,
                              purchaseExpence: {},
                            })
                          }
                          className={`flex items-center ${
                            purchaseExpenceDetails?.attachment?.length > 0
                              ? "text-rose-700 hover:text-rose-700"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FaImages
                            className="mr-2"
                            size={16}
                          />
                          View Document
                        </span>
                    </div>
                   
                  </td>

                 
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      </>
    </GlobalLayout>
  );
}
export default PurchaseandexpenceList;
