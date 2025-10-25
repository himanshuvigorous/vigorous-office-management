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
import { convertIntoAmount, domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, showSwal, } from "../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deletecashbook, getcashbookDetails, getcashbookList, getEmployeeCashbookList } from "./cashbookFeature/_cashbook_reducers";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { FaEye, FaFilePdf, FaImages, FaIndustry, FaRegAddressCard, FaRegFileImage } from "react-icons/fa";
import { IoImagesSharp, IoPersonSharp } from "react-icons/io5";
import { AiOutlineTags } from "react-icons/ai";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { CgComment } from "react-icons/cg";
import ListLoader from "../../../global_layouts/ListLoader";



function EmployeeCashbookList() {
  

  const { cashbookDetails, loading } = useSelector(
    (state) => state.cashbook
  );
  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    cashbook: {}
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeCashbookListData, totalemployeeCashbookListCount, employeeCashbookLoading } = useSelector(
    (state) => state.cashbook
  );


  const [viewOpen, setViewOpen] = useState(false)

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
    const [searchParams, setSearchParams] = useSearchParams();
        const initialPage = parseInt(searchParams.get("page")) || 1;
        const initialLimit = 10;
       
        const initialStatus = searchParams.get("status") || "";
        const [currentPage, setCurrentPage] = useState(initialPage);
        const [limit, setLimit] = useState(initialLimit);
        const [status, setStatus] = useState(initialStatus);
        const [searchText, setSearchText] = useState("");
      
      
        useEffect(() => {
          const params = new URLSearchParams();
          if (currentPage > 1) params.set("page", currentPage);
          if (status) params.set("status", status);
          setSearchParams(params);
        }, [currentPage, limit, status, searchText]);
        useEffect(() => {
          if (userInfoglobal?.userType === "employee" && userInfoglobal?._id) {
            getCashbookrequest();
          }
        }, [currentPage, limit,  status, searchText]);
      
        const handleResetFilters = () => {
          setCurrentPage(1);        
          setStatus("");
          setSearchText("");
        };
        const onChange = (e) => {
          setSearchText(e);
        };
      
        const onPaginationChange = (page) => setCurrentPage(page);
        const handleStatusChange = (value) => {
          setStatus(value);
          setCurrentPage(1);
        };


  const getCashbookrequest = () => {
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
           userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        employeId: userInfoglobal?._id,
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
      }
    };
    dispatch(getEmployeeCashbookList(data));
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
          getCashbookrequest()
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
          companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [])
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
    dispatch(getcashbookDetails({
      _id: element?._id
    }))
    setViewOpen(true)
  }


  if (userInfoglobal?.userType !== "employee" ) {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    );
  }

  const isPDF = (filename) => filename.toLowerCase().endsWith(".pdf");
  const isImage = (filename) =>
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"].some(ext =>
      filename.toLowerCase().endsWith(ext)
    );


  return (
    <GlobalLayout onChange={onChange}>

      <>

        <Modal
          className="antmodalclassName"
          title={`Attached Docs	For ${modal?.data?.employeName}`}
          width={1000}
          footer={false}
          open={modal.isOpen}
          onOk={() => setModal({ open: false, data: {} })}
          onCancel={() => setModal({ open: false, data: {} })}
        >
          <table className="w-full max-w-full rounded-xl">
            <thead>

            </thead>
            <tbody>
              <tr>
                <td className="whitespace-nowrap text-center p-2">
                  <div className="flex flex-col space-y-4">
                    {modal?.data?.attachment && Array.isArray(modal?.data?.attachment) ? (
                      modal.data.attachment.map((file, idx) => {
                        const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${file}`;
                        const icon = isPDF(file)
                          ? <FaFilePdf className="text-red-600 hover:text-red-700" size={20} />
                          : isImage(file)
                            ? <IoImagesSharp className="text-header hover:text-blue-700" size={20} />
                            : <IoImagesSharp className="text-gray-600" size={20} />;

                        return icon ? (
                          <Tooltip placement="topLeft"  title={`Attachment ${idx + 1}`} key={idx}>
                            <div className="flex justify-start items-center gap-2">
                              <p className="font-[500] text-[12px] text-black">({idx + 1})</p>
                              <button
                                onClick={() => window.open(url, "_blank")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                                type="button"
                              >
                                {icon || <FaRegFileImage className="text-gray-600" size={20} />}
                              </button>
                            </div>
                          </Tooltip>
                        ) : null;
                      })
                    ) : modal?.data?.attachment ? (
                      (() => {
                        const file = modal.data.attachment;
                        const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${file}`;
                        const icon = isPDF(file)
                          ? <FaFilePdf className="text-red-600 hover:text-red-700" size={18} />
                          : isImage(file)
                            ? <FaRegFileImage className="text-blue-600 hover:text-blue-700" size={18} />
                            : null;

                        return icon ? (
                          <Tooltip placement="topLeft"  title="Attachment">
                            <button
                              onClick={() => window.open(url, "_blank")}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                              type="button"
                            >
                              {icon}
                            </button>
                          </Tooltip>
                        ) : null;
                      })()
                    ) : (
                      <span className="text-gray-600 text-sm text-center">No File Attached</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Modal>

        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
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
                  <Select.Option value="Draft">Draft</Select.Option>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Paid">Paid</Select.Option>
                </Select>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {

                  handleResetFilters()
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate &&
                <Tooltip placement="topLeft"  title='Add Cashbook'>
                  <button
                    onClick={() => {
                      navigate("/admin/employee/cashbook/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center whitespace-nowrap space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Cashbook</span>
                  </button>
                </Tooltip>}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead">Amount</th>
                <th className="tableHead">Bill Date</th>
                <th className="tableHead">Remark</th>
                <th className="tableHead">created At</th>
                <th className="tableHead">Created By</th>
                <th className="tableHead">Updated At</th>
                <th className="tableHead">Updated By</th>

                <th className="tableHead">Status</th>
                {(canDelete || canUpdate) && <th className="tableHead w-[10%]">Action</th>}
              </tr>
            </thead>
            {employeeCashbookLoading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employeeCashbookListData && employeeCashbookListData?.length > 0 ? (
                  employeeCashbookListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="tableData">{convertIntoAmount(element?.amount || "-")}</td>
                      <td className="tableData">{element?.date ? dayjs(element?.date).format("DD-MM-YYYY ") : '-'}</td>
                      <td className="w-[150px]">{element?.remark || "-"}</td>
                      <td className="tableData">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}</td>
                      <td className="tableData">{element?.createdBy}</td>
                      <td className="tableData">{dayjs(element?.updatedAt).format('DD-MM-YYYY hh:mm a')}</td>
                      <td className="tableData">{element?.updatedBy}</td>

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
                      {(canDelete || canUpdate) &&
                        <td className="whitespace-nowrap p-2">
                          <span className="py-1.5 flex justify-start items-center space-x-2.5">


                            <Tooltip placement="topLeft"  title="View Details">
                              <button
                                onClick={() => {
                                  handleView(element)
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
                                    key: 'view-doc',
                                    label: (
                                      <span
                                        onClick={() =>
                                          element?.attachment?.length > 0 &&
                                          setModal({ isOpen: true, data: element, cashbook: {} })
                                        }
                                        className={`flex items-center`}
                                      >
                                        <FaImages
                                          className={`mr-2 flex items-center ${element?.attachment?.length > 0
                                            ? 'text-rose-700 hover:text-rose-700'
                                            : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                          size={16} />
                                        View Document
                                      </span>
                                    ),
                                    disabled: !(element?.attachment?.length > 0),
                                  },
                                  {
                                    key: 'view-comment',
                                    label: (
                                      <span
                                        onClick={() =>
                                          showSwal(element?.naration || "Data not available")
                                        }
                                        className="flex items-center text-blue-800 hover:text-blue-700"
                                      >
                                        <CgComment className="mr-2" size={16} />
                                        View Comment
                                      </span>
                                    ),
                                  },
                                  canUpdate && {
                                    key: 'edit',
                                    label: (
                                      <span
                                        onClick={() => {
                                          if (element?.status === "Pending") {
                                            navigate(`/admin/employee/cashbook/edit/${encrypt(element?._id)}`);
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
                              <Tooltip placement="topLeft"  title="More Actions">
                                <button
                                  className={`px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted ${element?.status !== "Pending" ? "opacity-60 cursor-not-allowed" : ""}`}
                                  type="button"
                                  disabled={element?.status !== "Pending"}
                                >
                                  <PiDotsThreeOutlineVerticalBold
                                    className={`${element?.status === "Pending" ? "text-[#3c8dbc] hover:text-[#337ab7]" : "text-gray-400"}`}
                                    size={16}
                                  />
                                </button>
                              </Tooltip>
                            </Dropdown>
                          </span>
                        </td>
                      }

                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={12}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>}



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
              {loading ? <ListLoader /> : <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                <thead>
                  <tr>
                    <th className="text-header ">
                      <div className="mt-2 ml-2">
                        Cashbook Details
                      </div>
                    </th>
                  </tr>
                </thead>
                {/* dfvdbdfb */}

                <tbody className="text-sm text-gray-700">

                  <tr className=" hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoPersonSharp
                          className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Employee Name
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.employeData?.fullName || "N/A"}
                      </span>
                    </td>

                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <AiOutlineTags className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Expense For
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.expenseFor || "N/A"}
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
                        {cashbookDetails?.naration || "N/A"
                        }
                      </span>
                    </td>

                    <td className="p-3  text-gray-600">
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
                  <tr className=" hover:bg-indigo-50">
                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaRegAddressCard className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Status
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {cashbookDetails?.status || 'N/A'}
                      </span>
                    </td>


                  </tr>




                </tbody>
              </table>}

            </div>
          </Modal>
        </div>
        {employeeCashbookListData?.length > 0 &&
          <CustomPagination
            totalCount={totalemployeeCashbookListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}
      </>

    </GlobalLayout>
  );
}
export default EmployeeCashbookList;
