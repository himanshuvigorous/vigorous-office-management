import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  customDayjs,
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  optionLabelForBankSlect,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import {
  branchSearch,
  getBranchDetails,
} from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";

import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createcontra } from "./contraFeature/_contra_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { Select } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import dayjs from "dayjs";

const CreateContra = () => {
   const { loading:contraLoading } = useSelector(
      (state) => state.contra
    );
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList,companyListLoading } = useSelector((state) => state.company);
  const { branchList ,branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { clientList } = useSelector((state) => state.client);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { branchDetailsData,loading:branchLoading } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);


  const onSubmit = (data) => {

    if (data?.type === "bank_transfer") {
      const finalPayload = {
        companyId:
          userInfoglobal?.userType === "admin"
            ? data?.PDCompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        directorId:
          userInfoglobal?.userType === "companyDirector"
            ? userInfoglobal?._id
            : userInfoglobal?.directorId,
        branchId:
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector" ||
          userInfoglobal?.userType === "company"
            ? data?.PDBranchId
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        senderUserId: "",
        receiverUserId: "",
        senderBankAccId: data?.PDbanktransferSenderBankId,
        receiverBankAccId: data?.PDBankTransferReciever,
        type: data?.type,
        amount: +data?.amount,
        date: customDayjs(data?.date),

        naration: data?.naration,
      };
      dispatch(createcontra(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    } else if (data?.type === "cash_deposit") {
      const finalPayload = {
        companyId:
          userInfoglobal?.userType === "admin"
            ? data?.PDCompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        directorId:
          userInfoglobal?.userType === "companyDirector"
            ? userInfoglobal?._id
            : userInfoglobal?.directorId,
        branchId:
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector" ||
          userInfoglobal?.userType === "company"
            ? data?.PDBranchId
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        senderUserId: data?.cashDepositemployee?.value,
        receiverUserId: "",
        senderBankAccId: "",
        receiverBankAccId: data?.PDCashDepositBankId,
        type: data?.type,
        amount: +data?.amount,
                date: customDayjs(data?.date),

        naration: data?.naration,
      };
      dispatch(createcontra(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    } else if (data?.type === "cash_withdraw") {
      const finalPayload = {
        companyId:
          userInfoglobal?.userType === "admin"
            ? data?.PDCompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        directorId:
          userInfoglobal?.userType === "companyDirector"
            ? userInfoglobal?._id
            : userInfoglobal?.directorId,
        branchId:
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector" ||
          userInfoglobal?.userType === "company"
            ? data?.PDBranchId
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        senderUserId: "",
        receiverUserId: data?.cashWithdrwaemployee?.value,
        senderBankAccId: data?.PDCashWithdrwaBankId,
        receiverBankAccId: "",
        type: data?.type,
        amount: +data?.amount,
        date: customDayjs(data?.date),
        naration: data?.naration,
      };
      dispatch(createcontra(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    }
  };

  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination:false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);
  const handleFileChange = (file) => {
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        setValue("fileUploadLink", data?.payload?.data);
      }
    });
  };
  useEffect(() => {
    if (
      BranchId ||
      (userInfoglobal?.userType !== "company" &&
        userInfoglobal?.userType !== "companyDirector" &&
        userInfoglobal?.userType !== "admin")
    ) {
      dispatch(
        getBranchDetails({
          _id:
            userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "companyDirector" ||
            userInfoglobal?.userType === "admin"
              ? BranchId
              : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        })
      );
    }
  }, [BranchId]);

  useEffect(() => {
    if (
      (CompanyId || userInfoglobal?.userType !== "admin") &&
      (BranchId ||
        userInfoglobal?.userType !== "companBranch" ||
        userInfoglobal?.userType === "employee")
    ) {
      fetchEmployeListData();
    }
  }, [CompanyId, BranchId]);

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: "",
      designationId: "",
      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
        userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
    };
    dispatch(employeSearch(reqPayload));
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-2 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:my-1 px-3 md:mt-4">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                {/* <select
                {...register("PDCompanyId", {
                  required: "company is required",
                })}
                className={` ${inputClassName} ${errors.PDCompanyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Comapany
                </option>
                {companyList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}

              </select> */}

                <Controller
                  control={control}
                  name="PDCompanyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ?<Select.Option disabled>
                          <ListLoader />
                        </Select.Option>: (sortByPropertyAlphabetically(companyList,'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>
            )}
            {(userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector") && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Branch <span className="text-red-600">*</span>
                </label>
                {/* <select
                {...register("PDBranchId", {
                  required: "Branch is required",
                })}
                className={` ${inputClassName} ${errors.PDBranchId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Branch
                </option>
                {branchList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}
              </select> */}

                <Controller
                  control={control}
                  name="PDBranchId"
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>:(sortByPropertyAlphabetically(branchList,'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />

                {errors.PDBranchId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDBranchId.message}
                  </p>
                )}
              </div>
            )}

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Type <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("type",{
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
                    className={`${inputAntdSelectClassName}  ${
                      errors.type
                        ? "border-[1px] "
                        : "border-gray-300"
                    } `}
                      showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                  >
                    <Select.Option value="">Select Type</Select.Option>
                    <Select.Option value="cash_deposit">
                      Cash Deposit
                    </Select.Option>
                    <Select.Option value="cash_withdraw">
                      Cash Withdraw
                    </Select.Option>
                    <Select.Option value="bank_transfer">
                      Bank Transfer
                    </Select.Option>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {watch("type") === "bank_transfer" && (
              <>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Sender Bank<span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="PDbanktransferSenderBankId"
                    rules={{ required: "bankId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {branchDetailsData?.data?.bankData &&
                          branchDetailsData?.data?.bankData.length > 0 &&
                          branchDetailsData.data.bankData.map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                              {/* {`${type.bankName} (${type.branchName})`} */}
                               {optionLabelForBankSlect(type)}
                            </Select.Option>
                          ))}
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
                    Reciever Bank<span className="text-red-600">*</span>
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
                    rules={{ required: "bankId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {branchDetailsData?.data?.bankData &&
                          branchDetailsData?.data?.bankData.length > 0 &&
                          sortByPropertyAlphabetically(branchDetailsData.data.bankData,'bankName').map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                              {optionLabelForBankSlect(type)}
                            </Select.Option>
                          ))}
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
            )}
            {watch("type") === "cash_deposit" && (
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
                        options={sortByPropertyAlphabetically(employeList,'fullName')?.map((employee) => ({
                          value: employee?._id,
                          label: employee?.fullName,
                        }))}
                        classNamePrefix="react-select"
                        className={`${inputLabelClassNameReactSelect} ${
                          errors.cashDepositemployee
                            ? "border-[1px] "
                            : "border-gray-300"
                        }`}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {errors.cashDepositemployee && (
                    <p className="text-red-500 text-sm">
                      {errors.cashDepositemployee.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Reciever Bank<span className="text-red-600">*</span>
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
                    rules={{ required: "bankId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {branchLoading? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> :(branchDetailsData?.data?.bankData &&
                          branchDetailsData?.data?.bankData.length > 0 &&
                          sortByPropertyAlphabetically(branchDetailsData.data.bankData,'bankName').map((type) => (
                            <option key={type._id} value={type._id}>
                             {optionLabelForBankSlect(type)}
                            </option>
                          )))}
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
            )}
            {watch("type") === "cash_withdraw" && (
              <>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Sender Bank<span className="text-red-600">*</span>
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
                    rules={{ required: "bankId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {branchLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>:(branchDetailsData?.data?.bankData &&
                          branchDetailsData?.data?.bankData.length > 0 &&
                          sortByPropertyAlphabetically(branchDetailsData.data.bankData,'bankName').map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                               {optionLabelForBankSlect(type)}
                            </Select.Option>
                          )))}
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
                  <label className={`${inputLabelClassName}`}>
                    {" "}
                    RecieverEmployee
                  </label>
                  <Controller
                    name="cashWithdrwaemployee"
                    control={control}
                    rules={{ required: "Employee is required" }}
                    render={({ field }) => (
                      <ReactSelect
                        {...field}
                        options={sortByPropertyAlphabetically(employeList,'fullName')?.map((employee) => ({
                          value: employee?._id,
                          label: employee?.fullName,
                        }))}
                        classNamePrefix="react-select"
                        className={`${inputLabelClassNameReactSelect} ${
                          errors.cashWithdrwaemployee
                            ? "border-[1px] "
                            : "border-gray-300"
                        }`}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {errors.cashWithdrwaemployee && (
                    <p className="text-red-500 text-sm">
                      {errors.cashWithdrwaemployee.message}
                    </p>
                  )}
                </div>
              </>
            )}

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
                className={` ${inputClassName} ${
                  errors.amount
                    ? "border-[1px] "
                    : "border-gray-300"
                }`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Naration<span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("naration", {
                  required: "Naration is required",
                })}
                className={` ${inputClassName} ${
                  errors.naration
                    ? "border-[1px] "
                    : "border-gray-300"
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
                Date<span className="text-red-600">*</span>
              </label>
              {/* <input
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
                className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Date"
              /> */}
              <Controller
                name="date"
                control={control}
                rules={{
                  required: "Date  is required",
                }}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current &&
                        current.isAfter(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
          <button
              type="submit"
              disabled={contraLoading}
              className={`${contraLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded mt-3`}
            >
            {contraLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateContra;
