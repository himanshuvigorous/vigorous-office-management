import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formButtonClassName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../../constents/global";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { resetStandardPayrollState, standardPayrollCreate, standardPayrollDetails, standardPayrollUpdate } from "./standardPayrollfeature/_standardPayroll_reducers";
import { deductionsListSearch, getdeductionsList } from "../Deductions/deductionsfeature/_deductionsList_reducers";
import { allowanceListSearch, getAllowanceList } from "../Allowance/allowancefeature/_allowanceList_reducers";
import { decrypt } from "../../../../config/Encryption";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";




const UpdateStandardPayroll = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { standardPayrollIdEnc } = useParams();
  const standardPayrollId = decrypt(standardPayrollIdEnc);
  const { standardPayrollDetailsData } = useSelector((state) => state.standardPayroll);
  const { allowanceListData, loading: allowanceLoading } = useSelector((state) => state.allowance);
  const { deductionsListData, loading: deductionLoading } = useSelector((state) => state.deductions);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [allDedfinalemployeeList, setAllDedFinalEmployeeList] = useState([]);
  const {
    fields: allowanceDetails,
    append: appendAllowance,
    remove: removeAllowance,
  } = useFieldArray({
    control,
    name: "allowanceDetails",
  });
  const {
    fields: deductionDetails,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: "deductionDetails",
  });
  const selectedEmployee = useWatch({
    control,
    name: "employee",
    defaultValue: "",
  });
  const deductionsListDetails = useWatch({
    control,
    name: "deductionDetails",
    defaultValue: "",
  });
  const allowanceListDetails = useWatch({
    control,
    name: "allowanceDetails",
    defaultValue: "",
  });

  useEffect(() => {
    if (standardPayrollId) {
      dispatch(standardPayrollDetails({ _id: standardPayrollId }));
    }

    // Cleanup function to reset the state when the component unmounts
    return () => {
      dispatch(resetStandardPayrollState());
    };
  }, [standardPayrollId, dispatch]);
  useEffect(() => {
    if (standardPayrollDetailsData) {


      if (!standardPayrollDetailsData) return null;

      let AllDed = [];
      const basicSalary = Number(standardPayrollDetailsData?.basicSalary) || 0;

      // Process Allowances
      if (Array.isArray(allowanceListDetails)) {
        allowanceListDetails.forEach((all) => {
          const allId = all?.allowance;
          const allowanceItem = allowanceListData?.find(
            (item) => item?._id === allId
          );
          const allName = allowanceItem?.name || "-";
          const allIsPercentage = all?.isPercentage;
          const amount = Number(all?.amount) || 0;

          const calculatedAmounted =
            allIsPercentage === "Yes"
              ? (basicSalary * amount) / 100
              : amount;

          AllDed.push({
            name: allName,
            isPercentage: allIsPercentage,
            _id: allId,
            amount: calculatedAmounted,
            type: "allowance",
          });
        });
      }

      // Process Deductions
      if (Array.isArray(deductionsListDetails)) {
        deductionsListDetails.forEach((ded) => {
          const dedId = ded?.deduction;
          const deductionItem = deductionsListData?.find(
            (item) => item?._id === dedId
          );
          const dedName = deductionItem?.name || "-";
          const dedIsPercentage = ded?.isPercentage;
          const amount = Number(ded?.amount) || 0;

          const calculatedAmounted =
            dedIsPercentage === "Yes"
              ? (basicSalary * amount) / 100
              : amount;

          AllDed.push({
            name: dedName,
            isPercentage: dedIsPercentage,
            _id: dedId,
            amount: calculatedAmounted,
            type: "deduction",
          });
        });
      }

      setAllDedFinalEmployeeList(AllDed);
    }
  }, [
    standardPayrollDetailsData,
    allowanceListDetails,
    deductionsListDetails,
    allowanceListData,
    deductionsListData,

  ]);

  const { loading: standardPayrollLoading } = useSelector(
    (state) => state.standardPayroll
  );
  useEffect(() => {
    if (standardPayrollDetailsData && standardPayrollDetailsData?.companyId && standardPayrollDetailsData?.branchId && !isDataFetched) {
      setIsDataFetched(true); // Prevent re-fetching

      // Reset form values before any data changes
      reset();

      // Set form values immediately after resetting
      setValue("allowanceDetails", []);
      setValue("deductionDetails", []);
      setValue("employee", standardPayrollDetailsData?.employeName);


      dispatch(allowanceListSearch({
        "text": "",
        "sort": true,
        "status": true,
        "isPagination": false,
        directorId: "",
        companyId: standardPayrollDetailsData?.companyId,
        branchId: standardPayrollDetailsData?.branchId,
      })).then((data) => {
        if (!data?.error) {
          standardPayrollDetailsData?.allowances?.forEach(allowance => {
            const newAllowance = {
              allowance: allowance?.allowanceId,
              isPercentage: allowance?.isPercentage ? "Yes" : "No",
              amount: allowance?.value,
            };
            appendAllowance(newAllowance);
          });
        }
      });

      // Dispatch for deduction list
      dispatch(deductionsListSearch({
        "text": "",
        "sort": true,
        "status": true,
        "isPagination": false,
        directorId: "",
        companyId: standardPayrollDetailsData?.companyId,
        branchId: standardPayrollDetailsData?.branchId,
      })).then((data) => {
        if (!data?.error) {
          standardPayrollDetailsData?.deductions?.forEach(deduction => {
            const newDeduction = {
              deduction: deduction?.deductionId,
              isPercentage: deduction?.isPercentage ? "Yes" : "No",
              amount: deduction?.value,
            };
            appendDeduction(newDeduction);
          });
        }
      });
    }
  }, [standardPayrollDetailsData, isDataFetched, dispatch, reset, setValue]);



  const onSubmit = (data) => {
    const finalPayload = {
      _id: standardPayrollId,
      companyId: standardPayrollDetailsData?.companyId,
      directorId: "",
      branchId: standardPayrollDetailsData?.branchId,
      "employeId": standardPayrollDetailsData?.employeId,
      "allowances": data?.allowanceDetails?.map((allowance) => ({
        "allowanceId": allowance?.allowance,
        "name": allowanceListData?.find((item) => item?._id === allowance?.allowance)?.name,
        "isPercentage": allowance?.isPercentage === "Yes" ? true : false,
        "value": allowance?.amount
      })),
      "deductions": data?.deductionDetails?.map((deduction) => ({
        "deductionId": deduction?.deduction,
        "name": deductionsListData?.find((item) => item?._id === deduction?.deduction)?.name,
        "isPercentage": deduction?.isPercentage === "Yes" ? true : false,
        "value": deduction?.amount
      }))
    };

    dispatch(standardPayrollUpdate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };






  const { Option } = Select
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>

          <div className="space-y-4 px-4 py-4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Employee Header with Salary Summary */}
              <div className="bg-header text-white p-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0">
                    {standardPayrollDetailsData?.profileImage ? (
                      <img src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${standardPayrollDetailsData.profileImage}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-header">{standardPayrollDetailsData?.fullName?.charAt(0).toUpperCase()}</span>
                    )}
                    {/* <span className="text-2xl font-bold text-header">

                      {standardPayrollDetailsData?.employeName?.charAt(0).toUpperCase() || 'E'}
                    </span> */}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{standardPayrollDetailsData?.employeName}</h2>

                    {/* Salary Summary */}
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div className="bg-white/10 p-1 rounded text-center">
                        <p className="font-medium">Basic</p>
                        <p className="font-semibold">₹{standardPayrollDetailsData?.basicSalary?.toLocaleString('en-IN') || '0'}</p>
                      </div>
                      <div className="bg-white/10 p-1 rounded text-center">
                        <p className="font-medium">Monthly</p>
                        <p className="font-semibold">₹{standardPayrollDetailsData?.baseSalary?.toLocaleString('en-IN') || '0'}</p>
                      </div>
                      <div className="bg-white/10 p-1 rounded text-center">
                        <p className="font-medium">Yearly</p>
                        <p className="font-semibold">₹{standardPayrollDetailsData?.ctc?.toLocaleString('en-IN') || '0'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions & Allowances */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Allowances Section */}
                <div className="p-4">
                  <h3 className="text-md font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Allowances
                  </h3>

                  {allDedfinalemployeeList?.filter(item => item?.type?.toLowerCase() === 'allowance')?.length > 0 ? (
                    <div className="space-y-2">
                      {allDedfinalemployeeList
                        .filter(item => item?.type?.toLowerCase() === 'allowance')
                        .map((item, idx) => (
                          <div key={`allowance-${idx}`} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-100">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="font-semibold text-green-600">+ ₹{item.amount}</span>
                          </div>
                        ))}

                      <div className="flex justify-between items-center p-2 bg-green-100 rounded font-semibold mt-2">
                        <span>Total Allowances</span>
                        <span className="text-green-700">
                          + ₹{allDedfinalemployeeList
                            .filter(item => item?.type?.toLowerCase() === 'allowance')
                            .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
                            .toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 bg-green-50 p-2 rounded text-center">
                      No allowances this period
                    </div>
                  )}
                </div>

                {/* Deductions Section */}
                <div className="p-4">
                  <h3 className="text-md font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    Deductions
                  </h3>

                  {allDedfinalemployeeList?.filter(item => item?.type?.toLowerCase() === 'deduction')?.length > 0 ? (
                    <div className="space-y-2">
                      {allDedfinalemployeeList
                        .filter(item => item?.type?.toLowerCase() === 'deduction')
                        .map((item, idx) => (
                          <div key={`deduction-${idx}`} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="font-semibold text-red-600">- ₹{item.amount}</span>
                          </div>
                        ))}

                      <div className="flex justify-between items-center p-2 bg-red-100 rounded font-semibold mt-2">
                        <span>Total Deductions</span>
                        <span className="text-red-700">
                          - ₹{allDedfinalemployeeList
                            .filter(item => item?.type?.toLowerCase() === 'deduction')
                            .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
                            .toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 bg-red-50 p-2 rounded text-center">
                      No deductions this period
                    </div>
                  )}
                </div>
              </div>

              {/* Net Salary Calculation */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="max-w-md mx-auto">
                  <h3 className="text-md font-semibold text-center mb-3 text-gray-700">Salary Calculation</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span className="font-medium">₹{standardPayrollDetailsData?.basicSalary?.toLocaleString('en-IN') || '0'}</span>
                    </div>

                    <div className="flex justify-between text-green-600">
                      <span>Total Allowances:</span>
                      <span>
                        + ₹{allDedfinalemployeeList
                          .filter(item => item?.type?.toLowerCase() === 'allowance')
                          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-red-600">
                      <span>Total Deductions:</span>
                      <span>
                        - ₹{allDedfinalemployeeList
                          .filter(item => item?.type?.toLowerCase() === 'deduction')
                          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="border-t border-gray-300 my-2"></div>

                    <div className="flex justify-between text-lg font-bold text-header">
                      <span>Net Salary Payable:</span>
                      <span>
                        ₹{(parseFloat(standardPayrollDetailsData?.basicSalary || 0) +
                          (allDedfinalemployeeList
                            .filter(item => item?.type?.toLowerCase() === 'allowance')
                            .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)) -
                          (allDedfinalemployeeList
                            .filter(item => item?.type?.toLowerCase() === 'deduction')
                            .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0))
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className=" rounded-t-lg border border-gray-300 ">
                <div className="py-2 text-white bg-header px-2 rounded-t-lg  font-semibold">
                  Allowance{" "}
                </div>
                {allowanceDetails.map((item, index) => (
                  <div key={index} className=" rounded-md my-2 ">
                    <div key={item.id} className="">


                      <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                        <div className="flex gap-3">
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Allowance <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name={`allowanceDetails[${index}].allowance`}
                              control={control}
                              rules={{ required: "allowance is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className={`${inputAntdSelectClassName} ${errors.allowanceDetails?.[index]?.allowance ? '' : 'border-gray-300'}`}
                                  showSearch
                                  filterOption={(input, option) =>
                                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                                  }
                                  placeholder="Select allowance"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <Option value="">Select allowance</Option>
                                  {allowanceLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(allowanceListData)?.map((item) => (
                                    <Option key={item._id} value={item._id}>
                                      {item.name}
                                    </Option>
                                  )))}
                                </Select>
                              )}
                            />
                            {errors.allowanceDetails?.[index]?.allowance && (
                              <p className="text-red-500 text-sm">
                                {errors.allowanceDetails[index].allowance.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Is Percentage <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name={`allowanceDetails[${index}].isPercentage`}
                            control={control}
                            rules={{ required: "isPercentage is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`${inputAntdSelectClassName} ${errors.allowanceDetails?.[index]?.isPercentage ? '' : 'border-gray-300'}`}
                                placeholder="Select Is Percentage"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                              >
                                <Option value="">Select Is Percentage</Option>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                              </Select>

                            )}

                          />
                          {errors.allowanceDetails?.[index]?.isPercentage && (
                            <p className="text-red-500 text-sm">
                              {errors.allowanceDetails[index].isPercentage.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            {watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? "Percentage" : "Amount"} <span className="text-red-600">*</span>
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            {...register(`allowanceDetails[${index}].amount`, {
                              required: "Amount is required",
                              valueAsNumber: true,
                              min: watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? 1 : undefined,  // For percentage, min value is 1
                              // max: watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? 100 : undefined, // For percentage, max value is 100, else no max
                            })}
                            className={`${inputClassName} ${errors.allowanceDetails?.[index]?.amount
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />

                          {errors.allowanceDetails?.[index]?.amount && (
                            <p className="text-red-500 text-sm">
                              {errors.allowanceDetails[index].amount.message}
                            </p>
                          )}
                        </div>
                        <div className="py-2">
                          {(
                            <div className="flex justify-end items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  removeAllowance(index)
                                }}
                                className="text-rose-800 hover:text-rose-900 flex items-center justify-center p-1 rounded-lg"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendAllowance({

                    })
                  }
                  className={`${formButtonClassName} mx-3 mb-2`}
                >
                  Add Allowance
                </button>
              </div>
            </div>
            <div>
              <div className=" rounded-t-lg border border-gray-300 ">
                <div className="py-2 text-white bg-header px-2 rounded-t-lg  font-semibold">
                  Deductions{" "}
                </div>
                {deductionDetails.map((item, index) => (
                  <div key={index} className=" rounded-md my-2 ">
                    <div key={item.id} className="">


                      <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                        <div className="flex gap-3">
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Deduction <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name={`deductionDetails[${index}].deduction`}
                              control={control}
                              rules={{ required: "deduction is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className={`${inputAntdSelectClassName} ${errors.deductionDetails?.[index]?.deduction ? '' : 'border-gray-300'}`}
                                  showSearch
                                  filterOption={(input, option) =>
                                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                                  }
                                  placeholder="Select deduction"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <Option value="">Select deduction</Option>
                                  {deductionLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(deductionsListData)?.map((item) => (
                                    <Option key={item._id} value={item._id}>
                                      {item.name}
                                    </Option>
                                  )))}
                                </Select>
                              )}
                            />
                            {errors.deductionDetails?.[index]?.deduction && (
                              <p className="text-red-500 text-sm">
                                {errors.deductionDetails[index].deduction.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Is Percentage <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name={`deductionDetails[${index}].isPercentage`}
                            control={control}
                            rules={{ required: "isPercentage is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`${inputAntdSelectClassName} ${errors.deductionDetails?.[index]?.isPercentage ? '' : 'border-gray-300'}`}
                                placeholder="Select Is Percentage"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                              >
                                <Option value="">Select Is Percentage</Option>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                              </Select>

                            )}

                          />
                          {errors.deductionDetails?.[index]?.isPercentage && (
                            <p className="text-red-500 text-sm">
                              {errors.deductionDetails[index].isPercentage.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            {watch(`deductionDetails[${index}].isPercentage`) === "Yes" ? "Percentage" : "Amount"} <span className="text-red-600">*</span>
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            {...register(`deductionDetails[${index}].amount`, {
                              required: "Amount is required",
                              valueAsNumber: true,
                              min: watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? 1 : undefined,  // For percentage, min value is 1
                              // max: watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? 100 : undefined, // For percentage, max value is 100, else no max
                            })}
                            className={`${inputClassName} ${errors.deductionDetails?.[index]?.amount
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />

                          {errors.deductionDetails?.[index]?.amount && (
                            <p className="text-red-500 text-sm">
                              {errors.deductionDetails[index].amount.message}
                            </p>
                          )}
                        </div>
                        <div className="py-2">
                          {(
                            <div className="flex justify-end items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  removeDeduction(index)
                                }}
                                className="text-rose-800 hover:text-rose-900 flex items-center justify-center p-1 rounded-lg"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendDeduction({

                    })
                  }
                  className={`${formButtonClassName} mx-3 mb-2`}
                >
                  Add Deduction
                </button>
              </div>
            </div>
          </div>


          <div className="flex justify-end m-4">
            <button
              type="submit"
              disabled={standardPayrollLoading}
              className={`${standardPayrollLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {standardPayrollLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>

      </div>
    </GlobalLayout>
  );
};

export default UpdateStandardPayroll;
