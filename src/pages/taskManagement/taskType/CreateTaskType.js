import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//import { createDesignation } from "./designationFeatures/_designation_reducers";

import { domainName, inputAntdSelectClassName, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../../constents/global";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { createTaskType } from "./taskFeatures/_task_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { getGstTypeListFunc, gstTypeSearch } from "../../global/other/GstType/GstTypeFeatures/_gstType_reducers";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";

function CreateTaskType() {
  const { loading: taskTypeloading } = useSelector((state) => state.taskType);
  const { register, handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const { companyList } = useSelector((state) => state.company);
  const { departmentListData, loading: depListLoading } = useSelector((state) => state.department);
  const { gstTypeList, loading: gstTypeLoading } = useSelector(state => state.gstType)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userInfoglobal?.companyId || "",
  });




  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
    }
  }, []);

  useEffect(() => {
    if (companyId || userInfoglobal?.userType !== "admin") {
      dispatch(deptSearch({
        text: "", sort: true, status: true, isPagination: false,
        companyId:
          userInfoglobal?.userType === "admin"
            ? companyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
      }));
    }

  }, [companyId])
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
          companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId])
  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: '',
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "departmentId": data?.departmentId,
      "name": data?.taskName,
      "fees": data?.fees,
      "gstTypeId": data?.gstTypeId,
      "HSNCode": data?.HSNCode,

    };

    dispatch(createTaskType(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" && <div className="">
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

            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>
              <Controller
                name="PDBranchId"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Branch"
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
              <label className={`${inputLabelClassName}`}>
                Department <span className="text-red-600">*</span>
              </label>

              <Controller
                name="departmentId"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Department"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Department</Select.Option>
                    {depListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (departmentListData?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.departmentId && (
                <p className="text-red-500 text-sm">
                  {errors.departmentId.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Task Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("taskName", {
                  required: "Task Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.taskName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Task Name"
              />
              {errors.taskName && (
                <p className="text-red-500 text-sm">
                  {errors.taskName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Gst Type <span className="text-red-600">*</span>
              </label>
              <Controller
                name="gstTypeId"
                control={control}
                rules={{ required: "GST Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select GST Type"
                    className={`${inputAntdSelectClassName} ${errors.gstTypeId ? "border-[1px] " : "border-gray-300"}`}
                    // showSearch
                    // filterOption={(input, option) =>
                    //   String(option?.children).toLowerCase().includes(input.toLowerCase())
                    // }
                    onFocus={() => {
                      const selectedCompanyId =
                        userInfoglobal?.userType === "admin"
                          ? watch("companyId")
                          : userInfoglobal?.userType === "company"
                            ? userInfoglobal?._id
                            : userInfoglobal?.companyId;

                      const selectedBranchId =
                        ["company", "admin", "companyDirector"].includes(userInfoglobal?.userType)
                          ? watch("PDBranchId")
                          : userInfoglobal?.userType === "companyBranch"
                            ? userInfoglobal?._id
                            : userInfoglobal?.branchId;

                      const reqPayload = {
                        directorId: "",
                        companyId: selectedCompanyId,
                        branchId: selectedBranchId,
                        text: "",
                        sort: true,
                        status: "",
                        isPagination: false,
                      };
                      dispatch(gstTypeSearch(reqPayload));
                    }}
                  >
                    <Select.Option value="">Select GST Type</Select.Option>
                    {gstTypeLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (gstTypeList?.map((element) => (
                      <Select.Option key={element?._id} value={element?._id}>
                        {element?.percentage} %
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.gstTypeId && (
                <p className="text-red-500 text-sm">
                  {errors.gstTypeId.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                HSNCode <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("HSNCode", {
                  required: "HSNCode is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.HSNCode
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter HSNCode"
              />
              {errors.HSNCode && (
                <p className="text-red-500 text-sm">
                  {errors.HSNCode.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Fees <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("fees", {
                  required: "Fees is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.fees
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Fees"
              />
              {errors.fees && (
                <p className="text-red-500 text-sm">
                  {errors.fees.message}
                </p>
              )}
            </div>

          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={taskTypeloading}
              className={`${taskTypeloading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {taskTypeloading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default CreateTaskType;
