import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createDesignation, getDesignationRole } from "./designationFeatures/_designation_reducers";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";
import { formButtonClassName, inputClassName, inputLabelClassName, domainName, usertypelist, inputAntdSelectClassName, } from "../../constents/global";
import getUserIds from "../../constents/getUserIds";
import { Select } from "antd";
import Loader from "../../global_layouts/Loader";
import ListLoader from "../../global_layouts/ListLoader";

function CreateDesignation() {
  const { loading: designationLoading } = useSelector(state => state.designation);
  const { register, handleSubmit, setValue, getValues, unregister, control, formState: { errors }, } = useForm();
  const {
    userCompanyId,
    userDepartmentId,
    userBranchId,
    userType
  } = getUserIds();

  const { companyList } = useSelector((state) => state.company);
  const { departmentListData, loading: deploading } = useSelector((state) => state.department);
  const { designationRoleData } = useSelector((state) => state?.designation);



  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });
  const branchId = useWatch({
    control,
    name: "branchiId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: userDepartmentId,
  });

  const roleId = useWatch({
    control,
    name: "roleId",
    defaultValue: "",
  });

  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
    }
  }, []);


  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
    }
  }, [companyId]);

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
    let reqData = {
      text: ''
    }
    dispatch(getDesignationRole(reqData))
  }, [])

  const onSubmit = (data) => {


    const finalPayload = {
      name: data?.designationName,
      companyId: userInfoglobal?.userType === "admin" ? data?.companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      departmentId: data?.departmentId,
      roleKey: data?.roleId,
      directorId: "",
    };


    dispatch(createDesignation(finalPayload)).then((data) => {
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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Department <span className="text-red-600">*</span>
              </label>
              <Controller
                name="departmentId"
                control={control}
                rules={{ required: "Department is required" }}
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
                    {deploading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (departmentListData?.map((element) => (
                      <Select.Option key={element?._id} value={element?._id}>
                        {element?.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.departmentId && <p className="text-red-500 text-sm">{errors.departmentId.message}</p>}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Designation Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("designationName", {
                  required: "Designation Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.designationName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Designation Name"
              />
              {errors.designationName && (
                <p className="text-red-500 text-sm">
                  {errors.designationName.message}
                </p>
              )}
            </div>

            {/* Role OF Designation  */}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Role <span className="text-red-600">*</span>
              </label>
              <Controller
                name="roleId"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.roleId ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Roles"
                  >
                    <Select.Option value="">Roles</Select.Option>
                    {designationRoleData?.map((element) => (
                      <Select.Option key={element?._id} value={element?.name}>
                        {element?.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.roleId && <p className="text-red-500 text-sm">{errors.roleId.message}</p>}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={designationLoading}
              className={`${designationLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {designationLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default CreateDesignation;
