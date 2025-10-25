import { Controller, useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";
import { wfhManagerCreate } from "./wfhManagerfeature/_wfhManager_reducers";

const CreatewfhManager = () => {
  const { loading: wfhManagerLoading } = useSelector(
    (state) => state.wfhManager
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

  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const isPercentage = useWatch({
    control,
    name: "isPercentage",
    defaultValue: "",
  });

  const onSubmit = (data) => {
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
      name: data?.wfhManagerName,
      // "allowedDays": data?.allowedDays,
    "perdaySalaryPercent": data?.perdaySalaryPercent,

    };
    dispatch(wfhManagerCreate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
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
          isPagination: false,
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
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("PDCompanyId", {
                    required: "company is required",
                  })}
                  className={` ${inputClassName} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
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
                  name="PDCompanyId"
                  control={control}
                  rules={{
                    required: "Company is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder="Select Company"
                     filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> :
                        (companyList
                          ?.map((element) => (
                            <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                          )))
                      }
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
                    className={` ${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"
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
                    name="PDBranchId"
                    control={control}
                    rules={{
                      required: "Branch is required",
                    }}

                    render={({ field }) => (
                      <Select
                        {...field}
                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        placeholder="Select Branch"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> :
                          (branchList
                            ?.map((element) => (
                              <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                            )))
                        }
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
              <label className={`${inputLabelClassName}`}>Name <span className="text-red-600"> *</span></label>
              <input
                type="text"
                {...register("wfhManagerName", {
                  required: "WFH Name  is required",
                })}
                className={`${inputClassName} ${errors.wfhManagerName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter WFH Name"
              />
              {errors.wfhManagerName && (
                <p className="text-red-500 text-sm">
                  {errors.wfhManagerName.message}
                </p>
              )}
            </div>
             {/* <div className="">
                            <label className={`${inputLabelClassName}`}>Maximum Allowed Days  <span className="text-red-600">*</span></label>
                            <input
                              type="number"
                              {...register("allowedDays", {
                                required: "Maximum Days  is required",
                               
                                
                              })}
                              className={`${inputClassName} ${errors.allowedDays ? "border-[1px] " : "border-gray-300"}`}
                              placeholder="Enter Maximum Days "
                            />
                            {errors.allowedDays && (
                              <p className="text-red-500 text-sm">{errors.allowedDays.message}</p>
                            )}
                          </div> */}
            <div className="">
  <label className={`${inputLabelClassName}`}>
    Perday Salary Percent <span className="text-red-600">*</span>
  </label>
  
  <input
    type="number"
    step="0.01"
    {...register("perdaySalaryPercent", {
      required: "Perday Salary Percent is required",
      min: {
        value: 0,
        message: "Percentage must be at least 0%",
      },
      max: {
        value: 100,
        message: "Percentage cannot exceed 100%",
      },
    })}
    className={`${inputClassName} ${errors.perdaySalaryPercent ? "border-[1px] border-red-500" : "border-gray-300"}`}
    placeholder="Enter Perday Salary Percent"
  />

  {errors.perdaySalaryPercent && (
    <p className="text-red-500 text-sm">{errors.perdaySalaryPercent.message}</p>
  )}
</div>


          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={wfhManagerLoading}
              className={`${wfhManagerLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {wfhManagerLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreatewfhManager;
