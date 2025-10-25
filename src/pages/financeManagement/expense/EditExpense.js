import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, generateFinancialYearPairs, getDefaultFinacialYear, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, months, optionLabelForBankSlect, quarter, sortByPropertyAlphabetically } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { getExpenseDetails, updateExpense } from "./expenseFeature/_expense_reducers";
import { decrypt } from "../../../config/Encryption";
import moment from "moment";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { Radio, Select } from "antd";
import ListLoader from "../../../global_layouts/ListLoader";
import { RiDeleteBin5Line } from "react-icons/ri";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import Loader2 from "../../../global_layouts/Loader/Loader2";

const EditExpense = () => {
  const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { expenseIdEnc } = useParams();
  const expenseId = decrypt(expenseIdEnc);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { expenseDetails } = useSelector((state) => state.expense);

  const { clientList } = useSelector((state) => state.client);
  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
  const { clientGroupList, loader: groupnameLoading } = useSelector(state => state.clientGroup);
  const { expenseTypeList } = useSelector(state => state.expenceHead);
  const { fields, append, remove } = useFieldArray({ control, name: "expenceHead" });
  const [expenseDataLoader, setexpenseDataLoader] = useState(false)

  console.log(expenseDetails,'expenseDetails')

  const onSubmit = (data) => {
    const heads = data?.expenceHead?.map((head) => ({
      "headId": head?.expenseTypeId,
      "type": head?.isPeriod,
      "financialYear": head?.financialYear,
      "monthName": head?.isPeriod === "Monthly" ? head?.monthName : "",
      "monthQuaters": head?.isPeriod === "Quaterly" ? head?.quarterName : "",
      "headType": "head",
      "description": "",
      "amount": 0
    }))
    const finalPayload = {
      _id: expenseId,
      companyId: expenseDetails?.companyId,
      directorId: expenseDetails?.directorId,
      branchId: expenseDetails?.branchId,
      clientGroupId: data?.groupName,
      employeId: data?.paymentMode === "cash" ? data?.employeeId?.value : null,
      bankAccId: data?.paymentMode !== "cash" ? data?.bankId : null,
      paymentMode: data?.paymentMode,
      chequeNo: data?.paymentMode === "cheque" ? data?.chequeNo : null,
      transactionNo: data?.paymentMode === "bank" ? data?.transactionNo : null,
      totalAmount: + data?.amount,
      naration: data?.naration,
      date: moment(data?.date).format("YYYY-MM-DD"),
      expenseTypeId: null,
      clientId: data?.clientId,
      heads: heads,
    };

    dispatch(updateExpense(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  useEffect(() => {
    dispatch(getExpenseDetails({
      _id: expenseId
    }))
  }, [])

  
      const clientId = useWatch({
      control,
      name: "clientId",
      defaultValue: '',
    });

  useEffect(() => {
    if (expenseDetails) {
      setexpenseDataLoader(true)

      dispatch(
        clientGrpSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
          groupId: "",
          companyId: expenseDetails?.companyId,
          branchId: expenseDetails?.branchId,
        })
      ).then((data) => {
        if (!data?.error) {
          setValue("groupName", expenseDetails?.clientGroupId)
        }
      })

      dispatch(clientSearch({
        text: "",
        status: true,
        sort: true,
        isPagination: false,
        departmentId: '',
        designationId: '',
        companyId: expenseDetails?.companyId,
        branchId: expenseDetails?.branchId,
        groupId: expenseDetails?.clientGroupId,
      })).then((data) => {
        if (!data?.error) {
          setValue("clientId", expenseDetails?.clientId)
        }
      })

      dispatch(expenseTypeSearch({
        directorId: "",
        companyId: expenseDetails?.companyId,
        branchId: expenseDetails?.branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": false,
      })).then((data) => {
        if (!data?.error) {
          const heads = expenseDetails?.heads?.map((head) => ({
            expenseTypeId: head?.headId,
            isPeriod: head?.type,
            financialYear: head?.financialYear,
            monthName: head?.monthName,
            quarterName: head?.monthQuaters,
          }))
          setValue("expenceHead", heads)
        }
      })
      setValue("paymentMode", expenseDetails?.paymentMode);
      setValue("amount", expenseDetails?.totalAmount);
      setValue("date", dayjs(expenseDetails?.date));
      setValue("naration", expenseDetails?.naration);




      if (expenseDetails?.paymentMode === "bank" || expenseDetails?.paymentMode === "cheque") {
        dispatch(getBranchDetails({ _id: expenseDetails?.branchId })).then((data) => {
          if (!data?.error) {
            setValue("bankId", expenseDetails?.bankAccId);
            setValue("transactionNo", expenseDetails?.transactionNo);
            setValue("chequeNo", expenseDetails?.chequeNo);
          }
        });
      } else if (expenseDetails?.paymentMode === "cash") {
        const reqPayload = {
          text: "",
          status: true,
          sort: true,
          isTL: "",
          isHR: "",
          isPagination: false,
          departmentId: '',
          designationId: '',
          companyId: expenseDetails?.companyId,
          branchId: expenseDetails?.branchId,
        };

        dispatch(employeSearch(reqPayload)).then((data) => {
          if (!data?.error) {
            const filteredData = data?.payload?.data?.docs?.find((emp) => emp?._id === expenseDetails?.employeId);
            setValue("employeeId", { value: filteredData?._id, label: filteredData?.fullName });
          }
        });
      }
      setexpenseDataLoader(false)
    }
  }, [expenseDetails]);
  const handleFocusClientGrp = () => {
    dispatch(
      clientGrpSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
        companyId: expenseDetails?.companyId,
        branchId: expenseDetails?.branchId,
      })
    );
  };


  return (
    <GlobalLayout>
      {expenseDataLoader ? <Loader2 /> : <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Group Type <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="groupName"
                rules={{ required: "Group Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onFocus={handleFocusClientGrp}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Group Type</Select.Option>
                    {groupnameLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : sortByPropertyAlphabetically(clientGroupList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.groupName && (
                <p className="text-red-500 text-sm">
                  {errors.groupName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Client<span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="clientId"
                rules={{ required: "client  is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onFocus={() => {
                      const reqPayload = {
                        directorId: "",
                        companyId: expenseDetails?.companyId,
                        branchId: expenseDetails?.branchId,
                        groupId: watch("groupName"),
                        "text": "",
                        "sort": true,
                        "status": "",
                        "isPagination": false,
                      }
                      dispatch(clientSearch(reqPayload))
                    }}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Client </Select.Option>
                    {sortByPropertyAlphabetically(clientList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.clientId && (
                <p className="text-red-500 text-sm">
                  {errors.clientId.message}
                </p>
              )}
            </div>
            {fields.map((field, index) => (
              <div className="border border-gray-300 rounded-md">
                <div className="flex flex-col items-end">
                  <div className="w-full bg-header flex justify-end items-center rounded-tl-md rounded-tr-md p-1 min-h-5">
                    {index !== 0 && <button type="button" onClick={() => remove(index)}>
                      <RiDeleteBin5Line
                        className="text-white w-12 hover:text-white"
                        size={20}
                      />
                    </button>}
                  </div>
                </div>
                <div
                  className={`grid ${watch(`expenceHead[${index}].isPeriod`) === "Yearly"
                    ? "grid-cols-1 md:grid-cols-3"
                    : watch(`expenceHead[${index}].isPeriod`)
                      ? "grid-cols-1 md:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-3"
                    } md:gap-4 md:my-1 px-3 md:mt-4`}
                >
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Department <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      placeholder={'Select Department'}
                      name={`expenceHead[${index}].expenseTypeId`}
                      rules={{ required: "Department is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.expenseTypeId
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option className="" value="">
                            Select Department
                          </Select.Option>
                          {clientList.find((value)=>value?._id==clientId)?.departmentIdList?.map((element) => (                        
                                                     
                                                     <Select.Option value={element?._id}>
                                                        {element?.name}
                                                      </Select.Option>
                                      ))}
                        </Select>
                      )}
                    />

                    {errors.expenceHead?.[index]?.expenseTypeId && (
                      <p className="text-red-500 text-sm">
                        {errors.expenceHead?.[index]?.expenseTypeId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Financial Year <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name={`expenceHead[${index}].financialYear`}
                      rules={{ required: "Financial year is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder={'Select Financial year'}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Financial year</Select.Option>
                          {generateFinancialYearPairs().map((year, index) => (
                            <Select.Option key={index} value={year}>
                              {year}
                            </Select.Option>
                          ))}

                        </Select>
                      )}
                    />
                    {errors.expenceHead?.[index]?.financialYear && (
                      <p className="text-red-500 text-sm">
                        {errors.expenceHead?.[index]?.financialYear.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Type <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name={`expenceHead[${index}].isPeriod`}
                      rules={{ required: "Type is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Type</Select.Option>
                          <Select.Option value="Quaterly"> Quaterly</Select.Option>
                          <Select.Option value="Monthly">Monthly</Select.Option>
                          <Select.Option value="Yearly">Yearly</Select.Option>
                        </Select>
                      )}
                    />
                    {errors.expenceHead?.[index]?.isPeriod && (
                      <p className="text-red-500 text-sm">
                        {errors.expenceHead?.[index]?.isPeriod.message}
                      </p>
                    )}
                  </div>

                  {watch(`expenceHead[${index}].isPeriod`) === "Quaterly" && (
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Quarter <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        control={control}
                        name={`expenceHead[${index}].quarterName`}
                        rules={{ required: "Reset Month is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={""}
                            className={`${inputAntdSelectClassName} `}
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            <Select.Option value="">
                              Select Quarter
                            </Select.Option>
                            {quarter.map((qtr) => (
                              <Select.Option key={qtr} value={qtr}>
                                {qtr}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.expenceHead?.[index]?.quarterName && (
                        <p className="text-red-500 text-sm">
                          {errors.expenceHead?.[index]?.quarterName.message}
                        </p>
                      )}
                    </div>
                  )}

                  {watch(`expenceHead[${index}].isPeriod`) === "Monthly" && (
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Month <span className="text-red-600">*</span>
                      </label>

                      <Controller
                        control={control}
                        name={`expenceHead[${index}].monthName`}
                        rules={{ required: "Month is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={""}
                            className={`${inputAntdSelectClassName} `}
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            <Select.Option value="">Select Month</Select.Option>
                            {months.map((month) => (
                              <Select.Option key={month} value={month}>
                                {month}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.expenceHead?.[index]?.monthName && (
                        <p className="text-red-500 text-sm">
                          {errors.expenceHead?.[index]?.monthName.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({ taskType: '', amount: "", financialYear: getDefaultFinacialYear() })
              }
              className={
                watch("isAlltask")
                  ? "hidden"
                  : "bg-header text-white p-2 px-4 rounded mt-4"
              }
            >
              Add Expense Head
            </button>

            <div>
              <div className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-1 md:gap-2 md:my-1  md:mt-2">
                  <div className="">
                    <div className="flex items-center gap-4">
                      <label className="your-input-label-class">
                        <Controller
                          name="paymentMode"
                          control={control}
                          defaultValue="cash"
                          rules={{ required: "Type is required" }}
                          render={({ field }) => (
                            <Radio.Group defaultValue={"cash"} {...field}>
                              <Radio className={`${inputLabelClassName}`} value="cash">Cash</Radio>
                              {/* <Radio className={`${inputLabelClassName}`} value="cheque">Cheque</Radio> */}
                              <Radio className={`${inputLabelClassName}`} value="bank">Bank</Radio>
                            </Radio.Group>
                          )}
                        />
                      </label>
                      {errors.type && <span className="error-message">{errors.type.message}</span>}
                    </div>
                    {errors.type && (
                      <p className="text-red-500 text-sm">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                  {watch("paymentMode") !== "cash" && <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Sender Bank<span className="text-red-600">*</span>
                    </label>

                    <Controller
                      control={control}
                      name="bankId"
                      rules={{ required: "bankId is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          className={`${inputAntdSelectClassName} `}
                          onFocus={() => {
                            dispatch(getBranchDetails({
                              _id: expenseDetails?.branchId
                            }))
                          }}
                        >
                          <Select.Option value="">Select Bank</Select.Option>
                          {
                            branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                            branchDetailsData.data.bankData.map((type) => (
                              <Select.Option key={type._id} value={type._id}>
                                {optionLabelForBankSlect(type)}
                                {/* {`${type.bankName} (${type.branchName})`} */}
                              </Select.Option>
                            ))
                          }         </Select>
                      )}
                    />

                    {errors.bankId && (
                      <p className="text-red-500 text-sm">
                        {errors.bankId.message}
                      </p>
                    )}
                  </div>}
                  {watch("paymentMode") === "cash" && <div className="w-full">
                    <label className={`${inputLabelClassName}`}>Employee</label>
                    <Controller
                      name="employeeId"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          options={employeList?.map((employee) => ({
                            value: employee?._id,
                            label: employee?.fullName,
                          }))}
                          classNamePrefix="react-select"
                          className={`${inputLabelClassNameReactSelect} ${errors.employeeId ? "border-[1px] " : "border-gray-300"}`}
                          placeholder="Select Employee"
                        />
                      )}
                    />
                    {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
                  </div>}
                  {watch("paymentMode") === "cheque" && <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Cheque No
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type=""
                      {...register("chequeNo", {
                        required: "chequeNo is required",

                      })}
                      className={` ${inputClassName} ${errors.chequeNo ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Cheque no"
                    />
                    {errors.chequeNo && (
                      <p className="text-red-500 text-sm">
                        {errors.chequeNo.message}
                      </p>
                    )}
                  </div>}
                  {watch("paymentMode") === "bank" && <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Transaction No
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("transactionNo", {
                        required: "transaction No is required",

                      })}
                      className={` ${inputClassName} ${errors.transactionNo ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter transaction no"
                    />
                    {errors.transactionNo && (
                      <p className="text-red-500 text-sm">
                        {errors.transactionNo.message}
                      </p>
                    )}
                  </div>}
                </div>
                <div className="">

                  <div>
                    <label className={`${inputLabelClassName}`}>Payment Date</label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker field={field} errors={errors} />
                      )}
                    />
                    {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Naration<span className="text-red-600">*</span>
              </label>
              <textarea

                {...register("naration", {
                  required: "Naration is required",

                })}
                className={` ${inputClassName} ${errors.naration ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Naration"
              ></textarea>
              {errors.naration && (
                <p className="text-red-500 text-sm">
                  {errors.naration.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Amount<span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                 step="0.01"
                {...register("amount", {
                  required: "Amount is required",

                })}
                className={` ${inputClassName} ${errors.amount ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>}
    </GlobalLayout>
  );
};

export default EditExpense;
