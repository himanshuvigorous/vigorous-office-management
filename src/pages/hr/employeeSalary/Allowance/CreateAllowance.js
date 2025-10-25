import { Controller, useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, inputAntdSelectClassName, inputAntdSelectClassNameFilter, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { allowanceCreate } from "./allowancefeature/_allowanceList_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";




const CreateAllowance = () => {
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


  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
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
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: "",
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "name": data?.allowanceName,
      "description": '',
      "isPercentage": false,
      "amount": 0

    };
 
    dispatch(allowanceCreate(finalPayload)).then((data) => {
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
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])
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
            {userInfoglobal?.userType === "admin" && <div className="">
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
                    // onFocus={() => {
                    //   dispatch(
                    //     companySearch({
                    //       text: "",
                    //       sort: true,
                    //       status: true,
                    //       isPagination: false,
                    //     })
                    //   );
                    // }}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Company</Select.Option>
                    {companyListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (companyList?.map((type) => (
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
            </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
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
                    // onFocus={() => {
                    //   dispatch(
                    //     companySearch({
                    //       text: "",
                    //       sort: true,
                    //       status: true,
                    //       isPagination: false,
                    //     })
                    //   );
                    // }}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
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
            </div>}


            <div className="">
              <label className={`${inputLabelClassName}`}>Name</label>
              <input
                type="text"
                {...register("allowanceName", {
                  required: "Allowance  is required",
                })}
                className={`${inputClassName} ${errors.allowanceName ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Allowance  Name"
              />
              {errors.allowanceName && (
                <p className="text-red-500 text-sm">{errors.allowanceName.message}</p>
              )}
            </div>

            {/* <div className="">
              <label className={`${inputLabelClassName}`}>Description </label>
              <input
                type="text"
                {...register("description", {
                  required: "Description is required",
                })}
                className={`${inputClassName} ${errors.description ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                isPercentage <span className="text-red-600">*</span>
              </label> */}
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
            {/* <Controller
                                    name="isPercentage"
                                    control={control}
                                    rules={{
                                      required: "isPercentage is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Select isPercentage"
                                        showSearch
              
                                      >
                                        <Select.Option value="">Select isPercentage</Select.Option>
                                        <Select.Option value="true">Active</Select.Option>
                                        <Select.Option value="false">Inactive</Select.Option>                          
                                      </Select>
                                    )}
                                  />
              {errors.isPercentage && (
                <p className="text-red-500 text-sm">{errors.isPercentage.message}</p>
              )}
            </div> */}
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>{(isPercentage === "true" || isPercentage === true) ? "Amount %" : "Amount"} </label>
              <input
                type="number"
                {...register("amount", {
                  required: "amount is required",
                })}
                className={`${inputClassName} ${errors.amount ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div> */}
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

export default CreateAllowance;
