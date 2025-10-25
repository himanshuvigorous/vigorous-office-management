import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  inputClassName, inputLabelClassName } from "../../../../constents/global";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import { createResignFunc } from "./resignationFeatures/resignation_reducers";
import dayjs from "dayjs";
import getUserIds from "../../../../constents/getUserIds";
import Loader from "../../../../global_layouts/Loader";


const CreateEmployeeResignation = () => {
    const {loading:employeeResignationLoading } = useSelector((state) => state.resignation);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
    const { userCompanyId,userType, userBranchId ,userEmployeId} = getUserIds();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userCompanyId || "",
      branchId: userBranchId || "",
      employeId : userEmployeId,
      directorId:"",
      title: data?.title,
      description: data?.description,
      applyDate: dayjs(data?.applyDate).format("YYYY-MM-DD"),
      type:"resignation"
    };
    dispatch(createResignFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  if (userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    )
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">



 


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

          <div className="flex justify-end">
          <button
                         type="submit"
                         disabled={employeeResignationLoading}
                         className={`${employeeResignationLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
                       >
                       {employeeResignationLoading ? <Loader /> : 'Submit'}
                       </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateEmployeeResignation;
