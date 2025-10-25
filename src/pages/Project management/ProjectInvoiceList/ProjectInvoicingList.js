import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { decrypt, encrypt } from "../../../config/Encryption";
import { inputAntdSelectClassNameFilter } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { Select, Tag, Modal, Button } from "antd";
import dayjs from "dayjs";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { deleteprojectInvoiceFunc, getprojectInvoiceListFunc, getprojectInvoiceReportList } from "./ProjectInvoiceFeatures/_ProjectInvoice_reducers";
import { FaEye, FaFileInvoiceDollar, FaMoneyBillWave, FaInfoCircle, FaFilePdf, FaCashRegister, FaSortAmountUp } from "react-icons/fa";
import PaymentEntryModal from "./PaymentEntryModal";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BiMoney, BiTrash } from "react-icons/bi";

function ProjectInvoicingList() {
  const { register, setValue, control, formState: { errors } } = useForm();
  const { element } = useParams();
  const parentdata = element ? JSON.parse(decrypt(element)) : {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectInvoiceReportList, loading } = useSelector((state) => state.projectInvoice);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentModalVisible, setPaymentModalVisible] = useState({
    isOpen: false,
    data: null,
    refrensedata : null
  
  });
  const [previousTransactionsModalVisible, setPreviousTransactionsModalVisible] = useState(false);
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month") });
  const endDate = useWatch({ control, name: "endDate", defaultValue: dayjs() });
  const tableRef = useRef(null);

  const status = useWatch({
    control,
    name: 'status',
    defaultValue: ''
  });
  const limit = 10;

  const filters = [status, searchText, startDate, endDate].join("-");
  const [isFirstRender, setisFirstRender] = useState(false);

  useEffect(() => {
    setValue('startDate', dayjs().subtract(1, "month"));
    setValue('endDate', dayjs());
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      fetchprojectInvoice();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  useEffect(() => {
    fetchprojectInvoice();
  }, [currentPage]);

  const fetchprojectInvoice = async () => {
    const reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        directorId: "",
        companyId: parentdata?.companyId,
        branchId: parentdata?.branchId,
        projectId: parentdata?._id,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        text: searchText,
        sort: true,
        status: status === "true" ? true : status === "false" ? false : "",
        isPagination: false,
      },
    };

    await dispatch(getprojectInvoiceReportList(reqData));
  };

  const onChange = (e) => {
    setSearchText(e);
  };

  const handleDelete = (id)=>{
    const reqData = {
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
        dispatch(deleteprojectInvoiceFunc(reqData)).then((data) => {
          if (!data.error) {
            fetchprojectInvoice();
          }
        });
      }
    });
  }

  // Get previous transactions summary
  const getPreviousSummary = () => {
    return projectInvoiceReportList?.previousTransactions?.summary || {
      totalDebit: 0,
      totalCredit: 0,
      closingBalance: 0,
      openingBalance: 0
    };
  };

  // Get current transactions summary
  const getCurrentSummary = () => {
    return projectInvoiceReportList?.currentTransactions?.summary || {
      totalDebit: 0,
      totalCredit: 0,
      closingBalance: 0,
      openingBalance: 0
    };
  };

  // Get current transactions only for the main list
  const getCurrentTransactions = () => {
    return projectInvoiceReportList?.currentTransactions?.allTransactions || [];
  };

  // Calculate running balance for current transactions
  const calculateRunningBalance = () => {
    const transactions = getCurrentTransactions();
    const openingBalance = getCurrentSummary().openingBalance;
    let balance = openingBalance;

    const transactionsWithBalance = transactions.map(item => {
      if (item.invoiceType === "credit") {
        balance += Number(item.amountPaid || 0);
      } else {
        balance -= Number(item.finalWithGSTAmount || 0);
      }
      return { ...item, balance };
    });

    return {
      openingBalance,
      transactions: transactionsWithBalance,
      closingBalance: balance
    };
  };

  const { openingBalance, transactions, closingBalance } = calculateRunningBalance();
  const previousSummary = getPreviousSummary();
  const currentSummary = getCurrentSummary();




  return (
    <GlobalLayout onChange={onChange}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-6">
          <div></div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/project-invoice/create?element=${encrypt(JSON.stringify(parentdata))}`)}
              className="bg-rose-700 hover:bg-rose-800 transition-colors py-2 px-4 rounded-md flex items-center text-sm font-medium text-white"
            >
              Create Invoice
            </button>
            <button
              onClick={() => setPaymentModalVisible({
                isOpen: true,
                data: parentdata,
                refrensedata : null
              })}
              className="bg-green-600 hover:bg-green-700 transition-colors py-2 px-4 rounded-md flex items-center text-sm font-medium text-white"
            >
              <FaMoneyBillWave className="mr-2" />
              Receive Payment
            </button>
          </div>
        </div>
        <div className="py-3 bg-white rounded-lg shadow px-3 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous Period Summary */}
            <div className="border rounded-lg p-4 relative">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium">Previous Period Summary</h3>
                <button
                  onClick={() => setPreviousTransactionsModalVisible(true)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Previous Transactions"
                >
                  <FaInfoCircle size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Opening Balance</p>
                  <p className="text-lg font-semibold">{previousSummary.openingBalance.toLocaleString('en-IN')}</p>
                </div> */}
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="text-lg font-semibold text-red-600">{previousSummary.totalDebit.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Received</p>
                  <p className="text-lg font-semibold text-green-600">{previousSummary.totalCredit.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Closing Balance</p>
                  <p className={`text-lg font-semibold ${previousSummary.closingBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {previousSummary.closingBalance.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Period Summary */}
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium mb-2">Current Period Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-600">Opening Balance</p>
                  <p className={`text-lg font-semibold ${currentSummary.openingBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>{currentSummary.openingBalance.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-600">Total Invoices</p>
                  <p className="text-lg font-semibold text-red-600">{currentSummary.totalDebit.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-600">Total Received</p>
                  <p className="text-lg font-semibold text-green-600">{currentSummary.totalCredit.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-600">Closing Balance</p>
                  <p className={`text-lg font-semibold ${currentSummary.closingBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(currentSummary.closingBalance).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Date Filters */}
        <div className="sm:flex justify-between items-center py-3 bg-gray-100 rounded-lg shadow px-4 mb-4">
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1.5">
            <div>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    report={true}
                    defaultValue={dayjs().subtract(1, "month")}
                    size={"middle"}
                    field={field}
                    errors={errors}
                    allowClear={false}
                    placeholder="Select Start Date"
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    report={true}
                    defaultValue={dayjs()}
                    size={"middle"}
                    field={field}
                    errors={errors}
                    allowClear={false}
                    placeholder="Select End Date"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => {
                setValue("startDate", dayjs().subtract(1, "month"));
                setValue("endDate", dayjs());
                setSearchText("");
              }}
              className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-md flex items-center text-sm text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Current Transactions Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden" ref={tableRef}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr className="text-left text-sm font-medium">
                  <th className="p-3 w-[5%]">#</th>
                  <th className="p-3 w-[15%]">Date</th>
                  <th className="p-3 w-[20%]">Reference</th>
                  <th className="p-3 w-[15%]">Description</th>
                  {/* <th className="p-3 w-[15%] text-center">Status</th> */}
                  <th className="p-3 w-[15%] text-right">Amount</th>
                  <th className="p-3 w-[15%] text-right">Balance</th>
                  <th className="p-3 w-[15%] text-center">Actions</th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="p-6 text-center">
                      <Loader2 />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-gray-200">
                  {/* Opening Balance Row */}
                  <tr className="bg-blue-50">
                    <td className="p-3 text-sm font-medium text-gray-700">-</td>
                    <td className="p-3 text-sm font-medium text-gray-700">
                      -
                    </td>
                    <td className="p-3">
                      <Tag color="blue">OPENING BALANCE</Tag>
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-700">
                      Balance brought forward
                    </td>
                    {/* <td className="p-3 text-sm text-center font-medium">-</td> */}
                    <td className="p-3 text-sm text-right font-medium">-</td>
                    <td className="p-3 text-sm text-right font-medium">
                      <span className={openingBalance <= 0 ? "text-red-600" : "text-green-600"}>
                        {Math.abs(openingBalance).toLocaleString('en-IN')}
                        <span className="text-xs ml-1">{openingBalance <= 0 ? '(Due)' : '(Adv)'}</span>
                      </span>
                    </td>
                    <td className="p-3 text-center">-</td>
                  </tr>

                  {/* Transactions */}
                  {transactions.length > 0 ? (
                    transactions.map((element, index) => (
                      <tr
                        key={element._id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                        <td className="p-3 text-sm text-gray-700">
                          {element?.invoiceType === "credit" ? dayjs(element.paymentDate).format('DD-MM-YYYY') : element?.invoiceDate ? dayjs(element.invoiceDate).format('DD-MM-YYYY') : "-"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {element?.invoiceType === "credit" ? (
                              <Tag color="green" className="mr-2">CREDIT</Tag>
                            ) : (
                              <Tag color="red" className="mr-2">INVOICE</Tag>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {element?.invoiceNumber ?? "-"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {element?.invoiceType === "credit"
                            ? element?.remark || "Payment Received"
                            : "Project Invoice"}
                        </td>
                        {/* <td className="p-3 text-sm text-gray-700 text-center">
                          {element?.status || "-"}
                        </td> */}
                        <td className="p-3 text-sm text-right font-medium">
                          <span className={element?.invoiceType === "credit" ? "text-green-600" : "text-red-600"}>
                            {element?.invoiceType === "credit"
                              ? `+ ${Number(element?.amountPaid || 0).toLocaleString('en-IN')}`
                              : `- ${Number(element?.finalWithGSTAmount || 0).toLocaleString('en-IN')}`}
                          </span>
                        </td>

                        <td className="p-3 text-sm text-right font-medium">
                          <span className={element.balance <= 0 ? "text-red-600" : "text-green-600"}>
                            {Math.abs(element.balance).toLocaleString('en-IN')}
                            <span className="text-xs ml-1">{element.balance <= 0 ? '(Due)' : '(Adv)'}</span>
                          </span>
                        </td>
                        <td className="p-3 text-center">
                         <div className="flex justify-center items-center gap-2">
                         <button
                            onClick={() => navigate(`/admin/project-invoice/view/${encrypt(JSON.stringify(element))}`)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md bg-gray-100 hover:bg-gray-200"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                        {/* { element?.invoiceType === "debit" && <button
                            onClick={() => setPaymentModalVisible({
                              isOpen: true,
                              data: parentdata,
                              refrensedata : element
                            })}
                            disabled={element?.invoiceType === "credit" || element?.status === "Paid"}
                            className="p-2 text-cyan-600 hover:text-cyan-800 transition-colors rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500"
                            title="Delete"
                          >
                            <BiMoney size={16} />
                          </button>} */}
                         </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-sm text-gray-500">
                        No transactions found for the current period
                      </td>
                    </tr>
                  )}

                  {/* Closing Balance Row */}
                  {transactions.length > 0 && (
                    <tr className="bg-blue-50">
                      <td className="p-3 text-sm font-medium text-gray-700">-</td>
                      <td className="p-3 text-sm font-medium text-gray-700">
                        {endDate.format('DD-MM-YYYY')}
                      </td>
                      <td className="p-3">
                        <Tag color="blue">CLOSING BALANCE</Tag>
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-700">
                        Balance carried forward
                      </td>
                      {/* <td className="p-3 text-sm text-center font-medium">-</td> */}
                      <td className="p-3 text-sm text-right font-medium">-</td>
                      <td className="p-3 text-sm text-right font-medium">
                        <span className={closingBalance <= 0 ? "text-red-600" : "text-green-600"}>
                          {Math.abs(closingBalance).toLocaleString('en-IN')}
                          <span className="text-xs ml-1">{closingBalance <= 0 ? '(Due)' : '(Adv)'}</span>
                        </span>
                      </td>
                      <td className="p-3 text-center">-</td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Payment Entry Modal */}
      {paymentModalVisible.isOpen && (
        <PaymentEntryModal
          visible={paymentModalVisible.isOpen}
          onCancel={() => setPaymentModalVisible({ isOpen: false, data: null , refrensedata : null })}
          parentdata={parentdata}
          refrensedata={paymentModalVisible.refrensedata}
          fetchprojectInvoice={fetchprojectInvoice}
        />
      )}

      {/* Previous Transactions Modal */}
      <Modal
        title="Previous Period Transactions"
        width={1000}
        visible={previousTransactionsModalVisible}
        onCancel={() => setPreviousTransactionsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviousTransactionsModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Summary</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-lg font-semibold text-red-600">{previousSummary.totalDebit.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600">Total Received</p>
              <p className="text-lg font-semibold text-green-600">{previousSummary.totalCredit.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600">Closing Balance</p>
              <p className={`text-lg font-semibold ${previousSummary.closingBalance <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(previousSummary.closingBalance).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-medium">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Reference</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projectInvoiceReportList?.previousTransactions?.allTransactions?.length > 0 ? (
                projectInvoiceReportList.previousTransactions.allTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="p-3 text-sm">
                      {transaction.filterDate
                        ? dayjs(transaction.filterDate).format('DD-MM-YYYY')
                        : '-'}
                    </td>
                    <td className="p-3">
                      {transaction.invoiceType === 'credit' ? (
                        <Tag color="green">CREDIT</Tag>
                      ) : (
                        <Tag color="red">INVOICE</Tag>
                      )}
                    </td>
                    <td className="p-3 text-sm">{transaction.invoiceNumber || '-'}</td>
                    <td className="p-3 text-sm text-right">
                      <span className={transaction.invoiceType === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.invoiceType === 'credit'
                          ? `+ ${Number(transaction.amountPaid || 0).toLocaleString('en-IN')}`
                          : `- ${Number(transaction.finalWithGSTAmount || 0).toLocaleString('en-IN')}`}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-sm text-gray-500">
                    No transactions found in the previous period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </GlobalLayout>
  );
}

export default ProjectInvoicingList;