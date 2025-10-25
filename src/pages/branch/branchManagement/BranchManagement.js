import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaEye } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { encrypt } from "../../../config/Encryption";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  deleteBranch,
  getBranchList,
  statusUpdateBranch,
} from "./branchFeatures/_branch_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import {
  domainName,
  formatAddress,
  handleSortLogic,
  inputAntdSelectClassNameFilter,
  inputClassNameSearch,
} from "../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { companySearch, regeneratePassfunc } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { Dropdown, Select, Switch, Tooltip } from "antd";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { TfiReload } from "react-icons/tfi";
import moment from "moment";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
function BranchManagement() {
  const {
    register,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branchList, totalBranchCount } = useSelector((state) => state.branch);
  const [status, setStatus] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [searchText, setSearchText] = useState("");
  const { companyList } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const pageSize = 10;
  const [sortedList, setSortedList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchBranchListData();
      setLoading(false);
    };
    fetchData();
  }, [currentPage, searchText, CompanyId, status]);

  const handleRegeneratePassword = (element) => {
    Swal.fire({
      title: 'Regenerate Password',
      text: `Are you sure to change password of ${element?.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(regeneratePassfunc({ _id: element?._id })).then((data) => {
          if (!data?.error) {
            Swal.fire(
              'Password Regenerated!',
              'Password has been Regenerated.',
              'success'
            );

          } else {
            Swal.fire(
              'Error!',
              'Failed to Password Regenerated Successfully.',
              'error'
            );
          }
        });
      }
    });
  }
  const fetchBranchListData = async () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: searchText,
        status: status === "true" ? true : status === "false" ? false : "",
        sort: true,
        companyId:
          userInfo?.userType === "admin"
            ? CompanyId
            : userInfo?.userType === "company"
              ? userInfo?._id
              : userInfo?.companyId,
        isPagination: true,
      },
    };

    try {
      await dispatch(getBranchList(reqData));
    } catch (error) {
      console.error("Error fetching branch list:", error);
      setLoading(false);
    }
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
        dispatch(deleteBranch(reqData)).then((data) => {
          // fetchBranchListData();
           if (currentPage > 1 && branchList?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        fetchBranchListData();    
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
    setSearchText(e);
  };

  useEffect(() => {
    if (branchList) {
      handleSort();
    }
  }, [branchList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, branchList);
    setSortedList(sortedList);
  };

  return (
    <GlobalLayout onChange={onChange}>

      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    className={` ${inputClassNameSearch} ${errors.PDCompanyId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Comapany
                    </option>
                    {companyList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select>
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>
              )}
              {/* <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className={` ${inputClassNameSearch} `}
                >
                  <option className="" value="">
                    All
                  </option>
                  <option value={true}>{"Active"}</option>
                  <option value={false}>{"InActive"}</option>
                </select> */}

              <Controller
                name="status"
                control={control} // You need to pass the 'control' prop from 'useForm' hook
                rules={{
                  required: "status is required",
                }}
                value={status}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassNameFilter} 
                         ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}
                          `}
                    placeholder="Status "
                    onChange={(value) => setStatus(value)}
                    showSearch
                  >
                    <Select.Option value="">All </Select.Option>
                    <Select.Option value='true'>{"Active"} </Select.Option>
                    <Select.Option value='false'>{"InActive"} </Select.Option>
                  </Select>
                )}
              />
            </div>
            <Tooltip placement="topLeft"  title='Create Branch'>
              <button
                onClick={() => {
                  navigate("/admin/branch/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Branch</span>
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px] ">
                <th className="tableHead min-w-[120px] w-[120px]">
                  S.No.
                </th>

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Branch Name</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("fullName", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("fullName", "desc")}
                      />
                    </div>
                  </div>
                </th>

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>User Name</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("userName", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("userName", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Branch Head</span>
                    {/* <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("userName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("userName", "desc")}
                        />
                      </div> */}
                  </div>
                </th>

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>E-mail</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("email", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("email", "desc")}
                      />
                    </div>
                  </div>
                </th>

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Mobile</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("mobile.number", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("mobile.number", "desc")}
                      />
                    </div>
                  </div>
                </th>

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Address</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() =>
                          handleSort("addresses.primary.street", "asc")
                        }
                      />
                      <FaAngleDown
                        onClick={() =>
                          handleSort("addresses.primary.street", "desc")
                        }
                      />
                    </div>
                  </div>
                </th>



                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>CreateAt</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() =>
                          handleSort("addresses.primary.street", "asc")
                        }
                      />
                      <FaAngleDown
                        onClick={() =>
                          handleSort("addresses.primary.street", "desc")
                        }
                      />
                    </div>
                  </div>
                </th>

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Created By</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() =>
                          handleSort("addresses.primary.street", "asc")
                        }
                      />
                      <FaAngleDown
                        onClick={() =>
                          handleSort("addresses.primary.street", "desc")
                        }
                      />
                    </div>
                  </div>
                </th>
                {/* <th className="tableHead ">
                    <div className="flex justify-start items-center space-x-1">
                    <span>Regenerate Password</span>

                    </div>
                  </th> */}

                <th className="tableHead ">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Status</span>

                  </div>
                </th>

                <th className="tableHead w-[10%]">
                  Action
                </th>
              </tr>
            </thead>


            {loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={9}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : <tbody>
              {sortedList && sortedList?.length > 0 ? (
                sortedList?.map((element, index) => (
                  <tr
                    key={element?._id}
                    className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151]`}
                  >
                    <td className="tableData">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    <td className="tableData">
                      {element?.fullName}
                    </td>
                    <td className="tableData">
                      {element?.userName}
                    </td>
                    <td className="tableData">
                      {element?.branchProfile?.head}
                    </td>
                    <td className="tableData">
                      {element?.email}
                    </td>
                    <td className="tableData">
                      {element?.mobile?.code + element?.mobile?.number}
                    </td>
                    <td 
                      className="tableData overflow-hidden text-ellipsis max-w-[250px] min-w-[250px]"
                    >
                      {formatAddress(element?.addresses?.primary)}
                    </td>
                    <td
                      className="tableData overflow-hidden text-ellipsis max-w-[200px]"
                    >
                      {moment(element?.createdAt).format('DD-MM-YYYY hh:mm a')}
                    </td>
                    <td
                      className="tableData overflow-hidden text-ellipsis max-w-[200px]"
                    >
                      {element?.createdBy}
                    </td>
                    {/* <td className="tableData">
                      <div className="w-full  flex justify-center">
<TfiReload onClick={()=>{handleRegeneratePassword(element)}} />
</div>
                      </td> */}

                    <td className="tableData">
                      <Tooltip placement="topLeft"  title={`${element?.status ? 'Tap to Inactive' : 'Tap to Active'}`}>
                        <Switch
                          checked={element?.status}
                          onChange={() => {
                            dispatch(
                              statusUpdateBranch({ _id: element?._id })
                            ).then((data) => {
                              if (!data?.error) {
                                fetchBranchListData();
                              }
                            });
                          }}
                          style={{
                            backgroundColor: element?.status
                              ? "#4caf50"
                              : "#f44336",
                            transition: "background-color 0.3s ease",
                          }}
                          height={20}
                          width={40}
                        />
                      </Tooltip>
                    </td>
                    <td className="tableData">
                      <span className="py-1.5 flex justify-start items-center space-x-2">
                        <Tooltip placement="topLeft"  title='View Details'>
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/branch/branchView/${encrypt(element?._id)}`
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
                        </Tooltip>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: 'edit',
                                label: (
                                  <span>
                                    <EditOutlined className="mr-2" />
                                    Edit Branch
                                  </span>
                                ),
                                onClick: () => navigate(`/admin/branch/edit/${encrypt(element?._id)}`),
                              },
                              {
                                key: 'regenerate-password',
                                label: (
                                  <span>
                                    <ReloadOutlined className="mr-2" />
                                    Regenerate Password
                                  </span>
                                ),
                                onClick: () => handleRegeneratePassword(element),
                              },
                              {
                                key: 'delete',
                                label: (
                                  <span className="text-red-500">
                                    <DeleteOutlined className="mr-2" />
                                    Delete Branch
                                  </span>
                                ),
                                onClick: () => handleDelete(element?._id),
                              },
                            ],
                          }}
                          trigger={['click']}
                        >
                          <Tooltip placement="topLeft"  title="More">
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

                        {/* <Tooltip placement="topLeft"  title="Edit">
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/branch/edit/${encrypt(element?._id)}`
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

                        </Tooltip> */}
                        {/* <Tooltip placement="topLeft"  title="Regenrate password">
                          <button
                            onClick={() => handleRegeneratePassword(element)}
                            className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <TfiReload
                              className="text-header hover:text-header"
                              size={14}
                            />
                          </button>
                        </Tooltip> */}
                        {/* <Tooltip placement="topLeft"  title="Delete">
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
                        </Tooltip> */}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5">
                  <td
                    colSpan={7}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>}
          </table>
        </div>
        {branchList?.length > 0 && (
          <CustomPagination
            totalCount={totalBranchCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </div>

    </GlobalLayout>
  );
}
export default BranchManagement;
