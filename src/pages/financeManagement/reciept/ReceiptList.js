import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  customDayjs,
  domainName,
  inputAntdSelectClassNameFilter,
  showSwal,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import {
  deletereceipt,
  getreceiptList,
} from "./receiptFeature/_receipt_reducers";
import { FaDownload, FaEye } from "react-icons/fa";
import usePermissions from "../../../config/usePermissions";
import { Select, Tooltip, Dropdown } from "antd";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { CgComment } from "react-icons/cg";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader";
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";
import CustomDatePickerFilter from "../../../global_layouts/DatePicker/CustomDatePickerFilter";
import { officeAddressSearch } from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";

function ReceiptList() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { receiptListData, totalreceiptListCount, loading } = useSelector(
    (state) => state.receipt
  );
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = parseInt(searchParams.get("limit")) || 10;
  const initialStartDate = searchParams.get("startDate") || null;
  const initialEndDate = searchParams.get("endDate") || null;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialLayoutId = searchParams.get("layoutId") || "";
  const [startDate, setStartDate] = useState(
    initialStartDate ? dayjs(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? dayjs(initialEndDate) : null
  );
  const [limit, setLimit] = useState(initialLimit);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [branchId, setBranchId] = useState(initialBranchId);
  const [layoutId, setLayoutId] = useState(initialLayoutId);
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (limit !== 10) params.set("limit", limit);
    if (branchId) params.set("branchId", branchId);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (layoutId) params.set("layoutId", layoutId);
    setSearchParams(params);
  }, [currentPage, branchId, limit, startDate, layoutId, endDate]);
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
  const handleLayoutChange = (value) => {
    setLayoutId(value);
    setCurrentPage(1);
  };
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const onChange = (e) => {
    setSearchText(e);
  };
  useEffect(() => {
    getreceiptrequest();
  }, [currentPage, branchId, limit, startDate, layoutId, endDate, searchText]);
  const getreceiptrequest = () => {
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
            userInfoglobal?.userType === "companyDirector"
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        receiptLayoutId: layoutId,
        text: searchText,
        sort: true,
        status: "",
        isPagination: true,
        clientId: "",
        groupId: "",
        startDate: customDayjs(startDate),
        endDate: customDayjs(endDate),
        paymentmode: "",
      },
    };
    dispatch(getreceiptList(data));
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
        dispatch(deletereceipt(reqData)).then((data) => {
          getreceiptrequest();
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
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, []);
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

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div className="md:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="grid md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 items-center md:gap-3 gap-1.5">
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
                  setLayoutId("");
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && (
                <Tooltip placement="topLeft" title="Add Receipt">
                  <button
                    onClick={() => {
                      navigate("/admin/receipt/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white whitespace-nowrap"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Receipt</span>
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
                  <th className="tableHead">Client Name</th>
                  <th className="tableHead text-right">Amount</th>
                  <th className="tableHead">Payment Mode</th>
                  <th className="tableHead">Employee Name / Bank Name</th>
                  <th className="tableHead">Date of Receipts</th>

                  {canCreate && <th className="tableHead w-[10%]">Action</th>}
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
                  {receiptListData && receiptListData?.length > 0 ? (
                    receiptListData?.map((element, index) => (
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">{element?.clientName}</td>
                        <td className="tableData text-right">
                          {convertIntoAmount(element?.grandTotalAmount || "-")}
                        </td>
                        <td className="tableData">
                          {element?.paymentmode || "-"}
                        </td>
                        <td className="tableData">
                          {element?.paymentmode === "cash"
                            ? element?.employeName || "-"
                            : `${element?.bankData?.bankName || "-"}/${element?.bankData?.bankholderName || "-"
                            }`}
                        </td>
                        <td className="tableData">
                          {element.createdAt ? dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a") || "-" : "-"}
                        </td>

                        {canCreate && (
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2.5">
                              {canCreate && (
                                <>
                                  <Tooltip placement="topLeft" title="View">
                                    <button
                                      onClick={() => {
                                        if (element?.receiptPDFPath) {
                                          const pdfLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.receiptPDFPath}`;
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
                                      className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                      type="button"
                                    >
                                      <FaDownload
                                        className="hover:text-rose-700 text-rose-600"
                                        size={15}
                                      />
                                    </button>
                                  </Tooltip>
                                  <Tooltip placement="topLeft" title="Download Invoice" >
                                    {canRead && (
                                      <button
                                        onClick={() =>
                                          navigate(`/admin/viewInvoice?invoiceId=${encrypt(element?._id)}&type=receipt&downloadPdfPath=${element?.receiptPDFPath ? encrypt(element?.receiptPDFPath) : ''}`)}
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
                                </>
                              )}

                              <Dropdown
                                menu={{
                                  items: [
                                    // {
                                    //   key: "created-at",
                                    //   label: (
                                    //     <span
                                    //       onClick={() =>
                                    //         showSwal(
                                    //           dayjs(element?.createdAt).format(
                                    //             "DD-MM-YYYY hh:mm a"
                                    //           ) || "Data not available"
                                    //         )
                                    //       }
                                    //       className="flex items-center text-teal-800 hover:text-teal-700"
                                    //     >
                                    //       <GrValidate
                                    //         className="mr-2"
                                    //         size={16}
                                    //       />
                                    //       Created At
                                    //     </span>
                                    //   ),
                                    // },
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
                                          Delete (No Actions)
                                        </span>
                                      ),
                                    },
                                    {
                                      key: "view-desc",
                                      label: (
                                        <span
                                          onClick={() =>
                                            showSwal(
                                              element?.naration ||
                                              "Data not available"
                                            )
                                          }
                                          className="flex items-center text-blue-800 hover:text-blue-700"
                                        >
                                          <CgComment
                                            className="mr-2"
                                            size={16}
                                          />
                                          View Naration
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
        {receiptListData?.length > 0 && (
          <CustomPagination
            totalCount={totalreceiptListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>
    </GlobalLayout>
  );
}
export default ReceiptList;
