import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { domainName, inputAntdSelectClassName, inputAntdSelectClassNameFilter, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { DatePicker, Select } from "antd";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import { createResignFunc } from "./resignationFeatures/resignation_reducers";
import dayjs from "dayjs";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";


const CreateResignation = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { companyList ,companyListLoading} = useSelector((state) => state.company);
  const { branchList ,branchListloading } = useSelector((state) => state.branch);
  const { employeList ,loading:employeListLoading } = useSelector((state) => state.employe);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const {  loading:reginationLoading } = useSelector((state) => state.resignation);
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
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: '',
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      employeId: data?.employee,
      title: data?.title,
      description: data?.description,
      applyDate: dayjs(data?.applyDate).format("YYYY-MM-DD"),
     type:"resignation"
    };
    dispatch(createResignFunc(finalPayload)).then((data) => {
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
          isPagination:false,
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
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">
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
                        >
                          <Select.Option value="">Select Company</Select.Option>
                          {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (companyList?.map((type) => (
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
                                            >
                                              <Select.Option value="">Select Branch</Select.Option>
                                              {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :(sortByPropertyAlphabetically(branchList,'fullName')?.map((type) => (
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
            }


            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Employee Name <span className="text-red-600">*</span>
              </label>

              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Employee"
                    showSearch
                    onFocus={() => {
                      const reqPayload = {
                        text: "",
                        status: true,
                        sort: true,
                        isTL: "",
                        isHR: "",
                        isPagination: false,
                        departmentId: "",
                        designationId: "",
                        companyId: userInfoglobal?.userType === "admin" ? userInfoglobal?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                        directorId: "",
                        branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? userInfoglobal?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
                      };
                      dispatch(employeSearch(reqPayload));
                    }}
                  >
                    <Select.Option value="">Select Employee</Select.Option>
                    {employeListLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (sortByPropertyAlphabetically(employeList,'fullName')?.map((employee) => (
                      <Select.Option key={employee?._id} value={employee?._id}>
                        {employee?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">{errors.employee.message}</p>
              )}
            </div>


          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`${inputClassName} ${errors.title ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Description <span className="text-red-600">*</span>
              </label>
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

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">

            <div>
              <label className={`${inputLabelClassName}`}>
                Apply Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="applyDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.applyDate && (
                <p className="text-red-500 text-sm">Apply Date is required</p>
              )}
            </div>

          </div>

          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={reginationLoading}
              className={`${reginationLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {reginationLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateResignation;
