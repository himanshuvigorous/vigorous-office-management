import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  domainName,
  formButtonClassName,
  formButtonClassNameDisabled,
  inputAntdSelectClassName,
  inputClassName,
  inputDisabledClassName,
  inputLabelClassName,
} from "../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import getUserIds from "../../../constents/getUserIds";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";

import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { Select } from "antd";
import usePermissions from "../../../config/usePermissions";
import {
  getAdminPrefixDetails,
  updateAdminPrefix,
} from "./companyPrefixSettingsFeatures/_admin_prefix_setting_reducer";

const AdminPrefixSetting = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const { companyList } = useSelector((state) => state.company);

  const { adminPrefixData } = useSelector((state) => state.adminprefix);

  const { userType } = getUserIds();
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: "",
  });



  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  }, []);

  useEffect(() => {
    fetchcompanyPrefixData();
  }, []);
  const fetchcompanyPrefixData = () => {
    dispatch(
      getAdminPrefixDetails({
        companyId:
          userInfoglobal?.userType === "admin"
            ? companyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      })
    );
  };


  useEffect(() => {
    setValue(
      "companyPrefix",
      adminPrefixData?.companyUserNamePrefix
        ? adminPrefixData?.companyUserNamePrefix
        : ""
    );
  }, [adminPrefixData]);

  const onSubmit = (data) => {
    const reqPayload = {
      companyUserNamePrefix: data?.companyPrefix,
    };
    dispatch(updateAdminPrefix(reqPayload)).then((response) => {
      !response.error && fetchcompanyPrefixData();
    });
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-2">
          <div className="p-2 rounded-xl">
            <div className="text-header text-[20px]">
              Company username Prefix 
            </div>

            <input
              type="text"
              {...register("companyPrefix", {
                required: "Company UserName Prefix is required",
              })}
              className={`${inputClassName} ${
                errors.companyPrefix
                  ? "border-[1px] "
                  : "border-gray-300"
              }`}
              placeholder="Company UserName Prefix"
            />
            {errors.companyPrefix && (
              <p className="text-red-500 text-sm">
                {errors.companyPrefix.message}
              </p>
            )}

            <button className="bg-header text-white py-1 px-2  m-3 rounded-md text-[14px]">
              Submit
            </button>
          </div>
        </div>
      </form>
    </GlobalLayout>
  );
};

export default AdminPrefixSetting;
