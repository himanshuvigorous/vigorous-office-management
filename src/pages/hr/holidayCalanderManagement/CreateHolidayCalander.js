import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputClassNameSearch,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { useEffect } from "react";
import { createholidayCalander } from "./holidayCalanderFeatures/_holiday_calander_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { Select } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import ListLoader from "../../../global_layouts/ListLoader";

const CreateHolidayCalander = () => {
  const {
    register,
    handleSubmit,
    control,

    formState: { errors },
    setValue,
  } = useForm();
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
  const { companyList,companyListLoading } = useSelector((state) => state.company);
  const { branchList,branchListloading } = useSelector(
    (state) => state.branch
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onSubmit = (data) => {
    const finalPayload = {
      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          :
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
      name: data?.name,
      date: dayjs(data?.date).format("YYYY-MM-DD"),
      type: data?.type,
      description: data?.description,
      status: true,
    };

    dispatch(createholidayCalander(finalPayload)).then((data) => {
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
                name="PDCompanyId"
                control={control}
                rules={{
                  required: "Company is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}

                    placeholder="Select Company"
                    showSearch

                  >
                    <Select.Option value="">Select Company</Select.Option>
                    {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                     ( companyList
                        ?.map((element) => (
                          <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
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
                name="PDBranchId"
                control={control}
                rules={{
                  required: "Branch is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                     onChange={(value) => {
                        setValue("type", '')
                        field.onChange(value);
                      }}
                    className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"} z-[99999]`}
                    placeholder="Select Branch"
                    showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                      (sortByPropertyAlphabetically(branchList,'fullName')
                        ?.map((element) => (
                          <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                        )))
                    }
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
              {/* Name Input Field */}
              <label className={`${inputLabelClassName}`}>
                Name <span className="text-red-600">*</span>
              </label>
              <input
                {...register("name", {
                  required: "Name is required",
                })}
                placeholder="Name"
                type="text"
                className={`${inputClassName} ${errors.name ? "border-[1px] " : "border-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="">
              {/* Date Picker */}
              <label className={`${inputLabelClassName}`}>
                Date <span className="text-red-600">*</span>
              </label>
              {/* <input
                {...register("date", {
                  required: "Date is required",
                })}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                  }`}
              /> */}

              <Controller
                name="date"
                control={control}
                rules={{
                  required: "Date  is required",
                }}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current &&
                        current.isBefore(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            <div className="">
              {/* Type Select Field */}
              <label className={`${inputLabelClassName}`}>
                Type <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("type", {
                  required: "Type is required",
                })}
                className={`${inputClassName} ${errors.type ? "border-[1px] " : "border-gray-300"
                  }`}
              >
                <option value="">Select Type</option>
                <option value="Public">Public</option>
                <option value="Optional">Optional</option>
                <option value="Company">Company</option>
              </select> */}

              <Controller
                name="type"
                control={control}
                rules={{
                  required: "Type  is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}

                    placeholder="Select Type"
                    showSearch
                    filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }

                  >
                    <Select.Option value="">Select Type</Select.Option>
                    <Select.Option value="Public">Public</Select.Option>

                    <Select.Option value="Optional">Optional</Select.Option>

                    <Select.Option value="Company">Company</Select.Option>

                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            <div className="">
              {/* Description Input Field */}
              <label className={`${inputLabelClassName}`}>
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Description"
                className={`${inputClassName} ${errors.description ? "border-[1px] " : "border-gray-300"
                  }`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>


          </div>

          <div className="flex justify-end">
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
};

export default CreateHolidayCalander;
