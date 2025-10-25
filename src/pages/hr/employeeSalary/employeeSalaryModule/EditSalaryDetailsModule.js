import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  formButtonClassName,
  inputAntdSelectClassName,
  inputClassName,
  inputDisabledClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import {
  DownOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector, } from "react-redux";
import { empDoctSearch, getEmployeeDocument } from "../../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { useNavigate } from "react-router-dom";
import {
} from "../../../employeManagement/employeFeatures/_employe_reducers";
import CommonImageViewer from "../../../../global_layouts/ImageViewrModal/CommonImageViewer";
import { Select, Tooltip } from "antd";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import ListLoader from "../../../../global_layouts/ListLoader";
import IncrementHistoryModal from "./IncrementHistoryModal";
import { incrementList } from "./employeeSalaryFeatures/_employee_salary_reducers";
import getUserIds from "../../../../constents/getUserIds";
import { banknameSearch } from "../../../global/other/bankname/bankNameFeatures/_bankName_reducers";

function EditSalaryDetailsModule({ step, errors, setValue, register, watch, control, currentPackage, isESIC, IsPf, formErrors, handleAddMore, documents, setDocuments, employeeDocumentListLoading, banks, setBanks, handleInputChangeBank, handleBankFileChange, handleDeleteBankImage, handleDeleteDoctImage, loadingUpdateFile, handleInputChange, employeeDocumentList, handleFileChange, handleDelete, formErrorsBank, onBoardingDetailsData }) {
  const { incrementListData } = useSelector(state => state.salaryDetails)
  const calculatedBasicSalary = useWatch({
    control,
    name: "calculatedBasicSalary",
    defaultValue: "",
  });
  const basicSalaryPercentage = useWatch({
    control,
    name: "basicSalaryPercentage",
    defaultValue: "",
  });
  const currentSalary = useWatch({
    control,
    name: "currentSalary",
    defaultValue: "",
  });
  const [incrementModalOpen, setIncrementModalOpen] = useState({
    isOpen: false,
    data: null,
  })

  const { bankNameListData, loading: bankNameListLoading } = useSelector((state) => state.bankname);

  useEffect(() => {
    dispatch(
      banknameSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
  }, []);

  useEffect(() => {
    if (basicSalaryPercentage, currentSalary) {
      const basicSalaryCalc = Number(currentSalary) * Number(basicSalaryPercentage) / 100
      setValue('calculatedBasicSalary', basicSalaryCalc)
    }
  }, [basicSalaryPercentage, currentSalary])

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        incrementlistFunc()
        await dispatch(empDoctSearch({ isPagination: false, companyId: getUserIds()?.userCompanyId, }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const incrementlistFunc = async () => {
    await dispatch(incrementList({
      "text": "",
      "status": "",
      "sort": true,
      "isPagination": false,
      companyId: onBoardingDetailsData?.companyId,
      directorId: onBoardingDetailsData?.directorId,
      branchId: onBoardingDetailsData?.branchId,
      employeId: onBoardingDetailsData?.employeId,
    }));
  }

  const { Option } = Select

  return (
    <>

      {step === 9 && (
        <div>
          <IncrementHistoryModal
            onClose={() => setIncrementModalOpen({
              data: null,
              isOpen: false
            })}
            incrementlistFunc={incrementlistFunc}
            onBoardingDetailsData={onBoardingDetailsData}
            isOpen={incrementModalOpen?.isOpen}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">

            <div>
              <label className={`${inputLabelClassName}`}>
                Current Package (yearly) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("currentPackage", {
                  required: "Current Package is required",
                })}
                className={`${inputClassName} ${errors.currentPackage ? "border-[1px] " : ""
                  }`}
                placeholder="Enter Current Package"
              />
              {errors.currentPackage && (
                <p className="text-red-600 text-sm">
                  {errors.currentPackage?.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Last Increment Date  <span className="text-red-600">*</span>
              </label>
              <Controller
                name={'salarystartDate'}
                control={control}
                rules={{ required: "Last Increment Date is required" }}
                render={({ field }) => (
                  <CustomDatePicker format="DD/MM/YYYY" picker="date" field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment(onBoardingDetailsData?.generalInfo?.dateOfJoining).endOf('day'), 'day');
                  }} />
                )}
              />

              {errors.salarystartDate && (
                <p className="text-red-500 text-sm">
                  {errors.salarystartDate?.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Next Increment Date  <span className="text-red-600">*</span>
              </label>
              <Controller
                name={'salaryEndDate'}
                control={control}
                rules={{ required: "salaryEndDate is required" }}
                render={({ field }) => (
                  <CustomDatePicker format="DD/MM/YYYY" picker="date" field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment(onBoardingDetailsData?.generalInfo?.dateOfJoining).endOf('day'), 'day');
                  }} />
                )}
              />

              {errors.salaryEndDate && (
                <p className="text-red-500 text-sm">
                  {errors.salaryEndDate?.message}
                </p>
              )}
            </div>

            {/* Current Salary */}
            {currentPackage > 0 && <div>
              <label className={`${inputLabelClassName}`}>
                Current Salary (monthly)
              </label>
              <input
                type="number"
                {...register("currentSalary", {

                })}
                className={`${inputDisabledClassName} ${errors.currentSalary ? "border-[1px] " : ""
                  }`}
                placeholder="Current Salary"
                disabled
              />
              {errors.currentSalary && (
                <p className="text-red-600 text-sm">
                  {errors.currentSalary?.message}
                </p>
              )}
            </div>
            }

            {currentPackage > 0 &&
              <div>
                <label className={`${inputLabelClassName}`}>
                  Per Day Salary
                </label>
                <input
                  type="number"
                  {...register("perDaySalary", {

                  })}
                  className={`${inputDisabledClassName} ${errors.perDaySalary ? "border-[1px] " : ""
                    }`}
                  placeholder="Per Day Salary"
                  disabled
                />
                {errors.perDaySalary && (
                  <p className="text-red-600 text-sm">
                    {errors.perDaySalary?.message}
                  </p>
                )}
              </div>
            }
            <div>
              <label className={`${inputLabelClassName}`}>
                basic salary percentage (%)
              </label>
              <input
                type="number"
                {...register("basicSalaryPercentage", {
                  required: "Percentage is required",
                })}
                className={`${inputClassName} ${errors.basicSalaryPercentage ? "border-[1px] " : ""
                  }`}
                placeholder="basic salary percentage"

              />
              {errors.basicSalaryPercentage && (
                <p className="text-red-600 text-sm">
                  {errors.basicSalaryPercentage?.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Claculated Basic Salary
              </label>
              <input
                type="number"
                disabled
                {...register("calculatedBasicSalary", {

                })}
                className={`${inputDisabledClassName} ${errors.calculatedBasicSalary ? "border-[1px] " : ""
                  }`}
                placeholder="Claculated Basic Salary"

              />
              {errors.calculatedBasicSalary && (
                <p className="text-red-600 text-sm">
                  {errors.calculatedBasicSalary?.message}
                </p>
              )}
            </div>

            <div></div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Is ESIC <span className="text-red-600">*</span>
              </label>
              <Controller
                name="isESIC"
                control={control}
                rules={{ required: "isESIC is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.isESIC ? '' : 'border-gray-300'}`}
                    placeholder="Select Is Esic"
                  >
                    <Option value={''}>Select isESIC</Option>
                    <Option value={'true'}>Yes</Option>
                    <Option value={'false'}>No</Option>
                  </Select>
                )}
              />
              {errors.isESIC && (
                <p className="text-red-600 text-sm">{errors.isESIC?.message}</p>
              )}
            </div>
            {(isESIC === 'true' || isESIC === true) && <div>
              <label className={`${inputLabelClassName}`}>
                ESIC Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text" // Change to text to allow regex-based validation
                {...register("esicNumber", {
                  required: "ESIC Number is required",  // Field is required
                  // pattern: {
                  //   //value: /^\d{17}$/, // Regex for exactly 17 digits
                  //   message: "ESIC Number must be a 17-digit number", // Error message if pattern doesn't match
                  // },
                  // minLength: {
                  //   value: 17,  // Ensures that it has at least 17 characters
                  //   message: "ESIC Number must be exactly 17 digits long",  // Error message for min length
                  // },
                  // maxLength: {
                  //   value: 17,  // Ensures that it doesn't exceed 17 characters
                  //   message: "ESIC Number must be exactly 17 digits long",  // Error message for max length
                  // },
                })}
                className={`${inputClassName} ${errors.esicNumber ? "border-[1px] " : ""
                  }`}
                // maxLength={17}
                // onInput={(e) => {
                //   if (e.target.value.length > 17) {
                //     e.target.value = e.target.value.slice(0, 17);
                //   }
                // }}
                placeholder="Enter ESIC Number"
              />
              {errors.esicNumber && (
                <p className="text-red-600 text-sm">
                  {errors.esicNumber?.message}
                </p>
              )}
            </div>}
            {(isESIC === 'true' || isESIC === true) && (
              <>
                <div>
                  <label className={`${inputLabelClassName}`}>
                    ESIC Calculated From <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="esicType"
                    control={control}
                    rules={{ required: "ESIC Calculated From is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`mt-0 ${inputAntdSelectClassName} ${errors.esicType ? '' : 'border-gray-300'}`}
                        placeholder="Select ESIC Calculated From"
                      >
                        <Option value="">Select ESIC Calculated From</Option>
                        <Option value="basicSalary">Basic Salary</Option>
                        <Option value="totalSalary">Total Salary</Option>
                      </Select>
                    )}
                  />

                  {errors.esicType && (
                    <p className="text-red-600 text-sm">
                      {errors.esicType?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Esic Percentage
                  </label>
                  <input
                    type="number"
  step={0.01}
                    {...register("esicInPercentage", {

                    })}
                    className={`${inputClassName} ${errors.esicInPercentage ? "border-[1px] " : ""
                      }`}
                    placeholder="Esic Percentage"

                  />
                  {errors.esicInPercentage && (
                    <p className="text-red-600 text-sm">
                      {errors.esicInPercentage?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Maximum Esic Amount
                  </label>
                  <input
                    type="number"
  step={0.01}
                    {...register("esicMaxUpTo", {

                    })}
                    className={`${inputClassName} ${errors.esicMaxUpTo ? "border-[1px] " : ""
                      }`}
                    placeholder="Maximum Esic Amount"

                  />
                  {errors.esicMaxUpTo && (
                    <p className="text-red-600 text-sm">
                      {errors.esicMaxUpTo?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={`${inputLabelClassName}`}>
                    ESIC Applied On <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="esicAppliedOn"
                    control={control}
                    rules={{ required: "ESIC Applied On is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`mt-0 ${inputAntdSelectClassName} ${errors.esicAppliedOn ? '' : 'border-gray-300'}`}
                        placeholder="Select ESIC Applied On"
                      >
                        <Option value="">Select ESIC Applied On</Option>
                        <Option value="employee">employee</Option>
                        <Option value="employer">employer</Option>
                        <Option value="both">both</Option>
                      </Select>
                    )}
                  />

                  {errors.esicAppliedOn && (
                    <p className="text-red-600 text-sm">
                      {errors.esicAppliedOn?.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Is PF */}
            <div>
              <label className={`${inputLabelClassName}`}>
                Is PF <span className="text-red-600">*</span>
              </label>

              <Controller
                name="isPF"
                control={control}
                rules={{ required: "Is PF is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.isPF ? '' : 'border-gray-300'}`}
                    placeholder="Select Is PF"
                  >
                    <Option value={''}>Select isPF</Option>
                    <Option value={'true'}>YES</Option>
                    <Option value={'false'}>No</Option>
                  </Select>
                )}
              />
              {errors.isPF && (
                <p className="text-red-600 text-sm">{errors.isPF?.message}</p>
              )}
            </div>

            {/* UAN Number */}
            {(IsPf === "true" || IsPf === true) &&
              <div>
                <label className={`${inputLabelClassName}`}>
                  UAN Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text" // Change to text to prevent issues with leading zeros in the number
                  {...register("uanNumber", {
                    required: "UAN Number is required", // Ensures UAN is provided
                    pattern: {
                      value: /^\d{12}$/, // Regex for exactly 12 digits
                      message: "UAN Number must be a 12-digit number", // Error message for invalid UAN number
                    },
                  })}
                  className={`${inputClassName} ${errors.uanNumber ? "border-[1px] " : ""
                    }`}
                  placeholder="Enter UAN Number"
                  maxLength={12}
                  onInput={(e) => {
                    if (e.target.value.length > 12) {
                      e.target.value = e.target.value.slice(0, 12);
                    }
                  }}
                />
                {errors.uanNumber && (
                  <p className="text-red-600 text-sm">
                    {errors.uanNumber?.message} {/* Display error message */}
                  </p>
                )}
              </div>}

            {/* PF Type */}
            {(IsPf === "true" || IsPf === true) && (
              <div>
                <label className={`${inputLabelClassName}`}>
                  PF Type <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="pfType"
                  control={control}
                  rules={{ required: "PF Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`mt-0 ${inputAntdSelectClassName} ${errors.isPF ? '' : 'border-gray-300'}`}
                      placeholder="Select Is PF"
                    >
                      <Option value="">Select PF Calculated From</Option>
                      <Option value="basicSalary">Basic Salary</Option>
                      <Option value="totalSalary">Total Salary</Option>
                    </Select>
                  )}
                />

                {errors.pfType && (
                  <p className="text-red-600 text-sm">
                    {errors.pfType?.message}
                  </p>
                )}
              </div>
            )}
            {(IsPf === "true" || IsPf === true) && <div>
              <label className={`${inputLabelClassName}`}>
                PF Percentage
              </label>
              <input
                type="number"
  step={0.01}
                {...register("pfInPercentage", {
                })}
                className={`${inputClassName} ${errors.pfInPercentage ? "border-[1px] " : ""
                  }`}
                placeholder="PF Percentage"

              />
              {errors.pfInPercentage && (
                <p className="text-red-600 text-sm">
                  {errors.pfInPercentage?.message}
                </p>
              )}
            </div>}
            {(IsPf === "true" || IsPf === true) &&
              <div>
                <label className={`${inputLabelClassName}`}>
                  Maximum PF Amount
                </label>
                <input
                  type="number"
  step={0.01}
                  {...register("pfMaxUpTo", {

                  })}
                  className={`${inputClassName} ${errors.pfMaxUpTo ? "border-[1px] " : ""
                    }`}
                  placeholder="Maximum PF Amount"

                />
                {errors.pfMaxUpTo && (
                  <p className="text-red-600 text-sm">
                    {errors.pfMaxUpTo?.message}
                  </p>
                )}
              </div>}
            {(IsPf === "true" || IsPf === true) &&
              <div>
                <label className={`${inputLabelClassName}`}>
                  PF Applied On <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="pfAppliedOn"
                  control={control}
                  rules={{ required: "ESIC Applied On is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`mt-0 ${inputAntdSelectClassName} ${errors.pfAppliedOn ? '' : 'border-gray-300'}`}
                      placeholder="Select PF Applied On"
                    >
                      <Option value="">Select PF Applied On</Option>
                      <Option value="employee">employee</Option>
                      <Option value="employer">employer</Option>
                      <Option value="both">both</Option>
                    </Select>
                  )}
                />

                {errors.pfAppliedOn && (
                  <p className="text-red-600 text-sm">
                    {errors.pfAppliedOn?.message}
                  </p>
                )}
              </div>}
          </div>
          <div className="flex justify-between px-3 pb-2">
            <button type="submit" className={`${formButtonClassName}`}>
              Submit
            </button>
            <button onClick={() =>
              setIncrementModalOpen({
                isOpen: true,
                data: onBoardingDetailsData
              })
            } type="button" className={`${formButtonClassName}`}>
              Add Increment
            </button>
          </div>
          {/* <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
            <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
              <table className="w-full max-w-full rounded-xl overflow-x-auto">
                <thead className="">
                  <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                    <th className="border-none p-2 whitespace-nowrap w-[5%]">
                      S.No.
                    </th>
                    <th className="border-none p-2 whitespace-nowrap w-[10%]">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Employe Name</span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Is Percentage</span>
                      </div>{" "}
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Percentage</span>
                      </div>{" "}
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Amount</span>
                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Next Increment date</span>

                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Remark</span>

                      </div>
                    </th>
                    <th className="border-none p-2 whitespace-nowrap">
                      <div className="flex justify-start items-center space-x-1">
                        <span>Status</span>
                        <div className="flex flex-col -space-y-1.5 cursor-pointer">

                        </div>
                      </div>
                    </th>

                  </tr>
                </thead>
                <tbody>
                  {incrementListData?.docs && incrementListData?.docs?.length > 0 ? (
                    incrementListData?.docs?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >
                        <td className="whitespace-nowrap border-none p-2">
                          {index + 1}
                        </td>

                        <td className="whitespace-nowrap border-none p-2">
                          {element?.employeName}
                        </td>

                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.isPercentage ? "YES" : "NO"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.incrementPercentage}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.incrementAmount}
                        </td>
                        <td className="whitespace-nowrap border-none p-2">
                          {moment(element?.nextIncrementDate).format("YYYY-MM-DD")}
                        </td>
                        <td className="whitespace-nowrap border-none p-2">
                          {element?.remark || "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          <Tooltip placement="topLeft"  title={`Status - ${element?.status ? "Active" : "InActive"}`}>
                            <span
                              className={`${element?.status
                                ? "bg-[#E0FFBE] border-green-500"
                                : "bg-red-200 border-red-500"
                                } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                            >
                              {element?.status ?? "-"}
                            </span>
                          </Tooltip>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5 ">
                      <td
                        colSpan={9}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> */}





          <div className="bg-white rounded-lg border border-gray-200 shadow-sm ">
            <details className="group" open={false}>
              <summary className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 list-none border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  <DownOutlined className="text-xs text-gray-500 group-open:rotate-180 transition-transform" />
                  <span>Increment Records</span>
                </div>
                <span className="bg-white px-2 py-0.5 rounded-md border border-gray-300 text-xs font-medium">
                  {incrementListData?.docs?.length || 0}
                </span>
              </summary>

              <div className="overflow-x-auto">
                {incrementListData?.docs?.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {incrementListData.docs.map((element, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {element?.employeName || "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarOutlined className="text-xs" />
                              {moment(element?.nextIncrementDate).format("MMM D, YYYY")}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {element?.isPercentage ? "Percentage" : "Fixed"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <DollarOutlined className="text-xs" />
                              {element?.isPercentage
                                ? `${element?.incrementPercentage}%`
                                : element?.incrementAmount}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${element?.status === 'Approved'
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                              }`}>
                              {element?.status ?? "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                            {element?.remark && (
                              <div className="flex items-start gap-1">
                                <FileTextOutlined className="text-xs mt-0.5 text-gray-400 flex-shrink-0" />
                                <div className="w-full whitespace-normal break-words">{element.remark}</div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-gray-400">
                    <SearchOutlined className="text-lg mb-2" />
                    <p className="text-sm">No increment records found</p>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      )}
      {step === 11 && (
        <div>
          <div className="rounded-md">
            {banks.map((bank, index) => (
              <div
                key={index}
                className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3"
              >
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Account Holder Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={bank.bankholderName}
                    onChange={(e) =>
                      handleInputChangeBank(
                        index,
                        "bankholderName",
                        e.target.value
                      )
                    }
                    className={`${inputClassName} ${formErrorsBank[index]?.bankholderName
                      ? "border-[1px] "
                      : ""
                      }`}
                    placeholder="Enter Bank Holder name"
                  />
                  {formErrorsBank[index]?.bankholderName && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].bankholderName}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Bank Name <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={bank.bankName}
                    onChange={(e) =>
                      handleInputChangeBank(index, "bankName", e)
                    }
                    className={`${inputAntdSelectClassName} ${formErrorsBank[index]?.bankName
                      ? "border-[1px] "
                      : ""
                      }`}
                  >
                    <Select.Option value="">
                      Select Bank Name
                    </Select.Option>
                    {bankNameListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(bankNameListData, 'name')?.map((data) => (
                      <Select.Option key={data.name} value={data.name}>
                        {data.name}
                      </Select.Option>
                    )))}
                  </Select>
                  {formErrorsBank[index]?.bankName && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].bankName}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Branch Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={bank.branchName}
                    onChange={(e) =>
                      handleInputChangeBank(
                        index,
                        "branchName",
                        e.target.value
                      )
                    }
                    className={`${inputClassName} ${formErrorsBank[index]?.branchName
                      ? "border-[1px] "
                      : ""
                      }`}
                    placeholder="Enter Branch name"
                  />
                  {formErrorsBank[index]?.branchName && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].branchName}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Account Number<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={bank.accountNumber}
                    onChange={(e) =>
                      handleInputChangeBank(
                        index,
                        "accountNumber",
                        e.target.value
                      )
                    }
                    className={`${inputClassName} ${formErrorsBank[index]?.accountNumber
                      ? "border-[1px] "
                      : ""
                      }`}
                    placeholder="Enter Account Number"
                  />
                  {formErrorsBank[index]?.accountNumber && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].accountNumber}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    IFSC Code<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={bank.ifscCode}
                    onChange={(e) =>
                      handleInputChangeBank(
                        index,
                        "ifscCode",
                        e.target.value
                      )
                    }
                    className={`${inputClassName} ${formErrorsBank[index]?.ifscCode
                      ? "border-[1px] "
                      : ""
                      }`}
                    placeholder="Enter IFSC Code"
                  />
                  {formErrorsBank[index]?.ifscCode && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].ifscCode}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Account Type <span className="text-red-600">*</span>
                  </label>

                  <Select
                    value={bank.accountType}
                    onChange={(e) =>
                      handleInputChangeBank(
                        index,
                        "accountType",
                        e
                      )
                    }
                    className={`${inputAntdSelectClassName} ${formErrorsBank[index]?.accountType
                      ? "border-[1px] "
                      : ""
                      }`}
                  >
                    <Select.Option value="">Select Account Type</Select.Option>
                    <Select.Option className="" value="saving">
                      Saving
                    </Select.Option>
                    <Select.Option className="" value="current">
                      Current
                    </Select.Option>
                    <Select.Option className="" value="Salary">
                      Salary
                    </Select.Option>
                    <Select.Option className="" value="Joint">
                      Joint
                    </Select.Option>
                  </Select>
                  {formErrorsBank[index]?.accountType && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].accountType}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Upload
                    </label>
                    <input
                      type="file"
                      id={`bankUpload${index}`}
                      className="hidden"
                      onChange={(e) =>
                        handleBankFileChange(index, e.target.files[0])
                      }
                    />
                    <br />
                    <label
                      htmlFor={`bankUpload${index}`}
                      className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                    >
                      Upload
                    </label>
                  </div>
                  {bank?.file?.length > 0
                    ? bank.file.map((file, fileIndex) => (
                      <div key={fileIndex} className="relative">
                        <CommonImageViewer
                          // key={index}
                          src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                          alt={`Uploaded ${fileIndex + 1}`}

                        />
                        <button
                          className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={() => handleDeleteBankImage(index, file)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                    : null}
                  {formErrorsBank[index]?.file && (
                    <p className="text-red-600 text-sm">
                      {formErrorsBank[index].file}
                    </p>
                  )}
                </div>

                {/* <div className="px-3 gap-4 items-end mb-3">
                        <button
                          type="button"
                          onClick={() => handleBankDelete(bank, index)}
                          className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                        </button>
                      </div> */}
              </div>
            ))}

          </div>
          <div className="flex justify-between px-3 pb-2">
            <button type="Submit" className={`${formButtonClassName}`}>
              {loadingUpdateFile ? "Submitting ..." : "Submit Details"}
            </button>
          </div>
        </div>
      )}
      {step === 10 && (
        <div>
          <div className="rounded-md">
            {documents?.map((document, index) => (
              <div
                key={index}
                className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3"
              >
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Document Type <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={document.documentType}
                    className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "documentType",
                        e
                      )
                    }
                    placeholder="Select Document Type"
                    showSearch

                  >
                    <Select.Option value="">Select Document</Select.Option>
                    {employeeDocumentListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (employeeDocumentList
                      ?.filter((data) => data?.type === "General")

                      .map((type) => (
                        <Select.Option key={type.name} value={type.name}>
                          {type.name}
                        </Select.Option>
                      )))}

                  </Select>
                  {formErrors[index]?.documentType && (
                    <p className="text-red-600 text-sm">
                      {formErrors[index].documentType}
                    </p>
                  )}
                </div>
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Document No <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={document.documentNo}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "documentNo",
                        e.target.value
                      )
                    }
                    className={`${inputClassName} ${formErrors[index]?.documentNo
                      ? "border-[1px] "
                      : ""
                      }`}
                    placeholder="Enter Document No"
                  />
                  {formErrors[index]?.documentNo && (
                    <p className="text-red-600 text-sm">
                      {formErrors[index].documentNo}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Upload <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"

                      id={`documentUpload${index}`}
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files[0])
                      }
                    />
                    <br />
                    <label
                      htmlFor={`documentUpload${index}`}
                      className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                    >
                      Upload
                    </label>
                  </div>
                  {document?.file?.length > 0
                    ? document.file.map((file, fileIndex) => (
                      <div key={fileIndex} className="relative">
                        <CommonImageViewer
                          // key={index}
                          src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                          alt={`Uploaded ${fileIndex + 1}`}

                        />
                        <button
                          className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={() => handleDeleteDoctImage(index, file)}
                        >
                          ✕
                        </button>
                      </div>

                    ))
                    : null}
                  {formErrors[index]?.file && (
                    <p className="text-red-600 text-sm">
                      {formErrors[index].file}
                    </p>
                  )}
                </div>

                <div className="px-3 gap-4 items-end mb-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(document, index)}
                    className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                  >
                    <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between px-3 pb-2">
              <button
                type="button"
                onClick={handleAddMore}
                className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
              >
                Add More
              </button>
            </div>
          </div>
          <div className="flex justify-between px-3 pb-2">
            <button disabled={loadingUpdateFile} type="Submit" className={`${formButtonClassName}`}>
              {loadingUpdateFile ? "Submitting ..." : "Submit Details"}
            </button>
          </div>
        </div>
      )}

    </>

  );
}

export default EditSalaryDetailsModule;
