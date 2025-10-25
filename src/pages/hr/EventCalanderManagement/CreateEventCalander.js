import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { useEffect } from "react";
import { createeventCalander } from "./EventCalanderFeatures/_event_calander_reducers";
import getUserIds from "../../../constents/getUserIds";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import { Select } from "antd";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";

const CreateEventCalander = () => {
  const { loading: eventCalanderLoading } = useSelector(
    (state) => state.eventCalander
  );
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attendees: [{ name: "", email: "", status: "" }], // default empty attendee
      startTime: "",
      endTime: "",
      isAllDay: false,
      recurrence: {
        frequency: "",
        interval: 1,
        endDate: "",
      },
    },
  });

  const { userCompanyId, userType } = getUserIds();
  const {
    fields: attendees,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attendees",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const { companyList, companyListLoading } = useSelector(
    (state) => state.company
  );
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const onSubmit = (data, index) => {
    // {
    //   "companyId": "67ac965282bb2dd40d7c8bf1",
    //   "directorId": "",
    //   "branchId": "67ac9e22e7941bc50cdbeeaf",
    //   "title": "Project 1122",
    //   "description": "Initial meeting to discuss project goals and deliverables.",
    //   "location": "Conference Room 1",
    //   "startDate": "2025-03-12T00:00:00Z",
    //   "endDate": "2025-03-19T00:00:00Z",
    //   "attendees": [
    //     {
    //       "name": "John Doe",
    //       "email": "john.doe@example.com",
    //       "status": "accepted"
    //     },
    //     {
    //       "name": "Jane Smith",
    //       "email": "jane.smith@example.com",
    //       "status": "tentative"
    //     }
    //   ]
    // }

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
      title: data.title,
      description: data.title,
      location: data.location,
      startDate: dayjs(data.startTime),
      endDate: dayjs(data.endTime),

      attendees: data.attendees,
    };

    dispatch(createeventCalander(finalPayload)).then((data) => {
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

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-2 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:my-2">
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
                  name="PDCompanyId"
                  control={control}
                  rules={{
                    required: "Company is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${
                        errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
                      placeholder="Select Company"
                      showSearch
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? (
                        <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>
                      ) : (
                        companyList?.map((element) => (
                          <Select.Option value={element?._id}>
                            {" "}
                            {element?.fullName}{" "}
                          </Select.Option>
                        ))
                      )}
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
                      className={` ${inputAntdSelectClassName} ${
                        errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      } z-[99999]`}
                      placeholder="Select Branch"
                      showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? (
                        <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>
                      ) : (
                        sortByPropertyAlphabetically(branchList,'fullName')?.map((element) => (
                          <Select.Option value={element?._id}>
                            {" "}
                            {element?.fullName}{" "}
                          </Select.Option>
                        ))
                      )}
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
              {/* Title Input Field */}
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Title"
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
              {/* Description Input Field */}
              <label className={`${inputLabelClassName}`}>
                Description <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Description"
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
              {/* Location Input Field */}
              <label className={`${inputLabelClassName}`}>
                Location <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Location"
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
              {/* Start Time Input Field */}
              <label className={`${inputLabelClassName}`}>
                Start Time <span className="text-red-600">*</span>
              </label>
              {/* <input
                {...register("startTime", { required: "Start time is required" })}
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                className={`${inputClassName} ${errors.startTime ? "border-[1px] " : "border-gray-300"}`}
              /> */}

              <Controller
                name="startTime"
                control={control}
                showTime={true}
                rules={{
                  required: "Start Time  is required",
                }}
             
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    showTime={true}
                    format="DD/MM/YYYY hh:mm"
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current && current.isBefore(dayjs().endOf("day"), "day")
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
              {/* End Time Input Field */}
              <label className={`${inputLabelClassName}`}>
                End Time <span className="text-red-600">*</span>
              </label>
              {/* <input
                min={new Date().toISOString().slice(0, 16)}
                {...register("endTime", { required: "End time is required" })}
                type="datetime-local"
                className={`${inputClassName} ${errors.endTime ? "border-[1px] " : "border-gray-300"}`}
              /> */}
              <Controller
                name="endTime"
                control={control}
                showTime={true}
                rules={{
                  required: "End Time  is required",
                }}
                format="DD/MM/YYYY hh:mm"
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    showTime={true}
                    format="DD/MM/YYYY hh:mm"
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current && current.isBefore(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />

              {errors.endTime && (
                <p className="text-red-500 text-sm">{errors.endTime.message}</p>
              )}
            </div>
            {/* 
            <div className="">
             
              <label className={`${inputLabelClassName}`}>
                All Day Event <span className="text-red-600">*</span>
              </label>
              <select
                {...register("isAllDay", { required: "Please select whether it is an all-day event" })}
                className={`${inputClassName} ${errors.isAllDay ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select all Day</option>
                <option value="true">Active</option>
                <option value="false">InActive</option>
              </select>
              {errors.isAllDay && <p className="text-red-500 text-sm">{errors.isAllDay.message}</p>}
            </div> */}
            {/* 
            <div className="">
          
              <label className={`${inputLabelClassName}`}>
                Recurrence Frequency <span className="text-red-600">*</span>
              </label>
              <select
                {...register("recurrence.frequency",{
                  required:'recurrence frequency is required'
                })}
                className={`${inputClassName} ${errors.recurrence?.frequency ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Recurrence</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.recurrence?.frequency && (
                <p className="text-red-500 text-sm">{errors.recurrence.frequency.message}</p>
              )}
            </div>

            <div className="">
         
              <label className={`${inputLabelClassName}`}>
                Recurrence Interval <span className="text-red-600">*</span>
              </label>
              <input
                {...register("recurrence.interval", { required: "Recurrence interval is required" })}
                type="number"
                className={`${inputClassName} ${errors.recurrence?.interval ? "border-[1px] " : "border-gray-300"}`}
              />
              {errors.recurrence?.interval && (
                <p className="text-red-500 text-sm">{errors.recurrence.interval.message}</p>
              )}
            </div>

            <div className="">
       
              <label className={`${inputLabelClassName}`}>
                Recurrence End Date <span className="text-red-600">*</span>
              </label>
              <Controller
                    name="recurrence.endDate"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker  field={field} errors={errors}  disabledDate={(current) => {
                        return current && current.isBefore(moment().endOf('day'), 'day');
                      }} /> 
                    )}
                  />
              {errors.recurrence?.endDate && (
                <p className="text-red-500 text-sm">{errors.recurrence.endDate.message}</p>
              )}
            </div> */}
          </div>

          {/* Attendees Input Fields */}

          {attendees?.map((item, index) => (
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
                  type="text"
                  placeholder="Attendee Name"
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
                  type="email"
                  className={`${inputClassName} ${
                    errors.attendees?.[index]?.email
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                  placeholder="Attendee Email"
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
                  className={`${inputClassName} ${errors.attendees?.[index]?.status ? "border-[1px] " : "border-gray-300"}`}
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
                      className={` ${inputAntdSelectClassName} ${
                        errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
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
              className={`${
                eventCalanderLoading ? "bg-gray-400" : "bg-header"
              } text-white p-2 px-4 rounded`}
            >
              {eventCalanderLoading ? <Loader /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateEventCalander;
