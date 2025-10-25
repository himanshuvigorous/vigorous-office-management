import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputClassNameSearch,
  inputLabelClassName,
} from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { createpenaltyType } from "./penaltyFeatures/_penalty_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";

const CreatePenalty = () => {
  const { loading: penaltyLoading } = useSelector((state) => state.penalty);
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

  // useEffect(() => {
  //   dispatch(employeSearch());
  // }, [dispatch]);

  const onSubmit = (data) => {
    const finalPayload = {
      employeId: "",
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
      name: data?.name,
      amount: Number(data?.amount),
    };
    dispatch(createpenaltyType(finalPayload)).then((data) => {
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
                  Company Name <span className="text-red-600">*</span>
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
                      {companyListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : companyList?.map((type) => (
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
              </div>
            )}
            {(userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Branch Name <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="PDBranchId"
                    control={control}
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                        placeholder="Select Branch"
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> : (branchList?.map((type) => (
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

            {/* Work Type Name */}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Penalty Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "penalty Name is required",
                })}
                className={`${inputClassName} ${errors.name ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter penalty Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
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
                className={`${inputClassName} ${errors.name ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={penaltyLoading}
              className={`${penaltyLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {penaltyLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreatePenalty;
