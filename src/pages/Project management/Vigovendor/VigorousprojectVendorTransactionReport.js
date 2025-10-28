import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getvendorFundOrPurchaseReport } from "./VigovendorFeatures/_vigo_vendor_reducers";
import { useParams } from "react-router-dom";
import { decrypt } from "../../../config/Encryption";
import { domainName } from "../../../constents/global";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from 'exceljs';
import autoTable from "jspdf-autotable";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";

const VigorousprojectVendorTransactionReport = () => {
    const dispatch = useDispatch();
    const param = useParams();
    const { vendorIdEnc } = param;
    const vendorId = decrypt(vendorIdEnc);
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const { vendorFundPurchaseDataList, vendorFundPurchaseDataCount, loading } = useSelector(state => state.vigoVendor);
    const tableRef = useRef();

    useEffect(() => {
        dispatch(getvendorFundOrPurchaseReport({
            companyId: userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
            branchId: userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
            "directorId": "",
            vendorId: vendorId,
            "text": "",
            "sort": true,
            "status": "",
            "isPagination": false
        }));
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format amount with currency
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Get reference type label
    const getReferenceLabel = (reference) => {
        const referenceMap = {
            'purchaseExpense': 'Purchase Expense',
            'fundTransfer': 'Fund Transfer'
        };
        return referenceMap[reference] || reference;
    };

    // Export to PDF
    const exportToPDF = () => {
      const doc = new jsPDF({
          orientation: "landscape",
          unit: "pt",
        });

     

        // Table
        autoTable(doc,{
            startY: 35,
            head: [['Date', 'Reference', 'Amount',  'Created By']],
            body: vendorFundPurchaseDataList?.map(item => [
                formatDate(item.date),
                getReferenceLabel(item.referanceBy),
                Number(item.amount).toFixed(2),
         
                item.createdBy
            ]),

            margin: { horizontal: 10 },
            styles: {
                cellPadding: 8,
                fontSize: 10,
                valign: "middle",
                halign: "left",
            },
            headStyles: {
                fillColor: [211, 211, 211],
                textColor: [0, 0, 0],
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });

        // Total amount
        const totalAmount = vendorFundPurchaseDataList?.reduce((sum, item) => sum + item.amount, 0);
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(`Total Amount: ${Number(totalAmount).toFixed(2)}`, 14, finalY);

        doc.save(`vendor-transactions-${vendorId}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Export to Excel
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Vendor Transactions');

        // Add title
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = 'Vendor Transaction Report';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        // Add generation date
        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `Generated on: ${new Date().toLocaleDateString()}`;
        worksheet.getCell('A2').font = { size: 10, color: { argb: 'FF666666' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Add vendor info
        worksheet.getCell('A3').value = `Vendor ID: ${vendorId}`;
        worksheet.getCell('A3').font = { size: 10, color: { argb: 'FF666666' } };

        // Add headers
        const headers = ['Date', 'Reference', 'Amount',  'Created By', 'Created Date'];
        worksheet.addRow(headers);

        // Style headers
        const headerRow = worksheet.getRow(5);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2980B9' }
        };
        headerRow.alignment = { horizontal: 'center' };

        // Add data rows
        vendorFundPurchaseDataList?.forEach(item => {
            worksheet.addRow([
                formatDate(item.date),
                getReferenceLabel(item.referanceBy),
                item.amount,
                item.createdBy,
                formatDate(item.createdAt)
            ]);
        });

        // Format columns
        worksheet.columns = [
            { width: 15 }, // Date
            { width: 20 }, // Reference
            { width: 15 }, // Amount
            { width: 30 }, // Transaction ID
            { width: 20 }, // Created By
            { width: 15 }  // Created Date
        ];

        // Format amount column
        const amountColumn = worksheet.getColumn(3);
        amountColumn.numFmt = '$#,##0.00';

        // Add total row
        const totalAmount = vendorFundPurchaseDataList?.reduce((sum, item) => sum + item.amount, 0);
        const totalRow = worksheet.addRow(['', 'Total:', totalAmount, '', '', '']);
        totalRow.font = { bold: true };
        totalRow.getCell(3).numFmt = '$#,##0.00';

        // Generate and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vendor-transactions-${vendorId}-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Calculate totals
    const totalAmount = vendorFundPurchaseDataList?.reduce((sum, item) => sum + item.amount, 0);
    const purchaseExpenseTotal = vendorFundPurchaseDataList?.filter(item => item.referanceBy === 'purchaseExpense')
        .reduce((sum, item) => sum + item.amount, 0);
    const fundTransferTotal = vendorFundPurchaseDataList
        ?.filter(item => item.referanceBy === 'fundTransfer')
        .reduce((sum, item) => sum + item.amount, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <GlobalLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                                    <p className="text-2xl font-semibold text-gray-900">{vendorFundPurchaseDataList?.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-semibold text-gray-900">{formatAmount(totalAmount)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Breakdown</p>
                                    <p className="text-sm text-gray-900">
                                        Purchase: {formatAmount(purchaseExpenseTotal)} |
                                        Transfer: {formatAmount(fundTransferTotal)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="mb-6 flex flex-wrap gap-3">
                        <button
                            onClick={exportToPDF}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Excel
                        </button>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reference
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {vendorFundPurchaseDataList?.map((transaction) => (
                                        <tr key={transaction._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.referanceBy === 'purchaseExpense'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {getReferenceLabel(transaction.referanceBy)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatAmount(transaction.amount)}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.createdBy}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {vendorFundPurchaseDataList?.length > 0 && (
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                                Total:
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                {formatAmount(totalAmount)}
                                            </td>
                                            <td colSpan="2"></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        {vendorFundPurchaseDataList?.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                                <p className="mt-1 text-sm text-gray-500">No transactions found for this vendor.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default VigorousprojectVendorTransactionReport;