import { useSearchParams } from "react-router-dom";
import { decrypt, decryptObject, encrypt } from "../../../../config/Encryption";
import moment from "moment";
import { ToWords } from "to-words";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";

const PayslipViewr = () => {
    const [searchParams] = useSearchParams();
    const payrollDetailsData = decryptObject(searchParams.get('payrollDetailsData'));
    const allowances = decryptObject(searchParams.get('allowances')) || [];
    const deductions = decryptObject(searchParams.get('deductions')) || [];
    const penalty = decryptObject(searchParams.get('penalty')) || [];
    const totalAllowanceAmount = allowances?.reduce((acc, allowance) => acc + (allowance.calculatedData || 0), 0);
    const totalDeductionAmount = deductions?.reduce((acc, deduction) => acc + (deduction.calculatedData || 0), 0);
    const totalPenalty = decrypt(searchParams.get('totalPenalty')) || 0;
    const updatedNetSalary = decrypt(searchParams.get('updatedNetSalary')) || 0;

    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
            currency: true,
            ignoreDecimal: true,
            currencyOptions: {
                name: 'Rupee',
                plural: 'Rupees',
                symbol: '₹',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paise',
                    symbol: '',
                },
            },
        },
    });

    const SalaryInWords = ({ amount }) => {
        const fixedAmount = Number(amount)?.toFixed(2);
        const numericValue = parseFloat(fixedAmount);
        if (isNaN(numericValue)) return <>Invalid salary</>;
        const words = toWords.convert(numericValue);
        return <>{words}</>;
    };


    const handleDownloadPDF = () => {
        const element = document.querySelector('.mainData');

        html2canvas(element, {
            // scale: 1, // Higher quality
            logging: false,
            useCORS: true,
            allowTaint: true,
            scrollY: -window.scrollY
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
            // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`payslip_${payrollDetailsData?.employeData?.fullName || 'employee'}_${moment().format('YYYY-MM-DD')}.pdf`);

            // For automatic printing (may not work in all browsers due to security restrictions)
            // try {
            //     const pdfBlob = pdf.output('blob');
            //     const pdfUrl = URL.createObjectURL(pdfBlob);
            //     const printWindow = window.open(pdfUrl);
            //     printWindow?.print();
            // } catch (e) {
            //     console.log("Auto-print failed, but PDF was saved", e);
            // }
        });
    };
    return (
        <div className="payslip-container">
            <style>
                {`
                    @media screen {
                        .payslip-container {
                            max-width: 100%;
                            padding: 16px;
                        }
                        @media (max-width: 768px) {
                            .grid-cols-3 {
                                grid-template-columns: 1fr;
                                gap: 16px;
                            }
                            .flex.justify-between {
                                flex-direction: column;
                                gap: 16px;
                            }
                        }
                    }
                    
                    @media print {
                        @page {
                            size: A4 portrait;
                            
                        }
                        body, html {
                            width: 100% !important;
                            height: 100% !important;
                            margin: 0 auto !important;
                            padding: 0 !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            background: white;
                            color: black;
                            font-size: 12pt;
                        }
                        .payslip-container {
                            width: 100% !important;
                            margin: 0 auto !important;
                            padding: 0 !important;
                            zoom: 100%;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .print-full-width {
                            width: 100% !important;
                        }
                        .print-grid-cols-3 {
                            display: grid !important;
                            grid-template-columns: repeat(3, 1fr) !important;
                            gap: 12px !important;
                        }
                        .print-flex-row {
                            display: flex !important;
                            flex-direction: row !important;
                            justify-content: space-between !important;
                        }
                        table {
                            page-break-inside: avoid;
                            width: 100% !important;
                        }
                        .avoid-break {
                            page-break-inside: avoid;
                        }
                        img {
                            max-width: 80px !important;
                            max-height: 60px !important;
                        }
                        * {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                `}
            </style>

            <div className="avoid-break mainData">
                <div className="py-2 bg-gray-100">
                    <div className="bg-white p-4 border-[1px] border-gray-300">
                        <div className=''>
                            <div className="print-flex-row py-2 border-b-[1px] border-gray-300 flex justify-between items-center">
                                <div>
                                    <h1 className="text-xl font-semibold mb-2">Payslip</h1>
                                    <p className="text-gray-800">{moment(payrollDetailsData?.startDate)?.format("DD-MM-YYYY")} to {moment(payrollDetailsData?.endDate)?.format("DD-MM-YYYY")}</p>
                                </div>
                                <div>
                                    <div className='flex flex-col justify-end items-center'>
                                        {payrollDetailsData?.branchData?.profileImage && <img className='max-w-[150px] max-h-[100px] rounded-full print-image' alt='' src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${payrollDetailsData?.branchData?.profileImage}`} />}
                                        {payrollDetailsData?.branchData?.fullName && <h3 className="text-sm font-semibold mb-2">{payrollDetailsData?.branchData?.fullName}</h3>}
                                    </div>
                                </div>
                            </div>

                            <div className='print-flex-row md:flex justify-between items-start avoid-break'>
                                <div className="mt-2 print-full-width">
                                    <h2 className="font-semibold text-lg">Employee Details</h2>
                                    <div className="mt-4 text-md space-y-2">
                                        <p>
                                            <span className="font-medium">Employee Name:</span> {payrollDetailsData?.employeData?.fullName || "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium">Department:</span> {payrollDetailsData?.departmentData?.name || "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium">Bank Acc./Cheque No.:</span> {payrollDetailsData?.bankData?.accountNumber || "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium">ESIC number:</span> {payrollDetailsData?.salaryData?.esicNumber || "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium">UAN number:</span> {payrollDetailsData?.salaryData?.uanNumber || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 gap-4 print-full-width">
                                    <div className="p-4 rounded-md border-[1px] border-gray-300 avoid-break">
                                        {payrollDetailsData ? (
                                            <>
                                                <div className="bg-green-100 border-l-4 border-green-600 rounded-xl p-3">
                                                    <h3 className="text-3xl font-semibold text-black">Rs {updatedNetSalary || "0.00"} </h3>
                                                    <p className="text-gray-600">Employee Net Pay</p>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                    <p>Actual Basic Pay: Rs {payrollDetailsData?.basicSalary?.toFixed(2) || "0.00"}</p>
                                                    <p>Total Allowance: Rs {totalAllowanceAmount ? totalAllowanceAmount?.toFixed(2) : "0.00"}</p>
                                                    <p>Total Deduction: Rs {totalDeductionAmount ? totalDeductionAmount?.toFixed(2) : "0.00"}</p>
                                                    {payrollDetailsData?.salaryData?.isPF && <p>PF Deduction : Rs {payrollDetailsData?.pf?.employee?.toFixed(2) || "0.00"}</p>}
                                                    {payrollDetailsData?.salaryData?.isESIC && <p>ESIC Deduction : Rs {payrollDetailsData?.esic?.employee?.toFixed(2) || "0.00"}</p>}
                                                    <p>Paid Days: {payrollDetailsData?.totalAttendance || "0.00"}</p>
                                                    <p>LOP Days: {payrollDetailsData?.totalLeave || "0.00"}</p>
                                                    <p className="text-blue-400 text-[11px]">The payslip is calculated based on the updated basic pay</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-gray-600">No data available</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="print-grid-cols-3 grid grid-cols-1 md:grid-cols-3  gap-5 mt-8 text-sm avoid-break">
                                <div className="print-full-width">
                                    <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                                        <table className="w-full max-w-full overflow-x-auto">
                                            <thead>
                                                <tr className='text-sm'>
                                                    <th className="border-b py-2 text-left w-[50%]">Allowances</th>
                                                    <th className="border-b py-2 text-right w-[50%]">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allowances?.length > 0 && allowances?.map((allowance, index) => (
                                                    <tr key={`new-${index}`}>
                                                        <td className="py-2">{allowance?.name || "N/A"}</td>
                                                        <td className="py-2 text-right">{Number(allowance?.calculatedData).toFixed(2) || "N/A"}</td>
                                                    </tr>
                                                ))}

                                                {!allowances.length && (
                                                    <tr className="bg-white bg-opacity-5">
                                                        <td colSpan={3} className="px-6 py-2 text-center text-sm text-gray-500 font-semibold">
                                                            Record Not Found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="print-full-width">
                                    <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                                        <table className="w-full max-w-full overflow-x-auto">
                                            <thead>
                                                <tr className='text-sm'>
                                                    <th className="border-b py-2 text-left w-[50%]">Deductions</th>
                                                    <th className="border-b py-2 text-right w-[50%]">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deductions?.map((deduction, index) => (
                                                    <tr key={`new-${index}`}>
                                                        <td className="py-2">{deduction?.name || "N/A"}</td>
                                                        <td className="py-2 text-right">{Number(deduction?.calculatedData).toFixed(2) || "N/A"}</td>
                                                    </tr>
                                                ))}

                                                {(!deductions.length) && (
                                                    <tr className="bg-white bg-opacity-5">
                                                        <td colSpan={3} className="px-6 py-2 text-center text-sm text-gray-500 font-semibold">
                                                            Record Not Found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="print-full-width">
                                    <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                                        <table className="w-full max-w-full overflow-x-auto">
                                            <thead>
                                                <tr className='text-sm'>
                                                    <th className="border-b py-2 text-left w-[30%]">Penalties</th>
                                                    <th className="border-b py-2 text-right w-[30%]">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payrollDetailsData?.panalty && payrollDetailsData?.panalty?.length > 0 ? (
                                                    payrollDetailsData?.panalty.map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td className="py-2">{item?.name || "N/A"}</td>
                                                                <td className="py-2 text-right">{item?.finalAmount || 0}</td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <tr className="bg-white bg-opacity-5">
                                                        <td
                                                            colSpan={2}
                                                            className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500 text-center"
                                                        >
                                                            Record Not Found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-[1px] border-gray-300 bg-gray-50 rounded font-semibold text-gray-800 flex justify-between items-center avoid-break">
                                <div className="flex flex-col justify-between md:w-[80%] md:text-sm text-[12px] px-2">
                                    <span>
                                        Total Net Payable - <span className='md:text-sm text-[11px] md:text-gray-700 text-green-600'>(<SalaryInWords amount={updatedNetSalary} />)</span>
                                    </span>
                                </div>
                                <div className="md:text-sm text-[12px] text-black text-center py-3 px-2 bg-gray-400 md:w-[20%]">
                                    <span>Rs. {(updatedNetSalary)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center no-print">
  <button
    onClick={() => window.print()}
    className="no-print bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
  >
    Download Payslip
  </button>
</div>

        </div>
    );
};

export default PayslipViewr;