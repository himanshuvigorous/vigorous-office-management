import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createemployeePenaltyType } from "./employeePenaltyFeatures/_employeePenalty_reducers";
import { employeSearch } from "../employeManagement/employeFeatures/_employe_reducers";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputClassNameSearch,
  inputDisabledClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../constents/global";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { getpenaltyList } from "../global/other/interviewRoundName copy/penaltyFeatures/_penalty_reducers";
import CustomDatePicker from "../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Select } from "antd";
import { current } from "@reduxjs/toolkit";
import Loader from "../../global_layouts/Loader";
import ListLoader from "../../global_layouts/ListLoader";

function CreateEmployeePenaltie() {

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const disabledDate = (current) => {
    return current && current.isAfter(dayjs().endOf('day')); // Ensures future dates are disabled
  };
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);

  const { employeList, loading: employeListLoading } = useSelector((state) => state.employe);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  
  const { penaltyListData, totapenaltyTypeCount, loading: penaltyListLoading } = useSelector(
    (state) => state.penalty
  );


  const { employeePenaltyListData, totaemployeePenaltyCount, loading: employeePenaltyLoading } = useSelector((state) => state.employeePenalty);

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });

  const penaltyName = useWatch({
    control,
    name: "penaltyName",
    defaultValue: "",
  });



  useEffect(() => {
    const amount = penaltyListData?.find((data) => data?._id == penaltyName)
    setValue('amount', amount?.amount)
  }, [penaltyName])

  useEffect(() => {
    getpenalty();
  }, [BranchId, CompanyId]);

  

  const getpenalty = () => {
    const data = {
      currentPage: "",
      pageSize: "",
      reqData: {
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        text: "",
        sort: true,
        status: "",
        isPagination: true,
      },
    };
    dispatch(getpenaltyList(data));
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {

    const finalPayload = {
      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      directorId: "",
      employeId: data?.employee,
      penaltyId: data?.penaltyName,
      amount: Number(data?.amount),
      reason: data?.reason,
      issueDate: dayjs(data?.date).format("YYYY-MM-DD"),
    };

    dispatch(createemployeePenaltyType(finalPayload)).then((data) => {
      !data?.error && navigate(-1);
    });
  };

  useEffect(() => {
    fetchEmployeListData();
  }, []);

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
      companyId: userInfoglobal?.companyId,
      branchId: userInfoglobal?.branchId,
    };

    dispatch(employeSearch(reqPayload));
  };


  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                {/* <select
                  {...register("PDCompanyId", {
                    required: "company is required",
                  })}
                  className={` ${inputClassNameSearch} ${
                    errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
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
                    required: 'Company is required'
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName}`}
                      placeholder="Select Company"
                     filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }                    >
                      <Select.Option value="">Select Company </Select.Option>
                      {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (companyList?.map((element, index) => (
                          <Select.Option key={index} value={element?._id}>
                            {element?.fullName}
                          </Select.Option>
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
                  <label className={`${inputLabelClassName}`}>Branch Name <span className="text-red-600">*</span></label>
                  {/* <select
                  {...register("PDBranchId", {
                    required: "Branch is required",
                  })}
                  className={` ${inputClassNameSearch} ${
                    errors.PDBranchId ? "border-[1px] " : "border-gray-300"
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
                    rules={{
                      required: 'Branch is required'
                    }}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                         onChange={(value) => {
                        setValue("employee", '')
                        setValue("penaltyName", '')
                        field.onChange(value);
                      }}
                        className={` ${inputAntdSelectClassName}`}
                        placeholder="Select Branch  "
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }                    >
                        <Select.Option value="">Select Branch </Select.Option>
                        {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((element, index) => (
                          <Select.Option key={index} value={element?._id}>
                            {element?.fullName}
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
            <div className="">
              <label className={`${inputLabelClassName}`}>Penalty Name <span className="text-red-600">*</span></label>
              {/* <select
                {...register("penaltyName", {
                  required: "penaltyName is required",
                })}
                className={` ${inputClassNameSearch} ${
                  errors.penaltyName ? "border-[1px] " : "border-gray-300"
                }`}
              >
                <option className="" value="">
                  Select Penalty
                </option>
                {penaltyListData?.map((type) => (
                  <option value={type?._id}>{type?.name}</option>
                ))}
              </select> */}

              <Controller
                name="penaltyName"
                control={control}
                rules={{
                  required: 'Penaulty Name is required'
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassName}`}
                    placeholder="Select penalty Name "
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }                  >
                    <Select.Option value="">Select Penalty Name </Select.Option>
                    {penaltyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(penaltyListData)?.map((element, index) => (
                      <Select.Option key={index} value={element?._id}>
                        {element?.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.penaltyName && (
                <p className="text-red-500 text-sm">
                  {errors.penaltyName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Employee Name <span className="text-red-600">*</span></label>
             

              <Controller
                name="employee"
                control={control}
                rules={{
                  required: 'Employee Name is required'
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassName}`}
                    placeholder="Select Employee "
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Employee </Select.Option>
                    {employeListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(employeList, 'fullName')?.map((element, index) => (
                      <Select.Option key={index} value={element?._id}>
                        {element?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                disabled
                {...register("amount", {
                  required: "amount is required",
                })}
                className={` ${errors.amount ? "border-[1px] " : "border-gray-300"
                  }${inputDisabledClassName}`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-2 md:my-2">
            <div className="w-full sm:mt-0 mt-2">
              <label className={`${inputLabelClassName}`}>
                Reason <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("reason", {
                  required: "reason is required",
                })}
                className={` ${errors.reason ? "border-[1px] " : "border-gray-300"
                  }${inputClassName}`}
                placeholder="Enter reason"
              />
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>Date <span className="text-red-600">*</span></label>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: 'Date is required'
                }}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={disabledDate} />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">date is required</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={employeePenaltyLoading}
              className={`${employeePenaltyLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {employeePenaltyLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default CreateEmployeePenaltie;
