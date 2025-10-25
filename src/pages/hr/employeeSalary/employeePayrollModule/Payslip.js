import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import GlobalLayout from '../../../../global_layouts/GlobalLayout/GlobalLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { getPayrollDetails, updatePayrollData } from './employeePayRollFeatures/_payroll_reducers';
import { decrypt, decryptObject, encrypt, encryptObject } from '../../../../config/Encryption';
import moment from 'moment';
import { FaPlus, FaTrash } from 'react-icons/fa';
import PenaltyModal from './PenaltyModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToWords } from 'to-words';

const Payslip = () => {
  const navigate = useNavigate();
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
  const [deductions, setDeductions] = useState([]);
  const [deductionInputs, setDeductionInputs] = useState(false);
  const [newDeduction, setNewDeduction] = useState({ name: "", finalAmount: "" });
  const [allowances, setAllowances] = useState([]);
  const [allowanceInputs, setAllowanceInputs] = useState(false);
  const [newAllowance, setNewAllowance] = useState({ name: "", finalAmount: "" });


  useEffect(() => {
    if (payrollDetailsData) {
      const updatedDataAllowances = payrollDetailsData?.allowances?.map((data) => ({
        allowanceId: data?.allowanceId,
        basicSalary: data?.basicSalary,
        finalAmount: data?.finalAmount,
        isPercentage: data?.isPercentage,
        name: data?.name,
        perDayAmount: data?.perDayAmount,
        value: data?.value,
        _id: data?._id,
        calculatedData: data?.allowanceId ? Number(data?.perDayAmount) * Number(payrollDetailsData?.saallaryTotal?.appliedAllowanceCount) : data?.finalAmount
      }))
      if (updatedDataAllowances?.length) { setAllowances(updatedDataAllowances) }
      const updatedDataDeduction = payrollDetailsData?.deductions?.map((data) => ({
        deductionId: data?.deductionId,
        basicSalary: data?.basicSalary,
        finalAmount: data?.finalAmount,
        isPercentage: data?.isPercentage,
        name: data?.name,
        perDayAmount: data?.perDayAmount,
        value: data?.value,
        _id: data?._id,
        calculatedData: data?.deductionId ? Number(data?.perDayAmount) * Number(payrollDetailsData?.saallaryTotal?.appliedDeductionCount) : data?.finalAmount
      }))
      if (updatedDataDeduction?.length) { setDeductions(updatedDataDeduction) }

    }
  }, [payrollDetailsData])
  const handleAllowances = () => {
    setAllowanceInputs(true);
  };

  const handleAddAllowances = () => {
    if (newAllowance.name && newAllowance.finalAmount) {
      setAllowances([...allowances, newAllowance]);
      setNewAllowance({ name: "", finalAmount: "", calculatedData: "" });
      setAllowanceInputs(false);
    }
  };

  const handleRemoveAllowance = (index) => {
    const updated = [...allowances];
    updated.splice(index, 1);
    setAllowances(updated);
  };



  const handleDeductions = () => {
    setDeductionInputs(true);
  };

  const handleAddDeductions = () => {
    if (newDeduction.name && newDeduction.finalAmount) {
      setDeductions([...deductions, newDeduction]);
      setNewDeduction({ name: "", finalAmount: "", calculatedData: "" });
      setDeductionInputs(false);
    }
  };
  const handleRemoveDeduction = (index) => {
    const updated = [...deductions];
    updated.splice(index, 1);
    setDeductions(updated);
  };

  const downloadPDF = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      doc.save('payslip.pdf');
    });
  };

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

  const baseNetSalary = parseFloat(payrollDetailsData?.basicSalary || 0);
  // const totalAllowance1 = payrollDetailsData?.allowances?.reduce((acc, item) => acc + (item?.finalAmount || 0), 0) || 0;
  const totalAllowance2 = allowances?.reduce((acc, item) => acc + (Number(item?.calculatedData) || 0), 0) || 0;
  const totalAllowanceAmount = Number(totalAllowance2);
  // const totalDeduction1 = payrollDetailsData?.deductions?.reduce((acc, item) => acc + (item?.finalAmount || 0), 0) || 0;
  const totalDeduction2 = deductions?.reduce((acc, item) => acc + (Number(item?.calculatedData) || 0), 0) || 0;
  const totalDeductionAmount = Number(totalDeduction2);
  const totalPenalty = payrollDetailsData?.panalty?.reduce((acc, item) => acc + (item?.finalAmount || 0), 0) || 0;
  const updatedNetSalary = (baseNetSalary + Number(totalAllowanceAmount) - Number(totalDeductionAmount)-Number(totalPenalty)).toFixed(2);

  const handleUpdatePaySlip = () => {
    const newAllowance = allowances?.map((output) => {
      if (output?.allowanceId) {
        return {
          allowanceId: output.allowanceId,
          ...output
        };
      } else {
        return {
          allowanceId: null,
          finalAmount: output?.finalAmount,
          isPercentage: false,
          name: "szdvsdv",
          value: output?.finalAmount
        };
      }
    });
    const newDeduction = deductions?.map((output) => {
      if (output?.deductionId) {
        return {
          deductionId: output.deductionId,
          ...output
        };
      } else {
        return {
          deductionId: null,
          finalAmount: output?.finalAmount,
          isPercentage: false,
          name: "szdvsdv",
          value: output?.finalAmount
        };
      }
    });

    dispatch(
      updatePayrollData({
        _id: payrollDetailsData?._id,
        companyId: payrollDetailsData?.companyId,
        branchId: payrollDetailsData?.branchId,
        employeId: payrollDetailsData?.employeId,
        startDate: payrollDetailsData?.startDate,
        endDate: payrollDetailsData?.endDate,
        allowances: [...newAllowance],
        deductions: [...newDeduction],
        penalties: payrollDetailsData?.panalty ? payrollDetailsData?.panalty?.map((penalty) => penalty?.penaltyId) : []

      })
    ).then((res) => {
      if (!res.error) {
        getPayrollDetailsFunc();
        setAllowances([])
        setDeductions([])
      }
    });
  };

  return (
    <GlobalLayout>
      <div>
        {isPenaltyOpen?.isOpen && <PenaltyModal closePenaltyModal={closePenaltyModal} isPenaltyOpen={isPenaltyOpen} getPayrollDetailsFunc={getPayrollDetailsFunc} />}
        <div className="">
          <div ref={printRef} className="py-2 bg-gray-100">
            <div className="bg-white p-4 border-[1px] border-gray-300">
              <div className='py-2 border-b-[1px] border-gray-300 sm:flex justify-between items-center'>
                <div>
                  <h1 className="text-xl font-semibold mb-2">Payslip</h1>
                  <p className="text-gray-800">{moment(payrollDetailsData?.startDate)?.format("DD-MM-YYYY")} to {moment(payrollDetailsData?.endDate)?.format("DD-MM-YYYY")}</p>
                </div>
                <div>
                  <div className='flex flex-col justify-end items-center'>
                    {payrollDetailsData?.branchData?.profileImage && <img className=' max-w-[150px] max-h-[100px] rounded-full' alt='' src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${payrollDetailsData?.branchData?.profileImage}`} />}
                    {payrollDetailsData?.branchData?.fullName && <h3 className="text-sm font-semibold mb-2">{payrollDetailsData?.branchData?.fullName}</h3>}
                  </div>
                  <div className="mt-2 gap-2 flex justify-end items-center">
                    <button
                      className="bg-blue-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-blue-600"
                      // onClick={downloadPDF}
                      onClick={() => {
                        const url = `/viewPayslip?payrollDetailsData=${encryptObject(payrollDetailsData)}&totalPenalty=${encrypt(totalPenalty)}&updatedNetSalary=${encrypt(updatedNetSalary)}&allowances=${encryptObject(allowances)}&deductions=${encryptObject(deductions)}&penalty=${encryptObject(payrollDetailsData?.panalty)}`;
                        window.open(url, '_blank');
                      }}

                    >
                      View
                    </button>
                    {payrollDetailsData?.status === "Draft" && <button
                      className="bg-cyan-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-cyan-600"
                      onClick={handleUpdatePaySlip}
                    >
                      save
                    </button>}
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
                          <h3 className="text-3xl font-semibold text-black">Rs {updatedNetSalary || "0.00"} </h3>
                          <p className="text-gray-600">Employee Net Pay</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          <p>Actual Basic Pay: Rs {payrollDetailsData?.basicSalary?.toFixed(2) || "0.00"}</p>
                          <p>Total Allowance: Rs {totalAllowanceAmount ? totalAllowanceAmount?.toFixed(2) : "0.00"}</p>
                          {/* <p>Updated Basic Pay: Rs {payrollDetailsData?.grossSalary?.toFixed(2) || "0.00"}</p> */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 text-sm">

                <div>
                  <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                    <table className="w-full max-w-full overflow-x-auto">
                      <thead>
                        <tr className='text-sm'>
                          <th className="border-b py-2 text-left w-[50%]">Allowances</th>
                          <th className="border-b py-2 text-right w-[50%]">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {payrollDetailsData?.allowances?.map((allowance, index) => (
                        <tr key={`api-${index}`}>
                          <td className="py-2">{allowance?.name || "N/A"}</td>
                          <td className="py-2 text-right">{allowance?.finalAmount || "N/A"}</td>
                        </tr>
                      ))} */}
                        {allowances?.length > 0 && allowances?.map((allowance, index) => (
                          <tr key={`new-${index}`}>
                            <td className="py-2">{allowance?.name || "N/A"}</td>
                            <td className="py-2 text-right">{Number(allowance?.calculatedData).toFixed(2) || "N/A"}</td>
                            <td className="py-2 text-center">
                              {!allowance?.allowanceId && payrollDetailsData?.status === "Draft" && <button
                                onClick={() => handleRemoveAllowance(index)}
                                className="p-1 border border-red-500 text-red-400 hover:border-red-600 hover:bg-red-100 rounded"
                                title="Remove Allowance"
                              >
                                <FaTrash size={9} />
                              </button>}
                            </td>
                          </tr>
                        ))}

                        {!allowances.length && (
                          <tr className="bg-white bg-opacity-5">
                            <td colSpan={3} className="px-6 py-2 text-center text-sm text-gray-500 font-semibold">
                              Record Not Found
                            </td>
                          </tr>
                        )}

                        {allowanceInputs && (
                          <tr>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                placeholder="Allowance Name"
                                value={newAllowance.name}
                                onChange={(e) => setNewAllowance({ ...newAllowance, name: e.target.value })}
                                className="w-full border px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="py-2 text-right flex justify-center items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Amount"
                                value={newAllowance.finalAmount}
                                onChange={(e) => setNewAllowance({ ...newAllowance, finalAmount: Number(e.target.value), calculatedData: Number(e.target.value) })}
                                className="w-full border px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="py-2 text-center">
                              <div
                                onClick={handleAddAllowances}
                                className="p-1 h-6 w-6 border border-orange-500 cursor-pointer inline-flex items-center justify-center"
                                title="Add Allowance"
                              >
                                <FaPlus className="text-green-600 text-xs" />
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>

                      {!allowanceInputs && payrollDetailsData?.status === "Draft" && (
                        <div
                          onClick={handleAllowances}
                          className="p-1 border border-orange-500 cursor-pointer whitespace-nowrap flex gap-2 justify-center items-center lg:w-[50%] w-full text-[11px]"
                          title="Add New Allowance"
                        >
                          <FaPlus className="text-red-600 text-xs" />Add
                        </div>
                      )}

                    </table>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 p-2 overflow-x-auto border-[1px] border-gray-200">
                    <table className="w-full max-w-full overflow-x-auto">
                      <thead>
                        <tr className='text-sm'>
                          <th className="border-b py-2 text-left w-[50%]">Deductions</th>
                          <th className="border-b py-2 text-right w-[50%]">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 
                      {payrollDetailsData?.deductions?.map((deduction, index) => (
                        <tr key={`api-${index}`}>
                          <td className="py-2">{deduction?.name || "N/A"}</td>
                          <td className="py-2 text-right">{deduction?.finalAmount || "N/A"}</td>
                        </tr>
                      ))} */}

                        {deductions?.map((deduction, index) => (
                          <tr key={`new-${index}`}>
                            <td className="py-2">{deduction?.name || "N/A"}</td>
                            <td className="py-2 text-right">{(+deduction?.calculatedData).toFixed(2) || "N/A"}</td>
                            <td className="py-2 text-center">
                              {!deduction?.deductionId && payrollDetailsData?.status === "Draft" && <button
                                onClick={() => handleRemoveDeduction(index)}
                                className="p-1 border border-red-500 text-red-400 hover:border-red-600 hover:bg-red-100 rounded"
                                title="Remove Allowance"
                              >
                                <FaTrash size={9} />
                              </button>}
                            </td>
                          </tr>
                        ))}


                        {(!deductions.length) && (
                          <tr className="bg-white bg-opacity-5">
                            <td colSpan={3} className="px-6 py-2 text-center text-sm text-gray-500 font-semibold">
                              Record Not Found
                            </td>
                          </tr>
                        )}
                        {deductionInputs && (
                          <tr>
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                placeholder="Deduction Name"
                                value={newDeduction.name}
                                onChange={(e) =>
                                  setNewDeduction({ ...newDeduction, name: e.target.value })
                                }
                                className="w-full border px-2 py-1 text-sm "
                              />
                            </td>
                            <td className="py-2 text-right flex justify-center items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Amount"
                                value={newDeduction.finalAmount}
                                onChange={(e) =>
                                  setNewDeduction({
                                    ...newDeduction,
                                    finalAmount: Number(e.target.value),
                                    calculatedData: Number(e.target.value)
                                  })
                                }
                                className="w-full border px-2 py-1 text-sm "
                              />
                              <div
                                onClick={handleAddDeductions}
                                className="p-1 h-6 w-6 border border-orange-500 cursor-pointer"
                                title="Add Deduction"
                              >
                                <FaPlus className="text-green-600 text-xs" />
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {!deductionInputs && payrollDetailsData?.status === "Draft" && (
                        <div
                          onClick={handleDeductions}
                          className="p-1 border border-orange-500 cursor-pointer whitespace-nowrap flex gap-2 justify-center items-center lg:w-[50%] w-full text-[11px]"
                          title="Add New Deduction"
                        >
                          <FaPlus className="text-red-600 text-xs" />Add
                        </div>
                      )}
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
              <div className="mt-8 border-[1px] border-gray-300 bg-gray-50 rounded font-semibold text-gray-800 flex justify-between items-center">
                <div className="flex flex-col justify-between md:w-[80%] md:text-sm text-[12px] px-2">
                  <span>
                    Total Net Payable - <span className='md:text-sm text-[11px] md:text-gray-700 text-green-600'>(<SalaryInWords amount={updatedNetSalary} />)</span>
                  </span>
                  {/* <span>Gross Earnings - Total Deductions</span> */}
                </div>
                <div className="md:text-sm text-[12px] text-black text-center py-3 px-2 bg-gray-400 md:w-[20%]">
                  <span>Rs. {(updatedNetSalary)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default Payslip;