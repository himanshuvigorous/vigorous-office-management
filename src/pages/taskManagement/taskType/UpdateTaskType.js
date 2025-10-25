import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decrypt } from "../../../config/Encryption";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { getTaskTypeDetails, updateTaskType } from "./taskFeatures/_task_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { getGstTypeListFunc, gstTypeSearch } from "../../global/other/GstType/GstTypeFeatures/_gstType_reducers";
import { Select, Spin } from "antd";
import ListLoader from "../../../global_layouts/ListLoader";


function UpdateTaskType() {
  const { loading: taskTypeloading } = useSelector((state) => state.taskType);
  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gstTypeList, loading: gstTypeListLoading } = useSelector(state => state.gstType)
  const { taskTypeIdEnc } = useParams();
  const taskTypeId = decrypt(taskTypeIdEnc);
  const { taskTypeDetails } = useSelector((state) => state.taskType);

  const { departmentListData, depListLoading } = useSelector((state) => state.department);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const reqData = {
          _id: taskTypeId,
        };
        await dispatch(getTaskTypeDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (taskTypeDetails) {
      dispatch(deptSearch({ text: "", sort: true, status: true, isPagination: false, companyId: taskTypeDetails?.companyId })).then((data) => {
        setValue("departmentId", taskTypeDetails?.departmentId);
      })
    }
  }, [taskTypeDetails])

  useEffect(() => {
    if (taskTypeDetails) {
      const reqPayload = {
        directorId: "",
        companyId: taskTypeDetails?.companyId,
        branchId: taskTypeDetails?.branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": true,
      }
      dispatch(gstTypeSearch(reqPayload)).then((data) => {
        if (!data.error) {
          setValue("designationName", taskTypeDetails?.name);
          setValue("companyId", taskTypeDetails?.companyId);
          setValue("departmentId", taskTypeDetails?.departmentId);
          setValue("fees", taskTypeDetails?.fees);
          setValue("taskName", taskTypeDetails?.name);
          setValue("gstTypeId", taskTypeDetails?.gstTypeId);
          setValue("HSNCode", taskTypeDetails?.HSNCode);
          // setValue("status", taskTypeDetails?.status);
          setValue("status", taskTypeDetails?.status ? "true" : "false");

        }
      })
    }
  }, [taskTypeDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: taskTypeId,
      companyId: taskTypeDetails?.companyId,
      directorId: '',
      branchId: taskTypeDetails?.branchId,
      "departmentId": data?.departmentId,
      "name": data?.taskName,
      "fees": data?.fees,
      // status: data?.status,
      status: data?.status === 'true' ? true : false,
      "gstTypeId": data?.gstTypeId,
      "HSNCode": data?.HSNCode,
    };
    dispatch(updateTaskType(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      {!pageLoading ? (
        <div className="gap-4">
          <form autoComplete="off" className="mt-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Department<span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("departmentId", {
                    required: "Department is required",
                  })}
                  className={` ${inputClassName} ${errors.departmentId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Department
                  </option>
                  {departmentListData?.map((element) => (
                    <option value={element?._id}>
                      {element?.name}
                    </option>
                  ))}
                </select> */}
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: "department is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"}`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Select Department"
                    >
                      <Select.Option value="">Select Department</Select.Option>
                      {depListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (departmentListData?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />
                {errors.departmentId && (
                  <p className="text-red-500 text-sm">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Task Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("taskName", {
                    required: "Task Name is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.taskName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Task Name"
                />
                {errors.taskName && (
                  <p className="text-red-500 text-sm">
                    {errors.taskName.message}
                  </p>
                )}
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Gst Type<span className="text-red-600">*</span>
                </label>
                <select
                  onFocus={() => {
                    const reqPayload = {
                      directorId: "",
                      companyId: taskTypeDetails?.companyId,
                      branchId: taskTypeDetails?.branchId,
                      "text": "",
                      "sort": true,
                      "status": "",
                      "isPagination": true,
                    }
                    dispatch(gstTypeSearch(reqPayload))
                  }}
                  {...register("gstTypeId", {
                    required: "GST Type is required",
                  })}
                  className={` ${inputClassName} ${errors.gstTypeId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Gst Type
                  </option>


                  {gstTypeListLoading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (gstTypeList?.map((element) => (
                    <option value={element?._id}>
                      {element?.percentage} %
                    </option>
                  )))}
                </select>
                {errors.gstTypeId && (
                  <p className="text-red-500 text-sm">
                    {errors.gstTypeId.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  HSNCode <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("HSNCode", {
                    required: "HSNCode is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.HSNCode
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter HSNCode"
                />
                {errors.HSNCode && (
                  <p className="text-red-500 text-sm">
                    {errors.HSNCode.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Fees <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("fees", {
                    required: "Fees is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.fees
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Fees"
                />
                {errors.fees && (
                  <p className="text-red-500 text-sm">
                    {errors.fees.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Select Status"
                    >
                      <Select.Option value="true">Active</Select.Option>
                      <Select.Option value="false">In Active</Select.Option>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
            </div>
            <div className="flex justify-end ">
              <button
                type="submit"
                disabled={taskTypeloading}
                className={`${taskTypeloading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
              >
                {taskTypeloading ? <div className='text-center flex justify-center items-center'>
                  <Spin />
                </div> : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
}

export default UpdateTaskType;