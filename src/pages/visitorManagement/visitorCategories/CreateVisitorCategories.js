import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//import { createDesignation } from "./designationFeatures/_designation_reducers";

import { domainName, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../../constents/global";
import getUserIds from '../../../constents/getUserIds';
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { createVisitorCat } from "./visitorCategoryFeatures/_visitor_categories_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";

function CreateTaskType() {
  const { register, handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const { companyList } = useSelector((state) => state.company);
  const { departmentListData } = useSelector((state) => state.department);
  const { gstTypeList } = useSelector(state => state.gstType)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });

  useEffect(() => {
    if (userType === "admin") {
      dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
    }
  }, []);

  useEffect(() => {
    if (companyId || userType === "company" || userType === "companyDirector") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          companyId: companyId,
          isPagination:false,
        })
      );
    }
  }, [companyId])

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: companyId,
      directorId: '',
      branchId: branchId,
      "name": data?.visitorCatName,
    };

    dispatch(createVisitorCat(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/visitor-category");
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company<span className="text-red-600">*</span>
              </label>
              <select
                {...register("companyId", {
                  required: "Company is required",
                })}
                className={` ${inputClassName} ${errors.companyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Company
                </option>
                {companyList?.map((type) => (
                  <option value={type?._id}>
                    {type?.fullName}({type?.userName})
                  </option>
                ))}
              </select>

              {errors.companyId && (
                <p className="text-red-500 text-sm">
                  {errors.companyId.message}
                </p>
              )}
            </div>}

            {(userType === "admin" || userType === "company" || userType === "companyDirector") &&
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Branch<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("branchId", {
                    required: "Branch is required",
                  })}
                  className={` ${inputClassName} ${errors.branchId
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
                </select>
                {errors.branchId && (
                  <p className="text-red-500 text-sm">
                    {errors.branchId.message}
                  </p>
                )}
              </div>}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Visitor Category Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("visitorCatName", {
                  required: "Visitor Category Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.visitorCatName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Visitor Category Name"
              />
              {errors.designationName && (
                <p className="text-red-500 text-sm">
                  {errors.visitorCatName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default CreateTaskType;
