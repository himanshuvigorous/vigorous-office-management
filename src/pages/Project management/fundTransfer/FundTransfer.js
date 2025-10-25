import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBack2Fill, RiDeleteBin5Line, RiTimeLine } from "react-icons/ri";
import { decrypt, encrypt } from "../../../config/Encryption";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  domainName,
  inputAntdSelectClassNameFilter,
  showSwal,
} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import usePermissions from "../../../config/usePermissions";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { FaEdit, FaEye, FaFileInvoiceDollar, FaTrash } from "react-icons/fa";
import ListLoader from "../../../global_layouts/ListLoader";
import { deletefundTransfer, getfundTransferDetails, getfundTransferList } from "./fundTransferFeatures/_fundTransfer_reducers";
import Swal from "sweetalert2";
import FundTransferViewModal from "./FundTransferViewModal";

function FundTransfer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fundTransferListData, totalfundTransferListCount, loading } = useSelector(
    (state) => state.fundTransfer
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
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
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);

    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [currentPage, limit, branchId, status, searchText]);

  useEffect(() => {
    getfundTransferrequest();
  }, [currentPage, limit, branchId, status, searchText]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setStatus("");
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
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const getfundTransferrequest = () => {
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
        type: status,
        text: searchText,
        sort: true,
        status: "",
        isPagination: true,
      },
    };
    dispatch(getfundTransferList(data));
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

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  const handleView = (element) => {
    dispatch(
      getfundTransferDetails({
        _id: element?._id,
      })
    );
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
        dispatch(deletefundTransfer(reqData)).then((data) => {
          if (currentPage > 1 && fundTransferListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));
          } else {
            getfundTransferrequest();
          }
        });
      }
    });
  };

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center md:gap-3 gap-1">
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
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  handleResetFilters();
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && (
                <Tooltip placement="topLeft" title="Add Contra">
                  <button
                    onClick={() => {
                      navigate("/admin/fund-transfer/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md whitespace-nowrap flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add fund transfer</span>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                  <th className="tableHead w-[5%]">S.No.</th>
                  <th className="tableHead w-[10%]">Date</th>
                  <th className="tableHead w-[15%]">Transfer Type</th>
                  <th className="tableHead w-[20%]">Sender</th>
                  <th className="tableHead w-[20%]">Receiver</th>
                  <th className="tableHead w-[15%]">Amount</th>
                  <th className="tableHead w-[10%]">UTR Number</th>
                  {(canDelete || canUpdate) && (
                    <th className="tableHead w-[15%]">Action</th>
                  )}
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr className="bg-white bg-opacity-5">
                    <td colSpan={10} className="px-6 py-4 whitespace-nowrap text-center">
                      <Loader2 />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {fundTransferListData && fundTransferListData?.length > 0 ? (
                    fundTransferListData?.map((element, index) => (
                      <tr
                        key={element?._id}
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD] hover:bg-gray-50`}
                      >
                        <td className="tableData text-center">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">
                          {dayjs(element?.date).format("DD-MM-YYYY") || "-"}
                        </td>
                        <td className="tableData">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${element?.transferCatagoryType === 'internal' ? 'bg-blue-100 text-blue-800' :
                              element?.transferCatagoryType === 'credit' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'}`}>
                            {element?.transferCatagoryType?.toUpperCase() || "-"}
                          </span>
                        </td>
                        <td className="tableData">
                          <div>
                            <div className="font-medium">{element?.senderName || "-"}</div>
                            {element?.senderBankAccName && (
                              <div className="text-xs text-gray-500">
                                {element?.senderBankAccName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="tableData">
                          <div>
                            <div className="font-medium">{element?.receiverName || "-"}</div>
                            {element?.receiverBankAccName && (
                              <div className="text-xs text-gray-500">
                                {element?.receiverBankAccName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="tableData font-semibold">
                          {convertIntoAmount(element?.amount || "-")}
                        </td>
                        <td className="tableData">
                          {element?.UTRNumber || "-"}
                        </td>
                        {(canDelete || canUpdate) && (
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2">
                              <Tooltip placement="top" title="View Details">
                                <button
                                  onClick={() => handleView(element)}
                                  className="p-2 text-xs rounded-md bg-transparent text-blue-600 border border-blue-200 hover:bg-blue-50"
                                  type="button"
                                >
                                  <FaEye className="size-3" />
                                </button>
                              </Tooltip>
                              <Tooltip placement="top" title="Edit">
                                <button
                                  onClick={() => navigate(`/admin/fund-transfer/edit/${encrypt(element?._id)}`)}
                                  className="p-2 text-xs rounded-md bg-transparent text-green-600 border border-green-200 hover:bg-green-50"
                                  type="button"
                                >
                                  <FaEdit className="size-3" />
                                </button>
                              </Tooltip>
                              <Tooltip placement="top" title="Delete">
                                <button
                                  onClick={() => handleDelete(element?._id)}
                                  className="p-2 text-xs rounded-md bg-transparent text-red-600 border border-red-200 hover:bg-red-50"
                                  type="button"
                                >
                                  <FaTrash className="size-3" />
                                </button>
                              </Tooltip>
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white">
                      <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FaFileInvoiceDollar className="text-4xl text-gray-300 mb-2" />
                          <span className="font-medium">No Fund Transfers Found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          )}

          {/* View Modal Component */}
          <FundTransferViewModal
            visible={viewOpen}
            onClose={() => setViewOpen(false)}
          />

        </div>
        {fundTransferListData?.length > 0 && (
          <CustomPagination
            totalCount={totalfundTransferListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>
    </GlobalLayout>
  );
}

export default FundTransfer;