import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
} from "../../../constents/global";
import { useEffect } from "react";
import {
  updateEventCalander,
  geteventCalanderDetails,
} from "./EventCalanderFeatures/_event_calander_reducers";
import { decrypt } from "../../../config/Encryption";

import getUserIds from "../../../constents/getUserIds";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";

const EditEventCalander = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attendees: [{ name: "", email: "", status: "" }], // default empty attendee
      startTime: "",
      endTime: "",
      isAllDay: "",
      recurrence: {
        frequency: "",
        interval: 1,
        endDate: "",
      },
    },
  });
  const { userCompanyId, userType } = getUserIds();
  const { eventCalanderEnc } = useParams();
  const eventCalander = decrypt(eventCalanderEnc);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendees",
  });
  const { companyList } = useSelector((state) => state.company);
  const { directorLists } = useSelector((state) => state.director);
  const { branchList } = useSelector((state) => state.branch);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventCalanderDetails ,loading:eventCalanderLoading } = useSelector(
    (state) => state.eventCalander
  );

 
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  useEffect(() => {
    if (eventCalanderDetails) {
  
      setValue("PDCompanyId", eventCalanderDetails?.PDCompanyId);
      setValue("title", eventCalanderDetails?.title);
      setValue("attendees", eventCalanderDetails?.attendees);
      setValue(
        "startTime",
        dayjs(eventCalanderDetails?.startDate)
      );
      setValue("location", eventCalanderDetails?.location);
      setValue(
        "endTime",
        dayjs(eventCalanderDetails?.endDate)
      );
     
      setValue("description", eventCalanderDetails?.description);
      setValue("status", eventCalanderDetails?.status === true ? 'true' : "false");
    
      
     
      eventCalanderDetails.attendees?.forEach((attendee, index) => {
        setValue(`attendees[${index}].email`, attendee?.email || "");
        setValue(`attendees[${index}].name`, attendee?.name || "");
        setValue(`attendees[${index}].status`, attendee?.status || "Pending");
      });
    }

  }, [eventCalanderDetails, setValue]);

  useEffect(() => {
    if (eventCalander) {
      dispatch(geteventCalanderDetails({ _id: eventCalander }));
    }
  }, []);
  const status = useWatch({
    control,
    name:'status',
    defaultValue:''
  })

  const onSubmit = (data) => {

    const finalPayload = {
      _id: eventCalander,
      branchId: eventCalanderDetails.branchId,
      companyId: companyId,
      directorID: "",

      // branchId: JSON.parse(localStorage.getItem(`user_info_${domainName}`)).branchId,
      ...data,

      title: data.title,
      description: data.description,
      location: data.location,
      startDate: dayjs(data.startTime),
      endDate: dayjs(data.endTime),
      attendees: data.attendees,
      status: data?.status === "true" ? true : false,
    };

    dispatch(updateEventCalander(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  const handleCompanyChange = (event) => {
    setValue("PDCompanyId", event.target.value);
    setValue("PDBranchId", "");
    setValue("PDDirectorId", "");
    dispatch(
      directorSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: event.target.value,
      })
    );
    dispatch(
      branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: event.target.value,
      })
    );
  };

  const handleFocusCompany = () => {
    if (!companyList?.length) {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  };

  const handleFocusDirector = () => {
    if (!directorLists?.length) {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  };

  const handleBranchChange = (event) => {
    setValue("PDBranchId", event.target.value);
    setValue("PDDepartmentId", "");
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
        branchId: event.target.value,
      })
    );
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:my-2">
            {/* {userType === "admin" && (
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("PDCompanyId", {
                    required: "Company is required",
                  })}
                  className={`${inputClassName}  ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                    } `}
                  onChange={handleCompanyChange}
                  onFocus={handleFocusCompany}
                >
                  <option value="">Select Company</option>
                  {companyList?.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company?.userName}({company?.fullName})
                    </option>
                  ))}
                </select>
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>
            )}
            {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Branch <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("PDBranchId", { required: "Branch is required" })}
                  className={`${inputClassName}  ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                    } `}
                  onChange={handleBranchChange}
                >
                  <option value="">Select Branch</option>
                  {branchList?.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.userName}({branch.fullName})
                    </option>
                  ))}
                </select>
                {errors.PDBranchId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDBranchId.message}
                  </p>
                )}
              </div>
            )} */}

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                className={`${inputClassName} ${
                  errors.title ? "border-[1px] " : "border-gray-300"
                }`}
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
                {...register("description", {
                  required: "Description is required",
                })}
                className={`${inputClassName} ${
                  errors.description ? "border-[1px] " : "border-gray-300"
                }`}
              />

              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Location <span className="text-red-600">*</span>
              </label>
              <input
                {...register("location", { required: "Location is required" })}
                type="text"
                className={`${inputClassName} ${
                  errors.location ? "border-[1px] " : "border-gray-300"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Start Time <span className="text-red-600">*</span>
              </label>
              {/* <input
                {...register("startTime", {
                  required: "Start time is required",
                })}
                type="datetime-local"
                className={`${inputClassName} ${
                  errors.startTime ? "border-[1px] " : "border-gray-300"
                }`}
              /> */}

<Controller
               name="startTime"
               control={control}
                showTime={true} 
                rules={{
                  required: "Start Time  is required",
                }}
                format = "DD/MM/YYYY hh:mm"
               render={({ field }) => (
                 <CustomDatePicker
                   field={field}
                   showTime={true} 
                   format = "DD/MM/YYYY hh:mm"
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
          
              {errors.startTime && (
                <p className="text-red-500 text-sm">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                End Time <span className="text-red-600">*</span>
              </label>
              {/* <input
                {...register("endTime", { required: "End time is required" })}
                type="datetime-local"
                className={`${inputClassName} ${
                  errors.endTime ? "border-[1px] " : "border-gray-300"
                }`}
              /> */}
               <Controller
               name="endTime"
               control={control}
                showTime={true} 
                rules={{
                  required: "End Time  is required",
                }}
                format = "DD/MM/YYYY hh:mm"
               render={({ field }) => (
                 <CustomDatePicker
                   field={field}
                   showTime={true} 
                   format = "DD/MM/YYYY hh:mm"
                   errors={errors}
                   disabledDate={(current) => {
                     return (
                       current &&
                       current?.isBefore(dayjs().endOf("day"), "day")
                     );
                   }}
                 />
               )}
             />
              {errors.endTime && (
                <p className="text-red-500 text-sm">{errors.endTime.message}</p>
              )}
            </div>

            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                All Day Event <span className="text-red-600">*</span>
              </label>
              <select
                {...register("isAllDay", {
                  required: "Please select whether it is an all-day event",
                })}
                className={`${inputClassName} ${
                  errors.isAllDay ? "border-[1px] " : "border-gray-300"
                }`}
              >
                <option value="">Select all Day</option>
                <option value="true">Active</option>
                <option value="false">InActive</option>
              </select>
              {errors.isAllDay && (
                <p className="text-red-500 text-sm">
                  {errors.isAllDay.message}
                </p>
              )}
            </div> */}
{/* 
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Recurrence Frequency <span className="text-red-600">*</span>
              </label>
              <select
                {...register("recurrence.frequency")}
                className={`${inputClassName} ${
                  errors.recurrence?.frequency
                    ? "border-[1px] "
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Recurrence</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.recurrence?.frequency && (
                <p className="text-red-500 text-sm">
                  {errors.recurrence.frequency.message}
                </p>
              )}
            </div>

            <div className="">
             
              <label className={`${inputLabelClassName}`}>
                Recurrence Interval <span className="text-red-600">*</span>
              </label>
              <input
                {...register("recurrence.interval", {
                  required: "Recurrence interval is required",
                })}
                type="number"
                className={`${inputClassName} ${
                  errors.recurrence?.interval
                    ? "border-[1px] "
                    : "border-gray-300"
                }`}
              />
              {errors.recurrence?.interval && (
                <p className="text-red-500 text-sm">
                  {errors.recurrence.interval.message}
                </p>
              )}
            </div>

            <div className="">
              Recurrence End Date Input Field
              <label className={`${inputLabelClassName}`}>
                Recurrence End Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="recurrence.endDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current && current.isAfter(moment().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />
              {errors.recurrence?.endDate && (
                <p className="text-red-500 text-sm">
                  {errors.recurrence.endDate.message}
                </p>
              )}
            </div> */}
                <div className="">
              {/* Is Recurring Select Field */}
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
  
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
      
          {/* Attendees Input Fields */}

          {fields.map((item, index) => (
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Attendee Name Input Field */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Attendee Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register(`attendees[${index}].name`, {
                    required: "Attendee name is required",
                  })}
                  placeholder="Attendee Name"
                  type="text"
                  className={`${inputClassName} ${
                    errors.attendees?.[index]?.name
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                />
                {errors.attendees?.[index]?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.attendees[index].name.message}
                  </p>
                )}
              </div>

              {/* Attendee Email Input Field */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Attendee Email <span className="text-red-600">*</span>
                </label>
                <input
                  {...register(`attendees[${index}].email`, {
                    required: "Attendee email is required",
                  })}
                  placeholder="Attendee Email"
                  type="email"
                  className={`${inputClassName} ${
                    errors.attendees?.[index]?.email
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                />
                {errors.attendees?.[index]?.email && (
                  <p className="text-red-500 text-sm">
                    {errors.attendees[index].email.message}
                  </p>
                )}
              </div>

              {/* Attendee Status Input Field */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Attendee Status
                </label>
                {/* <select
                  {...register(`attendees[${index}].status`)}
                  className={`${inputClassName} ${
                    errors.attendees?.[index]?.status
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                >
                  <option value="">select Status</option>
                  <option value="accepted">Accepted</option>
            
                  <option value="declined">Declined</option>
                </select> */}

                <Controller
                      name={`attendees[${index}].status`}
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
                          <Select.Option value="accepted">Accepted</Select.Option>                             
                            <Select.Option value="declined">Declined</Select.Option>
                           
                        </Select>
                      )}
                    />
                {errors.attendees?.[index]?.status && (
                  <p className="text-red-500 text-sm">
                    {errors.attendees[index].status.message}
                  </p>
                )}
              </div>

              {/* Delete Button for Attendee */}
              <div className="flex md:justify-center justify-end items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                >
                  <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                </button>
              </div>
            </div>
          ))}

          {/* Add Attendee Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() =>
                append({ name: "", email: "", status: "accepted" })
              }
              className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
            >
              Add More
            </button>
          </div>

          <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        disabled={eventCalanderLoading}
                        className={`${eventCalanderLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
                      >
                      {eventCalanderLoading ? <Loader /> : 'Submit'}
                      </button>
          
                    </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditEventCalander;
