import { Modal } from 'antd';
import dayjs from 'dayjs';
import React from 'react'
import { convertIntoAmount, formatNumber } from '../../../../constents/global';
import OpeningBalanceViewer from './OpeningBalanceViewer';

const BalanceSheetModal = ({isOpen , onClose , alldata,keys}) => {
 
    
  return (
    <div>
        <Modal
     visible={isOpen}
      onCancel={() => {
       onClose();
      }}
      footer={null}
    //   title={`Discount Given - ₹ ${(alldata?.discountGivenAmount ?? 0).toFixed(2) }`}
      width={1000}
      height={400}
      className="antmodalclassName"
    >

{(keys === "assetsAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Assets Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Amount</th>
        {/* <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">updatedAt</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">createdAt</th>        */}
      </tr>
    </thead>
    <tbody>

    {alldata?.balanceSheetReportList?.assetListData?.assetPaidData?.map((element, index) => (
  <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
    <td className="px-6 py-2 whitespace-nowrap">{element?.name}</td>
    <td className="px-6 py-2 whitespace-nowrap font-medium">{convertIntoAmount(element?.totalAmount)}</td>
    {/* <td className="px-6 py-2 whitespace-nowrap">{dayjs    (element?.updatedAt).format("YYYY-MM-DD hh:mm a")}</td>
    <td className="px-6 py-2 whitespace-nowrap">{dayjs(element?.createdAt).format("YYYY-MM-DD hh:mm a")}</td> */}
  </tr>
))}  
    </tbody>
  </table>
</div>


}


{(keys === "SundryDebtorAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Client Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Closing Balance</th>
            
      </tr>
    </thead>
    <tbody>

    {alldata?.balanceSheetReportList?.assetListData?.clientClosingBalance?.map((element, index) => (
  <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
    <td className="px-6 py-2 whitespace-nowrap">{element?.fullName}</td>
    <td className="px-6 py-2 whitespace-nowrap font-medium">{convertIntoAmount(element?.closingBalance)}</td>
    
  </tr>
))}  
    </tbody>
  </table>
</div>


}


{(keys === "bankAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Bank Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Branch Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Bank Holder Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Account Type</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Account Number</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Closing Balance</th>
            
      </tr>
    </thead>
    <tbody>

    {alldata?.balanceSheetReportList?.assetListData?.bankClosingBalances?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{element?.bankName}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{element?.branchName}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{element?.bankholderName}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{element?.accountType}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{element?.accountNumber}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{convertIntoAmount(element?.closingBalance)}</td>
            
        </tr>
))}  
    </tbody>
  </table>
</div>


}


{(keys === "CashBookAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto mb-2 mt-2">
   
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Employee Name</th>  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Email</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Mobile</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Paid Amount</th>
         
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.assetListData?.employeCashBookPaidBalance?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.fullName||'-'}`}</td> 
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.email||'-'}`}</td> 
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.mobile?.code||'-'}`} {element?.mobile?.number||'-'}</td> 
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.summary?.closingBalance)}`}</td>         

                        
        </tr>
))}  
    </tbody>
  </table>
</div>

}
{(keys === "receiptTDSAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Receipt Number</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Receipt Date</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Amount</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">updatedAt</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">createdAt</th>  
      </tr>
    </thead>
    <tbody>

    {alldata?.balanceSheetReportList?.assetListData?.receiptTDSData?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{`Reciept ${element?.receiptNumber}`}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{dayjs(element?.date).format("YYYY-MM-DD hh:mm a")}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{convertIntoAmount(element?.amount)}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{dayjs(element?.updatedAt).format("YYYY-MM-DD hh:mm a")}</td>
            <td className="px-6 py-2 whitespace-nowrap font-medium">{dayjs(element?.createdAt).format("YYYY-MM-DD hh:mm a")}</td>
        </tr>
))}  
    </tbody>
  </table>
</div>


}

{(keys === "vendorAdvanceAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Full Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Email</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Mobile</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deduction Count</th>  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deduction Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit Count</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit PaidCount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit PaidAmount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit PaidAmount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit PaidAmount</th>       
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.assetListData?.vendorAdvanceAvailable?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.fullName}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.email}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.mobile?.code} ${element?.mobile?.number}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.totalDeductionCount}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalDeductionAmount)}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.totalDepositCount}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalDepositAmount)}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.totalDepositPaidCount}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalDepositPaidAmount)}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.totalDepositPendingCount}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalDepositPendingAmount)}`}</td>            
        </tr>
))}  
    </tbody>
  </table>
</div>


}




{(keys === "ClientAdvanceReceiptAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Group Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Group User Name</th>

        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deduction Count</th>  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deduction Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit Count</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Deposit Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Available Balance</th>       
         
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.liabilityListData?.ClientAdvanceReceiptData?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.groupName}`}</td> 
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.groupUserName}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.totalDeductionCount}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalDeductionAmount)}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.totalDepositCount}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalDepositAmount)}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.availableBalance}`}</td>                 
        </tr>
))}  
    </tbody>
  </table>
</div>


}

{(keys === "FinalGSTAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto mb-2 mt-2">
    <div className='text-[14px] font-semibold m-2'>Invoice GST Details</div>
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Invoice Layout Name</th>
  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total GST Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Invoice Amount</th>       
       
         
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.liabilityListData?.GST?.invoiceGSTData?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.invoiceLayoutName}`}</td> 
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalGSTAmount)}`}</td>         
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalInvoiceAmount)}`}</td>
                        
        </tr>
))}  
    </tbody>
  </table>
</div>


}
{(keys === "TDSpayableAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto mb-2 mt-2">
    <div className='text-[14px] font-semibold m-2'>TDS Payable Details</div>
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">TDS Amount</th>
  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Date</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Created AT</th>       
       
         
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.liabilityListData?.TDSpayableData?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">           
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.TDSAmount) }`}</td>         
            <td className="px-6 py-2 whitespace-nowrap">{` ${element?.date ?  dayjs(element?.date).format("YYYY-MM-DD hh:mm a") :'-'}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.createdAt ? dayjs(element?.createdAt).format("YYYY-MM-DD hh:mm a"):"-"}`}</td>                        
        </tr>
))}
</tbody>
  </table>
</div>


}

{(keys === "FinalGSTAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg ">
<div className='text-[14px] font-semibold m-2'>Purchase  Asset GST Details</div>
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
    
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold"> Asset Name</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">purchaseType</th>
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">purchaseDate</th>  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total GST Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Total Amount</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Grand Total</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Updated At</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Created At</th>       
         
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.liabilityListData?.GST?.purchaseAssetGSTData?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.assetName  || "-"}`}</td> 
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.purchaseType || "-"}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${dayjs(element?.purchaseDate).format("YYYY-MM-DD hh:mm a") || "-"}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalGSTAmount || "-")}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.totalAmount || "-")}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.grandTotal || "-")}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${dayjs(element?.updatedAt).format("YYYY-MM-DD hh:mm a") || "-"}`}</td>                 
            <td className="px-6 py-2 whitespace-nowrap">{`${dayjs(element?.createdAt).format("YYYY-MM-DD hh:mm a") || "-"}`}</td>                 
        </tr>
))}  
    </tbody>
  </table>
</div>
</div>


}









{(keys === "duePaymentAmount") && 
<div className="font-sans max-w-4xl mx-auto shadow-md rounded-lg overflow-auto">
    
  <table className="w-full">
    <thead>
      <tr className="bg-white border-b-2">       
     
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Purchase Type</th>
        {/* <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Payment Mode</th>  
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Bank Acc Id</th>       
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Date</th>        */}
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Amount</th> 
        {/* <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">Status</th>        */}
        {/* <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">UpdatedAt</th>        */}
        <th className="px-6 py-2 whitespace-nowrap  text-left font-semibold">CreatedAt</th>       
         
      </tr>
    </thead>
    <tbody>

    {
    alldata?.balanceSheetReportList?.liabilityListData?.duePaymentData?.map((element, index) => (
        <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50">
          <td className="px-6 py-2 whitespace-nowrap">{`${element?.type || '-'}`}</td> 
            {/* 
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.paymentMode || '-'}`}</td>
            <td className="px-6 py-2 whitespace-nowrap">{`${element?.bankAccId || '-'}`}</td> */}
            {/* <td className="px-6 py-2 whitespace-nowrap">{`${dayjs(element?.date).format("YYYY-MM-DD hh:mm a")}`}</td> */}
            <td className="px-6 py-2 whitespace-nowrap">{`${convertIntoAmount(element?.amount)}`}</td>
            {/* <td className="px-6 py-2 whitespace-nowrap">{`${element?.status || '-'}`}</td>          */}
            {/* <td className="px-6 py-2 whitespace-nowrap">{`${dayjs(element?.updatedAt).format("YYYY-MM-DD hh:mm a")}`}</td>                  */}
            <td className="px-6 py-2 whitespace-nowrap">{`${dayjs(element?.createdAt).format("YYYY-MM-DD hh:mm a")}`}</td>                 
        </tr>
))}  
    </tbody>
  </table>
</div>


}
    {(keys === "capitalBalance") && 
    <OpeningBalanceViewer data={alldata?.balanceSheetReportList?.liabilityListData?.openingBalanceList} lastYearProfitLoss={alldata?.liabilitySummery?.lastYearProfitAndLoss}/>
    }
    </Modal>
    </div>
  )
}

export default BalanceSheetModal