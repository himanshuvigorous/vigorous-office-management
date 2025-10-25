import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import { decrypt } from "../../../config/Encryption";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";

import moment from "moment";
import { getHolidayCalanderDetails, updateholidayDetails } from "./holidayCalanderFeatures/_holiday_calander_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Select } from "antd";

const EditHolidayCalander = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { holidayCalanderIdEnc } = useParams();
  const holidayCalanderId = decrypt(holidayCalanderIdEnc);


  const { holidayCalanderDetails } = useSelector((state) => state.holidayCalander);




  useEffect(() => {
    if (holidayCalanderId) {
      dispatch(getHolidayCalanderDetails({ _id: holidayCalanderId }));
    }
  }, [dispatch, holidayCalanderId]);

  // Populate form fields once leaveRequestDetails is available
  useEffect(() => {
    if (holidayCalanderDetails) {
      setValue("name", holidayCalanderDetails?.name);
      setValue("date", dayjs(holidayCalanderDetails?.date))
      setValue("type", holidayCalanderDetails?.type);
      setValue("description",holidayCalanderDetails?.description);
      setValue("status", holidayCalanderDetails?.status === true ? "true" : "false");

    }

  }, [holidayCalanderDetails, setValue]);



  const onSubmit = (data) => {
    const finalPayload = {
    companyId : holidayCalanderDetails?.companyId,
    branchId : holidayCalanderDetails?.branchId,
      _id:holidayCalanderId ,
    name: data?.name,
    date: dayjs(data?.date).format("YYYY-MM-DD"),
    type: data?.type,
    description: data?.description,

    status: data?.status === "true" ? true : false,
    };

    dispatch(updateholidayDetails(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
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
                className={`${inputClassName} ${
                  errors.name ? "border-[1px] " : "border-gray-300"
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
              <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    
                    <CustomDatePicker
                      field={field}
                      errors={errors}
                      disabledDate={(current) => {
                        return (
                          current &&
                          current.isBefore(moment().endOf("day"), "day")
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
                className={`${inputClassName} ${
                  errors.type ? "border-[1px] " : "border-gray-300"
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
                        required: "type  is required",
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
                className={`${inputClassName} ${
                  errors.description ? "border-[1px] " : "border-gray-300"
                }`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

           
            <div className="">
              {/* Is Recurring Select Field */}
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("status", {
                  required: "Recurring option is required",
                })}
                className={`${inputClassName} ${
                  errors.status ? "border-[1px] " : "border-gray-300"
                }`}
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>InActive</option>
              </select> */}
              <Controller
                      name="status"
                      control={control}
                      rules={{
                        required: "status  is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                
                          placeholder="Select status"
                          showSearch

                        >
                          <Select.Option value="">Select status</Select.Option>
                          <Select.Option value="true">Active</Select.Option>                             
                            <Select.Option value="false">InActive</Select.Option>
                           
                        </Select>
                      )}
                    />
              {errors.status && (
                <p className="text-red-500 text-sm">
                  {errors.status.message}
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

export default EditHolidayCalander;
