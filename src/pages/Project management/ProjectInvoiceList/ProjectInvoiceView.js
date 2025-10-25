import { useParams } from "react-router-dom";
import { getprojectInvoiceDetails } from "./ProjectInvoiceFeatures/_ProjectInvoice_reducers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { decrypt } from "../../../config/Encryption";
import { format } from "date-fns";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ProjectInvoiceView = () => {
  const { projectInvoiceIdEnc } = useParams();
  const parentdata = JSON.parse(decrypt(projectInvoiceIdEnc));
  const printRef = useRef();

  const dispatch = useDispatch();
  const { projectInvoiceDetailsData: projectInvoiceDetailsDatafromReducer, loading } = useSelector((state) => state.projectInvoice);
  const projectInvoiceDetailsData = projectInvoiceDetailsDatafromReducer?.result;
  
  useEffect(() => {
    dispatch(getprojectInvoiceDetails({
      _id: parentdata._id,
    }))
  }, []);
console.log(parentdata ,projectInvoiceDetailsData)
  const handlePrint = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceNumber}.pdf`);
  };

  if (loading || !projectInvoiceDetailsData) {
    return <GlobalLayout><Loader2 /></GlobalLayout>;
  }

  const {
    invoiceType,
    invoiceNumber,
    invoiceDate,
    paymentDate,
    subTotal,
    GSTTotal,
    finalWithGSTAmount,
    amountPaid,
    balanceDue,

    gstRate,
    items,
    paymentMethod,
    paymentReference,
    remark,
    terms,
    projectData,
    clientData,
    branchData,
    companyName,
    accountentData,
    gstNumber
  } = projectInvoiceDetailsData;
const   isGSTApplicable=true
  // Format dates
  const formattedInvoiceDate = invoiceDate ? format(new Date(invoiceDate), 'dd MMM yyyy') : '';
  const formattedPaymentDate = paymentDate ? format(new Date(paymentDate), 'dd MMM yyyy') : '';

  // Calculate GST breakdown
  const gstBreakdown = {};
  if (isGSTApplicable && items) {
    items.forEach(item => {
      if (!gstBreakdown[item.GSTRate]) {
        gstBreakdown[item.GSTRate] = {
          taxableValue: 0,
          gstAmount: 0
        };
      }
      gstBreakdown[item.GSTRate].taxableValue += item.amount;
      gstBreakdown[item.GSTRate].gstAmount += item.GSTAmount;
    });
  }
  const {
    previousBalance = 0,
    currentBalance = 0,
    balance = 0,
    amountPaid: parentAmountPaid = 0
  } = parentdata;
  // Render invoice view for debit type
  if (invoiceType === 'debit') {
    return (
      <GlobalLayout>
        <div className="flex justify-end mb-2">
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
            className="print-button"
          >
            Print/Download
          </Button>
        </div>
        
        <div ref={printRef} className="p-6  mx-auto bg-white shadow rounded border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{companyName}</h1>
              <p className="text-sm text-gray-600">{branchData?.addresses?.primary?.street}</p>
              <p className="text-sm text-gray-600">{branchData?.addresses?.primary?.city}, {branchData?.addresses?.primary?.state} - {branchData?.addresses?.primary?.pinCode}</p>
              {gstNumber && <p className="text-sm text-gray-600">GSTIN: {gstNumber}</p>}
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-blue-600">TAX INVOICE</h2>
              <p className="text-sm text-gray-700">Invoice #: {invoiceNumber}</p>
              <p className="text-sm text-gray-700">Date: {formattedInvoiceDate}</p>
            </div>
          </div>

          {/* Bill To and Project Info */}
          <div className="flex justify-between mb-6">
            <div className="w-1/2 pr-2">
              <h3 className="font-semibold text-gray-700 mb-1">Bill To:</h3>
              <p className="text-gray-800">{clientData?.fullName}</p>
              <p className="text-xs text-gray-600">{clientData?.addresses?.primary?.street}</p>
              <p className="text-xs text-gray-600">{clientData?.addresses?.primary?.city}, {clientData?.addresses?.primary?.state} - {clientData?.addresses?.primary?.pinCode}</p>
              {clientData?.mobile?.number && (
                <p className="text-xs text-gray-600">Phone: {clientData?.mobile?.code} {clientData?.mobile?.number}</p>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="font-semibold text-gray-700 mb-1">Project:</h3>
              <p className="text-gray-800">{projectData?.title}</p>
              <p className="text-xs text-gray-600">Code: {projectData?.projectCode}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border">#</th>
                  <th className="p-2 text-left border">Description</th>
                  <th className="p-2 text-right border">Amount (₹)</th>
                  {isGSTApplicable && (
                    <>
                      <th className="p-2 text-right border">GST Rate (%)</th>
                      <th className="p-2 text-right border">GST (₹)</th>
                    </>
                  )}
                  <th className="p-2 text-right border">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">
                      <p className="font-medium">{item.name}</p>
                      {item.remark && <p className="text-xs text-gray-500">{item.remark}</p>}
                    </td>
                    <td className="p-2 border text-right">{item.amount.toFixed(2)}</td>
                    {isGSTApplicable && (
                      <>
                        <td className="p-2 border text-right">{item.GSTRate}%</td>
                        <td className="p-2 border text-right">{item.GSTAmount.toFixed(2)}</td>
                      </>
                    )}
                    <td className="p-2 border text-right font-medium">{item.amountAfterGST.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GST Breakdown */}
          {isGSTApplicable && (
            <div className="mb-4 ml-auto w-64">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {Object.entries(gstBreakdown).map(([rate, values]) => (
                    <tr key={rate} className="border-b">
                      <td className="p-1 text-right border">GST @ {rate}% on ₹{values.taxableValue.toFixed(2)}</td>
                      <td className="p-1 text-right border font-medium">₹{values.gstAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="flex justify-end mb-4">
            <div className="w-64 border-t">
              <div className="flex justify-between py-1">
                <span className="font-medium">Subtotal:</span>
                <span>₹{subTotal?.toFixed(2)}</span>
              </div>
              {isGSTApplicable && (
                <div className="flex justify-between py-1">
                  <span className="font-medium">GST Total:</span>
                  <span>₹{GSTTotal?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t font-semibold">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{finalWithGSTAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mb-4 border p-3 rounded bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-2">Balance Information</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="border-r pr-4">
                <p className="text-gray-600">Previous Balance</p>
                <p className={`font-medium ${previousBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(previousBalance).toFixed(2)} {previousBalance < 0 ? '(Dr)' : '(Cr)'}
                </p>
              </div>
              <div className="border-r pr-4">
                <p className="text-gray-600">Invoice Amount</p>
                <p className="font-medium text-blue-600">₹{finalWithGSTAmount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount To Be Paid</p>
                <p className={`font-medium ${currentBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(currentBalance).toFixed(2)} {currentBalance < 0 ? '(Dr)' : '(Cr)'}
                </p>
              </div>
            </div>
          </div>


          

          {/* Footer */}
          <div className="pt-4 border-t flex justify-between">
            <div className="text-center w-1/3">
              <p className="text-xs font-medium text-gray-700 mb-1">Customer Signature</p>
              <div className="h-12 border-t mt-1"></div>
            </div>
            <div className="text-center w-1/3">
              <p className="text-xs text-gray-500">Thank you for your business!</p>
            </div>
            <div className="text-center w-1/3">
              <p className="text-xs font-medium text-gray-700 mb-1">Authorized Signatory</p>
              <div className="h-12 border-t mt-1"></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media print {
            .print-button {
              display: none;
            }
          }
        `}</style>
      </GlobalLayout>
    );
  }

  // Render receipt view for credit type
  return (
    <GlobalLayout>
      <div className="flex justify-end mb-4">
        <Button 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={handlePrint}
          className="print-button"
        >
          Print/Download
        </Button>
      </div>
      
      <div ref={printRef} className="p-6  mx-auto bg-white shadow rounded border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{companyName}</h1>
            <p className="text-sm text-gray-600">{branchData?.addresses?.primary?.street}</p>
            <p className="text-sm text-gray-600">{branchData?.addresses?.primary?.city}, {branchData?.addresses?.primary?.state} - {branchData?.addresses?.primary?.pinCode}</p>
            {gstNumber && <p className="text-sm text-gray-600">GSTIN: {gstNumber}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-green-600">PAYMENT RECEIPT</h2>
            <p className="text-sm text-gray-700">Receipt #: {invoiceNumber}</p>
            <p className="text-sm text-gray-700">Date: {formattedPaymentDate}</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <h3 className="font-semibold text-gray-700 mb-1">Received From:</h3>
              <p className="text-gray-800">{clientData?.fullName || 'N/A'}</p>
              {clientData?.addresses?.primary?.street && (
                <p className="text-xs text-gray-600">{clientData.addresses.primary.street}</p>
              )}
              {clientData?.addresses?.primary?.city && (
                <p className="text-xs text-gray-600">{clientData.addresses.primary.city}, {clientData.addresses.primary.state}</p>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="font-semibold text-gray-700 mb-1">Project:</h3>
              <p className="text-gray-800">{projectData?.title}</p>
              <p className="text-xs text-gray-600">Code: {projectData?.projectCode}</p>
            </div>
          </div>

          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3 text-center">Payment Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Amount Received</p>
                <p className="font-bold text-green-600">₹{amountPaid?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{paymentMethod || 'N/A'}</p>
              </div>
              {paymentReference && (
                <div>
                  <p className="text-gray-600">Reference Number</p>
                  <p className="font-medium">{paymentReference}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Payment Date</p>
                <p className="font-medium">{formattedPaymentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accountant Info */}
        {accountentData && (
          <div className="mb-4 border p-3 rounded bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-1">Received By:</h3>
            <p className="text-gray-800">{accountentData?.fullName}</p>
            {accountentData?.email && <p className="text-xs text-gray-600">{accountentData?.email}</p>}
          </div>
        )}

        {/* Add Balance Information Section */}
        <div className="mb-4 border p-3 rounded bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-2">Balance Information</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="border-r pr-4">
              <p className="text-gray-600">Previous Balance</p>
              <p className={`font-medium ${previousBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{Math.abs(previousBalance).toFixed(2)} {previousBalance < 0 ? '(Dr)' : '(Cr)'}
              </p>
            </div>
            <div className="border-r pr-4">
              <p className="text-gray-600">Amount Received</p>
              <p className="font-medium text-green-600">₹{parentAmountPaid?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Outstanding</p>
              <p className={`font-medium ${currentBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{Math.abs(currentBalance).toFixed(2)} {currentBalance < 0 ? '(Dr)' : '(Cr)'}
              </p>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="pt-4 border-t flex justify-between">
          <div className="text-center w-1/3">
            <p className="text-xs font-medium text-gray-700 mb-1">Customer Signature</p>
            <div className="h-12 border-t mt-1"></div>
          </div>
          <div className="text-center w-1/3">
            <p className="text-xs text-gray-500">Thank you for your payment!</p>
          </div>
          <div className="text-center w-1/3">
            <p className="text-xs font-medium text-gray-700 mb-1">Authorized Signatory</p>
            <div className="h-12 border-t mt-1"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .print-button {
            display: none;
          }
        }
      `}</style>
    </GlobalLayout>
  );
};

export default ProjectInvoiceView;