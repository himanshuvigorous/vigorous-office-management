import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, optionLabelForBankSlect } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { getcontraDetails, updatecontra } from "./contraFeature/_contra_reducers";
import { decrypt } from "../../../config/Encryption";
import moment from "moment";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";

const EditContra = () => {
  
  
  const { loading: contraLoading } = useSelector(
    (state) => state.contra
  );
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branchDetailsData, loading: branchDetailsLoading } = useSelector((state) => state.branch);
  const { employeList } = useSelector(
    (state) => state.employe
  );
  const { contraDetails } = useSelector(
    (state) => state.contra
  );

  const { contraIdEnc } = useParams();
  const contraId = decrypt(contraIdEnc);



  const onSubmit = (data) => {

    if (data?.type === "bank_transfer") {
      const finalPayload = {
        _id: contraId,
        companyId: contraDetails?.companyId,
        directorId: contraDetails?.directorId,
        branchId: contraDetails?.branchId,
        "senderUserId": "",
        "receiverUserId": "",
        "senderBankAccId": data?.PDbanktransferSenderBankId,
        "receiverBankAccId": data?.PDBankTransferReciever,
        "type": data?.type,
        "amount": + data?.amount,
        "date": data?.date,
        "naration": data?.naration
      };
      dispatch(updatecontra(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    } else if (data?.type === "cash_deposit") {
      const finalPayload = {
        _id: contraId,
        companyId: contraDetails?.companyId,
        directorId: contraDetails?.directorId,
        branchId: contraDetails?.branchId,
        "senderUserId": data?.cashDepositemployee?.value,
        "receiverUserId": "",
        "senderBankAccId": '',
        "receiverBankAccId": data?.PDCashDepositBankId,
        "type": data?.type,
        "amount": + data?.amount,
        "date": data?.date,
        "naration": data?.naration
      };
      dispatch(updatecontra(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    } else if (data?.type === "cash_withdraw") {
      const finalPayload = {
        _id: contraId,
        companyId: contraDetails?.companyId,
        directorId: contraDetails?.directorId,
        branchId: contraDetails?.branchId,
        "senderUserId": "",
        "receiverUserId": data?.cashWithdrwaemployee?.value,
        "senderBankAccId": data?.PDCashWithdrwaBankId,
        "receiverBankAccId": '',
        "type": data?.type,
        "amount": + data?.amount,
        "date": data?.date,
        "naration": data?.naration
      };
      dispatch(updatecontra(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    }
  };


  useEffect(() => {
    dispatch(getcontraDetails({
      _id: contraId
    }))
  }, [])
  useEffect(() => {
    if (contraDetails) {
      setValue("type", contraDetails?.type);
      setValue("amount", contraDetails?.amount);
      setValue("date", moment(contraDetails?.date).format("YYYY-MM-DD"));
      setValue("naration", contraDetails?.naration);

      if (contraDetails?.type === "bank_transfer") {
        dispatch(getBranchDetails({ _id: contraDetails?.branchId })).then((data) => {
          if (!data?.error) {
            setValue("PDbanktransferSenderBankId", contraDetails?.senderBankAccId);
            setValue("PDBankTransferReciever", contraDetails?.receiverBankAccId);
          }
        });
      } else if (contraDetails?.type === "cash_deposit") {
        dispatch(getBranchDetails({ _id: contraDetails?.branchId })).then((data) => {
          if (!data?.error) {
            setValue("PDCashDepositBankId", contraDetails?.receiverBankAccId);
          }
        });

        const reqPayload = {
          text: "",
          status: true,
          sort: true,
          isTL: "",
          isHR: "",
          isPagination: false,
          departmentId: '',
          designationId: '',
          companyId: contraDetails?.companyId,
          branchId: contraDetails?.branchId,
        };

        dispatch(employeSearch(reqPayload)).then((data) => {
          if (!data?.error) {
            const filteredData = data?.payload?.data?.docs?.find((emp) => emp?._id === contraDetails?.senderUserId);
            setValue("cashDepositemployee", { value: filteredData?._id, label: filteredData?.fullName });
          }
        });
      } else if (contraDetails?.type === "cash_withdraw") {
        dispatch(getBranchDetails({ _id: contraDetails?.branchId })).then((data) => {
          if (!data?.error) {
            setValue("PDCashWithdrwaBankId", contraDetails?.senderBankAccId);
          }
        });

        const reqPayload = {
          text: "",
          status: true,
          sort: true,
          isTL: "",
          isHR: "",
          isPagination: false,
          departmentId: '',
          designationId: '',
          companyId: contraDetails?.companyId,
          branchId: contraDetails?.branchId,
        };

        dispatch(employeSearch(reqPayload)).then((data) => {
          if (!data?.error) {
            const filteredData = data?.payload?.data?.docs?.find((emp) => emp?._id === contraDetails?.receiverUserId);
            setValue("cashWithdrwaemployee", { value: filteredData?._id, label: filteredData?.fullName });
          }
        });

      }
    }
  }, [contraDetails]);


  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:my-1 px-3 md:mt-4">

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Type <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("type", {
                  required: "Type is required"
                })}
                className={`${inputClassName}  ${errors.type
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
              >

                <option value='cash_deposit'>
                  Cash Deposit
                </option>
                <option value='cash_withdraw'>
                  Cash Withdraw
                </option>
                <option value='bank_transfer'>
                  Bank Transfer
                </option>

              </select> */}

              <Controller
                control={control}
                name="type"
                rules={{ required: "type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName}  ${errors.type
                      ? "border-[1px] "
                      : "border-gray-300"
                      } `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value='cash_deposit'>
                      Cash Deposit
                    </Select.Option>
                    <Select.Option value='cash_withdraw'>
                      Cash Withdraw
                    </Select.Option>
                    <Select.Option value='bank_transfer'>
                      Bank Transfer
                    </Select.Option>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-sm">
                  {errors.type.message}
                </p>
              )}
            </div>

            {watch("type") === "bank_transfer" &&

              <>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Sender Bank <span className="text-red-600">*</span>
                  </label>
                  {/* <select

                    {...register("PDbanktransferSenderBankId",)}
                    className={`${inputClassName}  ${errors.PDbanktransferSenderBankId
                      ? "border-[1px] "
                      : "border-gray-300"
                      } `}
                  // onFocus={handleFocusCompany}
                  >

                    <option value=''>
                      select bank
                    </option>
                    {
                      branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                      branchDetailsData.data.bankData.map((type) => (
                        <option key={type._id} value={type._id}>
                          {`${type.bankName} (${type.branchName})`}
                        </option>
                      ))
                    }
                  </select> */}

                  <Controller
                    control={control}
                    name="PDbanktransferSenderBankId"
                    rules={{ required: "bank name is required" }}
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
                        <Select.Option value="">Select Bank</Select.Option>
                        {branchDetailsLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> :
                          (branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                            branchDetailsData.data.bankData.map((type) => (
                              <Select.Option key={type._id} value={type._id}>
                             {optionLabelForBankSlect(type)}
                              </Select.Option>
                            )))
                        }
                      </Select>
                    )}
                  />
                  {errors.PDbanktransferSenderBankId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDbanktransferSenderBankId.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Reciever Bank <span className="text-red-600">*</span>
                  </label>
                  {/* <select

                    {...register("PDBankTransferReciever",)}
                    className={`${inputClassName}  ${errors.PDBankTransferReciever
                      ? "border-[1px] "
                      : "border-gray-300"
                      } `}
                  // onFocus={handleFocusCompany}
                  >

                    <option value=''>
                      select bank
                    </option>
                    {
                      branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                      branchDetailsData.data.bankData.map((type) => (
                        <option key={type._id} value={type._id}>
                          {`${type.bankName} (${type.branchName})`}
                        </option>
                      ))
                    }
                  </select> */}
                  <Controller
                    control={control}
                    name="PDBankTransferReciever"
                    rules={{ required: "bank Name is required" }}
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
                        <Select.Option value="">Select Bank</Select.Option>
                        {branchDetailsLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> :
                          (branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                            branchDetailsData.data.bankData.map((type) => (
                              <Select.Option key={type._id} value={type._id}>
                           {optionLabelForBankSlect(type)}
                              </Select.Option>)
                            ))
                        }
                      </Select>
                    )}
                  />
                  {errors.PDBankTransferReciever && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBankTransferReciever.message}
                    </p>
                  )}
                </div>
              </>
            }
            {watch("type") === "cash_deposit" &&

              <>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>Employee</label>
                  <Controller
                    name="cashDepositemployee"
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
                        className={`${inputLabelClassNameReactSelect} ${errors.cashDepositemployee ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {errors.cashDepositemployee && <p className="text-red-500 text-sm">{errors.cashDepositemployee.message}</p>}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Reciever  Bank<span className="text-red-600">*</span>
                  </label>
                  {/* <select

                    {...register("PDCashDepositBankId",)}
                    className={`${inputClassName}  ${errors.PDCashDepositBankId
                      ? "border-[1px] "
                      : "border-gray-300"
                      } `}
                  // onFocus={handleFocusCompany}
                  >

                    <option value=''>
                      select bank
                    </option>
                    {
                      branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                      branchDetailsData.data.bankData.map((type) => (
                        <option key={type._id} value={type._id}>
                          {`${type.bankName} (${type.branchName})`}
                        </option>
                      ))
                    }
                  </select> */}
                  <Controller
                    control={control}
                    name="PDCashDepositBankId"
                    rules={{ required: "bank Name is required" }}
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
                        <Select.Option value="">Select Bank</Select.Option>
                        {
                          branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                          branchDetailsData.data.bankData.map((type) => (
                            <option key={type._id} value={type._id}>
                             {optionLabelForBankSlect(type)}
                            </option>
                          ))
                        }
                      </Select>
                    )}
                  />
                  {errors.PDCashDepositBankId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCashDepositBankId.message}
                    </p>
                  )}
                </div>
              </>
            }
            {watch("type") === "cash_withdraw" &&

              <>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Sender Bank <span className="text-red-600">*</span>
                  </label>
                  {/* <select

                    {...register("PDCashWithdrwaBankId",)}
                    className={`${inputClassName}  ${errors.PDCashWithdrwaBankId
                      ? "border-[1px] "
                      : "border-gray-300"
                      } `}
                  // onFocus={handleFocusCompany}
                  >

                    <option value=''>
                      select bank
                    </option>
                    {
                      branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                      branchDetailsData.data.bankData.map((type) => (
                        <option key={type._id} value={type._id}>
                          {`${type.bankName} (${type.branchName})`}
                        </option>
                      ))
                    }
                  </select> */}

                  <Controller
                    control={control}
                    name="PDCashWithdrwaBankId"
                    rules={{ required: "bank Name is required" }}
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
                        <Select.Option value="">Select Bank</Select.Option>
                        {
                          branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                          branchDetailsData.data.bankData.map((type) => (
                            <option key={type._id} value={type._id}>
                              {/* {`${type.bankName} (${type.branchName})`} */}
                               {optionLabelForBankSlect(type)}
                            </option>
                          ))
                        }
                      </Select>
                    )}
                  />
                  {errors.PDCashWithdrwaBankId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCashWithdrwaBankId.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}> Reciever Employee</label>
                  <Controller
                    name="cashWithdrwaemployee"
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
                        className={`${inputLabelClassNameReactSelect} ${errors.cashWithdrwaemployee ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {errors.cashWithdrwaemployee && <p className="text-red-500 text-sm">{errors.cashWithdrwaemployee.message}</p>}
                </div>

              </>
            }


            <div className="">
              <label className={`${inputLabelClassName}`}>
                Amount <span className="text-red-600">*</span>
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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Naration <span className="text-red-600">*</span>
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
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
                className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Date"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">
                  {errors.date.message}
                </p>
              )}
            </div>

          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={contraLoading}
              className={`${contraLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {contraLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditContra;
