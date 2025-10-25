import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { createTimeSlotsFunc } from "./timeSlotsFeatures/_timeSlots_reducers";
import ReactSelect from "react-select";
import ListLoader from "../../global_layouts/ListLoader";
import { Select } from "antd";

const CreateTimeSlots = () => {
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

  const { companyList } = useSelector((state) => state.company);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector(state => state.department);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { directorLists } = useSelector((state) => state.director);
  const [days, setDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [weekOffs, setWeekOffs] = useState([]);
  const [selectedweeks, setSelectedweeks] = useState([]);

  const fetchDaysList = async () => {
    const dayListData = [
      { dayName: "Monday" },
      { dayName: "Tuesday" },
      { dayName: "Wednesday" },
      { dayName: "Thursday" },
      { dayName: "Friday" },
      { dayName: "Saturday" },
      { dayName: "Sunday" },
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
    setSelectedweeks(selected || []);
  };

  const getWeekOffValues = () => {
    return selectedweeks.map((week) => week.value);
  };

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

  const onSubmit = (data) => {
    const workingDaysvalue = getWorkingDaysValues();
    const weekoffvalue = getWeekOffValues();
    const sundaysOffValue = data?.sundaysOff == "Yes" ? true : false;
    const finalPayload = {
      companyId: companyId,
      directorId: directorId,
      branchId: branchId,
      shiftName: data?.shiftName,
      "skipHRS": + data?.skipHRS,
      "lunchMin": + data?.lunchMin,
      "lateMIN": + data?.lateMin,
      workingDays: workingDaysvalue,
      weekOffRules: {
        sundaysOff: sundaysOffValue,
        saturdaysOff: weekoffvalue,
      },
      openingTime: String(data?.openingTime),
      closingTime: String(data?.closingTime),
      isApplySandwich: data?.isApplySandwich == "true" ? true : false,
    };
    dispatch(createTimeSlotsFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

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

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
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


            </div>
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
                  {...register("lateMin", {
                    required: "Late Minutes is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.lateMin ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Late Minutes"
                />
                {errors.lateMin && (
                  <p className="text-red-500 text-sm">
                    {errors.lateMin.message}
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
                  Working Days <span className="text-red-600">*</span>
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
                  value={selectedweeks}
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
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                      className={`${inputAntdSelectClassName} `}
                      placeholder='Select Sundays'
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
                      placeholder='Select Sandwich'
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

export default CreateTimeSlots;