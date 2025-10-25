import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import GlobalLayout from '../../../../global_layouts/GlobalLayout/GlobalLayout';
import AllowanceModal from './AllowanceModal';
import DeductionModal from './DeductionModal';
import { useParams } from 'react-router-dom';
import { getPayrollDetails } from './employeePayRollFeatures/_payroll_reducers';
import { decrypt } from '../../../../config/Encryption';
import moment from 'moment';
import { FaPlus } from 'react-icons/fa';
import PenaltyModal from './PenaltyModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EmployeePayslip = () => {
  const dispatch = useDispatch();
  const { payslipIdEnc } = useParams();
  const paySlipId = decrypt(payslipIdEnc);

  useEffect(() => {
    getPayrollDetailsFunc();
  }, []);

  const getPayrollDetailsFunc = () => {
    dispatch(getPayrollDetails({
      _id: paySlipId
    }));
  };

  const printRef = useRef();
  const { payrollDetailsData } = useSelector((state) => state.payrollReducer);
  const [isAllowanceOpen, setIsAllowanceOpen] = useState({
    isOpen: false,
    data: null,
  });
  const openAllowanceModal = (element) => setIsAllowanceOpen({
    isOpen: true,
    data: element,
  });
  const closeAllowanceModal = () => setIsAllowanceOpen({
    isOpen: false,
    data: [],
  });

  const [isDeductionOpen, setIsDeductionOpen] = useState({
    isOpen: false,
    data: null,
  });
  const openDeductionModal = (element) => setIsDeductionOpen({
    isOpen: true,
    data: element,
  });
  const closeDeductionModal = () => setIsDeductionOpen({
    isOpen: false,
    data: null,
  });

  const [isPenaltyOpen, setIsPenaltyOpen] = useState({
    isOpen: false,
    data: null,
  });
  const openPenaltyModal = (element) => setIsPenaltyOpen({
    isOpen: true,
    data: element,
  });
  const closePenaltyModal = () => setIsPenaltyOpen({
    isOpen: false,
    data: null,
  });

  const downloadPDF = () => {
    const input = printRef.current;

    // Convert the div to a canvas
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Create a PDF document
      const doc = new jsPDF();
      const imgWidth = 210; // A4 size width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image (the content of the div) to PDF
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      doc.save('payslip.pdf');
    });
  };

  return (
    <GlobalLayout>
      {isAllowanceOpen?.isOpen && <AllowanceModal closeAllowanceModal={closeAllowanceModal} isAllowanceOpen={isAllowanceOpen} getPayrollDetailsFunc={getPayrollDetailsFunc} />}
      {isDeductionOpen?.isOpen && <DeductionModal closeDeductionModal={closeDeductionModal} isDeductionOpen={isDeductionOpen} getPayrollDetailsFunc={getPayrollDetailsFunc} />}
      {isPenaltyOpen?.isOpen && <PenaltyModal closePenaltyModal={closePenaltyModal} isPenaltyOpen={isPenaltyOpen} getPayrollDetailsFunc={getPayrollDetailsFunc} />}
      <div className="">
        <div ref={printRef} className="py-2 bg-gray-100">
          <div className="bg-white p-4 border-[1px] border-gray-300">
            <div className='py-2 border-b-[1px] border-gray-300 lg:flex justify-between items-center'>
              <div>
                <h1 className="text-xl font-semibold mb-3">Payslip</h1>
                <p className="text-gray-800">{moment(payrollDetailsData?.startDate)?.format("DD-MM-YYYY")} to {moment(payrollDetailsData?.endDate)?.format("DD-MM-YYYY")}</p>
              </div>
              <div>
                <div className='flex justify-end items-center'>
                  <img className='h-14 w-14 rounded-full' alt='' src={payrollDetailsData?.branchData?.profileImage} />
                </div>
                <div className="mt-4 lg:flex justify-end items-center grid md:grid-cols-3 grid-cols-2 gap-4">
                  <button
                    className="bg-blue-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-blue-600"
                    onClick={downloadPDF}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>

            <div className='md:flex justify-between items-center'>
              <div className="mt-2">
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

              <div className="mt-6 gap-4">
                <div className="p-4 rounded-md border-[1px] border-gray-300">
                  {payrollDetailsData ? (
                    <>
                      <div className="bg-green-100 border-l-4 border-green-600 rounded-xl p-3">
                        <h3 className="text-3xl font-semibold text-black">Rs {payrollDetailsData?.netSalary?.toFixed(2) || "0.00"}</h3>
                        <p className="text-gray-600">Employee Net Pay</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Actual Basic Pay: Rs {payrollDetailsData?.basicSalary?.toFixed(2) || "0.00"}</p>
                        <p>Paid Days: {payrollDetailsData?.totalAttendance || "0.00"}</p>
                        <p>LOP Days: {payrollDetailsData?.totalLeave || "0.00"}</p>
                        <p>Updated Basic Pay: Rs {payrollDetailsData?.grossSalary?.toFixed(2) || "0.00"}</p>
                        <p className="text-blue-400 text-[11px]">The payslip is calculated based on the updated basic pay</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-600">No data available</div>
                  )}
                </div>

              </div>

            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 text-sm">

               <div>
                 <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                  <table className="w-full max-w-full overflow-x-auto">
                    <thead>
                       <tr className='text-sm'>
                         <th className="border-b py-2 text-left w-[30%]">Allowances</th>
                         <th className="border-b py-2 text-right w-[30%]">Amount</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                   
                      {payrollDetailsData?.allowances && payrollDetailsData?.allowances.length > 0 ? (
                        payrollDetailsData?.allowances.map((allowance, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="py-2">{allowance?.name || "N/A"}</td>
                              <td className="py-2 text-right">{allowance?.value || "N/A"}</td>
                            </tr>
                           
                          </React.Fragment>
                        ))
                      ) : (
                        <tr className="bg-white bg-opacity-5">
                          <td
                            colSpan={2}
                            className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                          >
                            Record Not Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                  <table className="w-full max-w-full overflow-x-auto">
                    <thead>
                      <tr className='text-sm'>
                        <th className="border-b py-2 text-left w-[30%]">Deductions</th>
                        <th className="border-b py-2 text-right w-[30%]">Amount</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {payrollDetailsData?.deductions && payrollDetailsData?.deductions?.length > 0 ? (
                        payrollDetailsData?.deductions.map((deductions, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="py-2">{deductions?.name || "N/A"}</td>
                              <td className="py-2 text-right">{deductions?.value || "N/A"}</td>
                            </tr>
                           
                          </React.Fragment>
                        ))
                      ) : (
                        <tr className="bg-white bg-opacity-5">
                          <td
                            colSpan={2}
                            className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                          >
                            Record Not Found
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              </div>
              <div>
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
                              <td className="py-2 text-right">{item?.finalAmount || "N/A"}</td>
                            </tr>
                          </React.Fragment>
                        ))
                      ) : (
                        <tr className="bg-white bg-opacity-5">
                          <td
                            colSpan={2}
                            className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
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
            <div className="mt-8 border-[1px] border-gray-300 bg-gray-50 rounded-lg font-semibold text-gray-800 flex justify-between items-center">
              <div className="flex flex-col justify-between md:w-[80%] md:text-sm text-[11px] px-3">
                <span>Total Net Payable</span>
                <span>Gross Earnings - Total Deductions</span>
              </div>
              <div className="md:text-md text-sm text-black text-center py-3 px-2 bg-gray-400 md:w-[20%]">
                <span>Rs {(payrollDetailsData?.netSalary)?.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default EmployeePayslip;























// import React, { useState, useRef, useEffect } from 'react';
// import { useDispatch, useSelector } from "react-redux";
// import GlobalLayout from '../../../../global_layouts/GlobalLayout/GlobalLayout';
// import AllowanceModal from './AllowanceModal';
// import DeductionModal from './DeductionModal';
// import { useParams } from 'react-router-dom';
// import { getPayrollDetails } from './employeePayRollFeatures/_payroll_reducers';
// import { decrypt } from '../../../../config/Encryption';
// import moment from 'moment';
// import { FaPlus } from 'react-icons/fa';
// import PenaltyModal from './PenaltyModal';

// const Payslip = () => {

 
//   const dispatch = useDispatch()
//   const { payslipIdEnc } = useParams()
//   const paySlipId = decrypt(payslipIdEnc)

//   useEffect(() => {
//     getPayrollDetailsFunc()
//   }, [])
//   const getPayrollDetailsFunc = ()=>{
//     dispatch(getPayrollDetails({
//       _id: paySlipId
//     }))
//   }
//   const printRef = useRef();
//   const { payrollDetailsData } = useSelector((state) => state.payrollReducer);
//   const [isAllowanceOpen, setIsAllowanceOpen] = useState({
//     isOpen: false,
//     data: null,
//   });
//   const openAllowanceModal = (element) => setIsAllowanceOpen({
//     isOpen: true,
//     data: element,
//   });
//   const closeAllowanceModal = () => setIsAllowanceOpen({
//     isOpen: false,
//     data: [],
//   });




//   const [isDeductionOpen, setIsDeductionOpen] = useState({
//     isOpen: false,
//     data: null,
//   });
//   const openDeductionModal = (element) => setIsDeductionOpen({
//     isOpen: true,
//     data: element,
//   });
//   const closeDeductionModal = () => setIsDeductionOpen({
//     isOpen: false,
//     data: null,
//   });
//   const [isPenaltyOpen, setIsPenaltyOpen] = useState({
//     isOpen: false,
//     data: null,
//   });
//   const openPenaltyModal = (element) => setIsPenaltyOpen({
//     isOpen: true,
//     data: element,
//   });
//   const closePenaltyModal = () => setIsPenaltyOpen({
//     isOpen: false,
//     data: null,
//   });





//   return (
//     <GlobalLayout>
//       {isAllowanceOpen?.isOpen && <AllowanceModal closeAllowanceModal={closeAllowanceModal} isAllowanceOpen={isAllowanceOpen}  getPayrollDetailsFunc={getPayrollDetailsFunc} />}
//       {isDeductionOpen?.isOpen  && <DeductionModal  closeDeductionModal={closeDeductionModal} isDeductionOpen={isDeductionOpen}  getPayrollDetailsFunc={getPayrollDetailsFunc}  />}
//       {isPenaltyOpen?.isOpen  && <PenaltyModal  closePenaltyModal={closePenaltyModal} isPenaltyOpen={isPenaltyOpen}  getPayrollDetailsFunc={getPayrollDetailsFunc}  />}
//       <div className="">
//         <div ref={printRef} className="py-2 bg-gray-100">
//           <div className="bg-white p-4 border-[1px] border-gray-300">

//             <div className='py-2 border-b-[1px] border-gray-300 lg:flex justify-between items-center'>
//               <div>
//                 <h1 className="text-xl font-semibold mb-3">Payslip</h1>
//                 <p className="text-gray-800">{moment(payrollDetailsData?.startDate)?.format("DD-MM-YYYY")} to {moment(payrollDetailsData?.endDate)?.format("DD-MM-YYYY")}</p>
//               </div>
//               <div>
//                 <div className='flex justify-end items-center'>
//                   <img className='h-14 w-14 rounded-full' alt='' src={payrollDetailsData?.branchData?.profileImage} />
//                 </div>
//                 <div className="mt-4 lg:flex justify-end items-center grid md:grid-cols-3 grid-cols-2 gap-4">
                  
//                   <button
//                     className="bg-blue-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-blue-600"
//                   >
//                     Print
//                   </button>
//                   <button
//                     className="bg-blue-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-blue-600"
//                   >
//                     download
//                   </button>
                 
//                 </div>
//               </div>
//             </div>

//             <div className='md:flex justify-between items-center'>

//               <div className="mt-2">
//                 <h2 className="font-semibold text-lg">Employee Details</h2>
//                 <div className="mt-4 text-md space-y-2">
//                   <p>
//                     <span className="font-medium">Employee Name:</span> {payrollDetailsData?.employeData?.fullName || "N/A"}
//                   </p>
//                   <p>
//                     <span className="font-medium">Department:</span> {payrollDetailsData?.departmentData?.name || "N/A"}
//                   </p>
//                   <p>
//                     <span className="font-medium">Bank Acc./Cheque No.:</span> {payrollDetailsData?.bankData?.accountNumber || "N/A"}
//                   </p>
//                   <p>
//                     <span className="font-medium">ESIC number:</span> {payrollDetailsData?.salaryData?.esicNumber || "N/A"}
//                   </p>
//                   <p>
//                     <span className="font-medium">UAN number:</span> {payrollDetailsData?.salaryData?.uanNumber || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 gap-4">
//                 <div className="p-4 rounded-md border-[1px] border-gray-300">
//                   {payrollDetailsData ? (
//                     <>
//                       <div className="bg-green-100 border-l-4 border-green-600 rounded-xl p-3">
//                         <h3 className="text-3xl font-semibold text-black">Rs {payrollDetailsData?.netSalary?.toFixed(2) || "0.00"}</h3>
//                         <p className="text-gray-600">Employee Net Pay</p>
//                       </div>
//                       <div className="mt-2 text-sm text-gray-600 space-y-1">
//                         <p>Actual Basic Pay: Rs {payrollDetailsData?.basicSalary?.toFixed(2) || "0.00"}</p>
//                         <p>Paid Days: {payrollDetailsData?.totalAttendance || "0.00"}</p>
//                         <p>LOP Days: {payrollDetailsData?.totalLeave || "0.00"}</p>
//                         <p>Updated Basic Pay: Rs {payrollDetailsData?.grossSalary?.toFixed(2) || "0.00"}</p>
//                         <p className="text-blue-400 text-[11px]">The payslip is calculated based on the updated basic pay</p>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="text-gray-600">No data available</div>
//                   )}
//                 </div>

//               </div>

//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 text-sm">

//               <div>
//                 <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
//                   <table className="w-full max-w-full overflow-x-auto">
//                     <thead>
//                       <tr className='text-sm'>
//                         <th className="border-b py-2 text-left w-[30%]">Allowances</th>
//                         <th className="border-b py-2 text-right w-[30%]">Amount</th>
//                         <th className="border-b py-2 flex justify-center items-center">
//                           <div onClick={() => openAllowanceModal({
//                             isOpen: true,
//                             data: payrollDetailsData,
//                           })} className='p-1 border-[1px] border-orange-500 cursor-pointer'>
//                             <FaPlus className='text-red-600' />
//                           </div>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
                   
//                       {payrollDetailsData?.allowances && payrollDetailsData?.allowances.length > 0 ? (
//                         payrollDetailsData?.allowances.map((allowance, index) => (
//                           <React.Fragment key={index}>
//                             <tr>
//                               <td className="py-2">{allowance?.name || "N/A"}</td>
//                               <td className="py-2 text-right">{allowance?.value || "N/A"}</td>
//                             </tr>
                           
//                           </React.Fragment>
//                         ))
//                       ) : (
//                         <tr className="bg-white bg-opacity-5">
//                           <td
//                             colSpan={2}
//                             className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
//                           >
//                             Record Not Found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div>
//                 <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
//                   <table className="w-full max-w-full overflow-x-auto">
//                     <thead>
//                       <tr className='text-sm'>
//                         <th className="border-b py-2 text-left w-[30%]">Deductions</th>
//                         <th className="border-b py-2 text-right w-[30%]">Amount</th>
//                         <th className="border-b py-2 flex justify-center items-center">
//                           <div onClick={() =>{
//                             openDeductionModal({
//                               isOpen: true,
//                               data: payrollDetailsData,
//                             })
//                           }} className='p-1 border-[1px] border-orange-500 cursor-pointer'>
//                             <FaPlus className='text-red-600' />
//                           </div>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {payrollDetailsData?.deductions && payrollDetailsData?.deductions?.length > 0 ? (
//                         payrollDetailsData?.deductions.map((deductions, index) => (
//                           <React.Fragment key={index}>
//                             <tr>
//                               <td className="py-2">{deductions?.name || "N/A"}</td>
//                               <td className="py-2 text-right">{deductions?.value || "N/A"}</td>
//                             </tr>
                           
//                           </React.Fragment>
//                         ))
//                       ) : (
//                         <tr className="bg-white bg-opacity-5">
//                           <td
//                             colSpan={2}
//                             className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
//                           >
//                             Record Not Found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>

//                   </table>
//                 </div>
//               </div>
//               <div>
//                 <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
//                   <table className="w-full max-w-full overflow-x-auto">
//                     <thead>
//                       <tr className='text-sm'>
//                         <th className="border-b py-2 text-left w-[30%]">Penalties</th>
//                         <th className="border-b py-2 text-right w-[30%]">Amount</th>
//                         <th className="border-b py-2 flex justify-center items-center">
//                           <div onClick={() =>{
//                             openPenaltyModal({
//                               isOpen: true,
//                               data: payrollDetailsData,
//                             })
//                           }} className='p-1 border-[1px] border-orange-500 cursor-pointer'>
//                             <FaPlus className='text-red-600' />
//                           </div>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {payrollDetailsData?.penaltyData && payrollDetailsData?.penaltyData?.length > 0 ? (
//                         payrollDetailsData?.penaltyData.map((item, index) => (
//                           <React.Fragment key={index}>
//                             <tr>
//                               <td className="py-2">{item?.penaltyName || "N/A"}</td>
//                               <td className="py-2 text-right">{item?.amount || "N/A"}</td>
//                             </tr>
//                           </React.Fragment>
//                         ))
//                       ) : (
//                         <tr className="bg-white bg-opacity-5">
//                           <td
//                             colSpan={2}
//                             className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
//                           >
//                             Record Not Found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>

//                   </table>
//                 </div>
//               </div>

//             </div>
//             <div className="mt-8 border-[1px] border-gray-300 bg-gray-50 rounded-lg font-semibold text-gray-800 flex justify-between items-center">
//               <div className="flex flex-col justify-between md:w-[80%] md:text-sm text-[11px] px-3">
//                 <span>Total Net Payable</span>
//                 <span>Gross Earnings - Total Deductions</span>
//               </div>
//               <div className="md:text-md text-sm text-black text-center py-3 px-2 bg-gray-400 md:w-[20%]">
//                 <span>Rs {(payrollDetailsData?.netSalary)?.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </GlobalLayout>
//   );
// };

// export default Payslip;
