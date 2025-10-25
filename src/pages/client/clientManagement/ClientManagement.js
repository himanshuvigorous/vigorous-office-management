import  { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  FaPenToSquare, FaUser } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaEye } from "react-icons/fa";
import { domainName, handleSortLogic, inputAntdSelectClassNameFilter, pazeSizeReport } from "../../../constents/global";
import { getClientList, deleteClientFunc, statusClientFunc } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { Progress, Select, Switch, Tooltip, Dropdown } from "antd";
import usePermissions from "../../../config/usePermissions";
import { regeneratePassfunc } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import Loader2 from "../../../global_layouts/Loader/Loader2";
import ImportCliebtsModal from "./ImportCliebtsModal";
import { TfiReload } from "react-icons/tfi";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader";
import moment from "moment";

function ClientManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { clientList, totalEmployeCount, loading } = useSelector((state) => state.client);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [sortedList, setSortedList] = useState([]);
  const [importClientsModal, setImportClientModal] = useState(false);



  useEffect(() => {
    if (clientList) {
      handleSort();
    }
  }, [clientList]);

  const [searchParams, setSearchParams] = useSearchParams();
 const initialPage = parseInt(searchParams.get('page')) || 1;
  const initialLimit = parseInt(searchParams.get('limit')) || 10;
  const initialBranchId = searchParams.get('branchId') || '';
  const initialStatus = searchParams.get('status') || '';

 const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
    const [searchText, setSearchText] = useState('');
      const [branchId, setBranchId] = useState(initialBranchId);


 useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (limit !== 10) params.set('limit', limit);
    if (branchId) params.set('branchId', branchId);
    if (status) params.set('status', status);
    setSearchParams(params);
  }, [currentPage, limit, branchId,  status,  searchText]);
  useEffect(() => {
    fetchClientListData();
  }, [currentPage, limit, branchId,  status,  searchText]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setLimit(10);
    setBranchId('');
    setStatus('');
    setSearchText('');
  };
  const onChange = (e) => {
    setSearchText(e);
  
  };
  const handlePageSizeChange = (e) => {
    setLimit(Number(e));
    setCurrentPage(Number(1))
  };
  const onPaginationChange = (page) => setCurrentPage(page)
  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1); 
  }
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };




  const fetchClientListData = () => {
    let reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        companyId: userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company"  || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,

        "directorId": "",
        "organizationId": "",
        "industryId": "",
        "text": searchText,
        "sort": true,
        "status": status === 'true' ? true : status === 'false' ? false : '',
        "isPagination": true,
      },
    };
    dispatch(getClientList(reqData));
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
        dispatch(deleteClientFunc(reqData)).then((data) => {
          // fetchClientListData()
          if (currentPage > 1 && clientList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchClientListData();
          }

        })
      }
    });
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
  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, clientList);
    setSortedList(sortedList);
  };


  return (
    <GlobalLayout onChange={onChange}>
      <section>
        <div className="bg-grey-100 w-full p-1">
          <div className="xl:flex justify-between items-center xl:space-y-0 space-y-2 py-1">
            <div className="grid md:flex sm:grid-cols-3 grid-cols-1 flex-wrap md:gap-3 gap-1.5">
               {(userInfoglobal?.userType == 'company' || userInfoglobal?.userType == 'companyDirector') && (
                  <div>
                    <Select
                      value={branchId}
                      onChange={handleBranchChange}
                      defaultValue=""
                      disabled={loading}
                      className={`${inputAntdSelectClassNameFilter} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? (
                        <Select.Option disabled><ListLoader /></Select.Option>
                      ) : (
                        branchList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        ))
                      )}
                    </Select>
                  </div>
                )}
              <div>
                    <Select
                     value={status}
                    onChange={handleStatusChange}
                    disabled={loading}
                      className={`${inputAntdSelectClassNameFilter} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select status</Select.Option>
                      <Select.Option value="true">Active</Select.Option>
                      <Select.Option value="false">Inactive</Select.Option>
                    </Select>
              </div>
              <button
                onClick={() => {
              handleResetFilters();
                }}
                className="bg-header py-[6px] rounded-md md:flex hidden px-5 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
            </div>

            {canCreate &&
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => {
                   handleResetFilters()
                  }}
                  className="bg-header   py-[6px] rounded-md md:hidden flex px-5 justify-center items-center  text-white md:mt-0">
                  <span className="text-[12px]">Reset</span>
                </button>
                <Tooltip placement="topLeft"  title='Add Client'>
                  <button
                    onClick={() => {
                      navigate("/admin/client/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white whitespace-nowrap"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Client</span>
                  </button>
                </Tooltip>
                <Tooltip placement="topLeft"  title='import Clients'>
                  <button
                    onClick={() => setImportClientModal(true)}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white whitespace-nowrap"
                  >
                    <FaPlus />
                    <span className="text-[12px]">importClients</span>
                  </button>
                </Tooltip>
              </div>
            }
          </div>
          <div className="flex justify-between items-center gap-2">

            <div className="flex items-center gap-2">
              <span className="text-sm font-light text-gray-500">
                Rows per page:
              </span>
              <Select
                value={limit}
                disabled={loading}
                onChange={handlePageSizeChange}
                className="text-sm font-light text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                {pazeSizeReport.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="bg-white !min-w-[100px] mt-2 p-2 rounded-xl shadow-sm text-sm flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total Client:</span>
              <span className="text-header font-semibold">{totalEmployeCount}</span>
            </div>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500]  h-[40px]">
                  <th className="tableHead w-[5%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>S.No.</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">



                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Profile</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead w-[10%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Profile Image</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                  {/* <th className="tableHead w-[10%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Client Id</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("userName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("userName", "desc")}
                        />
                      </div>
                    </div>
                  </th> */}
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Group</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("groupName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("groupName", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead w-[10%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Client Name</span>
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
                  <th className="tableHead w-[10%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Organization</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("organizationName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("organizationName", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Mb. No.</span>
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
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Email Id</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("email", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("email", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>PAN Number</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("clientProfile.penNumber", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("clientProfile.penNumber", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  {/* <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Created At</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("createdAt", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("createdAt", "desc")}
                        />
                      </div>
                    </div>
                  </th> */}
                  {/* <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Created By</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("createdBy", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("createdBy", "desc")}
                        />
                      </div>
                    </div>
                  </th> */}
                  <th className="tableHead">Status</th>
                  {(canUpdate || canDelete || canRead) && <th className="tableHead w-[5%]">
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
              </tr> :
                <tbody>
                  {sortedList && sortedList?.length > 0 ? (
                    sortedList?.map((element, index) => (
                      <tr
                        className={`${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD] text-[#374151]`}
                      >
                        <td className="tableData">
                          {index + 1 + ((currentPage - 1) * limit)}
                        </td>
                        <td className="tableData">
                          <span

                          >
                            <Progress size={
                              50
                            } strokeWidth={10} type="circle" percent={element?.profileCompletion} strokeColor={{
                              '0%': '#E74C3C',
                              '50%': '#108ee9',
                              '100%': '#87d068',
                            }} />

                          </span>
                        </td>

                        <td className="tableData ">
                          {element.profileImage ? (
                            <img
                              alt=""
                              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                              className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                              <FaUser className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </td>

                        {/* <td className="tableData">
                          {element?.userName || '-'}
                        </td> */}
                        <td className="tableData max-w-[150px] min-w-[150px]">
                          {element?.groupName || '-'}
                        </td>
                        <td className="min-w-[200px]" style={{
                          whiteSpace: 'normal',
                          padding: '0.5rem',
                          fontSize: '12.8px',
                          textAlign: 'left',
                        }}>
                          {element?.fullName || '-'}
                        </td>

                        <td className="tableData">
                          {element?.organizationName || '-'}
                        </td>

                        <td className="tableData">
                          {element?.mobile?.code + element?.mobile?.number || '-'}
                        </td>
                        <td className="tableData">
                          {element?.email || '-'}
                        </td>
                        <td className="tableData">
                          {element?.clientProfile?.penNumber || '-'}
                        </td>
                        {/* <td className="tableData">
                          {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
                        </td>
                        <td className="tableData">
                          {element?.createdBy || '-'}
                        </td> */}


                        <td className="tableData">
                          <Tooltip placement="topLeft"  title={`${element?.status ? 'Tap to Inactive' : 'Tap to Active'}`}>
                            <Switch
                              checked={element?.status}
                              onChange={() => {
                                Swal.fire({
                                  title: 'Are you sure?',
                                  text: `Do you want to ${element?.status ? 'deactivate' : 'activate'} this client?`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonText: 'Yes, change it!',
                                  cancelButtonText: 'Cancel',
                                  reverseButtons: true
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    dispatch(
                                      statusClientFunc({ _id: element?._id, status: !element?.status })
                                    ).then((data) => {
                                      if (!data?.error) {
                                        fetchClientListData();
                                      }
                                    });
                                  }
                                });
                              }}
                              style={{
                                backgroundColor: element?.status ? "#4caf50" : "#f44336",
                                transition: "background-color 0.3s ease",
                              }}
                              height={20}
                              width={40}
                            />
                          </Tooltip>
                        </td>
                        {(canUpdate || canDelete || canRead) && <td className="tableData">
                          <span className="py-1.5 flex justify-start items-center space-x-2">
                            {canRead && <Tooltip placement="topLeft"  title='View Details'>
                              <button
                                onClick={() => {
                                  navigate(
                                    `/admin/client/clientView/${encrypt(element?._id)}`
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
                            }
                            <Dropdown
                              menu={{
                                items: [
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
                                  canUpdate && {
                                    key: 'edit',
                                    label: (
                                      <span
                                        onClick={() =>
                                          navigate(`/admin/client/edit/${encrypt(element?._id)}`)
                                        }
                                        className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]"
                                      >
                                        <FaPenToSquare className="mr-2" size={16} />
                                        Edit
                                      </span>
                                    ),
                                  },
                                  canDelete && {
                                    key: 'delete',
                                    label: (
                                      <span
                                        onClick={() =>
                                          handleDelete(element?._id)
                                        }
                                        className="flex items-center text-rose-500 hover:text-rose-500"
                                      >
                                        <RiDeleteBin5Line className="mr-2" size={16} />
                                        Delete
                                      </span>
                                    ),
                                  },


                                      ...(canRead
                                        ? [{
                                          key: 'createdAt',
                                          label: (
                                            <span
                                              className="flex justify-start items-center gap-1"
                                              // onClick={() => handleOpenChat(element)}
                                              >
                                              {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
                                            <span className="font-bold text-header">Created At :</span>
                                             <span className="text-[12px]">{moment(element?.createdAt).format("DD-MM-YYYY hh:mm a") || 'N/A'}</span>
                                            </span>
                                          ),
                                        }]
                                        : []),

                                        ...(canRead
                                        ? [{
                                          key: 'createdBy',
                                          label: (
                                            <span
                                              className="flex justify-start items-center gap-1"
                                             // onClick={() => handleOpenChat(element)}
                                              >
                                              {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
                                              <span className="font-bold text-header">Created By :</span>
                                              <span className="text-[12px]">{element?.createdBy || 'N/A'}</span>
                                            </span>
                                          ),
                                        }]
                                        : []),



                                ].filter(Boolean), // Removes false/null if `canUpdate` is false
                              }}
                              trigger={['click']}
                            >
                              <Tooltip placement="topLeft"  title="Actions">
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
                        </td>}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5 ">
                      <td
                        colSpan={8}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>}
            </table>}

          </div>



        </div>
        {clientList?.length > 0 && (
          <CustomPagination
            totalCount={totalEmployeCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />)}
        <ImportCliebtsModal fetchList={fetchClientListData} isOpen={importClientsModal} onClose={() => setImportClientModal(false)} />
      </section>
    </GlobalLayout>
  );
}
export default ClientManagement;