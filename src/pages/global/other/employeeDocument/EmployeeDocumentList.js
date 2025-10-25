import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import {
  deleteEmployeeDoc,
  getEmployeeDocument,
} from "./EmployeeDocumentFeatures/_emp_document_reducers";
import Loader from "../../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import {
  domainName,
  inputAntdSelectClassNameFilter,
  inputClassNameSearch,
} from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select } from "antd";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";

function EmployeeDocumentList() {
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employeeDocumentList, totalEmpDoctCount, loading } = useSelector(
    (state) => state.employeeDocument
  );
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });

  const { companyList } = useSelector((state) => state.company);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;


  const filters = [status, CompanyId,searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      getdocumentList();
    } else {
      setCurrentPage(1);
    }
  }, [filters])


  useEffect(() => {
    getdocumentList();
  }, [currentPage]);


  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const getdocumentList = () => {
    const reqData = {
      currentPage: currentPage,
      pageSize: limit,
      data: {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        isPagination: true,
        text: searchText,
        sort: true,
        status: status,
      },
    };
    dispatch(getEmployeeDocument(reqData));
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
        dispatch(deleteEmployeeDoc(reqData)).then((data) => {
          if (!data?.error) {
            // getdocumentList();
             if (currentPage > 1 && employeeDocumentList?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        getdocumentList();    
          } 
          }
        });
      }
    });
  };

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
    ;
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <Select
                    defaultValue={""}
                    value={CompanyId}
                    onChange={(e) => {
                      setValue("PDCompanyId", e);
                    }}
                    className={` ${inputAntdSelectClassNameFilter} ${
                      errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <Select.Option className="" value="">
                      Select Company
                    </Select.Option>
                    {companyList?.map((type) => (
                      <Select.Option value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>
              )}
              {/* {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
                  <div className="">
                    <Controller
                      name="PDBranchId"
                      control={control}
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputClassNameSearch} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
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
                } */}
              <Select
                className={` ${inputAntdSelectClassNameFilter} `}
                value={status}
                onChange={(e) => {
                  setStatus(e);
                }}
                placeholder="Select Status"
                showSearch
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value={true}>{"Active"}</Select.Option>
                <Select.Option value={false}>{"InActive"}</Select.Option>
              </Select>
            </div>
            <div className="flex justify-end items-center gap-2 ">
              <button
                onClick={() => {
                  setStatus("");
                }}
                className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && (
                <button
                  onClick={() => {
                    navigate("/admin/document-type/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Document Type</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                  <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                  <th className="p-2 whitespace-nowrap">Name</th>
                  {userInfoglobal?.userType === "admin" && (
                    <th className="p-2 whitespace-nowrap">Company name</th>
                  )}
                  <th className="p-2 whitespace-nowrap">Type</th>
                  <th className="p-2 whitespace-nowrap">createdAt</th>
                  <th className="p-2 whitespace-nowrap">createdBy</th>
                  <th className="p-2 whitespace-nowrap">status</th>
                  {(canDelete || canUpdate) && (
                    <th className="p-2 whitespace-nowrap w-[10%]">Action</th>
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
                  {employeeDocumentList && employeeDocumentList?.length > 0 ? (
                    employeeDocumentList?.map((element, index) => (
                      <tr
                        className={`text-black ${
                          index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="whitespace-nowrap p-2">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          {element?.name}
                        </td>
                        {userInfoglobal?.userType === "admin" && (
                          <td className="whitespace-nowrap p-2">
                            {element?.companyData?.fullName ?? "-"}
                          </td>
                        )}
                        <td className="whitespace-nowrap p-2">
                          {element?.type}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          {dayjs(element?.createdAt).format(
                            "DD-MM-YYYY hh:mm a"
                          )}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          {element?.createdBy ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          <span
                            className={`${
                              element?.status
                                ? "bg-[#E0FFBE] border-green-500"
                                : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status ? "Active" : "Inactive" ?? "-"}
                          </span>
                        </td>
                        {(canDelete || canUpdate) && (
                          <td className="whitespace-nowrap p-2">
                            <span className="py-1.5 flex justify-start items-center space-x-2.5">
                              {canUpdate && (
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/admin/document-type/edit/${encrypt(
                                        element?._id
                                      )}`
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
                              )}
                              {canDelete && (
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
                              )}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={7}
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
          totalCount={totalEmpDoctCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </>
    </GlobalLayout>
  );
}
export default EmployeeDocumentList;
