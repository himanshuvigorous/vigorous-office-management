import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createemployeePenaltyType, getEmployeePenaltyDetails, updateemployeePenaltyType } from "./employeePenaltyFeatures/_employeePenalty_reducers";
import { employeSearch } from "../employeManagement/employeFeatures/_employe_reducers";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputClassNameSearch,
  inputDisabledClassName,
  inputLabelClassName,
} from "../../constents/global";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { getpenaltyList } from "../global/other/interviewRoundName copy/penaltyFeatures/_penalty_reducers";
import CustomDatePicker from "../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Select } from "antd";
import { decrypt } from "../../config/Encryption";
import Loader from "../../global_layouts/Loader";
import ListLoader from "../../global_layouts/ListLoader";

function EditEmployeePenaltie() {
  const { penaltyIdEnc } = useParams()
  const penaltyTypeId = decrypt(penaltyIdEnc);
  const { employeePenaltyDetails } = useSelector(state => state.employeePenalty)



  const { loading: employeePenaltyLoading } = useSelector((state) => state.employeePenalty);
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let reqData = {
      _id: penaltyTypeId,
    };
    dispatch(getEmployeePenaltyDetails(reqData));
  }, []);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { penaltyListData } = useSelector(
    (state) => state.penalty
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });

  useEffect(() => {
    getpenalty();
  }, [BranchId, CompanyId]);


  useEffect(() => {
    if (employeePenaltyDetails) {
      setValue("PDBranchId", employeePenaltyDetails?.branchId)
      setValue("employee", employeePenaltyDetails?.employeId)
      setValue("employeeName", employeePenaltyDetails?.employeName)
      setValue("amount", employeePenaltyDetails?.amount)
      setValue("date", dayjs(employeePenaltyDetails?.issueDate))
      setValue("penaltyName", employeePenaltyDetails?.penaltyId)
      setValue("reason", employeePenaltyDetails?.reason)

    }
    

  }, [employeePenaltyDetails])
  const getpenalty = () => {
    const data = {
      currentPage: "",
      pageSize: "",
      reqData: {
        directorId: "",
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
        text: "",
        sort: true,
        status: "",
        isPagination: true,
      },
    };
    dispatch(getpenaltyList(data));
  };

  const penaltyName = useWatch({
    control,
    name: "penaltyName",
    defaultValue: "",
  });



  useEffect(() => {
    const amount = penaltyListData?.find((data) => data?._id == penaltyName)
    setValue('amount', amount?.amount)
  }, [penaltyName])


  const disabledDate = (current) => {
    return current && current.isAfter(dayjs().endOf('day')); // Ensures future dates are disabled
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {

    const finalPayload = {
      "_id": penaltyTypeId,
      companyId: employeePenaltyDetails?.companyId,
      directorId: employeePenaltyDetails?.directorId,
      branchId: employeePenaltyDetails?.branchId,
      employeId: employeePenaltyDetails?.employeId,
      penaltyId: data?.penaltyName,
      amount: Number(data?.amount),
      reason: data?.reason,
      issueDate: dayjs(data?.date)?.format("YYYY-MM-DD"),
    };
    dispatch(updateemployeePenaltyType(finalPayload)).then((data) => {
      !data?.error && navigate(-1);
    });
  };




  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-2 md:my-2">

            <div className="">
              <label className={`${inputLabelClassName}`}>Penalty Name <span className="text-red-600">*</span></label>
              <Controller
                name="penaltyName"
                control={control}
                rules={{
                  required: 'Penaulty Name is required'
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassName}`}
                    placeholder="Select penalty Name "
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }                  >
                    <Select.Option value="">Select Penalty Name </Select.Option>
                    {employeePenaltyLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (penaltyListData?.map((element, index) => (
                      <Select.Option key={index} value={element?._id}>
                        {element?.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.penaltyName && (
                <p className="text-red-500 text-sm">
                  {errors.penaltyName.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>Employee Name <span className="text-red-600">*</span></label>
              <input
                disabled
                type="text"
                {...register("employeeName", {
                  required: "Employee Name is required",
                })}
                className={` ${errors.amount ? "border-[1px] " : "border-gray-300"
                  }${inputDisabledClassName}`}
                placeholder="Employee Name"
              />

              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                disabled
                {...register("amount", {
                  required: "Amount is required",
                })}
                className={` bg-gray-200 ${errors.amount ? "border-[1px] " : "border-gray-300"
                  }${inputDisabledClassName}`}
                placeholder="Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Reason <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("reason", {
                  required: "reason is required",
                })}
                className={` ${errors.reason ? "border-[1px] " : "border-gray-300"
                  }${inputClassName}`}
                placeholder="Enter reason"
              />
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>Date <span className="text-red-600">*</span></label>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: 'Date is required'
                }}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={disabledDate} />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">date is required</p>
              )}
            </div>


          </div>

          <div className="flex justify-end m-4">
            <button
              type="submit"
              disabled={employeePenaltyLoading}
              className={`${employeePenaltyLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {employeePenaltyLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditEmployeePenaltie;
