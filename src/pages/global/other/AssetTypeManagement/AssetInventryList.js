import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line, RiTreasureMapFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../../config/Encryption";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import Loader from "../../../../global_layouts/Loader/Loader";

import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { domainName, inputAntdSelectClassNameFilter, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { deleteAssetInventry, getAssetInventryList, updateAssetInventry } from "./AssetTypeFeatures/_AssetType_reducers";
import AssignInventryModal from "./AssignInventryModal";
import { BiCheckShield, BiSend } from "react-icons/bi";
import UpdateInventryModal from "./UpdateInventryModal";
import { FaBackward } from "react-icons/fa";
import ReturnInventryModal from "./ReturnInventryModal";
import AssetsTrailing from "./AssetsTrailing";


function AssetInventryListList() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AssetInventryListData, totalAssetInventryListCount, loading } = useSelector(
    (state) => state.AssetType
  );
  const {assetNameIdEnc , companyIdEnc , branchIdEnc} = useParams();
  const assetNameId = decrypt(assetNameIdEnc);
  const companyId = decrypt(companyIdEnc);
  const branchId = decrypt(branchIdEnc);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [assignInventryModal, setAsignInventryModal] = useState({
    data : null,
    isOpen: false,
   }); 
  const [returnInventryModal, setreturnInventryModal] = useState({
    data : null,
    isOpen: false,
   }); 
  const [updateInventryModal, setupdateInventryModal] = useState({
    data : null,
    isOpen: false,
   }); 
  const [detailsInventryModal, setDetailsInventryModal] = useState({
    data : null,
    isOpen: false,
   }); 
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
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
    name: 'status',
    defaultValue: ''
  });
  const limit = 10;
  useEffect(() => {
    if (CompanyId) {
      setValue("PDBranchId", "");
    }
  }, [CompanyId])
  useEffect(() => {
    getAssetInventryListListRequest();
  }, [currentPage, BranchId, CompanyId, status, searchText]);

  const getAssetInventryListListRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId:companyId,
        branchId:branchId,
        assetNameId:assetNameId,
        "text": searchText,
        "sort": true,
        status: status === "true" ? true : status === "false" ? false : "",
        "isPagination": true,
      }
    };
    dispatch(getAssetInventryList(data));
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
        dispatch(deleteAssetInventry(reqData)).then((data) => {
         if(!data?.error){
          getAssetInventryListListRequest()
         }
        });
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

  const onChange = (e) => {
    
    setSearchText(e);
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
              {userInfoglobal?.userType === "admin" &&
                <div className="">
                  <Controller
                    name="PDCompanyId"
                    control={control}
                    rules={{ required: "Company is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`w-full ${inputClassNameSearch} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Select Company"
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
                    <p className="text-red-500 text-sm">{errors.PDCompanyId.message}</p>
                  )}
                </div>
              }
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
                <div className="">
                  <Controller
                    name="PDBranchId"
                    control={control}
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputClassNameSearch} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                        placeholder="Select Branch"
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
                </div>
              }
            </div>

            <div className="flex justify-end items-center gap-2 ">
              <button
                onClick={() => {
                  setValue("status", "");
                  setValue("PDBranchId", '');
                  setValue("PdDepartmentId", "");
                  setValue("PdCompanyId", "");
                }}
                className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap">Name</th>
                <th className="p-2 whitespace-nowrap">Model</th>
                <th className="p-2 whitespace-nowrap">Brand</th>
                <th className="p-2 whitespace-nowrap">Serial Number</th>
                <th className="p-2 whitespace-nowrap">created At</th>
                <th className="p-2 whitespace-nowrap">created By</th>
                {/* <th className="p-2 whitespace-nowrap">status</th> */}
                {(canUpdate || canDelete) && <th className="p-2 whitespace-nowrap w-[10%]">Action</th>}
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
                {AssetInventryListData && AssetInventryListData?.length > 0 ? (
                  AssetInventryListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap p-2">{element?.name}</td>
                      <td className="whitespace-nowrap p-2">{element?.model}</td>
                      <td className="whitespace-nowrap p-2">{element?.brand}</td>
                      <td onClick={()=>setDetailsInventryModal({data : element , isOpen : true})} className="whitespace-nowrap p-2 text-header cursor-pointer font-semibold">{element?.serialNumber}</td>
                      <td className="whitespace-nowrap p-2">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}</td>
                      <td className="whitespace-nowrap p-2">{element?.createdBy || '-'}</td>
                      {/* <td className="whitespace-nowrap border-none p-2 ">
                        <span
                          className={`${element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
                        </span>
                      </td> */}
                      {(canUpdate || canDelete) && <td className="whitespace-nowrap p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                            <button
                               onClick={() => {
                                setupdateInventryModal({
                                data : element,
                                isOpen: true,
                               })
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPenToSquare
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft"  title='Assign Item'>
                            <button
                              onClick={() => {
                               setAsignInventryModal({
                                data : element,
                                isOpen: true,
                               })
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status !== "available" || element?.employeId}
                            >
                              <BiSend
                                className={(element?.status === "available" && !element?.employeId ) ? " hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-400"}
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft"  title='Return Item'>
                            <button
                              onClick={() => {
                               setreturnInventryModal({
                                data : element,
                                isOpen: true,
                               })
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status !== "assigned" }
                            >
                              <FaBackward
                                className={(element?.status === "assigned"  ) ? " hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-400"}
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft"  title='Make Available'>
                            <button
                              onClick={() => {
                              
                              dispatch(updateAssetInventry({
                               ...element,
                                status:"available"
                              })).then((data)=>{
                                  if(!data?.error){
                                      getAssetInventryListListRequest()
                                  }
                              })
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status === "assigned" || element?.status === "available" }
                            >
                              <BiCheckShield
                                className={(element?.status !== "assigned" &&  element?.status !== "available"  ) ? " hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-400"}
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                        
                          {canDelete && <Tooltip placement="topLeft"  title='Delete'>
                            <button
                              onClick={() => handleDelete(element?._id)}
                              className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <RiDeleteBin5Line
                                className="text-red-600 hover:text-red-500"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                        </span>
                      </td>}
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
        </div>
        {AssetInventryListData?.length > 0 &&
          <CustomPagination
            totalCount={totalAssetInventryListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}

          {assignInventryModal?.isOpen && (
            <AssignInventryModal
            assignInventryModal={assignInventryModal}
              onClose={() => {setAsignInventryModal({ data:null, isOpen: false }) }}
              getAssetInventryListListRequest={getAssetInventryListListRequest}
            />
          )}
          {returnInventryModal?.isOpen && (
            <ReturnInventryModal
            returnInventryModal={returnInventryModal}
              onClose={() => {setreturnInventryModal({ data:null, isOpen: false }) }}
              getAssetInventryListListRequest={getAssetInventryListListRequest}
            />
          )}
          {updateInventryModal?.isOpen && (
            <UpdateInventryModal
            updateInventryModal={updateInventryModal}
              onClose={() => {setupdateInventryModal({data :null, isOpen: false })}}
              getAssetInventryListListRequest={getAssetInventryListListRequest}
            />
          )}
          {detailsInventryModal?.isOpen && (
            <AssetsTrailing
            detailsInventryModal={detailsInventryModal}
              onClose={() => {setDetailsInventryModal({ data:null, isOpen: false }) }}
              getAssetInventryListListRequest={getAssetInventryListListRequest}
            />
          )}
      </>

    </GlobalLayout>
  );
}
export default AssetInventryListList;
