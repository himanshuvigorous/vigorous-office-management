import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AutoComplete, Input, Select } from "antd";
import ReactSelect from "react-select";
import getUserIds from '../../../constents/getUserIds';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from "../../../constents/global";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { createProposal } from "../proposal/proposalFeatures/_proposal_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";

function CreateProposal() {
  const { loading: proposalLoading } = useSelector(state => state.proposal);
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
  const { employeList } = useSelector((state) => state.employe);

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
      name: data?.name,
      email: data?.email,
      mobile: {
        code: data?.code,
        number: data?.number,
      },
      employeId: data?.employee?.value,
      description: data?.remark,
      fee: data?.amount,
    };
    dispatch(createProposal(finalPayload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  }

  useEffect(() => {
    fetchEmployeListData()
  }, [branchId])
  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: "",
      designationId: "",
      companyId:
        userInfoglobal?.userType === "admin"
          ? companyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
    };

    dispatch(employeSearch(reqPayload));
  };
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
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
                  className={`${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
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
                      {branchListloading ?
                        (<Select.Option disabled>
                          <Loader />
                        </Select.Option>)
                        :
                        (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        )))
                      }
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
                {...register("name", {
                  required: "Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.name
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Handling Employee <span className="text-red-600">*</span></label>
              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={sortByPropertyAlphabetically(employeList, 'fullName')?.map((employee) => ({
                      value: employee?._id,
                      label: employee?.fullName,
                    }))}
                    classNamePrefix="react-select"
                    className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Employee"
                  />
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
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
                className={` ${inputClassName} ${errors.email ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
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
                {errors[`code`] && (
                  <p className="text-red-500 text-sm mt-2">
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
                    ? "border-[1px] "
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
                  Remark <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("remark", {
                    required: "Remark is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.remark
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Remark"
                />
                {errors.remark && (
                  <p className="text-red-500 text-sm">
                    {errors.remark.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Amount <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.amount
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Amount"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.amount.message}
                  </p>
                )}
              </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={proposalLoading}
              className={`${proposalLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {proposalLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateProposal
