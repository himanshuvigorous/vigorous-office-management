import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { createDepartmentFunc } from "./departmentFeatures/_department_reducers";
import { useNavigate } from "react-router-dom";
import { formButtonClassName, inputClassName, inputLabelClassName, domainName, usertypelist, inputerrorClassNameAutoComplete, } from "../../constents/global";
import getUserIds from '../../constents/getUserIds';
import { useEffect } from "react";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../global_layouts/Loader";
import CustomMobileCodePicker from "../../global_layouts/MobileCode/MobileCodePicker";

function CreateDepartment() {

  const { loading: departmentLoading } = useSelector(
    (state) => state.department
  );
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userCompanyId, userType } = getUserIds();
  const { companyList } = useSelector((state) => state.company);

  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  useEffect(() => {
    if (userType === "admin") {
      dispatch(companySearch({ isPagination: false, text: "", sort: true, status: true }));
    }
  }, []);

  const onSubmit = (data) => {
    const finalPayload = {
      "name": data.departmentName,
      email: data?.email,
      companyId: companyId,
      mobile: {
        code: data?.PDMobileCode,
        number: data?.PDMobileNo
      }
    };

    dispatch(createDepartmentFunc(finalPayload)).then((data) => {
      !data.error && navigate(-1)
    });
  }

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
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
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

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Department Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("departmentName", {
                  required: "Department Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.departmentName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Department Name"
              />
              {errors.departmentName && (
                <p className="text-red-500 text-sm">
                  {errors.departmentName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Email
              </label>
              <input
                type="text"
                {...register("email", {

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

            <div className="flex gap-3 pt-7">
              <div className="w-[100px] grid">
                <label className={`!text-[#5e6366] !text-sm  !font-normal !font-[Poppins] `}>
                  Code
                </label>
                <Controller
                  control={control}
                  name="PDMobileCode"

                  render={({ field }) => (
                    <CustomMobileCodePicker
                      field={field}
                      errors={errors}
                    />
                  )}
                />

                {errors[`PDMobileCode`] && (
                  <p className={`${inputerrorClassNameAutoComplete}`}>
                    {errors[`PDMobileCode`].message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName} `}>
                  Mobile No
                </label>
                <input
                  type="number"
                  {...register(`PDMobileNo`, {

                    minLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                  })}
                  className={` ${inputClassName}  ${errors[`PDMobileNo`]
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
                {errors[`PDMobileNo`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`PDMobileNo`].message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={departmentLoading}
              className={`${departmentLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3 `}
            >
              {departmentLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateDepartment
