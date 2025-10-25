import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { domainName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { getadvanceDetails, updateadvance } from "./advanceFeature/_advance_reducers";
import { decrypt } from "../../../config/Encryption";
import moment from "moment";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";

const EditAdvance = () => {
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
  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector(
    (state) => state.employe
  );
  const { advanceDetails } = useSelector(
    (state) => state.advance
  );
  const { clientGroupList } = useSelector(state => state.clientGroup);
  const { advanceIdEnc } = useParams();
  const advanceId = decrypt(advanceIdEnc);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: advanceId,
      companyId: advanceDetails?.companyId,
      directorId: advanceDetails?.directorId,
      branchId: advanceDetails?.branchId,
      "clientGroupId": data?.groupName,
      "employeId": data?.type === "cash" ? data?.employeeId?.value : null,
      "bankAccId": data?.type !== "cash" ? data?.bankId : null,
      "type": data?.type,
      "chequeNo": data?.type === "cheque" ? data?.chequeNo : null,
      "transactionNo": data?.type === "bank" ? data?.transactionNo : null,
      "amount": + data?.amount,
      "naration": data?.naration,
      "date": data?.date,
    };
    dispatch(updateadvance(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  useEffect(() => {
    dispatch(getadvanceDetails({
      _id: advanceId
    }))
  }, [])
  useEffect(() => {
    if (advanceDetails) {
      setValue("type", advanceDetails?.type);
      setValue("amount", advanceDetails?.amount);
      setValue("date", moment(advanceDetails?.date).format("YYYY-MM-DD"));
      setValue("naration", advanceDetails?.naration);
      // setValue("groupName", advanceDetails?.naration);
      dispatch(
        clientGrpSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
          groupId: "",
          companyId: advanceDetails?.companyId,
          branchId: advanceDetails?.branchId,
        })
      ).then((data) => {
        if (!data?.error) {
          setValue("groupName", advanceDetails?.clientGroupId)
        }
      })
      if (advanceDetails?.type === "bank" || advanceDetails?.type === "cheque") {
        dispatch(getBranchDetails({ _id: advanceDetails?.branchId })).then((data) => {
          if (!data?.error) {
            setValue("bankId", advanceDetails?.bankAccId);
            setValue("transactionNo", advanceDetails?.transactionNo);
            setValue("chequeNo", advanceDetails?.chequeNo);
          }
        });
      } else if (advanceDetails?.type === "cash") {


        const reqPayload = {
          text: "",
          status: true,
          sort: true,
          isTL: "",
          isHR: "",
          isPagination: false,
          departmentId: '',
          designationId: '',
          companyId: advanceDetails?.companyId,
          branchId: advanceDetails?.branchId,
        };

        dispatch(employeSearch(reqPayload)).then((data) => {
          if (!data?.error) {
            const filteredData = data?.payload?.data?.docs?.find((emp) => emp?._id === advanceDetails?.employeId);
            setValue("employeeId", { value: filteredData?._id, label: filteredData?.fullName });
          }
        });
      }
    }
  }, [advanceDetails]);


  const handleFocusClientGrp = () => {

    dispatch(
      clientGrpSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
        companyId: advanceDetails?.companyId,
        branchId: advanceDetails?.branchId,
      })
    );

  };


  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Group Type <span className="text-red-600">*</span>
              </label>
              <select
                {...register("groupName", {
                  required: "Organization type is required",
                })}
                className={` ${inputClassName} ${errors.groupName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
                onFocus={handleFocusClientGrp}
              >
                <option className="text-xs" value="">
                  Select Group Type
                </option>
                {clientGroupList?.map((elment, index) => (
                  <option value={elment?._id}>{elment?.fullName}({elment?.groupName})</option>
                ))}
              </select>
              {errors.groupName && (
                <p className="text-red-500 text-sm">
                  {errors.groupName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Type <span className="text-red-600">*</span>
              </label>
              <select
                {...register("type", {
                  required: "Type is required"
                })}
                className={`${inputClassName}  ${errors.type
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
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
              {errors.type && (
                <p className="text-red-500 text-sm">
                  {errors.type.message}
                </p>
              )}
            </div>
            {watch("type") !== "cash" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Sender Bank<span className="text-red-600">*</span>
              </label>
              <select

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
              </select>
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
                placeholder="Enter Cheque no"
              />
              {errors.transactionNo && (
                <p className="text-red-500 text-sm">
                  {errors.transactionNo.message}
                </p>
              )}
            </div>}
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
                Date<span className="text-red-600">*</span>
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
              className="bg-header text-white p-2 px-4 rounded mt-3"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditAdvance;
