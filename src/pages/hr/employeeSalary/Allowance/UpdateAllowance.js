import { Controller, useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
} from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  allowanceCreate,
  allowanceDetails,
  allowanceUpdate,
} from "./allowancefeature/_allowanceList_reducers";
import { decrypt } from "../../../../config/Encryption";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";

const UpdateAllowance = () => {
  const { loading: allowanceLoading } = useSelector(
    (state) => state.allowance
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allowanceIdEnc } = useParams();
  const allowanceId = decrypt(allowanceIdEnc);
  const { allowanceDetailsData } = useSelector((state) => state.allowance);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const isPercentage = useWatch({
    control,
    name: "isPercentage",
    defaultValue: "",
  });

  useEffect(() => {
    if (allowanceId) {
      dispatch(
        allowanceDetails({
          _id: allowanceId,
        })
      );
    }
  }, [allowanceId]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: allowanceId,
      companyId: allowanceDetailsData?.companyId,
      directorId: allowanceDetailsData?.directorId,
      branchId: allowanceDetailsData?.branchId,
      name: data?.allowanceName,
      description: "",
      isPercentage: false,
      amount: 0,
      status:
        data.status === "true" ? true : data.status === "false" ? false : "",
    };

    dispatch(allowanceUpdate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };
  useEffect(() => {
    if (allowanceDetailsData) {
      setValue("allowanceName", allowanceDetailsData?.name);
      // setValue("description", allowanceDetailsData?.description);
      // setValue("isPercentage", allowanceDetailsData?.isPercentage === true ? 'Active' : 'InActive');
      // setValue("amount", allowanceDetailsData?.amount);
      setValue(
        "status",
        allowanceDetailsData?.status === true
          ? "true"
          : allowanceDetailsData?.status === false
            ? "false"
            : ""
      );
    }
  }, [allowanceDetailsData]);

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-2 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Name</label>
              <input
                type="text"
                {...register("allowanceName", {
                  required: "Allowance  is required",
                })}
                className={`${inputClassName} ${errors.allowanceName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Allowance  Name"
              />
              {errors.allowanceName && (
                <p className="text-red-500 text-sm">
                  {errors.allowanceName.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("isPercentage", {
                  required: "isPercentage is required",
                })}
                className={`${inputClassName} ${errors.isPercentage ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select isPercentage</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select> */}
              <Controller
                name="status"
                control={control}
                rules={{
                  required: "status is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` w-32 ${inputAntdSelectClassName} ${errors.PDPlan
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Select Status"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    <Select.Option value="true"> Active </Select.Option>
                    <Select.Option value="false"> InActive </Select.Option>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={allowanceLoading}
              className={`${allowanceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {allowanceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default UpdateAllowance;
