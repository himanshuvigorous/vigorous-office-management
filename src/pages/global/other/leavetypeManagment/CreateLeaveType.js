import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { createLeaveType } from "./LeaveTypeFeatures/_leave_type_reducers";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";


const CreateLeaveType = () => {
  const { loading: leaveTyeloading } = useSelector(
    (state) => state.leaveType
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
  const [isDurationActive, setIsDurationActive] = useState(false);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const isPaid = useWatch({
    control,
    name: "isPaid",
    defaultValue: "",
  });

  const totalLeaves = useWatch({
    control,
    name: "totalLeaves",
    defaultValue: "",
  });

  // useEffect(() => {
  //   dispatch(employeSearch());
  // }, [dispatch]);

  const onSubmit = (data) => {
    const finalPayload = {
      employeId: "",
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "name": data?.leaveTypeName,
      "maxDays": Number(data?.maxDays),
      totalLeaves: Number(data?.totalLeaves),
      duration: isDurationActive,
      isPaid: data?.isPaid,
      isCarryForword: (isPaid && isDurationActive) ? data?.isCarryForward : false,
    };
    dispatch(createLeaveType(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  const handleDurationChange = (value) => {
    setIsDurationActive(value === "true");  // Convert to boolean
    setValue("maxDays", "");  // Reset maxDays when duration changes
  };;

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
                Company Name <span className="text-red-600">*</span>
              </label>
              <select
                {...register("PDCompanyId", {
                  required: "company is required",
                })}
                className={` ${inputClassName} ${errors.PDCompanyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
              >
                <option className="" value="">
                  Select Comapany
                </option>
                {companyListLoading ? <Select.Option disabled>
                  <ListLoader />
                </Select.Option> : (companyList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                )))}
              </select>
              {errors.PDCompanyId && (
                <p className="text-red-500 text-sm">
                  {errors.PDCompanyId.message}
                </p>
              )}
            </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
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

            {/* Leave Type Name */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Leave Type Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("leaveTypeName", {
                  required: "Leave Type Name is required",
                })}
                className={`${inputClassName} ${errors.leaveTypeName ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Leave Type Name"
              />
              {errors.leaveTypeName && (
                <p className="text-red-500 text-sm">{errors.leaveTypeName.message}</p>
              )}
            </div>

             <div className="">
              <label className={`${inputLabelClassName}`}>Total Annual Allowance <span className="text-red-600">*</span></label>
              <input
                type="number"
                {...register("totalLeaves", {
                  required: "Total Annual Allowance is required",
                })}
                className={`${inputClassName} ${errors.totalLeaves ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Total Annual Allowance"
              />
              {errors.totalLeaves && (
                <p className="text-red-500 text-sm">{errors.totalLeaves.message}</p>
              )}
            </div>

            {/* Duration */}
            <div className="">
              <label className={`${inputLabelClassName}`}>
              Application Limit <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("duration", {
                  required: "Duration is required",
                })}
                className={`${inputClassName} ${errors.duration ? "border-[1px] " : "border-gray-300"}`}
                onChange={handleDurationChange}
              >
                <option value="">Select Duration</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select> */}

              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.duration ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Application Limit"
                    onChange={handleDurationChange}
                  >
                    <Select.Option value="">Select Application Limit</Select.Option>
                    <Select.Option value={"true"}>Active</Select.Option>
                    <Select.Option value={"false"}>Inactive</Select.Option>
                  </Select>
                )}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">{errors.duration.message}</p>
              )}
            </div>

            {/* Max Days (conditionally shown) */}
          

           


            {/* Is Paid */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Is This a Paid Leave? <span className="text-red-600">*</span></label>

              <Controller
                name="isPaid"
                control={control}
                
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.isPaid ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Option"
                  >
                    <Select.Option value="">Select Option</Select.Option>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                )}
              />
              {/* <select
                {...register("isPaid", {
                  required: "This field is required",
                })}
                className={`${inputClassName} ${errors.isPaid ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Option</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select> */}
              {errors.isPaid && (
                <p className="text-red-500 text-sm">{errors.isPaid.message}</p>
              )}
            </div>

            {isDurationActive && (
              <div className="">
                <label className={`${inputLabelClassName}`}>Maximum Days Per Application ( In Month ) <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  {...register("maxDays", {
                    required: "Maximum Days Per Application is required",
                    validate: (value) => {
                      if (value > totalLeaves) {
                        return "Maximum Days Per Application cannot be greater than Total Annual Allowance";
                      }
                      return true;
                    },
                    
                  })}
                  className={`${inputClassName} ${errors.maxDays ? "border-[1px] " : "border-gray-300"}`}
                  placeholder="Enter Maximum Days Per Application"
                />
                {errors.maxDays && (
                  <p className="text-red-500 text-sm">{errors.maxDays.message}</p>
                )}
              </div>
            )}

            {/* Is Carry Forward */}
            {(isPaid && isDurationActive) && <div className="">
              <label className={`${inputLabelClassName}`}>Allow Carry Forward? <span className="text-red-600">*</span></label>
              {/* <select
                {...register("isCarryForward", {
                  required: "This field is required",
                })}
                className={`${inputClassName} ${errors.isCarryForward ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Option</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select> */}

              <Controller
                name="isCarryForward"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.isCarryForward ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Option"
                  >
                    <Select.Option value="">Select Option</Select.Option>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                )}
              />
              {errors.isCarryForward && (
                <p className="text-red-500 text-sm">{errors.isCarryForward.message}</p>
              )}
            </div>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={leaveTyeloading}
              className={`${leaveTyeloading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {leaveTyeloading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateLeaveType;
