import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Input, Typography, Select } from "antd";
import dayjs from "dayjs";
import getUserIds from "../../../constents/getUserIds";
import usePermissions from "../../../config/usePermissions";

import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { encrypt } from "../../../config/Encryption";
import Swal from "sweetalert2";
import { deleteLeadmanagementFeatureFunc, getLeadmanagementFeatureList, LeadmanagementFeatureStatus, updateLeadmanagementFeatureFunc } from "./LeadmanagementFeature/_LeadmanagementFeature_reducers";
import { FaPenToSquare, FaPlus, FaAngleDown } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import moment from "moment";
import { leadManagementStatus } from "../../../constents/ActionConstent";
import { FaEye } from "react-icons/fa";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { customDayjs, domainName, inputAntdSelectClassNameFilter, pageSizeLead, sortByPropertyAlphabetically } from "../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BiTransfer } from "react-icons/bi";
import TransferReaquestCreateModal from "./TransferReaquestCreateModal";
import ListLoader from "../../../global_layouts/ListLoader";
import { getLeadCategoryList } from "../LeadsManagementCategory/LeadCategoryFeatures/_LeadCategory_reducers";
import { DatePicker } from "antd";
import { parse } from "@fortawesome/fontawesome-svg-core";


function EmployeeLeadManagement() {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
  });
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branchList,branchListloading } = useSelector((state) => state.branch);
  const { LeadmanagementFeatureListData, totalLeadmanagementFeatureCount, loading } = useSelector((state) => state.LeadmanagementFeature);
  const { LeadCategoryListData, totalLeadCategoryCount, loading:categoryLoading } = useSelector((state) => state.leadCategory);

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
  }

  const handlePageSizeChange = (e) => {
    setLimit(Number(e));
    setCurrentPage(Number(1))
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();




  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )


      const [searchParams, setSearchParams] = useSearchParams();
      const initialPage = parseInt(searchParams.get("page")) || 1;
      const initialLimit = parseInt(searchParams.get("limit")) || 10;   
      const initialStatus = searchParams.get("status") || "";
      const initialCategoryId = searchParams.get("categoryId") || "";
      const initialSubCategory = searchParams.get("subCategory") || "";
      const initialTime1 = searchParams.get("time1") || "";
      const initialTime2 = searchParams.get("time2") || "";
    //  const initialTime = searchParams.get("time") || "";
  
    
      const [currentPage, setCurrentPage] = useState(initialPage);
      const [limit, setLimit] = useState(initialLimit);
      const [status, setStatus] = useState(initialStatus);
       const [time, setTime] = useState([
          initialTime1 ? dayjs(initialTime1) : null,
          initialTime2 ? dayjs(initialTime2) : null,
        ]);
      const [categoryId, setCategoryId] = useState(initialCategoryId);
      const [subCategory, setSubCategory] = useState(initialSubCategory);
      const [searchText, setSearchText] = useState("");   
  
      useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (time?.length > 0) {
          params.set("time1", time[0] && dayjs(time[0]).isValid() ? dayjs(time[0]).format("YYYY-MM-DD") : "");
          params.set("time2", time[1] && dayjs(time[1]).isValid() ? dayjs(time[1]).format("YYYY-MM-DD") : "");
        }
        if (categoryId) params.set("categoryId", categoryId);
        if (limit) params.set("limit", limit);
        if (subCategory) params.set("subCategory", subCategory);
       
        if (status) params.set("status", status);
        setSearchParams(params);
      }, [  status, searchText, categoryId, subCategory, currentPage, limit, time]);
      useEffect(() => {
        fetchLeadmanagementFeatureList();
      }, [ status, searchText, categoryId, subCategory, currentPage, limit, time]);
    
      const handleResetFilters = () => {
        setCurrentPage(1);
  
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
   
      const handleCategoryIdChange = (value) => {
        setCategoryId(value);
        setCurrentPage(1);
      };
      const handleSubCategoryChange = (value) => {
        setSubCategory(value);
        setCurrentPage(1);
      };
      const handleFilterStatus = (value)=>{
        setStatus(value);
        setCurrentPage(1);
      }
      const handleFilterTime = (value)=>{
        setTime(value);
        setCurrentPage(1);
      }


   useEffect(() => {
      dispatch(
        getLeadCategoryList({
         companyId: userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }, []);

  const fetchLeadmanagementFeatureList = () => {
    const reqListData = {
      limit: limit,
      page: currentPage,
      reqPayload: {
        text: searchText,
        sort: true,
        leadCategoryId: categoryId,
        leadSubCategoryId: subCategory,
        startDate: time?.length > 0 && time[0] ? customDayjs(time[0]) : null,
        endDate: time?.length > 1 && time[1] ? customDayjs(time[1]) : null,
        companyId: userInfoglobal?.companyId,
        branchId: userInfoglobal?.branchId,
        isPagination: true,
        status: status,
        "assignedToId": userInfoglobal?._id,
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
            !data.error && fetchLeadmanagementFeatureList()
          }
        });
      }
    });
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


  if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    )
  }

  return (
    <GlobalLayout onChange={onChange}  >
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-4 2xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-4 w-full items-center">
            
      
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
                        sortByPropertyAlphabetically(
                          LeadCategoryListData,
                          "name"
                        )?.map((element) => (
                          <Select.Option value={element?._id}>
                            {" "}
                            {element?.name}{" "}
                          </Select.Option>
                        ))
                      )}
                    </Select>
               
              </div>
              <div className="w-full">
               
                    <Select                   
                  
                      className={` ${inputAntdSelectClassNameFilter}`}
                      placeholder="Select SubCategory"
                      showSearch
                      value={subCategory}
                      onChange={handleSubCategoryChange}
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
                      value={status}
                      onChange={handleFilterStatus}
                      className={` w-32 ${inputAntdSelectClassNameFilter} ${
                        errors.status ? "border-[1px] " : "border-gray-300"
                      }`}
                      placeholder="Select Status"
                      showSearch
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
                      
                      value={time}
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
                <Tooltip placement="topLeft" title="Add GST Type">
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
      
      <div className="flex justify-between items-center m-1.5">
        <div className="flex items-center p-2 gap-2">
                           <span className="text-sm font-light text-gray-500">
                             Rows per page:
                           </span>
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
        {canCreate &&
          <Tooltip placement="topLeft" title='Add GST Type'>
            <button onClick={() => navigate("/admin/lead-management/create")} className='bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white'>
              <FaPlus />
              <span className='text-[12px]'>Add Leads</span>
            </button>
          </Tooltip>} 

      </div>
      {loading ? (
        <Loader2 />
      ) : (
        <>
          <div className="bg-[#ffffff] w-full overflow-x-auto rounded-xl mt-1">
            {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
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
                      <span>Assigned To </span>

                    </div>
                  </th>



                  <th className='border-none p-2 whitespace-nowrap'>
                    <div className='flex justify-start items-center space-x-1'>
                      <span>created At</span>

                    </div>
                  </th>
                  <th className='border-none p-2 whitespace-nowrap'>
                    <div className='flex justify-start items-center space-x-1'>
                      <span>created By</span>

                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Status</span>
                    </div>
                  </th>
                  {<th className="border-none p-2 whitespace-nowrap w-[10%]">
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
              </tr>
                :
                <tbody>
                  {LeadmanagementFeatureListData && LeadmanagementFeatureListData?.length > 0 ? (
                    LeadmanagementFeatureListData?.map((element, index) => (
                      <tr
                        key={index}
                        className={` ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >
                        <td className="whitespace-nowrap border-none p-2 ">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        {/* <td className="whitespace-nowrap border-none p-2 ">
                          {element?.followUpDate ? moment(element?.followUpDate)?.format("YYYY-MM-DD") : "-"}
                        </td> */}
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.name ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.categoryName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.intrested ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.source ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.userData?.fullName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td>
                        <td className="whitespace-nowrap border-none p-2 ">{element?.createdBy ?? "-"}</td>
                        {canRead && (
                          <td className="whitespace-nowrap text-center border-none p-2">
                            <Tooltip
                              placement="topLeft"

                            >
                              <select
                                className="border-[1px] px-2 py-1.5 rounded-lg text-[12px]"
                                value={element?.status}
                                onChange={(e) =>
                                  handleStatusChange(e.target.value, element?._id)
                                }

                              >
                                {leadManagementStatus?.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </Tooltip>
                          </td>
                        )}


                        <td className="whitespace-nowrap border-none p-2">
                          {element?.companyId === "null" ||
                            element?.companyId === null ? (
                            <span className="py-1.5 text-black "> - </span>
                          ) : (
                            <span className="py-1.5 flex justify-start items-center space-x-2">
                              {canRead && <Tooltip placement="topLeft" title='view'>
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
                              </Tooltip>}

                              
                              {canRead && <Tooltip placement="topLeft" title='Tranfer Lead'>
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
                              </Tooltip>}
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
                </tbody>}
            </table>}
          </div>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <CustomPagination
              totalCount={totalLeadmanagementFeatureCount}
              pageSize={limit}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />
          </div>
        </>
      )}
      <TransferReaquestCreateModal transferModal={transferModal} onclose={handlecloseTransferModal} LeadmanagementtransferLoading={loading} />
    </GlobalLayout>
  );
}

export default EmployeeLeadManagement;