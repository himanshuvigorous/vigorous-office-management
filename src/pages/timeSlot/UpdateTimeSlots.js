import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { decrypt } from "../../config/Encryption";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../constents/global";
import getUserIds from '../../constents/getUserIds';
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../Director/director/DirectorFeatures/_director_reducers";
import { updateTimeSlotsFunc, getTimeSlotsById } from "./timeSlotsFeatures/_timeSlots_reducers";
import ReactSelect from 'react-select';
import Loader from "../../global_layouts/Loader";
import { Select } from "antd";
import ListLoader from "../../global_layouts/ListLoader";


function UpdateTimeSlots() {
  const { loading: timeSlotLoading } = useSelector(state => state.timeSlots)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const [pageLoading, setPageLoading] = useState(true);
  const { companyList } = useSelector((state) => state.company);
  const { designationList } = useSelector((state) => state.designation);


  const { timeSlotsIdEnc } = useParams();
  const timeSlotsId = decrypt(timeSlotsIdEnc);
  const { timeSlotsByIdData } = useSelector((state) => state.timeSlots);

 
  const { departmentListData } = useSelector(state => state.department);

  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { directorLists } = useSelector((state) => state.director);


  const [days, setDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [weekOffs, setWeekOffs] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);


  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const directorId = useWatch({
    control,
    name: "directorId",
    defaultValue: userDirectorId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: userDepartmentId,
  });

  const designationId = useWatch({
    control,
    name: "designationId",
    defaultValue: userDesignationId,
  });

  const employeId = useWatch({
    control,
    name: "employeId",
    defaultValue: userEmployeId,
  });


  useEffect(() => {

    const fetchData = async () => {
      try {
        if (userType === "admin") {
          await dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
        }
        const reqData = {
          _id: timeSlotsId,
        };
        await dispatch(getTimeSlotsById(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchDaysList = async () => {
    const dayListData = [
      { dayName: "Monday", label: "Monday" },
      { dayName: "Tuesday", label: "Tuesday" },
      { dayName: "Wednesday", label: "Wednesday" },
      { dayName: "Thursday", label: "Thursday" },
      { dayName: "Friday", label: "Friday" },
      { dayName: "Saturday", label: "Saturday" },
    ];
    return dayListData;
  };

  useEffect(() => {
    const weekDaysList = async () => {
      const daysList = await fetchDaysList();
      const formattedOptions = daysList.map((day) => ({
        value: day.dayName,
        label: day.dayName,
      }));
      setDays(formattedOptions);
    };
    weekDaysList();
  }, []);

  const handleWorkingDays = (selected) => {
    setSelectedDays(selected || []);
  };

  useEffect(() => {
    if (timeSlotsByIdData?.data?.workingDays) {
      const formattedSelectedDays = Object.values(
        timeSlotsByIdData?.data?.workingDays
      ).map((day) => ({
        value: day,
        label: day,
      }));
      setSelectedDays(formattedSelectedDays);
    }
  }, [timeSlotsByIdData]);

  const getWorkingDaysValues = () => {
    return selectedDays.map((day) => day.value);
  };

  const fetchWeekOffList = async () => {
    const weekListCount = [
      { weekCount: 1 },
      { weekCount: 2 },
      { weekCount: 3 },
      { weekCount: 4 },
      { weekCount: 5 },
    ];
    return weekListCount;
  };

  useEffect(() => {
    const fetchAndSetWeekOffs = async () => {
      const daysList = await fetchWeekOffList();
      const formattedOptions = daysList.map((week) => ({
        value: week.weekCount,
        label: `Week ${week.weekCount}`,
      }));
      setWeekOffs(formattedOptions);
    };
    fetchAndSetWeekOffs();
  }, []);

  const handleSaturdays = (selected) => {
    setSelectedWeeks(selected || []);
  };

  const getWeekOffValues = () => {
    return selectedWeeks.map((week) => week.value);
  };

  useEffect(() => {
    const preloadedWeeks = timeSlotsByIdData?.data?.weekOffRules?.saturdaysOff;
    const formattedPreloadedWeeks = preloadedWeeks?.map((week) => ({
      value: week,
      label: `Week ${week}`,
    }));
    setSelectedWeeks(formattedPreloadedWeeks);
  }, [timeSlotsByIdData]);

  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          userType: "company",
          text: "",
          status: true,
        })
      );
    }
  }, []);



  useEffect(() => {
    if ((companyId && userType === "company" || companyId && userType === "admin")) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId
        })
      );
    }
  }, [companyId])

  useEffect(() => {
    if (companyId && userType === "company" || userType === "admin") {
      dispatch(directorSearch({
        text: "", sort: true, status: true, isPagination: false, companyId: companyId,
      })
      );
    }
  }, [companyId]);

  useEffect(() => {
    if (departmentId) {
      dispatch(
        designationSearch({
          departmentId: departmentId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [departmentId]);

  useEffect(() => {
    if (timeSlotsByIdData && timeSlotsByIdData?.data) {
      setValue("companyId", timeSlotsByIdData?.data?.companyId);
      setValue("departmentName", timeSlotsByIdData?.data?.name);
      setValue("directorId", timeSlotsByIdData?.data?.directorId);
      setValue("branchId", timeSlotsByIdData?.data?.branchId);

      setValue("shiftName", timeSlotsByIdData?.data?.shiftName);
      setValue("lateMIN", timeSlotsByIdData?.data?.lateMIN);
      setValue("lunchMin", timeSlotsByIdData?.data?.lunchMin);
      setValue("skipHRS", timeSlotsByIdData?.data?.skipHRS);

      setValue("openingTime", timeSlotsByIdData?.data?.openingTime);
      setValue("closingTime", timeSlotsByIdData?.data?.closingTime);
      setValue("workingDaysvalue", timeSlotsByIdData?.data?.workingDaysvalue);
      setValue("weekoffvalue", timeSlotsByIdData?.data?.weekoffvalue);
      // setValue("sundaysOff", timeSlotsByIdData?.data?.weekOffRules?.sundaysOff);
      setValue("sundaysOff", timeSlotsByIdData?.data?.weekOffRules?.sundaysOff ? "Yes" : "No");
      setValue("isApplySandwich", timeSlotsByIdData?.data?.isApplySandwich ? "Yes" : "No");


    }
  }, [timeSlotsByIdData]);


  const onSubmit = (data) => {
    const workingDaysvalue = getWorkingDaysValues();
    const weekoffvalue = getWeekOffValues();
    const finalPayload = {
      _id: timeSlotsId,
      companyId: companyId,
      directorId: directorId,
      branchId: branchId,
      // departmentId: departmentId,
      // designationId: designationId,
      shiftName: data?.shiftName,
      "skipHRS": + data?.skipHRS,
      "lunchMin": + data?.lunchMin,
      "lateMIN": + data?.lateMIN,
      "workingDays": workingDaysvalue,
      "weekOffRules": {
        "sundaysOff": data?.sundaysOff == "Yes" ? true : false,
        "saturdaysOff": weekoffvalue,
      },
      openingTime: String(data?.openingTime),
      closingTime: String(data?.closingTime),
      isApplySandwich: data?.isApplySandwich == "true" ? true : false,
    };

    dispatch(updateTimeSlotsFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };




  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              {(userType === "admin") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Company<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("companyId", {
                      required: "Company is required",
                    })}
                    className={` ${inputClassName} ${errors.companyId ? "border-[1px] " : "border-gray-300"
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
                </div>
              )}
              {/* {(userType === "admin" || userType === "company") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Director<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDDirectorId", {
                      required: "Director is required",
                    })}
                    className={` ${inputClassName} ${errors.PDDirectorId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Director
                    </option>
                    {directorLists?.map((element) => (
                      <option value={element?._id}>{element?.fullName}</option>
                    ))}
                  </select>
                  {errors.PDDirectorId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDDirectorId.message}
                    </p>
                  )}
                </div>)} */}
              {(userType === "admin" || userType === "company") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Branch<span className="text-red-600">*</span>
                  </label>
                  {/* <select
                    {...register("branchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassName} ${errors.branchId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Branch
                    </option>

                    {branchList
                      ?.filter((element) => element?.companyId === companyId)
                      ?.map((element) => (
                        <option value={element?._id}>{element?.fullName}</option>
                      ))}

                    {branchList?.map((element) => (
                      <option value={element?._id}>{element?.fullName}</option>
                    ))}
                  </select> */}

                  <Controller
                    control={control}
                    name="branchId"
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        )))}
                      </Select>
                    )}
                  />
                  {errors.branchId && (
                    <p className="text-red-500 text-sm">
                      {errors.branchId.message}
                    </p>
                  )}
                </div>)}

              {/* {(userType === "admin" || userType === "company") && ( */}
              {/* <div className="">
                <label className={`${inputLabelClassName}`}>
                  Department<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("departmentId", {
                    required: "Department is required",
                  })}
                  className={` ${inputClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Department
                  </option>
   

                  {departmentListData?.map((element) => (
                    <option value={element?._id}>{element?.name}</option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-sm">
                    {errors.departmentId.message}
                  </p>
                )}
              </div> */}
              {/* )} */}

            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              <div className="">
                <label className={`${inputLabelClassName}`}>Designation</label>
                <select
                  {...register("designationId", {
                    required: "Designation is required",
                  })}
                  className={` ${inputClassName} ${errors.designationId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Designation
                  </option>
                  {designationList?.map((type) => (
                    <option value={type?._id}>{type?.name}</option>
                  ))}


                </select>
                {errors.designationId && (
                  <p className="text-red-500 text-sm">
                    {errors.designationId.message}
                  </p>
                )}
              </div>
            </div> */}


            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-2">

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Shift Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("shiftName", {
                    required: "Shift Name is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.shiftName ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Shift Name"
                />
                {errors.shiftName && (
                  <p className="text-red-500 text-sm">
                    {errors.shiftName.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Late Minutes <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("lateMIN", {
                    required: "Late Minutes is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.lateMIN ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Late Minutes"
                />
                {errors.lateMIN && (
                  <p className="text-red-500 text-sm">
                    {errors.lateMIN.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Lunch Minutes <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("lunchMin", {
                    required: "Lunch Minutes is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.lunchMin ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Lunch Minutes"
                />
                {errors.lunchMin && (
                  <p className="text-red-500 text-sm">
                    {errors.lunchMin.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Skip Minutes <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("skipHRS", {
                    required: "Skip Minutes is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.skipHRS ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Skip Minutes"
                />
                {errors.skipHRS && (
                  <p className="text-red-500 text-sm">
                    {errors.skipHRS.message}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Opening Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  typeof="time"
                  {...register("openingTime", { required: "Opening Time is required" })}
                  className={`mt-1 block w-full border ${errors.openingTime ? "border-[1px] " : "border-gray-300"
                    } p-2 rounded`}
                />
                {errors.openingTime && (
                  <p className="text-red-500 text-sm">
                    {errors.openingTime.message}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Closing Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  typeof="time"
                  {...register("closingTime", { required: "Closing Time is required" })}
                  className={`mt-1 block w-full border ${errors.closingTime ? "border-[1px] " : "border-gray-300"
                    } p-2 rounded`}
                />
                {errors.closingTime && (
                  <p className="text-red-500 text-sm">
                    {errors.closingTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-2">
              <div>
                <label className={`${inputLabelClassName}`}>
                  Working Days  <span className="text-red-600">*</span>
                </label>
                <ReactSelect
                  isMulti
                  options={days}
                  value={selectedDays}
                  onChange={handleWorkingDays}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Saturday Off <span className="text-red-600">*</span>
                </label>
                <ReactSelect
                  isMulti
                  options={weekOffs}
                  value={selectedWeeks}
                  onChange={handleSaturdays}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Sundays Off <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("sundaysOff", {
                    required: "Sundays Off is required",
                  })}
                  className={` ${inputClassName} ${errors.sundaysOff ? "border-[1px] " : "border-gray-300"}`}
                >
                  <option value="">Select Sundays Off</option>
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>

                  
                </select> */}
                <Controller
                  control={control}
                  name="sundaysOff"
                  rules={{ required: "sundaysOff is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Sundays Off</Select.Option>
                      <Select.Option value="Yes">Yes</Select.Option>
                      <Select.Option value="No">No</Select.Option>

                    </Select>
                  )}
                />
                {errors.sundaysOff && (
                  <p className="text-red-500 text-sm">{errors.sundaysOff.message}</p>
                )}
              </div>

              <div>
                <label className={`${inputLabelClassName}`}>
                  Select Sandwich <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="isApplySandwich"
                  rules={{ required: "Select Sandwich is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Sandwich</Select.Option>
                      <Select.Option value="true">Yes</Select.Option>
                      <Select.Option value="false">No</Select.Option>

                    </Select>
                  )}
                />
                {errors.isApplySandwich && (
                  <p className="text-red-500 text-sm">{errors.isApplySandwich.message}</p>
                )}
              </div>


            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={timeSlotLoading}
              className={`${timeSlotLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {timeSlotLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default UpdateTimeSlots;