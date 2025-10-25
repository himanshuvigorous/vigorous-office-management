import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaSearch, FaEye } from "react-icons/fa";
import {
  getUserList,
  deleteUser,
  userSearch,
} from "../../userManagement/userFeatures/_user_reducers";
import { HiOutlineFilter } from "react-icons/hi";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  deleteDirector,
  directorList,
  updateDirectorStatus,
} from "./DirectorFeatures/_director_reducers";
import { RiDeleteBin5Line } from "react-icons/ri";
import { encrypt } from "../../../config/Encryption";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import Loader from "../../../global_layouts/Loader/Loader";
import {
  formatAddress,
  handleSortLogic,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
  inputClassNameSearch,
} from "../../../constents/global";
import {
  formButtonClassName,
  inputClassName,
  inputLabelClassName,
  domainName,
  usertypelist,
} from "../../../constents/global";
import { companySearch, regeneratePassfunc } from "../../company/companyManagement/companyFeatures/_company_reducers";
import moment from "moment";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { Select, Switch, Tooltip, Dropdown } from "antd";
import { TfiReload } from "react-icons/tfi";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";


function DirectorManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [sortedList, setSortedList] = useState([]);
  const [status, setStatus] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const userTypeglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;
  const { companyList } = useSelector((state) => state.company);
  const { directorLists, totalDirectorCount } = useSelector(
    (state) => state.director
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const pageSize = 10;
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDirectorListData();
      setLoading(false);
    };

    fetchData();
  }, [currentPage, CompanyId, status, searchText]);

  const fetchDirectorListData = async () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userTypeglobal === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId || "",
        text: searchText,
        status: status === "true" ? true : status === "false" ? false : "",
        sort: true,
        isPagination: true,
      },
    };

    try {
      await dispatch(directorList(reqData));
    } catch (error) {
      console.error("Error fetching director list:", error);
      setLoading(false);
    }
  };
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
  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDirector(reqData)).then((data) => {

          if (currentPage > 1 && directorLists?.docs?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            !data.error && fetchDirectorListData();
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
    // 
    setSearchText(e);
  };

  useEffect(() => {

    if (directorLists?.docs) {
      handleSort();
    } else {
      setSortedList(directorLists?.docs)
    }
  }, [directorLists?.docs]);

  const handleSort = (key, order) => {

    const sortedList = handleSortLogic(key, order, directorLists?.docs);
    setSortedList(sortedList);
  };


  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="bg-grey-100 w-full p-1">
          <div className="w-full">
            <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {userInfoglobal?.userType === "admin" && (
                  <div className="">

                    <Controller
                      name="PDCompanyId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassNameFilter}`}

                          placeholder="Select Company "
                          showSearch

                        >
                          <Select.Option value="">Select Company </Select.Option>
                          {companyList?.map((element, index) => (
                            <Select.Option key={index} value={element?._id}>
                              {element?.fullName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.PDCompanyId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDCompanyId.message}
                      </p>
                    )}
                  </div>
                )}

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
              <div className="flex justify-end items-center">
                <Tooltip placement="topLeft" title="Create Director" >
                  <button
                    onClick={() => {
                      navigate("/admin/director/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Owner</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                  <th className="tableHead  min-w-[120px] w-[120px]">
                    S.No.
                  </th>
                  {/* <th className='tableHead'>Profile</th> */}

                  <th className="tableHead ">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Owner Name</span>
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
                  {/* <th className='tableHead'>
                                        <div className='flex justify-start items-center space-x-1'>
                                            <span>User Name</span>
                                            <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                                <FaAngleUp />
                                                <FaAngleDown />
                                            </div>
                                        </div>
                                    </th> */}
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>E-mail</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp onClick={() => handleSort("email", "asc")} />
                        <FaAngleDown
                          onClick={() => handleSort("email", "desc")}
                        />
                      </div>
                    </div>{" "}
                  </th>
                  <th className="tableHead">
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
                    </div>{" "}
                  </th>
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Address</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
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
                    </div>
                  </th>
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Created At</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <div className="flex flex-col -space-y-1.5 cursor-pointer">
                          <FaAngleUp
                            onClick={() =>
                              handleSort("createdAt", "asc")
                            }
                          />
                          <FaAngleDown
                            onClick={() =>
                              handleSort("createdAt", "desc")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </th>

                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Created By</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <div className="flex flex-col -space-y-1.5 cursor-pointer">
                          <FaAngleUp
                            onClick={() =>
                              handleSort("createdBy", "asc")
                            }
                          />
                          <FaAngleDown
                            onClick={() =>
                              handleSort("createdBy", "desc")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </th>


                  <th className="tableHead">
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
              ) : (
                <tbody>
                  {sortedList && sortedList && sortedList?.length > 0 ? (
                    sortedList?.map((element, index) => (
                      <tr
                        key={index}
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * pageSize}
                        </td>
                        {/* <td className="tableData ">
                                                {element.profileImage ? <img
                                                    alt=""
                                                    src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                                                    className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                                                /> : <img
                                                    alt=""
                                                    src={`/images/avatar.jpg`}
                                                    className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                                                />}
                                            </td> */}
                        <td className="tableData">
                          {element?.fullName}
                        </td>
                        <td className="tableData">
                          {element?.userName}
                        </td>
                        {/* <td className='tableData '>{element?.userName}</td> */}
                        <td className="tableData ">
                          {element?.email}
                        </td>
                        <td className="tableData ">
                          {element?.mobile?.code + element?.mobile?.number}{" "}
                        </td>
                        <td className="tableData overflow-hidden text-ellipsis max-w-[200px] min-w-[200px]">
                          {formatAddress(element?.addresses?.primary)}
                        </td>
                        <td className="tableData ">
                          {element?.createdAt ? moment(element?.createdAt).format('DD-MM-YYYY hh:mm a') : '-'}
                        </td>
                        <td className="tableData ">
                          {element?.createdBy || '-'}
                        </td>
                        {/* <td className='tableData'>{element?.userType}</td> */}
                        {/* <td className='tableData'>{element?.lastLogin}</td> */}
                        <td className="tableData">
                          <Tooltip placement="topLeft" title={`${element?.status ? 'Click to Inactive' : 'Click to Active'}`}>
                            <Switch
                              checked={element?.status}
                              onChange={() => {
                                dispatch(
                                  updateDirectorStatus({ _id: element?._id })
                                ).then((data) => {
                                  if (!data?.error) {
                                    fetchDirectorListData();
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
                            <Tooltip placement="topLeft" title='View Details'>
                              <button
                                onClick={() => {
                                  navigate(
                                    `/admin/director/directorView/${encrypt(
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
                            </Tooltip>
                            {/* <Tooltip placement="topLeft"  title='Edit'>
                              <button
                                onClick={() => {
                                  navigate(
                                    `/admin/director/edit/${encrypt(
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
                            </Tooltip>
                            <Tooltip placement="topLeft"  title="Regenrate password">
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
                            </Tooltip>
                            <Tooltip placement="topLeft"  title='Delete'>
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
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: 'edit',
                                    label: (
                                      <span
                                        onClick={() =>
                                          navigate(`/admin/director/edit/${encrypt(element?._id)}`)
                                        }
                                        className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]"
                                      >
                                        <FaPenToSquare className="mr-2" size={16} />
                                        Edit
                                      </span>
                                    ),
                                  },
                                  {
                                    key: 'regenerate-password',
                                    label: (
                                      <span
                                        onClick={() => handleRegeneratePassword(element)}
                                        className="flex items-center text-blue-700 hover:text-blue-600"
                                      >
                                        <TfiReload className="mr-2" size={14} />
                                        Regenerate Password
                                      </span>
                                    ),
                                  },
                                  {
                                    key: 'delete',
                                    label: (
                                      <span
                                        onClick={() => handleDelete(element?._id)}
                                        className="flex items-center text-red-600 hover:text-red-500"
                                      >
                                        <RiDeleteBin5Line className="mr-2" size={16} />
                                        Delete
                                      </span>
                                    ),
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
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5 ">
                      <td
                        colSpan={9}
                        className="px-6 py-2 text-center whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
          {directorLists?.docs?.length > 0 && (
            <CustomPagination
              totalCount={totalDirectorCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />
          )}
        </div>
      </>
    </GlobalLayout>
  );
}
export default DirectorManagement;
