import React, { useEffect, useState } from 'react'
import Loader2 from '../../../../global_layouts/Loader/Loader2';
import { useDispatch, useSelector } from 'react-redux';
import { message, Modal, Spin, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../../../config/usePermissions';
import { companyInvoiceRefund, companyInvoiveDetail, companyPlanHistory, deleteCompany, getCompanyList, regeneratePassfunc, subscriptionFunc } from '../companyFeatures/_company_reducers';
import { sendProposalEmail } from '../../../client/proposal/proposalFeatures/_proposal_reducers';
import Swal from 'sweetalert2';
import { planSearch } from '../../../global/other/Plan/PlanFeatures/_plan_reducers';
import { handleSortLogic } from '../../../../constents/global';
import dayjs from 'dayjs';
import { FaEye, FaRegBuilding } from 'react-icons/fa';
import moment from 'moment';
import { BiDetail } from 'react-icons/bi';
import SubscriptionModal from '../SubscriptionModal';
import GlobalLayout from '../../../../global_layouts/GlobalLayout/GlobalLayout';
import { AiOutlinePercentage, AiOutlineSkype, AiTwotoneCheckSquare, AiTwotoneContacts, AiTwotoneContainer } from 'react-icons/ai';
import ListLoader from '../../../../global_layouts/ListLoader';

const PlanHistory = ({companyId}) => {

  const [isCompanyMailOpen, setIsCompanyMailOpen] = useState(false);

  const copyToClipboard = (text) => {
    if(!text) return
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyList, totalCompanyCount, companyPlanHistoryData, subscriptionData, companyInvoiceDetailsdata } = useSelector(
    (state) => state.company
  );
    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [sortedList, setSortedList] = useState([]);
 
  const [detailsModal, setDetailsModal] = useState({
    data: null,
    status: false,
    loading: false
  })
  // const [detailsModal, setDetailsModal] = useState({
  //   data: null,
  //   status: false,
  //   loading: false
  // })
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [refundloading, setRefundloading] = useState(false);

  const handleSubmit = async (e, element) => {
    e.preventDefault();
    if (!amount.trim()) {
      setError('Amount is required.');
      return;
    }
    setError('');
    setRefundloading(true)
    await dispatch(companyInvoiceRefund({
      "paymentId": element,
      "amount": amount
    })).then(data => {
      if (!data?.error) {
        dispatch(companyInvoiveDetail({ paymentId: element }));
        setAmount('')
      }
    })
    setRefundloading(false)
  };
  const { planListData } = useSelector((state) => state.plan);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPlanHistory, setLoadingPlanHistory] = useState(false);
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

    
 
useEffect(()=>{
    setLoadingPlanHistory(true)
    if (companyId) {
       dispatch(companyPlanHistory({ companyId: companyId }))
    }
    setLoadingPlanHistory(false)
},[companyId])
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const limit = 10;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCompanyListData();
      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchText, plan, status]);
  useEffect(() => {
    if (companyInvoiceDetailsdata) {
      setAmount(
        (
          (companyInvoiceDetailsdata?.amount ?? 0) / 100 -
          (companyInvoiceDetailsdata?.amount_refunded ?? 0) / 100
        ).toFixed(0)
      );

    }
  }, [companyInvoiceDetailsdata])

   const [subscriptionModal, setSubscriptionModal] = useState({
    data: null,
    status: false,
    loading: false
  })
  const fetchCompanyListData = async () => {
    let reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        text: searchText,
        status: status,
        planId: plan,
        isPagination: true
      },
    };


    try {
      // Assuming dispatch is a function that returns a promise
      await dispatch(getCompanyList(reqData));
    } catch (error) {
      console.error('Error fetching company list:', error);
      setLoading(false); // Ensure loading is stopped on error
    }
  };
  const handleProposalEmail = (emailData) => {
    dispatch(sendProposalEmail(emailData)).then(data => {
      if (!data.error) {

        setIsCompanyMailOpen(false);
        // setcompanyId([])
        Swal.fire({
          icon: 'success',
          title: 'Proposal Email',
          html: `
                <p>Proposal Email has been send successfully!</p>
              `,
          confirmButtonColor: '#3085d6'
        });
      }
    });
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    const listData = {
      isClient: false,
      size: 10,
      pageNo: 1,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCompany(reqData)).then((data) => {
          fetchCompanyListData();
        });
      }
    });
  };

  useEffect(() => {
    dispatch(planSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
    }))
  }, [])

  const onChange = (e) => {
    // 
    setSearchText(e)
  }

  useEffect(() => {
    if (companyList) {
      handleSort();
    }
  }, [companyList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, companyList);
    setSortedList(sortedList);
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
  const handleSubscriptionView = async (element) => {
  
    setSubscriptionModal({
      data: element,
      status: true,
      loading: true,
    });

    try {
      await dispatch(subscriptionFunc({
        // subscriptionId: "sub_QKU1wkxVzQVEvb"
        subscriptionId: element?.subscriptionId
      }));
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionModal(prevState => ({
        ...prevState,
        loading: false,
      }));
    }
  };
  const handleinvoicedetailsView = async (element) => {
    setDetailsModal({
      data: element,
      status: true,
      loading: true,
    });

    try {
      await dispatch(companyInvoiveDetail({ paymentId: element?.payment_id }));
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setDetailsModal(prevState => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  return (

        <div className='px-2'>
        <div className="bg-[#ffffff] text-[13px] text-[#676a6c] w-full overflow-x-auto mt-1">
                          {/* <table className="w-full max-w-full rounded-xl overflow-hidden ">
                            <thead className="">
                              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500]  h-[40px]">
                                <th className="border-none p-2 whitespace-nowrap w-[10%]"> S.no.</th>
                                <th className="border-none p-2 whitespace-nowrap"> Plan Name </th>
                                <th className="border-none p-2 whitespace-nowrap"> Description</th>
                                <th className="border-none p-2 whitespace-nowrap"> Duration</th>
                                <th className="border-none p-2 whitespace-nowrap">Price / Month</th>
                                <th className="border-none p-2 whitespace-nowrap">Total Price</th>
                                <th className="border-none p-2 whitespace-nowrap">Created At</th>
                                <th className="border-none p-2 whitespace-nowrap">Created By</th>
                                <th className="border-none p-2 whitespace-nowrap">Status</th>
                                <th className="border-none p-2 whitespace-nowrap text-center">Action</th>
                              </tr>
                            </thead>
                            {loadingPlanHistory ?
                              <tr className="bg-white bg-opacity-5 ">
                                <td
                                  colSpan={15}
                                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                                >
                                  <Loader2 />
                                </td>
                              </tr> :
        
                              <tbody>
                                {companyPlanHistoryData && companyPlanHistoryData?.planHistory && companyPlanHistoryData?.planHistory?.length > 0 ? (
                                  companyPlanHistoryData?.planHistory?.map((element, index) => (
                                    <tr
                                      className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                                        }`}
                                    >
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {index + 1 + ((currentPage - 1) * limit)}
                                      </td>
        
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {`${element?.title} ` ?? "-"}
                                      </td>
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {element?.planData?.description ?? "-"}
                                      </td>
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {`${element?.days} days` ?? "-"}
                                      </td>
        
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {`₹ ${element?.price} ` ?? "-"}
                                      </td>
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {`₹ ${element?.price * element?.planData?.billingCycle} ` ?? "-"}
                                      </td>
        
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {`${dayjs(element?.createdAt).format('DD-MM-YYYY')} ` ?? "-"}
                                      </td>
                                      <td className="whitespace-nowrap border-none p-2 ">
                                        {element?.createdBy ?? "-"}
                                      </td>
                                      <td className="whitespace-nowrap border-none p-2 capitalize">
                                        {element?.status ?? "-"}
                                      </td>
                                      <td className="whitespace-nowrap border-none p-2 capitalize">
                                        <Tooltip placement="topLeft"  title="Subscription" >
                                          <button
                                            onClick={() => {
                                              handleSubscriptionView(element)
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
        
                                      </td>
        
                                    </tr>
                                  ))
                                ) : (
                                  <tr className="bg-white bg-opacity-5 ">
                                    <td
                                      colSpan={10}
                                      className="px-6 text-center py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                                    >
                                      Record Not Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>}
                          </table> */}
                          <Modal
                            title="Subscription Details"
                            open={subscriptionModal.status}
                            onCancel={() => setSubscriptionModal(state => ({
                              ...state,
                              status: false
                            }))}
                            className="antmodalclassName"
                            footer={null}
                            width={1100}
                            wrapClassName="overflow-hidden"
                          >
                            {subscriptionModal?.loading ? (
                              <div className="flex justify-center items-center h-64">
                                <Spin />
                              </div>
                            ) : (
                              <div className="">
                                {/* Subscription Info - Responsive Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4  bg-gray-50 rounded-lg p-1">
                                  <div className="space-y-3">
                                    <InfoRow label="Subscription ID" value={subscriptionData?.id} />
                                    <InfoRow label="Payment Method" value={subscriptionData?.payment_method} />
                                    <InfoRow label="Plan ID" value={subscriptionData?.plan_id} />
                                    <InfoRow
                                      label="Short URL"
                                      value={subscriptionData?.short_url}
                                      copyable
                                      onCopy={() => copyToClipboard(subscriptionData?.short_url)}
                                    />
                                    <InfoRow label="Total Count" value={subscriptionData?.total_count} />
                                  </div>
                                  <div className="space-y-3">
                                    <InfoRow label="Paid Count" value={subscriptionData?.paid_count} />
                                    <InfoRow label="Remaining Count" value={subscriptionData?.remaining_count} />
                                    <InfoRow label="Status" value={
                                      <div onClick={()=>{
        
                                      }} className="flex justify-between items-center gap-2 text-xs">
                                        <span>
                                          {
                                            subscriptionData?.status ?? "-"
                                          }
                                        </span>
                                        <span>
                                        {/* {subscriptionData?.status !== "cancelled"  && <SubscriptionModal subscriptionId={subscriptionData?.id} />} */}
                                        </span>
                                      </div>
                                    } capitalize />
                                    <InfoRow
                                      label="Period"
                                      value={
                                        subscriptionData?.current_start && subscriptionData?.current_end
                                          ? `${moment(subscriptionData.current_start).format("DD-MM-YYYY")} to ${moment(subscriptionData.current_end).format("DD-MM-YYYY")}`
                                          : "-"
                                      }
                                    />
                                  </div>
                                </div>
        
                                {/* Invoice Table - Responsive with horizontal scroll on mobile */}
                                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-800">
                                        <tr>
                                          <TableHeader>#</TableHeader>
                                          <TableHeader>Order ID</TableHeader>
                                          <TableHeader>Short URL</TableHeader>
                                          <TableHeader>Amount</TableHeader>
                                          <TableHeader>Amount Due</TableHeader>
                                          <TableHeader>Gross Amount</TableHeader>
                                          <TableHeader>Status</TableHeader>
                                          <TableHeader>Action</TableHeader>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingPlanHistory ? (
                                          <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center">
                                              <div className="flex justify-center">
                                                <Loader2 />
                                              </div>
                                            </td>
                                          </tr>
                                        ) : subscriptionData?.invoiceList?.length > 0 ? (
                                          subscriptionData.invoiceList.map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                              <TableCell>{index + 1 + ((currentPage - 1) * limit)}</TableCell>
                                              <TableCell className="max-w-[120px] truncate">{item?.order_id || "-"}</TableCell>
                                              <TableCell>
                                                {item?.short_url ? (
                                                  <div className="flex items-center space-x-1">
                                                    <span className="truncate max-w-[100px] md:max-w-[180px]">{item?.short_url}</span>
                                                    <CopyButton onCopy={() => copyToClipboard(item?.short_url)} />
                                                  </div>
                                                ) : "-"}
                                              </TableCell>
                                              <TableCell>{item?.amount ? (item.amount / 100).toFixed(2) : "-"}</TableCell>
                                              <TableCell>{item?.amount_due ? (item.amount_due / 100).toFixed(2): "-"}</TableCell>
                                              <TableCell>{item?.gross_amount ? (item.gross_amount / 100).toFixed(2) : "-"}</TableCell>
                                              <TableCell className="capitalize">{item?.status || "-"}</TableCell>
                                              <TableCell className="capitalize">
        
        
                                                <Tooltip placement="topLeft"  title="Payment Summary" >
                                                  <button
                                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                                    type="button"
                                                    disabled={item.status === "issued"}
                                                  >
                                                    <BiDetail
        
                                                      onClick={() => handleinvoicedetailsView(item)}
                                                      className={item.status === "issued" ? "text-gray-500 " : "text-cyan-600 hover:text-cyan-500"}
                                                      size={16}
                                                    />
                                                  </button>
                                                </Tooltip>
                                              </TableCell>
                                              <Modal
                                                title="Payment Summary"
                                                className="antmodalclassName"
                                                open={detailsModal.status}
                                                onCancel={() => setDetailsModal((state) => ({ ...state, status: false }))}
                                                footer={null}
                                                width={800}
                                                wrapClassName="overflow-hidden"
                                                style={{ borderRadius: '12px' }}
                                                bodyStyle={{ padding: '0' }}
                                              >
                                                {detailsModal?.loading ? (
                                                  <div className="flex justify-center items-center h-64">
                                                    <Spin />
                                                  </div>
                                                ) : (
                                                  <div className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                      {/* Payment Status Card */}
                                                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                                        <div className="flex justify-between items-start mb-4">
                                                          <h3 className="text-lg font-semibold text-gray-800">Payment Status</h3>
                                                          <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${companyInvoiceDetailsdata?.status === 'captured'
                                                              ? 'bg-green-100 text-green-800'
                                                              : 'bg-yellow-100 text-yellow-800'
                                                              }`}
                                                            style={{ textTransform: 'uppercase' }}
                                                          >
                                                            {companyInvoiceDetailsdata?.status}
                                                          </span>
                                                        </div>
        
                                                        <div className="space-y-3">
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Amount</span>
                                                            <span className="font-medium">
                                                              ₹{(companyInvoiceDetailsdata?.amount / 100).toFixed(2)}
                                                            </span>
                                                          </div>
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Payment Method</span>
                                                            <span className="font-medium" style={{ textTransform: 'uppercase' }}>
                                                              {companyInvoiceDetailsdata?.method}
                                                            </span>
                                                          </div>
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Date</span>
                                                            <span className="font-medium">
                                                              {new Date(companyInvoiceDetailsdata?.created_at).toLocaleString()}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
        
                                                      {/* Customer Details Card */}
                                                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
                                                        <div className="space-y-3">
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Email</span>
                                                            <span className="font-medium">{companyInvoiceDetailsdata?.email}</span>
                                                          </div>
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Contact</span>
                                                            <span className="font-medium">{companyInvoiceDetailsdata?.contact}</span>
                                                          </div>
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Description</span>
                                                            <span className="font-medium text-right">{companyInvoiceDetailsdata?.description}</span>
                                                          </div>
                                                        </div>
                                                      </div>
        
        
                                                      {/* {subscriptionData?.status === "cancelled" && <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Refund Amount</h3>
                                                        <form onSubmit={(e) => handleSubmit(e, companyInvoiceDetailsdata?.id)} className="max-w-md mx-auto">
                                                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Amount <span className="text-red-600">*</span>
                                                          </label>
                                                          <div className="flex rounded-md shadow-sm overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-rose-500">
                                                            <input
                                                              type="number"
                                                              value={amount}
                                                              disabled={(!amount || amount === "0")}
                                                              onChange={(e) => setAmount(e.target.value)}
                                                              placeholder="Enter Amount"
                                                              className="flex-1 px-4 py-2 text-sm focus:outline-none"
                                                            />
                                                            <button
                                                              type="submit"
                                                              disabled={(!amount || amount === "0")}
                                                              className={` ${(!amount || amount === "0") ? " bg-gray-500" : "bg-rose-600 hover:bg-rose-700"} text-white px-5 py-2 text-sm font-medium transition-colors    `}
                                                            >
                                                              {refundloading ? <Spin size="small" /> : "Submit"}
                                                            </button>
                                                          </div>
                                                          {error && (
                                                            <p className="mt-2 text-sm text-red-600">{error}</p>
                                                          )}
                                                        </form>
                                                      </div>}
         */}
                                                      {/* Transaction Details Card */}
                                                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                          <div className="space-y-2">
                                                            <p className="text-gray-500">Transaction ID</p>
                                                            <p className="font-medium break-all">{companyInvoiceDetailsdata?.id}</p>
                                                          </div>
                                                          <div className="space-y-2">
                                                            <p className="text-gray-500">Order ID</p>
                                                            <p className="font-medium break-all">{companyInvoiceDetailsdata?.order_id}</p>
                                                          </div>
                                                          <div className="space-y-2">
                                                            <p className="text-gray-500">Invoice ID</p>
                                                            <p className="font-medium break-all">{companyInvoiceDetailsdata?.invoice_id}</p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      {companyInvoiceDetailsdata?.refund_status && (
                                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                                                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Refund Status</h3>
                                                          <div className="flex justify-between">
                                                            <span className="text-gray-500">Amount Refunded</span>
                                                            <span className="font-medium">
                                                              ₹{(companyInvoiceDetailsdata?.amount_refunded / 100).toFixed(2)}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
        
                                                    {/* Notes Section (if notes exist) */}
                                                    {companyInvoiceDetailsdata?.notes?.length > 0 && (
                                                      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                          {companyInvoiceDetailsdata.notes.map((note, index) => (
                                                            <li key={index} className="text-gray-700">{note}</li>
                                                          ))}
                                                        </ul>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </Modal>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                              No records found
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
        
        
                                </div>
                              </div>
                            )}
                          </Modal>
        
        
        
                        </div>

                         <div>
                                      {
                                      companyPlanHistoryData && companyPlanHistoryData?.planHistory && companyPlanHistoryData?.planHistory?.length > 0 ?
                                      (companyPlanHistoryData?.planHistory?.map((element, index) => (
                                        <div key={index} className=" rounded-md  ">
                                          <div key={index} className=" rounded-md ">
                                            <div className="flex justify-between items-center rounded-t-md px-3">
                                              <div className="py-2 text-header font-semibold">
                                                Plan History {index + 1}
                                              </div>
                                            </div>
                                            <div className="grid sm:grid-cols-1 grid-cols-1 gap-4 items-end overflow-auto">
                                              <div className="w-full">
                                                <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                                                  <thead>
                                                    <tr></tr>
                                                  </thead>
                                                  <tbody className="text-sm text-gray-700">
                                                    {/* Company Name Row */}
                                                    <tr className=" hover:bg-indigo-50 ">
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center  gap-2">
                                                          <AiTwotoneContainer className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            Plan Name
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                          {`${element?.title} ` ?? "-"}
                                                        </span>
                                                      </td>
                        
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          <FaRegBuilding className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            Plan Description
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                           {element?.planData?.description ?? "-"}
                                                        </span>
                                                      </td>
                                                    </tr>
                        
                                                    {/* <tr className=" hover:bg-indigo-50">
                                              <td className="p-3  text-gray-600">
                                                <div className="flex items-center gap-2">
                                                  <FaPeopleGroup className="size-4 text-header text-lg" />
                                                  <span className="text-[16px] font-medium">
                                                    Branch Head
                                                  </span>
                                                </div>
                                                <span className="block text-[15px] ml-4 font-light mt-1">
                                                  {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                                                </span>
                                              </td>
                        
                                              <td className="p-3  text-gray-600">
                                                <div className="flex items-center gap-2">
                                                  <FaIndustry className="size-4 text-header text-lg" />
                                                  <span className="text-[16px] font-medium">
                                                    Remark
                                                  </span>
                                                </div>
                                                <span className="block text-[15px] ml-4 font-light mt-1">
                                                  {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                                                </span>
                                              </td>
                                            </tr> */}
                        
                                                    <tr className=" hover:bg-indigo-50">
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          <AiTwotoneContacts className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            Duration
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                         {`${element?.days} days` ?? "-"}
                                                        </span>
                                                      </td>
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          <AiTwotoneContacts className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            {" "}
                                                            Price/Month
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                           {`₹ ${element?.price} ` ?? "-"}
                                                        </span>
                                                      </td>
                        
                                                      {/* <td className="p-3  text-gray-600">
                                                <div className="flex items-center gap-2">
                                                  <AiOutlineMail className="size-4 text-header text-lg" />
                                                  <span className="text-[16px] font-medium">Email</span>
                                                </div>
                                                <span className="block text-[15px] ml-4 font-light mt-1">
                                                  {branchDetailsData?.data?.email || "N/A"}
                                                </span>
                                              </td>*/}
                                                    </tr>
                        
                                                    <tr className=" hover:bg-indigo-50">
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          <AiTwotoneCheckSquare className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            Total Price
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                            {`₹ ${element?.price * element?.planData?.billingCycle} ` ?? "-"}
                                                        </span>
                                                      </td>
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          <AiOutlinePercentage className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            {" "}
                                                            Created At
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                          {`${dayjs(element?.createdAt).format('DD-MM-YYYY')} ` ?? "-"}
                                                        </span>
                                                      </td>
                                                    </tr>
                        
                                                    <tr className=" hover:bg-indigo-50">
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          {/* <AiOutlineSkype className="size-4 text-header text-lg" /> */}
                                                          <span className="text-[16px] font-medium">
                                                            CreatedBy
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                          {element?.createdBy ?? "-"}
                                                        </span>
                                                      </td>
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                          {/* <AiOutlineSkype className="size-4 text-header text-lg" /> */}
                                                          <span className="text-[16px] font-medium">
                                                            Status
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                          {element?.status ?? "-"}
                                                        </span>
                                                      </td>

                                                    </tr>
                                                    <tr className=" hover:bg-indigo-50 ">
                                                      <td className="p-3 w-1/2 text-gray-600">
                                                        <div className="flex items-center  gap-2">
                                                          <AiTwotoneContainer className="size-4 text-header text-lg" />
                                                          <span className="text-[16px] font-medium">
                                                            Action
                                                          </span>
                                                        </div>
                                                        <span className="block text-[15px] ml-4 font-light mt-1">
                                                          <Tooltip placement="topLeft"  title="Subscription" >
                                          <button
                                            onClick={() => {
                                              handleSubscriptionView(element)
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
                                                        </span>
                                                      </td>
                        
                                                      
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))) :<div className='flex justify-center items-center text-[15px] text-header'> No Data Found </div>
                                      
                                      }
                        
                                      {/* Add Education Button */}
                                    </div>
    </div>
  
  )
}

export default PlanHistory
const InfoRow = ({ label, value, copyable = false, capitalize = false, onCopy }) => (
  <div className="flex flex-wrap items-center">
    <span className="w-32 md:w-40 text-sm font-medium text-gray-600">{label}:</span>
    <span className={`flex-1 text-sm text-gray-800 ${capitalize ? 'capitalize' : ''}`}>
      {value || "-"}
      {copyable && value && (
        <button
          onClick={onCopy}
          className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          aria-label="Copy to clipboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      )}
    </span>
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

const CopyButton = ({ onCopy }) => (
  <button
    onClick={onCopy}
    className="text-blue-500 hover:text-blue-700 focus:outline-none"
    title="Copy to clipboard"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
  </button>
);