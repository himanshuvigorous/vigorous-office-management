import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPeopleGroup } from "react-icons/fa6";
import { RiDeleteBin5Line, RiTimeLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import Loader from "../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  domainName,
  inputAntdSelectClassNameFilter,

  showSwal,
} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import {

  getcontraDetails,
  getcontraList,
} from "./contraFeature/_contra_reducers";
import usePermissions from "../../../config/usePermissions";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { FaEye, FaIndustry, FaRegAddressCard } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineMail, AiOutlineTags } from "react-icons/ai";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { CgComment } from "react-icons/cg";
import ListLoader from "../../../global_layouts/ListLoader";
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";

function ContraList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { contraListData, totalcontraListCount, loading } = useSelector(
    (state) => state.contra
  );
  const { contraDetails } = useSelector((state) => state.contra);
  const [viewOpen, setViewOpen] = useState(false);
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

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);

    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [currentPage, limit, branchId, status, searchText]);
  useEffect(() => {
    getcontrarequest();
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

  const getcontrarequest = () => {
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
    dispatch(getcontraList(data));
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
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  const handleView = (element) => {
    dispatch(
      getcontraDetails({
        _id: element?._id,
      })
    );

    setViewOpen(true);
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
                  <Select.Option value="">Select Type</Select.Option>
                  <Select.Option value="cash_deposit">
                    Cash Deposit
                  </Select.Option>
                  <Select.Option value="cash_withdraw">
                    Cash Withdraw
                  </Select.Option>
                  <Select.Option value="bank_transfer">
                    Bank Transfer
                  </Select.Option>
                </Select>
              </div>
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
                <Tooltip placement="topLeft"  title="Add Contra">
                  <button
                    onClick={() => {
                      navigate("/admin/contra/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md whitespace-nowrap flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add contra</span>
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
                  <th className="tableHead">Entry Date</th>
                  <th className="tableHead">Transfer Date</th>
                  <th className="tableHead">Reciever</th>
                  <th className="tableHead">Sender</th>
                  <th className="tableHead">Amount</th>                  
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
                  {contraListData && contraListData?.length > 0 ? (
                    contraListData?.map((element, index) => (
                      <tr
                        className={`text-black ${
                          index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">
                          {dayjs(element?.entryDate).format("DD-MM-YYYY")}
                        </td>
                        <td className="tableData">
                          {dayjs(element?.date).format("DD-MM-YYYY")}
                        </td>
                        <td className="tableData">
                          {element?.type === "bank_transfer" &&
                            `${element?.senderBankAccData?.bankName} (${element?.senderBankAccData?.accountNumber})`}
                          {element?.type === "cash_withdraw" &&
                            `${element?.senderBankAccData?.bankName} (${element?.senderBankAccData?.accountNumber})`}
                          {element?.type === "cash_deposit" &&
                            `${element?.senderName}`}
                        </td>
                        <td className="tableData">
                          {element?.type === "bank_transfer" &&
                            `${element?.receiverBankAccData?.bankName} (${element?.receiverBankAccData?.accountNumber})`}
                          {element?.type === "cash_withdraw" &&
                            `${element?.receiverName}`}
                          {element?.type === "cash_deposit" &&
                            `${element?.receiverBankAccData?.bankName} (${element?.receiverBankAccData?.accountNumber})`}
                        </td>
                        <td className="tableData">
                          {convertIntoAmount(element?.amount || "-")}
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
                                  ].filter(Boolean),
                                }}
                                trigger={["click"]}
                              >
                                <Tooltip placement="topLeft"  title="More Actions">
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

          <Modal
            visible={viewOpen}
            onCancel={() => setViewOpen(false)}
            footer={null}
            title={false}
            width={1200}
            height={600}
            className="antmodalclassName"
          >
            <div className="w-full overflow-auto">
              <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                <thead>
                  <tr>
                    <th className="text-header ">
                      <div className="mt-2 ml-2">Contra Details</div>
                    </th>
                  </tr>
                </thead>
                {/* dfvdbdfb */}

                <tbody className="text-sm text-gray-700">
                  <tr className=" hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoPersonSharp className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Type</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {contraDetails?.type || "N/A"}
                      </span>
                    </td>

                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <AiOutlineTags className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Date</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {dayjs(contraDetails?.date).format("DD-MM-YYYY") ||
                          "N/A"}
                      </span>
                    </td>
                  </tr>

                  <tr className=" hover:bg-indigo-50">
                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaPeopleGroup className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Naration
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {contraDetails?.naration || "N/A"}
                      </span>
                    </td>

                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaIndustry className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Amount</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {contraDetails?.amount || "N/A"}
                      </span>
                    </td>
                  </tr>
                  {contraDetails?.recieverBankData && (
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Reciever Bank
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {contraDetails?.recieverBankData?.bankName || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Reciever Bank Account Number
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {contraDetails?.recieverBankData?.accountNumber ||
                            "N/A"}
                        </span>
                      </td>
                    </tr>
                  )}

                  {contraDetails?.senderBankData && (
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Sender Bank
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {contraDetails?.senderBankData?.bankName || "N/A"}
                        </span>
                      </td>
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Sender Bank Account Number
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {contraDetails?.senderBankData?.accountNumber ||
                            "N/A"}
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr className=" hover:bg-indigo-50">
                    {contraDetails?.senderUserData && (
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Sender Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {contraDetails?.senderUserData?.fullName || "N/A"}
                        </span>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>
        </div>
        {contraListData?.length > 0 && (
          <CustomPagination
            totalCount={totalcontraListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>
    </GlobalLayout>
  );
}
export default ContraList;
