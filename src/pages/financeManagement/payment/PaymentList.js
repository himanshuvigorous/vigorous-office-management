import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { convertIntoAmount, customDayjs, domainName, inputAntdSelectClassNameFilter,  showSwal, } from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deletepayment, getpaymentList } from "./paymentFeature/_payment_reducers";
import moment from "moment";
import { MdPayments } from "react-icons/md";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { BsEyeFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { CgComment } from "react-icons/cg";
import ListLoader from "../../../global_layouts/ListLoader";
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";
import { FaEye, FaIndustry, FaRegAddressCard } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineMail, AiOutlineTags } from "react-icons/ai";
import { FaPeopleGroup } from "react-icons/fa6";
import CustomDatePickerFilter from "../../../global_layouts/DatePicker/CustomDatePickerFilter";

function PaymentList() {  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentListData, totalpaymentListCount, loading } = useSelector(
    (state) => state.payment
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
      const initialStartDate = searchParams.get("startDate") || null;
  const initialEndDate = searchParams.get("endDate") || null;
      const [currentPage, setCurrentPage] = useState(initialPage);
      const [limit, setLimit] = useState(initialLimit);
      const [status, setStatus] = useState(initialStatus);
      const [searchText, setSearchText] = useState("");
      const [branchId, setBranchId] = useState(initialBranchId);
      const [startDate, setStartDate] = useState(
        initialStartDate ? dayjs(initialStartDate) : null
      );
      const [endDate, setEndDate] = useState(
        initialEndDate ? dayjs(initialEndDate) : null
      );
      useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
        if (branchId) params.set("branchId", branchId);
        if (status) params.set("status", status);
        setSearchParams(params);
      }, [currentPage, limit, branchId, status, searchText,startDate,endDate]);
      useEffect(() => {
        getpaymentrequest();
      }, [currentPage, limit, branchId, status, searchText,startDate,endDate]);
      const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(1);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(1);
  };
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

      const [viewOpen, setViewOpen] = useState(false);
      const [viewData,setViewData] = useState({})

      const handleView = (element) => {
       setViewData(element)
        setViewOpen(true);
      };


  const getpaymentrequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId: userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "text": searchText,
        "sort": true,
        "type":['payroll','advance','purchase'],
        startDate: customDayjs(startDate),
                endDate: customDayjs(endDate),
        "status": status,
        "isPagination": true,
      }
    };
    dispatch(getpaymentList(data));
  };
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
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
        dispatch(deletepayment(reqData)).then((data) => {
          getpaymentrequest()
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
          companyId:  userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
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


  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="flex items-center flex-wrap gap-1">
            
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
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
                </div>}
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
                        <Select.Option value="Draft">Pending</Select.Option>
                        <Select.Option value="Paid">Paid</Select.Option>
                 
                       </Select>
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
                handleResetFilters()
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
            </div>

          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead">Bill Date</th>
                {/* <th className="tableHead">Type</th> */}
                <th className="tableHead">Vendor Name</th>
           

                <th className="tableHead">Asset / Expense Type</th>
                <th className="tableHead">Description</th>
                <th className="tableHead">Amount</th>
                {/* <th className="tableHead">Payment For</th> */}
                {/* <th className="tableHead">Entry</th> */}
                {/* <th className="tableHead">craeted At</th>
                <th className="tableHead">craeted By</th> */}
                <th className="tableHead">Status</th>
                <th className="tableHead">Payment Date</th>
                {canCreate && <th className="tableHead w-[10%]">Action</th>}
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
                {paymentListData && paymentListData?.length > 0 ? (
                  paymentListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>

                      <td className="tableData w-[150px]">
                        {customDayjs(element?.createdAt)}
                      </td>
                      {/* <td className="tableData">{element?.type === "payroll" ? "Payroll" : element?.type === "cashBook" ? 'cashbook' : element?.purchaseAssetData?.purchaseType}</td> */}
                      <td className="tableData w-[100px]">
                        {element?.type === "purchase" && `${element?.purchaseAssetData?.purchaseType === "Vendor" ? `${element?.purchaseAssetData?.userName  || '-'} ` : `${element?.purchaseAssetData?.userName || 'Other'} `}`}
                        {element?.type === "cashBook" && ` ${element?.cashbookData?.userName || '-'}  ${element?.cashbookData?.date ? `/${moment(element?.cashbookData?.date).format("MM/YYYY")}` : ''} `}
                        {element?.type === "payroll" && ` ${element?.type || '-'} `}
                        {/* (${moment(element?.featureDate).format("DD/MM/YYYY")}) */}
                      </td>
                      <td className="tableData w-[100px] capitalize ">{element?.type === "purchase" && element?.purchaseAssetData?.purchaseType === "Vendor" ? element?.purchaseAssetData?.assetName  :element?.type === "cashBook" ? element?.type : element?.type}</td>
                      <td className="tableData lg:min-w-[600px] lg:w-[600px]  w-[400px] min-w-[400px] ">
                        {element?.remarks || '-'}
                      </td>
                      <td className="tableData">
                        {convertIntoAmount(element?.amount || element?.cashbookTotalAmount)}
                      </td>
                   
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
                          {element?.status==='Draft' ? 'Pending' : element?.status}
                        </span>
                      </td>
                      <td className="tableData w-[100px]">
                        { element?.date ? moment(element?.date).format("DD/MM/YYYY") : '-'}
                      
                      </td>
                      
                      
                        <td className="tableData">
                        

                          <span className="py-1.5 flex justify-start items-center space-x-2.5">
                         {canRead && <Tooltip placement="topLeft"  title="View Details">
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
                              </Tooltip>}

                           {canCreate &&
                              element?.status === "Draft" ? (
                                <Tooltip placement="topLeft"  title="Make Payment">
                                  <button
                                    onClick={() => {
                                      if (element?.status === "Draft") {
                                        navigate(`/admin/payment/edit/${encrypt(element?._id)}`);
                                      }
                                    }}
                                    className="p-1 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <MdPayments
                                      className="hover:text-[#337ab7] text-[#3c8dbc]"
                                      size={14} // Small size for the icon
                                    />
                                  </button>
                                </Tooltip>
                              ) : (
                                <Tooltip placement="topLeft"  title=" (No Actions Allowed)">
                                  <button
                                    className="p-1 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <MdPayments
                                      className="hover:text-gray-600 text-gray-500"
                                      size={14}
                                    />
                                  </button>
                                </Tooltip>
                              )
                            }
                            {canCreate &&
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: 'edit',
                                    label: (
                                      <span
                                        onClick={() => {
                                          if (element?.status === "Paid") {
                                            navigate(`/admin/payment/view/${encrypt(element?._id)}`);
                                          }
                                        }}
                                        className={`flex items-center ${element?.status !== "Draft"
                                          ? "text-[#3c8dbc] hover:text-[#337ab7]"
                                          : "text-gray-500 cursor-not-allowed"
                                          }`}
                                      >
                                        <BsEyeFill className="mr-2" size={14} />
                                        {element?.status !== "Draft" ? "View" : "No Actions (Not Paid)"}
                                      </span>
                                    ),
                                    disabled: element?.status !== "Paid",
                                  },
                                  {
                                    key: 'view-comment',
                                    label: (
                                      <span
                                        onClick={() =>
                                          showSwal(element?.remarks || "Data not available")
                                        }
                                        className="flex items-center text-blue-800 hover:text-blue-700"
                                      >
                                        <CgComment className="mr-2" size={16} />
                                        View Comment
                                      </span>
                                    ),
                                  },
                                  {
                                    key: 'created-at',
                                    label: (
                                      <span
                                        onClick={() =>
                                          showSwal(dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || "Data not available")
                                        }
                                        className="flex items-center text-teal-800 hover:text-teal-700"
                                      >
                                        <GrValidate className="mr-2" size={16} />
                                        Created At
                                      </span>
                                    ),
                                  },
                                  {
                                    key: 'created-by',
                                    label: (
                                      <span
                                        onClick={() =>
                                          showSwal(element?.createdBy || "Data not available")
                                        }
                                        className="flex items-center text-sky-800 hover:text-sky-700"
                                      >
                                        <TbPencilMinus className="mr-2" size={16} />
                                        Created By
                                      </span>
                                    ),
                                  },


                                ],
                              }}
                              trigger={['click']}
                            >
                              <Tooltip placement="topLeft"  title="More Actions">
                                <button
                                  className="p-1 text-xs rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <PiDotsThreeOutlineVerticalBold
                                    className="text-[#3c8dbc] hover:text-[#337ab7]"
                                    size={16}
                                  />
                                </button>
                              </Tooltip>
                            </Dropdown>}
                          </span>
                        </td>
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
              </tbody>}
          </table>}

           <Modal
                    className="antmodalclassName"
                    visible={viewOpen}
                    onCancel={() => {
                      setViewData({})
                      setViewOpen(false)
                    }}
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
                              <div className="mt-2 ml-2">Purchase  Details</div>
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
                                  Purchase Type
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {viewData.type === "purchase" ? viewData?.purchaseAssetData?.purchaseType : viewData?.type || "N/A"}
                              </span>
                            </td>
          
                            <td className="p-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonSharp className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                 {viewData?.type=="payroll" ? 'Updated By' : 'Name'}
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                              {viewData.purchaseAssetData?.purchaseType === "Vendor" ? viewData.purchaseAssetData?.userName : (viewData?.purchaseAssetData?.purchaseType === "Other" ? viewData.purchaseAssetData?.userName : viewData?.type === "cashBook" ? viewData?.cashbookData?.userName : viewData?.type === "payroll" ? (viewData?.updatedBy||viewData?.createdBy) : 'N/A')}

                              </span>
                            </td>
                          
                          </tr>
                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineTags className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  {viewData.purchaseAssetData?.purchaseType === "Vendor" || viewData?.purchaseAssetData?.purchaseType === "Other" ? 'purchaseDate':'date'}
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {viewData.purchaseAssetData?.purchaseType === "Vendor" || viewData?.purchaseAssetData?.purchaseType === "Other" ? customDayjs(viewData.purchaseAssetData?.purchaseDate) || "N/A" : viewData?.type === 'cashBook' ? customDayjs(viewData?.cashbookData?.date) || "N/A" : viewData?.type === 'payroll' ?viewData?.date ?  customDayjs(viewData?.date):'N/A' : "N/A"}
                              </span>
                            </td>
          
                            <td className="p-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonSharp className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                 Amount
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {convertIntoAmount(viewData?.amount )}
                              </span>
                            </td>
                          </tr>
          
                          <tr className=" hover:bg-indigo-50">
                          {viewData.purchaseAssetData?.purchaseType === "Vendor" && <td className="p-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonSharp className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                 Asset Name
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                              {viewData.purchaseAssetData?.purchaseType === "Vendor" ? viewData.purchaseAssetData?.assetName : '-'}

                              </span>
                            </td>}
          
                            {viewData?.type==='purchase' &&<td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaIndustry className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Gst Amount
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {viewData.purchaseAssetData?.totalGSTAmount || "N/A"} Rs
                              </span>
                            </td>}
                          </tr>
                          
                        </tbody>
                      </table>
                    </div>
                  </Modal>
        </div>
        {paymentListData?.length > 0 &&
          <CustomPagination
            totalCount={totalpaymentListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}
      </>

    </GlobalLayout>
  );
}
export default PaymentList;
