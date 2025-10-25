
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { decrypt } from "../../../config/Encryption";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";
import { getprojectserviceDetails, updateprojectserviceFunc } from "./projectserviceFeatures/_projectservice_reducers";




function Editprojectservice() {
  const { loading: projectservice } = useSelector((state) => state.projectservice);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectservicedEnc } = useParams();
  const projectserviceId = decrypt(projectservicedEnc);
  const { projectserviceDetailsData } = useSelector(
    (state) => state.projectservice
  );
  useEffect(() => {
    let reqData = {
      _id: projectserviceId,
    };
    dispatch(getprojectserviceDetails(reqData));
  }, []);

  useEffect(() => {
    if (projectserviceDetailsData) {

      setValue("projectserviceName", projectserviceDetailsData?.name);
      setValue("status", projectserviceDetailsData?.status ? "true" : "false");
    }

  }, [projectserviceDetailsData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: projectserviceId,
      "companyId": projectserviceDetailsData?.companyId,
      "directorId": projectserviceDetailsData?.directorId,
      "branchId": projectserviceDetailsData?.branchId,
      "name": data.projectserviceName,
      status: data?.status === 'true' ? true : false,

    };

    dispatch(updateprojectserviceFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };



  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Projects Services  <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("projectserviceName", {
                  required: "Projects Services is required",
                })}
                className={`${inputClassName} ${errors.projectserviceName ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Projects Services"
              />
              {errors.projectserviceName && (
                <p className="text-red-500 text-sm">
                  {errors.projectserviceName.message}
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
              disabled={projectservice}
              className={`${projectservice ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {projectservice ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default Editprojectservice;
