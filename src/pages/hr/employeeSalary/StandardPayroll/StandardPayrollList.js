import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  convertIntoAmount,
  domainName,
  inputAntdSelectClassNameFilter,
} from "../../../../constents/global";

import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { encrypt } from "../../../../config/Encryption";
import Swal from "sweetalert2";
import { Select, Tooltip, Dropdown } from "antd";
import getUserIds from "../../../../constents/getUserIds";

import { getstandardPayrollList, standardPayrollDelete, standardPayrollStatus } from "./standardPayrollfeature/_standardPayroll_reducers";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import usePermissions from "../../../../config/usePermissions";
import { dynamicSidebarSearch } from "../../../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";

import ListLoader from "../../../../global_layouts/ListLoader";
import { BsViewList } from "react-icons/bs";
import { FaEye } from "react-icons/fa";


function StandardPayrollList() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { userCompanyId, userBranchId, userType } = getUserIds();
  const { standardPayrollListData, standardPayrollListTotal, loading } = useSelector(
    (state) => state.standardPayroll
  );
  const { PageRoleData } = useSelector((state) => state.rolePermission);


  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);




  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);





  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });




  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus)
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);



  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [branchId, status, currentPage, searchText,]);
  useEffect(() => {
    getchstandardPayrollData();
  }, [branchId, status, currentPage, searchText,]);

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



  const getchstandardPayrollData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqPayload: {
        text: searchText,
        sort: true,
        status: status,
        isPagination: true,
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? companyId
            : userInfoglobal?.userType === "company"
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
      },
    };
    dispatch(getstandardPayrollList(reqData));
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
    dispatch(dynamicSidebarSearch({
      companyId:
        userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      isPagination: false,
    }))

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
        dispatch(standardPayrollDelete(reqData)).then((data) => {

          if (currentPage > 1 && standardPayrollListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            getchstandardPayrollData();
          }
        });
      }
    });
  };



  const handlePayrollStatusChange = (e, id) => {
    dispatch(
      standardPayrollStatus({
        _id: id,
        status: e.target.value,
      })
    ).then((data) => {
      if (!data?.error) {
        getchstandardPayrollData();
      }
    });
  };


  const sidebarId = sidebarListData?.find((data) => data?.slug === `standardPayroll`)?._id;
  const standardPayrollPermission = usePermissions(sidebarId).canRead;




  return (

    <GlobalLayout onChange={onChange}>
      <div className="flex justify-start items-center  my-1">
        <button
          className="bg-header px-3 py-2 border border-header rounded-l-md flex justify-center items-center space-x-2 text-white"
        >
          <span className="text-[12px]">Standard payroll</span>
        </button>
        <button
          onClick={() => {
            if (!standardPayrollPermission) {
              return null;
            } else {
              navigate("/admin/payroll-list")
            }
          }
          }
          className=" px-3 border border-black py-2 rounded-r-md flex justify-center items-center space-x-2 text-black"
        >
          <span className="text-[12px]">Actual Payslip</span>
        </button>
      </div>
      <div className="bg-grey-100 w-full">
        <div className="w-full md:flex justify-between items-center py-1 sm:space-y-0 space-y-2">
          <div className="md:flex justify-between grid grid-cols-1 gap-2 items-center  text-[14px] rounded-md">
            {userType === "admin" && (
              <div className="flex justify-center items-center  text-[14px] rounded-md">
                <Controller
                  control={control}
                  name="PDCompanyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      disabled={loading}
                      className={`${inputAntdSelectClassNameFilter} `}
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
                <div className="flex justify-center items-center  text-[14px] rounded-md">

                  <Select
                    defaultValue={""}
                    disabled={loading}
                    value={branchId}
                    onChange={handleBranchChange}
                    className={`${inputAntdSelectClassNameFilter} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? (<Select.Option disabled>
                      <ListLoader />
                    </Select.Option>) : (branchList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    )))}
                  </Select>

                </div>
              )}
            <div className="">

              <Select

                className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Select Status"
                disabled={loading}
                value={status}
                onChange={handleStatusChange}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value="Draft" > Draft  </Select.Option>
                <Select.Option value="Active" > Active  </Select.Option>
                <Select.Option value="InActive" > InActive  </Select.Option>

              </Select>

            </div>
            <div className="w-full my-2">
              <button
                onClick={() => {
                  handleResetFilters()
                }}
                className="bg-header py-[8px] w-full rounded-md  flex px-5 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
          </div>
          {canCreate &&
            <div className="flex justify-end items-center ">
              <Tooltip placement="topLeft" title="Create standardPayroll">
                <button
                  onClick={() => navigate("/admin/standardPayroll/create")}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Create standardPayroll</span>
                </button>
              </Tooltip>
            </div>}
        </div>
        <div className="w-full">
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                  <th className="tableHead w-[10%]">
                    S.No.
                  </th>
                  <th className="tableHead">Name</th>
                  <th className="tableHead">
                    Created By
                  </th>
                  <th className="tableHead">
                    CTC
                  </th>
                  <th className="tableHead">
                    Monthly Salary
                  </th>
                  <th className="tableHead">
                    Basic Salary
                  </th>
                  <th className="tableHead">
                    Status
                  </th>
                  {(canRead || canUpdate) &&
                    <th className="tableHead w-[10%]">
                      Action
                    </th>}
                </tr>
              </thead>
              {loading ?
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={10}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr> :
                <tbody>
                  {standardPayrollListData && standardPayrollListData?.length > 0 ? (
                    standardPayrollListData?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">
                          {element?.employeName}
                        </td>
                        <td className="tableData">
                          {element?.createdBy}
                        </td>
                        <td className="tableData">
                          {convertIntoAmount(element?.ctc)}
                        </td>
                        <td className="tableData">
                          {convertIntoAmount(element?.baseSalary) ? (convertIntoAmount(element?.baseSalary)) : "-"}
                        </td>
                        <td className="tableData">
                          {convertIntoAmount(element?.basicSalary) ? (convertIntoAmount(element?.basicSalary)) : "-"}
                        </td>
                        <td className="tableData">
                          <select
                            className="border-[1px] px-2 py-1.5 rounded-lg text-[12px]"
                            value={element?.status}
                            disabled={element?.status === "InActive"}
                            onChange={(e) =>
                              handlePayrollStatusChange(e, element?._id)
                            }
                          >
                            <option disabled value="Draft"> Draft </option>
                            <option value="Active" > Active </option>
                            <option value="InActive" > InActive </option>
                          </select>
                        </td>
                        {(canRead || canUpdate) &&
                          <td className="tableData">
                            <Tooltip placement="topLeft" title="View">
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                                onClick={() => {
                                  navigate(`/admin/standardPayroll/view/${encrypt(element?._id)}`)
                                }}
                              >
                                <FaEye
                                  className="hover:text-[#337ab7] text-[#3c8dbc]"
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                            <Dropdown
                              menu={{
                                items: [
                                  canUpdate && {
                                    key: 'edit',
                                    label: (
                                      <span className="flex items-center">
                                        <FaPenToSquare className="mr-2 text-[#3c8dbc]" />
                                        Edit
                                      </span>
                                    ),
                                    onClick: () =>
                                      navigate(`/admin/standardPayroll/edit/${encrypt(element?._id)}`),
                                  },
                                  canDelete && {
                                    key: 'delete',
                                    label: (
                                      <span className="flex items-center text-red-500">
                                        <RiDeleteBin5Line className="mr-2" />
                                        Delete
                                      </span>
                                    ),
                                    onClick: () => handleDelete(element?._id),
                                  },
                                ],
                              }}
                              trigger={['click']}
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
                          </td>
                        }
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={15}
                        className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>}
            </table>
          </div>
          <CustomPagination
            totalCount={standardPayrollListTotal}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        </div>
      </div>
    </GlobalLayout>
  );
}

export default StandardPayrollList;