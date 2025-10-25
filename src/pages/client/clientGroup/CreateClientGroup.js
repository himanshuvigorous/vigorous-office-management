import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getUserIds from '../../../constents/getUserIds';
import { AutoComplete, Input, Select } from "antd";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../constents/global";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { createClientGroup } from "../clientGroup/clientGroupFeatures/_client_group_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";

function CreateClientGroup() {
  const { loading: clientGroupLoading } = useSelector(state => state.clientGroup)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userType
  } = getUserIds();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { companyList } = useSelector((state) => state.company);
  const { countryListData, companyListLoading } = useSelector((state) => state.country);
  const { branchList, branchListloading } = useSelector((state) => state.branch);


  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const directorId = useWatch({
    control,
    name: "directorId",
    defaultValue: userDirectorId,
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });

  useEffect(() => {
    setValue("PDMobileCode", "+91");
  }, [countryListData]);

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

  useEffect(() => {
    if (companyId && userType === "company" || userType === "admin") {
      dispatch(
        directorSearch({
          text: "", sort: true, status: true, isPagination: false, companyId: companyId,
        })
      );
    }
  }, [companyId]);

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? companyId :
        userInfoglobal?.userType === "company" ? userInfoglobal?._id :
          userInfoglobal?.companyId,
      "directorId": "",
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      fullName: data?.fullName,
      email: data?.email,
      openingBalance:+data?.openingBalance,
      userType: "clientGroup",
      // password: data?.password,
      mobile: {
        code: data?.code,
        number: data?.number,
      },
    };
    dispatch(createClientGroup(finalPayload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("PDCompanyId", {
                    required: "company is required",
                  })}
                  className={` ${inputClassName} ${errors.PDCompanyId
                    ? ""
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
                      className={`${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled>
                        <Loader />
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
              </div>)}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
              <div>
                <label className={`${inputLabelClassName}`}>
                  Branch <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("PDBranchId", { required: "Branch is required" })}
                  className={`${inputClassName} ${errors.PDBranchId ? "" : "border-gray-300"}`}
                >
                  <option value="">Select Branch</option>
                  {branchList?.map((type) => (
                    <option key={type?._id} value={type?._id}>
                      {type?.fullName}
                    </option>
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
                      className={`${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? (<Select.Option disabled>
                        <Loader />
                      </Select.Option>) :
                        (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        )))}
                    </Select>
                  )}
                />
                {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.fullName
                  ? ""
                  : "border-gray-300"
                  }`}
                placeholder="Enter Name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={` ${inputClassName} ${errors.email ? "" : "border-gray-300"
                  }`}
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                className={` ${inputClassName} ${errors.password ? "" : "border-gray-300"
                  }`}
                placeholder="Enter Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div> */}
            <div className="flex gap-3">
              <div className="w-[150px]">
                <label className={`${inputLabelClassName}`}>
                  Code <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="code"
                  rules={{ required: "code is required" }}
                  render={({ field }) => (
                    <CustomMobileCodePicker
                      field={field}
                      errors={errors}
                    />
                  )}
                />

                {/* <select
                            {...register("code", {
                              required: "MobileCode is required",
                            })}
                            onFocus={() => {
                              dispatch(
                                countrySearch({
                                  isPagination: false,
                                  text: "",
                                  sort: true,
                                  status: true,
                                })
                              );
                            }}
                            className={` ${inputClassName} ${
                              errors.code
                                ? ""
                                : "border-gray-300"
                            }`}
                          >
                            <option className="" value="">
                              Select Mobile Code
                            </option>
                            {countryListData?.docs?.map((type) => (
                              <option value={type?.countryMobileNumberCode}>
                                {type?.countryMobileNumberCode}
                              </option>
                            ))}
                          </select> */}
                {errors[`code`] && (
                  <p className="text-red-500 text-sm mt-3">
                    {errors[`code`].message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Mobile No <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register(`number`, {
                    required: "Mobile No is required",
                    minLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                  })}
                  className={` ${inputClassName} ${errors[`number`]
                    ? ""
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Mobile No"
                  maxLength={10}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                />
                {errors[`number`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`number`].message}
                  </p>
                )}
              </div>

             
            </div>
               <div className="">
                                  <label className={`${inputLabelClassName}`}>
                                    Opening Balance
                                  </label>
                                  <input
                                    type="number"
                                    step="any"
                                    {...register("openingBalance", {
                                     
              
                                   
                                    })}
                                    className={` ${inputClassName} ${errors.openingBalance
                                      ? "border-[1px] "
                                      : "border-gray-300"
                                      } `}
                                    placeholder="Enter Opening Balance "
                                   
                                  />
                                  {errors.openingBalance && (
                                    <p className="text-red-500 text-sm">
                                      {errors.openingBalance.message}
                                    </p>
                                  )}
                                </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={clientGroupLoading}
              className={`${clientGroupLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {clientGroupLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateClientGroup
