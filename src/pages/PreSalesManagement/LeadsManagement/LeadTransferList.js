import { useEffect, useState } from 'react';
import { getLeadmanagementtransferList, LeadmanagementTransferListStatus } from './LeadmanagementFeature/_LeadmanagementFeature_reducers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import getUserIds from '../../../constents/getUserIds';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import usePermissions from '../../../config/usePermissions';
import { domainName } from '../../../constents/global';
import Loader2 from '../../../global_layouts/Loader/Loader2';
import { Select, Tooltip } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { encrypt } from '../../../config/Encryption';
import { FaEye } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin5Line } from 'react-icons/ri';
import CustomPagination from '../../../component/CustomPagination/CustomPagination';
import { BiCheckDouble } from 'react-icons/bi';
import Swal from 'sweetalert2';
import { MdCancel } from 'react-icons/md';

const LeadTransferList = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({

  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branchList } = useSelector((state) => state.branch);
  const { userCompanyId } = getUserIds();
  const { LeadmanagementTransferList, totalLeadmanagementTransferList, loading } = useSelector((state) => state.LeadmanagementFeature);
 
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )
 

      const [searchParams, setSearchParams] = useSearchParams();
      const initialPage = parseInt(searchParams.get("page")) || 1;
      const initialLimit = parseInt(searchParams.get("limit")) || 10;
      const initialBranchId = searchParams.get("branchId") || "";     
      const [currentPage, setCurrentPage] = useState(initialPage);
      const [limit, setLimit] = useState(initialLimit);   
      const [searchText, setSearchText] = useState("");   
      const [branchId, setBranchId] = useState(initialBranchId);
  
      useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (limit) params.set("limit", limit);
        if (branchId) params.set("branchId", branchId);
        setSearchParams(params);
      }, [ branchId, searchText, currentPage, limit]);
      useEffect(() => {
        if(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company"){
          return
        } else{
          fetchLeadTransferList();
        }
      }, [ branchId, searchText, currentPage, limit]);
    
      const handleResetFilters = () => {
        setCurrentPage(1);
        setBranchId("");
        setLimit(10);
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


  const fetchLeadTransferList = () => {
    const reqListData = {
      limit: limit,
      page: currentPage,
      reqPayload: {
        text: searchText,
        sort: true,
        companyId: userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        isPagination: true,
        status: "",
        "leadId": "",
        "fromUser": "",
        "toUser": userInfoglobal?._id,
        "startDate": "",
        "endDate": "",


      },
    };
    dispatch(getLeadmanagementtransferList(reqListData));
  };
 
  const handleApprove = (id) => {
    Swal.fire({
      title: 'Approve Lead Transfer Request',
      text: 'Are you sure you want to approve this lead transfer request?',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(LeadmanagementTransferListStatus({
          _id: id,
          status: 'Approved',
        })).then((data) => {
          if (!data?.error) {
            fetchLeadTransferList();
            Swal.fire('Approved!', 'The leave request has been approved.', 'success');
          }
        });
      }
    });
  };
  const handleReject = (id) => {
    Swal.fire({
      title: 'Reject Lead Transfer Request',
      text: 'Are you sure you want to Reject this lead transfer request?',
      showCancelButton: true,
      confirmButtonText: 'Rejected',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(LeadmanagementTransferListStatus({
          _id: id,
          status: 'Rejected',
        })).then((data) => {
          if (!data?.error) {
            fetchLeadTransferList();
            Swal.fire('Rejected!', 'The leave request has been rejected.', 'success');
          }
        });
      }
    });
  };

  if (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" ) {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an Authorized. This page is viewable for Lead Handlers only.
          </p>
        </div>
      </GlobalLayout>
    )
  }

  return (
    <GlobalLayout onChange={onChange} >
      {loading ? (
        <Loader2 />
      ) : (
        <>
          <div className="flex justify-between items-center m-1.5">
            <div>
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
                <div className="">
                 
                      <Select
                     
                        defaultValue={""}
                        onChange={handleBranchChange}
                        value={branchId}
                        className={`inputAntdSelectClassNameFilterReport`}
                        showSearch
                        disabled={loading}
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                   
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>}
            </div>


          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto rounded-xl mt-1">
            {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    S.No.
                  </th>
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Request from</span>

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
                  {LeadmanagementTransferList && LeadmanagementTransferList?.length > 0 ? (
                    LeadmanagementTransferList?.map((element, index) => (
                      <tr
                        key={index}
                        className={` ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >
                        <td className="whitespace-nowrap border-none p-2 ">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.FromUserData?.fullName ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td>
                        <td className="whitespace-nowrap border-none p-2 ">{element?.createdBy ?? "-"}</td>
                        <td className="whitespace-nowrap border-none p-2 ">{element?.status ?? "-"}</td>




                        <td className="whitespace-nowrap border-none p-2">
                          {element?.companyId === "null" ||
                            element?.companyId === null ? (
                            <span className="py-1.5 text-black "> - </span>
                          ) : (
                            <span className="py-1.5 flex justify-start items-center space-x-2">
                              {canUpdate && <Tooltip placement="topLeft" title='Approve'>
                                <button
                                  disabled={element?.status !== "Pending"}
                                  onClick={() => {
                                    handleApprove(element?._id);
                                  }}
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <BiCheckDouble
                                    className={element?.status === "Pending" ? " hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-700"}
                                    size={16}
                                  />
                                </button>
                              </Tooltip>}

                              {canUpdate && <Tooltip placement="topLeft" title=''>
                                <button
                                  disabled={element?.status !== "Pending"}
                                  onClick={() => {
                                    handleReject(element?._id);
                                  }}
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <MdCancel
                                    className={element?.status === "Pending" ? " hover:text-rose-800 text-rose-900" : "text-gray-700"}
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
              totalCount={totalLeadmanagementTransferList}
              pageSize={limit}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />
          </div>
        </>
      )}
    </GlobalLayout>
  );
};

export default LeadTransferList;