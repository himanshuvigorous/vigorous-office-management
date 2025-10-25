import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  domainName,
  inputAntdSelectClassNameFilter,
  inputClassNameSearch,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { encrypt } from "../../../../config/Encryption";
import Swal from "sweetalert2";
import { Select, Tooltip } from "antd";
import getUserIds from "../../../../constents/getUserIds";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import Loader from "../../../../global_layouts/Loader/Loader";
import { HiOutlineFilter } from "react-icons/hi";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import moment from "moment";
import ListLoader from "../../../../global_layouts/ListLoader";
import { getwfhManagerList, wfhManagerDelete } from "./wfhManagerfeature/_wfhManager_reducers";

function WfhManagerList() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { userCompanyId, userBranchId, userType } = getUserIds();
  const { wfhManagerListData, wfhManagerListTotal, loading } = useSelector(
    (state) => state.wfhManager
  );
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const pageSize = 10;
  const navigate = useNavigate();
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const { companyList } = useSelector((state) => state.company);
  const { branchList, loading: branchSearchLoading } = useSelector((state) => state.branch);
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });
  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });
  const [searchText, setSearchText] = useState("");

  const filters = [companyId, branchId, status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      getwfhManagerData();
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    getwfhManagerData();
  }, [currentPage]);
  const getwfhManagerData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: searchText,
        sort: true,
        status: status === "true" ? true : status === "false" ? false : "",
        isPagination: true,
        directorId: "",
        companyId: companyId || "",
        branchId: branchId || "",
      },
    };
    dispatch(getwfhManagerList(reqData));
  };

  useEffect(() => {
    if (companyId || userType === "company" || userType === "companyDirector") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
        })
      );
    }
  }, [companyId]);
  useEffect(() => {
    if (userType === "admin") {
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
        dispatch(wfhManagerDelete(reqData)).then((data) => {
          // getwfhManagerData();
          if (currentPage > 1 && wfhManagerListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            getwfhManagerData();
          }
        });
      }
    });
  };

  const onChange = (e) => {
  
    setSearchText(e);
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="w-full sm:flex justify-between items-center py-1 sm:space-y-0 space-y-2">
          <div className="sm:flex justify-between items-center  sm:space-x-2 space-x-0 px-2 text-[14px] rounded-md">
            {userType === "admin" && (
              <div className="flex justify-center items-center space-x-2 text-[14px] rounded-md">
                <HiOutlineFilter />
                

                <Controller
                  control={control}
                  name="PDCompanyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      
                      className={`${inputAntdSelectClassNameFilter} `}
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
              </div>
            )}
            {(userType === "admin" ||
              userType === "company" ||
              userType === "companyDirector") && (
                <div className="flex justify-center items-center space-x-2 text-[14px] rounded-md">
                 

                  <Controller
                    control={control}
                    name="PDBranchId"
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                       
                        className={`${inputAntdSelectClassNameFilter} `}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchSearchLoading ? (
                          <Select.Option disabled>
                            <ListLoader />
                          </Select.Option>
                        ) : (
                          sortByPropertyAlphabetically(branchList)?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          ))
                        )}
                      </Select>
                    )}
                  />
                </div>
              )}
            <Controller
              name="status"
              control={control}
              rules={{}}
              render={({ field }) => (
                <Select
                  {...field}
                  className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Select Status"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="true"> Active </Select.Option>
                  <Select.Option value="false"> InActive </Select.Option>
                </Select>
              )}
            />
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
            {canCreate && canRead && (
              <Tooltip placement="topLeft"  title="Create Deduction">
                <button
                  onClick={() => navigate("/admin/wfhManager/create")}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Create wfhManager</span>
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            {canRead && (
              <table className="w-full max-w-full rounded-xl overflow-x-auto">
                <thead>
                  <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                    <th className="border-none p-2 whitespace-nowrap w-[10%]">
                      S.No.
                    </th>
                    <th className="border-none p-2 whitespace-nowrap w-[20%]">Name</th>
        
                    
                    {/* <th className="border-none p-2 whitespace-nowrap">
                      Allowed Days
                    </th> */}
                    <th className="border-none p-2 whitespace-nowrap">
                      Perday Salary Percent
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      Created At
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      Created By
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      Status
                    </th>
                    {(canUpdate || canDelete) && (
                      <th className="border-none p-2 whitespace-nowrap w-[10%]">
                        Action
                      </th>
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
                    {wfhManagerListData && wfhManagerListData?.length > 0 ? (
                      wfhManagerListData?.map((element, index) => (
                        <tr
                          className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                        >
                          <td className="whitespace-nowrap border-none p-2">
                            {index + 1 + (currentPage - 1) * pageSize}
                          </td>
                          <td className="whitespace-nowrap border-none p-2">
                            {element.name}
                          </td>
                          {/* <td className="whitespace-nowrap border-none p-2">
                            {element.allowedDays || '-'}
                          </td> */}
                          <td className="whitespace-nowrap border-none p-2">
                            {element.perdaySalaryPercent || '-'}
                          </td>

                         
                          
                          <td className="whitespace-nowrap border-none p-2">
                            {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a") || '-'}
                          </td>
                          <td className="whitespace-nowrap border-none p-2">
                            {element?.createdBy || '-'}
                          </td>
                          <td className="whitespace-nowrap border-none p-2">
                            <Tooltip placement="topLeft" 
                              title={`Status - ${element?.status ? "Active" : "InActive"
                                }`}
                            >
                              <span
                                className={`${element?.status
                                  ? "bg-[#E0FFBE] border-green-500"
                                  : "bg-red-200 border-red-500"
                                  } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                              >
                                {element?.status ? "Active" : "Inactive" ?? "-"}
                              </span>
                            </Tooltip>
                          </td>
                          {(canUpdate || canDelete) && (
                            <td className="whitespace-nowrap border-none p-2">
                              <span className="py-1.5 flex justify-start items-center space-x-2">
                                {canUpdate && (
                                  <Tooltip placement="topLeft"  title="Edit">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/admin/wfhManager/edit/${encrypt(
                                            element?._id
                                          )}`
                                        )
                                      }
                                      className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                      type="button"
                                    >
                                      <FaPenToSquare
                                        className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                        size={16}
                                      />
                                    </button>
                                  </Tooltip>
                                )}
                                {canDelete && (
                                  <Tooltip placement="topLeft"  title="Delete">
                                    <button
                                      onClick={() => handleDelete(element?._id)}
                                      className="px-2 py-1.5 rounded-md bg-transparent border border-muted hover:bg-red-100"
                                      type="button"
                                    >
                                      <RiDeleteBin5Line
                                        className="text-red-600 hover:text-red-500"
                                        size={16}
                                      />
                                    </button>
                                  </Tooltip>
                                )}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white bg-opacity-5">
                        <td
                          colSpan={15}
                          className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
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
          <CustomPagination
            totalCount={wfhManagerListTotal}
            pageSize={pageSize}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        </div>
      </div>
    </GlobalLayout>
  );
}

export default WfhManagerList;
