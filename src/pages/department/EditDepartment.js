import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Select, Spin } from "antd";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { getDepartmentById, updateDepartmentFunc } from "./departmentFeatures/_department_reducers";
import { decrypt } from "../../config/Encryption";
import { domainName, inputAntdSelectClassName, inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName } from "../../constents/global";
import getUserIds from '../../constents/getUserIds';
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../global_layouts/Loader/Loader";
import CustomMobileCodePicker from "../../global_layouts/MobileCode/MobileCodePicker";

const MemoizedCustomMobileCodePicker = React.memo(CustomMobileCodePicker);

function EditDepartment() {
  // Selectors with memoization
  const departmentLoading = useSelector((state) => state.department.loading);
  const departmentByIdData = useSelector((state) => state.department.departmentByIdData);
  const companyList = useSelector((state) => state.company.companyList);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      status: true // Default value for status
    }
  });

  const [pageLoading, setPageLoading] = React.useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userCompanyId, userType } = getUserIds();
  const { departmentIdEnc } = useParams();
  const departmentId = useMemo(() => decrypt(departmentIdEnc), [departmentIdEnc]);

  // Memoized company options
  const companyOptions = useMemo(() => 
    companyList?.map((type) => (
      <option key={type?._id} value={type?._id}>
        {type?.fullName}({type?.userName})
      </option>
    )),
    [companyList]
  );

  // Fetch data callback
  const fetchData = useCallback(async () => {
    try {
      if (userType === "admin") {
        await dispatch(companySearch({ 
          text: "", 
          sort: true, 
          status: true, 
          isPagination: false 
        }));
      }
      const reqData = { _id: departmentId };
      await dispatch(getDepartmentById(reqData));
      setPageLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPageLoading(false);
    }
  }, [departmentId, dispatch, userType]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set form values when data is loaded
  useEffect(() => {
    if (departmentByIdData?.data) {
      const { data } = departmentByIdData;
      setValue("companyId", data?.companyId);
      setValue("departmentName", data?.name);
      setValue("status", data?.status);
      setValue("email", data?.email);
      setValue("PDMobileCode", data?.mobile?.code);
      setValue("PDMobileNo", data?.mobile?.number);
    }
  }, [departmentByIdData, setValue]);

  // Submit handler
  const onSubmit = useCallback((data) => {
    const finalPayload = {
      _id: departmentId,
      name: data.departmentName,
      status: data?.status,
      email: data?.email,
      companyId: data?.companyId,
      mobile: {
        code: data?.PDMobileCode,
        number: data?.PDMobileNo
      }
    };

    dispatch(updateDepartmentFunc(finalPayload)).then(({ error }) => {
      if (!error) navigate(-1);
    });
  }, [departmentId, dispatch, navigate]);

  // Status options
  const statusOptions = useMemo(() => [
    { value: true, label: 'Active' },
    { value: false, label: 'In Active' }
  ], []);

  if (pageLoading) return <Loader />;

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form 
          autoComplete="off" 
          className="mt-5" 
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userType === "admin" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Company<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("companyId", {
                    required: "Company is required",
                  })}
                  className={`${inputClassName} ${
                    errors.companyId ? "border-[1px]" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Company</option>
                  {companyOptions}
                </select>
                {errors.companyId && (
                  <p className="text-red-500 text-sm">
                    {errors.companyId.message}
                  </p>
                )}
              </div>
            )}

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Department Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("departmentName", {
                  required: "Department Name is required",
                })}
                className={`placeholder: ${inputClassName} ${
                  errors.departmentName ? "border-[1px]" : "border-gray-300"
                }`}
                placeholder="Enter Department Name"
              />
              {errors.departmentName && (
                <p className="text-red-500 text-sm">
                  {errors.departmentName.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${
                      errors.status ? "border-[1px]" : "border-gray-300"
                    }`}
                    options={statusOptions}
                    placeholder="Select Status"
                  />
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>Email</label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`${inputClassName} ${
                  errors.email ? "border-[1px]" : "border-gray-300"
                }`}
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="w-[100px] grid">
                <label className={`!text-[#5e6366] !text-sm !font-normal !font-[Poppins] !mb-0`}>
                  code
                </label>
                <Controller
                  control={control}
                  name="PDMobileCode"
                  render={({ field }) => (
                    <MemoizedCustomMobileCodePicker
                      field={field}
                      errors={errors}
                    />
                  )}
                />
                {errors.PDMobileCode && (
                  <p className={`${inputerrorClassNameAutoComplete}`}>
                    {errors.PDMobileCode.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Mobile No</label>
                <input
                  type="tel" // Better for mobile number input
                  {...register("PDMobileNo", {
                    minLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                  })}
                  className={`${inputClassName} ${
                    errors.PDMobileNo ? "border-[1px]" : "border-gray-300"
                  }`}
                  placeholder="Enter Mobile No"
                  maxLength={10}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 10);
                  }}
                />
                {errors.PDMobileNo && (
                  <p className="text-red-500 text-sm">
                    {errors.PDMobileNo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={departmentLoading}
              className={`${
                departmentLoading ? 'bg-gray-400' : 'bg-header'
              } text-white p-2 px-4 mt-3 rounded`}
            >
              {departmentLoading ? (
                <div className="text-center flex justify-center items-center">
                  <Spin size="small" />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default React.memo(EditDepartment);