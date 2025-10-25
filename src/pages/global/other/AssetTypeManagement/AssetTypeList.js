import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line, RiTreasureMapFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { deleteAssetType, getAssetTypeList } from "./AssetTypeFeatures/_AssetType_reducers";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { convertIntoAmount, domainName, inputAntdSelectClassNameFilter, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { IoMdCreate } from "react-icons/io";
import InventryCreateModal from "./InventryCreateModal";
import { CgViewList } from "react-icons/cg";


function AssetTypeList() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AssetTypeListData, totalAssetTypeListCount, loading } = useSelector(
    (state) => state.AssetType
  );

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  // const [status, setStatus] = useState("");
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const [openInventryModal, setInventryModal] = useState({
    data:null,
    default: 1,
    isOpen:false
  })
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

    
  const filters = [BranchId, CompanyId, status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }

    if (currentPage === 1) {
      getAssetTypeListRequest();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);


  useEffect(() => {
    getAssetTypeListRequest();
  }, [currentPage]);

  const getAssetTypeListRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "text": searchText,
        "sort": true,
        status: status === "true" ? true : status === "false" ? false : "",
        "isPagination": true,
      }
    };
    dispatch(getAssetTypeList(data));
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
        dispatch(deleteAssetType(reqData)).then((data) => {
          // getAssetTypeListRequest()

             if (currentPage > 1 && AssetTypeListData?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        getAssetTypeListRequest();    
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
                        className={`${inputAntdSelectClassNameFilter} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
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

              {(canRead && canCreate) &&
                <Tooltip placement="topLeft"  title='Add AssetType Type'>
                  <button
                    onClick={() => {
                      navigate("/admin/asset-type/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add AssetType Type</span>
                  </button>
                </Tooltip>}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap">Name</th>
                <th className="p-2 whitespace-nowrap">Quantity</th>
                
                <th className="p-2 whitespace-nowrap">openingBalance</th>
                <th className="p-2 whitespace-nowrap">created At</th>
                <th className="p-2 whitespace-nowrap">created By</th>
                
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
                {AssetTypeListData && AssetTypeListData?.length > 0 ? (
                  AssetTypeListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap p-2">{element?.name}</td>
                      <td className="whitespace-nowrap p-2">{element?.quantity}</td>
                    
                      <td className="whitespace-nowrap p-2">{convertIntoAmount(element?.openingBalance)}</td>
                    
                      <td className="whitespace-nowrap p-2">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}</td>
                      <td className="whitespace-nowrap p-2">{element?.createdBy || '-'}</td>
                      
                      {(canUpdate || canDelete) && <td className="whitespace-nowrap p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          {canUpdate && <Tooltip placement="topLeft"  title='create Inventry'>
                            <button
                              onClick={() => {
                               setInventryModal({
                                data : element,
                                default: (element?.quantity > element?.totalInventory.total) ?  element?.quantity - element?.totalInventory.total :  0,
                                isOpen:true
                               })
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <IoMdCreate
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft"  title='view Inventry'>
                            <button
                              onClick={() => {
                               navigate(
                                  `/admin/asset-inventry/${encrypt(element?._id)}/${encrypt(element?.companyId)}/${encrypt(element?.branchId)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <CgViewList
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/asset-type/edit/${encrypt(element?._id)}`
                                );
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
        {AssetTypeListData?.length > 0 &&
          <CustomPagination
            totalCount={totalAssetTypeListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}
          <InventryCreateModal setInventryModal={setInventryModal} openInventryModal ={openInventryModal} onClose={()=>{setInventryModal({data:null,isOpen:false,default:0})}}  />
      </>

    </GlobalLayout>
  );
}
export default AssetTypeList;
