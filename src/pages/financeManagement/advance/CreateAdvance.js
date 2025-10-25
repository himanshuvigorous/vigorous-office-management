import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { customDayjs, domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, optionLabelForBankSlect, sortByPropertyAlphabetically } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";

import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createadvance } from "./advanceFeature/_advance_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { officeAddressSearch } from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import { Select } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";


const CreateAdvance = () => {
  const { loading: advanceLoading } = useSelector(
    (state) => state.advance
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
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector(
    (state) => state.employe
  );
  const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const { clientGroupList, groupSearchLoading } = useSelector(state => state.clientGroup);
  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "clientGroupId": data?.groupName,
      "employeId": data?.type === "cash" ? data?.employeeId?.value : null,
      "bankAccId": data?.type !== "cash" ? data?.bankId : null,
      "type": data?.type,
      "chequeNo": data?.type !== "cheque" ? data?.chequeNo : null,
      "transactionNo": data?.type === "bank" ? data?.transactionNo : null,
      "amount": + data?.amount,
      "naration": data?.naration,
      "date": customDayjs(data?.date),
      "receiptLayoutId": data?.invoiceLayout,
    };
    dispatch(createadvance(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  useEffect(() => {
    if (BranchId || (userInfoglobal?.userType !== "company" && userInfoglobal?.userType !== "companyDirector" && userInfoglobal?.userType !== "admin")) {
      dispatch(getBranchDetails({
        _id: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "admin" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId
      }))
    }
  }, [BranchId])



  useEffect(() => {
    if ((CompanyId || userInfoglobal?.userType !== "admin") && (BranchId || userInfoglobal?.userType !== "companBranch" || userInfoglobal?.userType === "employee")) {
      fetchEmployeListData()
    }
  }, [CompanyId, BranchId])

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: '',
      designationId: '',
      companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
    };
    dispatch(employeSearch(reqPayload));
  };
  const handleFocusClientGrp = () => {

    dispatch(
      clientGrpSearch({
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );

  };
  const handleFocusBranchSearch = () => {

    dispatch(
      branchSearch({
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );

  };
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" &&
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
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {sortByPropertyAlphabetically(companyList, 'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
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
                      onFocus={handleFocusBranchSearch}
                      className={`${inputAntdSelectClassName} `}
                       showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
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
              </div>}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Group Type <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("groupName", {
                  required: "Organization type is required",
                })}
                className={` ${inputClassName} ${errors.groupName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                onFocus={handleFocusClientGrp}
              >
                <option className="text-xs" value="">
                  Select Group Type
                </option>
                {clientGroupList?.map((elment, index) => (
                  <option value={elment?._id}>{elment?.fullName}({elment?.groupName})</option>
                ))}
              </select> */}

              <Controller
                control={control}
                name="groupName"
                rules={{ required: "groupName is required" }}
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
                    {groupSearchLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(clientGroupList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}({type?.groupName})
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.groupName && (
                <p className="text-red-500 text-sm">
                  {errors.groupName.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className={`${inputLabelClassName}`}>
                Firm Layout Name<span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("invoiceLayout", {
                  required: "Task Name is required",
                })}
                className={` ${inputClassName} ${errors.invoiceLayout ? "border-[1px] " : "border-gray-300"
                  }`}
                onFocus={() => {
                  dispatch(
                    officeAddressSearch({
                      companyId:
                        userInfoglobal?.userType === "admin"
                          ? watch("PDCompanyId")
                          : userInfoglobal?.userType === "company"
                            ? userInfoglobal?._id
                            : userInfoglobal?.companyId,
                      branchId:
                        userInfoglobal?.userType === "company" ||
                          userInfoglobal?.userType === "admin" ||
                          userInfoglobal?.userType === "companyDirector"
                          ? watch("PDBranchId")
                          : userInfoglobal?.userType === "companyBranch"
                            ? userInfoglobal?._id
                            : userInfoglobal?.branchId,
                      directorId: "",
                      text: "",
                      sort: true,
                      status: true,
                      type: "receipt",
                      isPagination: false,
                      bankAccountId: "",
                      isGSTEnabled: "",
                    })
                  );
                }}
              >
                <option className="" value="">
                  Select Layout
                </option>

                {officeAddressListData?.map((element) => (
                  <option value={element?._id}>{element?.firmName}</option>
                ))}
              </select> */}
              <Controller
                control={control}
                name="invoiceLayout"
                rules={{ required: "Task Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={` ${inputAntdSelectClassName} ${errors.invoiceLayout ? "border-[1px] " : "border-gray-300"
                      }`}
                       showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    onFocus={() => {
                      dispatch(
                        officeAddressSearch({
                          companyId:
                            userInfoglobal?.userType === "admin"
                              ? watch("PDCompanyId")
                              : userInfoglobal?.userType === "company"
                                ? userInfoglobal?._id
                                : userInfoglobal?.companyId,
                          branchId:
                            userInfoglobal?.userType === "company" ||
                              userInfoglobal?.userType === "admin" ||
                              userInfoglobal?.userType === "companyDirector"
                              ? watch("PDBranchId")
                              : userInfoglobal?.userType === "companyBranch"
                                ? userInfoglobal?._id
                                : userInfoglobal?.branchId,
                          directorId: "",
                          text: "",
                          sort: true,
                          status: true,
                          type: "invoice",
                          isPagination: false,
                          bankAccountId: "",
                          isGSTEnabled: "",
                        })
                      );
                    }}
                  >
                    <Select.Option className="" value="">
                      Select Layout
                    </Select.Option>

                    {officeAddressLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(officeAddressListData, 'firmName')?.map((element) => (
                      <Select.Option value={element?._id}>{element?.firmName}</Select.Option>
                    )))}
                  </Select>
                  // <Select
                  //   {...field}
                  //   defaultValue={""}
                  //   className={`${inputAntdSelectClassName} `}
                  // >
                  //   <Select.Option value="">Select Branch</Select.Option>
                  //   {branchList?.map((type) => (
                  //     <Select.Option key={type?._id} value={type?._id}>
                  //       {type?.fullName}
                  //     </Select.Option>
                  //   ))}
                  // </Select>
                )}
              />
              {errors.invoiceLayout && (
                <p className="text-red-500 text-sm">
                  {errors.invoiceLayout.message}
                </p>
              )}
            </div>
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

                <option value='cash'>
                  Cash Deposit
                </option>
                <option value='cheque'>
                  Cheque Deposit
                </option>
                <option value='bank'>
                  Bank Transfer
                </option>
              </select>
               */}
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
                    <Select.Option value=''>
                      Select Type
                    </Select.Option>
                    <Select.Option value='cash'>
                      Cash Deposit
                    </Select.Option>
                    {/* <Select.Option value='cheque'>
                      Cheque Deposit
                    </Select.Option> */}
                    <Select.Option value='bank'>
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
            {watch("type") !== "cash" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Bank<span className="text-red-600">*</span>
              </label>
              {/* <select

                {...register("bankId",)}
                className={`${inputClassName}  ${errors.bankId
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
                name="bankId"
                rules={{ required: "bankId is required" }}
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
                      sortByPropertyAlphabetically(branchDetailsData.data.bankData, 'bankName').map((type) => (
                        <Select.Option key={type._id} value={type._id}>
                           {optionLabelForBankSlect(type)}
                          {/* {`${type.bankName} (${type.branchName})`} */}
                        </Select.Option>
                      ))
                    }
                  </Select>
                )}
              />
              {errors.bankId && (
                <p className="text-red-500 text-sm">
                  {errors.bankId.message}
                </p>
              )}
            </div>}
            {watch("type") === "cash" && <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee</label>
              <Controller
                name="employeeId"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={sortByPropertyAlphabetically(employeList, 'fullName')?.map((employee) => ({
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
            {watch("type") === "cheque" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Cheque No
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
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
            {watch("type") === "bank" && <div className="">
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
                placeholder="Enter Transaction no"
              />
              {errors.transactionNo && (
                <p className="text-red-500 text-sm">
                  {errors.transactionNo.message}
                </p>
              )}
            </div>}
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
                  // disabledDate={(current) => {
                  //   return (
                  //     current &&
                  //     current.isBefore(dayjs().endOf("day"), "day")
                  //   );
                  // }}
                  />
                )}
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
              disabled={advanceLoading}
              className={`${advanceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {advanceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateAdvance;
