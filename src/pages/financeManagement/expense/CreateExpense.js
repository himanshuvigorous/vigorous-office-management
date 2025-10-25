import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { customDayjs, domainName, generateFinancialYearPairs, getDefaultFinacialYear, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, months, optionLabelForBankSlect, quarter, sortByPropertyAlphabetically } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { createExpense } from "./expenseFeature/_expense_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import getUserIds from "../../../constents/getUserIds";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Radio, Select } from "antd";
import ListLoader from "../../../global_layouts/ListLoader";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";


const CreateExpense = () => {
  const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm({defaultValues:{ expenceHead :   [{ financialYear: getDefaultFinacialYear(), isPeriod: "", monthName: "", quarterName: "" }]}});
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userType
  } = getUserIds();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { clientList } = useSelector((state) => state.client);
  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
  const { clientGroupList } = useSelector(state => state.clientGroup);
  const { expenseTypeList } = useSelector(state => state.expenceHead);
  const { fields, append, remove } = useFieldArray({ control, name: "expenceHead" });
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });


  const directorId = useWatch({
    control,
    name: "PDDirectorId",
    defaultValue: userDirectorId,
  });


    const clientId = useWatch({
    control,
    name: "clientId",
    defaultValue: '',
  });


  console.log(clientId,'ssafsad')
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
      companyId: companyId,
      directorId: directorId,
      branchId: branchId,
      clientGroupId: data?.groupName,
      employeId: data?.paymentMode === "cash" ? data?.employeeId?.value : null,
      bankAccId: data?.paymentMode !== "cash" ? data?.bankId : null,
      paymentMode: data?.paymentMode,
      chequeNo: data?.paymentMode === "cheque" ? data?.chequeNo : null,
      transactionNo: data?.paymentMode === "bank" ? data?.transactionNo : null,
      totalAmount: + data?.amount,
      naration: data?.naration,
      date: customDayjs(data?.date),
      expenseTypeId: null,
      clientId: data?.clientId,
      heads: heads,
    };
    dispatch(createExpense(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };
  useEffect(() => {

    if (
      companyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId]);
  // useEffect(() => {
  //   if (branchId || (userType !== "company" && userType !== "companyDirector" && userType !== "admin")) {
  //     dispatch(getBranchDetails({
  //       _id: branchId
  //     }))
  //   }
  // }, [branchId])

  useEffect(() => {
    if ((companyId || userType !== "admin") && (branchId || userType !== "companBranch" || userType === "employee")) {
      fetchEmployeListData()
      dispatch(expenseTypeSearch({
        directorId: "",
        companyId: companyId,
        branchId: branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": false,
      }))
    }
  }, [companyId, branchId])

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
      companyId: companyId,
      branchId: branchId,
    };
    dispatch(employeSearch(reqPayload));
  };

  const handleFocusClientGrp = () => {
    dispatch(
    clientGrpSearch({
        isPagination: false,
        companyId: companyId,
        branchId: branchId,
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
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">
            {(userType === "admin" || userType === "company" || userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="PDBranchId"
                rules={{ required: "Branch is required" }}
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
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />

              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>}

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
                    {branchListloading ? <Select.Option disabled>
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
                        companyId: companyId,
                        branchId: branchId,
                        "userType": "client",
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
                      placeholder={'Select Department '}
                      name={`expenceHead[${index}].expenseTypeId`}
                      rules={{ required: "Department is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder='Select Department '
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
                          
                          {clientList?.find((value)=>value?._id==clientId)?.departmentIdList?.map((element) => (

                           
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
                         value={field.value || getDefaultFinacialYear()}
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
                append({ taskType: '', amount: "" ,financialYear:getDefaultFinacialYear()})
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
                              _id: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
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
              paymentMode="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateExpense;
