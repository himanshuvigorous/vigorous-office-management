import { useNavigate, useSearchParams } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import { decrypt, encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare, FaDeleteLeft } from "react-icons/fa6"
import { domainName, inputAntdSelectClassNameFilter,  pazeSizeReport } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { getClientGroupList, deleteClientGroup } from "../clientGroup/clientGroupFeatures/_client_group_reducers"
import { Select, Tooltip, Dropdown } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import ClientListModal from "./ClientListModal";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader";

function ClientGroupList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const { branchList, branchListloading } = useSelector((state) => state.branch);
    const [openClientModal, setOpenClientModal] = useState({
        data: null,
        isOpen: false
    })
    const { clientGroupList, totalClientGroupCount, loading } = useSelector(state => state.clientGroup)
    

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
  fetchClientGroupList();
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

    const fetchClientGroupList = () => {
        const reqData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                companyId:
                        userInfoglobal?.userType === "company"
                            ? userInfoglobal?._id
                            : userInfoglobal?.companyId,
                branchId:
                    userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
                        ? userInfoglobal?._id
                        : userInfoglobal?.branchId,
                "directorId": "",
                "text": searchText,
                "sort": true,
                "status": status === 'true' ? true : status === 'false' ? false : '',
                "isPagination": true,
            }
        }
        dispatch(getClientGroupList(reqData))
    }

    const handleDelete = (id) => {
        let reqData = {
            _id: id,
        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to delete!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteClientGroup(reqData)).then((data) => {
                    // fetchClientGroupList();
                    if (currentPage > 1 && clientGroupList?.length == 1) {
                        setCurrentPage(Number(currentPage - 1));

                    } else {
                        fetchClientGroupList();
                    }
                })
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
                    companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                })
            );
        }
    }, [])




    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();


    return (
        <GlobalLayout onChange={onChange}>

            <section>
                <div className="lg:flex justify-between items-center xl:space-y-0 space-y-2 py-1">
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
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <button
                            onClick={() => {
                              handleResetFilters()
                            }}
                            className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {canCreate && <Tooltip placement="topLeft"  title='Add Client Group'>
                            <button
                                onClick={() => {
                                    navigate("/admin/client-group/create");
                                }}
                                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                            >
                                <FaPlus />
                                <span className="text-[12px]">Add Client Group</span>
                            </button>
                        </Tooltip>}
                    </div>
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
                        <span className="text-gray-600 font-medium">Total Group : </span>
                        <span className="text-header font-semibold">{totalClientGroupCount}</span>
                    </div>
                </div>
                <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                    {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                        <thead className=''>
                            <tr className='border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]'>
                                <th className='tableHead w-[7%]'>
                                    S.No.
                                </th>
                                <th className='tableHead w-[10%]'>
                                    Name
                                </th>
                                <th className='tableHead w-[10%]'>
                                    User Name
                                </th>
                                <th className='tableHead w-[5%]'>
                                    Total Clients
                                </th>
                                <th className='tableHead'>
                                    Email
                                </th>
                                <th className='tableHead'>
                                    Mobile Number
                                </th>
                                <th className='tableHead'>
                                    CreatedAt
                                </th>
                                <th className='tableHead'>
                                    CreatedBy
                                </th>
                                <th className='tableHead'>
                                    Status
                                </th>
                                {(canUpdate) && <th className='tableHead w-[10%]'>
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
                                {clientGroupList && clientGroupList?.length > 0 ?
                                    clientGroupList?.map((element, index) => (
                                        <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151]`}>
                                            <td className='tableData '>
                                                {index + 1 + ((currentPage - 1) * limit)}
                                            </td>
                                            <td className='tableData '>{element?.fullName ?? "-"}</td>
                                            <td className='tableData '>{element?.groupName ?? "-"}</td>
                                            <td className='tableData '>{element?.totalClient ? <div className="flex justify-start items-center gap-1">
                                                <span>{element?.totalClient}</span>
                                                <span className="flex justify-center items-center cursor-pointer" ><FaEye onClick={() => setOpenClientModal({ data: element, isOpen: true })} className=' hover:text-[#337ab7] text-[#3c8dbc]' size={14} /></span>
                                            </div> : "-"}</td>
                                            <td className='tableData '>{element?.email ?? "-"}</td>
                                            <td className='tableData '>{element?.mobile?.code + element?.mobile?.number}</td>
                                            <td className='tableData '>{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td>
                                            <td className='tableData '>{element?.createdBy ?? "-"}</td>

                                            <td className='tableData '>
                                                <span
                                                    className={`${element?.status
                                                        ? "bg-[#E0FFBE] border-green-500"
                                                        : "bg-red-200 border-red-500"
                                                        } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                                                >
                                                    {element?.status ? "Active" : "Inactive" ?? "-"}
                                                </span>
                                            </td>
                                            {(canUpdate) &&
                                                <td className='tableData'>
                                                    <span className="py-1.5 flex justify-start items-center space-x-2">
                                                        {/* {(canUpdate) && <Tooltip placement="topLeft"  title='Edit'>
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/admin/client-group/edit/${encrypt(element?._id)}`);
                                                            }}
                                                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                        </button>
                                                    </Tooltip>} */}
                                                        <Dropdown
                                                            menu={{
                                                                items: [
                                                                    canUpdate && {
                                                                        key: 'edit-client-group',
                                                                        label: (
                                                                            <span
                                                                                onClick={() => navigate(`/admin/client-group/edit/${encrypt(element?._id)}`)}
                                                                                className="flex items-center gap-1"
                                                                            >
                                                                                <FaPenToSquare className="text-[#3c8dbc] hover:text-[#337ab7]" size={16} />
                                                                                Edit Client Group
                                                                            </span>
                                                                        ),
                                                                    },
                                                                    canDelete && {
                                                                        key: 'delete-client-group',
                                                                        label: (
                                                                            <span

                                                                                className="flex items-center gap-1"
                                                                            >
                                                                                <FaDeleteLeft className={Number(element?.totalClient) ? "" : "text-rose-500 hover:text-rose-500"} size={16} />
                                                                                Delete Client Group
                                                                            </span>
                                                                        ),
                                                                        onClick: () => handleDelete(element?._id),
                                                                        disabled: Number(element?.totalClient),
                                                                    },
                                                                ].filter(Boolean),
                                                            }}
                                                            trigger={['click']}
                                                        >
                                                            <Tooltip placement="topLeft"  title='More Actions'>
                                                                <button
                                                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                                                    type="button">
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
                                    : (<tr className="bg-white bg-opacity-5 " >
                                        <td colSpan={5} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                                    </tr>)}
                            </tbody>}
                    </table>}
                </div>
                {clientGroupList?.length > 0 && (
                    <CustomPagination
                        totalCount={totalClientGroupCount}
                        pageSize={limit}
                        currentPage={currentPage}
                        onChange={onPaginationChange}
                    />)}
            </section>
            <ClientListModal
                groupId={openClientModal?.data}
                isOpen={openClientModal?.isOpen}
                onClose={() => {
                    setOpenClientModal({
                        data: null,
                        isOpen: false
                    })
                }}
            />

        </GlobalLayout>
    )
}
export default ClientGroupList