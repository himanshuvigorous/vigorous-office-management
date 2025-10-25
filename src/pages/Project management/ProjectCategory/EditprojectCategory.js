
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { decrypt } from "../../../config/Encryption";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";
import { getprojectCategoryDetails, updateprojectCategoryFunc } from "./projectCategoryFeatures/_projectCategory_reducers";




function EditprojectCategory() {
  const { loading: projectCategory } = useSelector((state) => state.projectCategory);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectcategorydEnc } = useParams();
  const projectCategoryId = decrypt(projectcategorydEnc);
  const { projectCategoryDetailsData } = useSelector(
    (state) => state.projectCategory
  );
  useEffect(() => {
    let reqData = {
      _id: projectCategoryId,
    };
    dispatch(getprojectCategoryDetails(reqData));
  }, []);

  useEffect(() => {
    if (projectCategoryDetailsData) {

      setValue("projectCategoryName", projectCategoryDetailsData?.name);
      setValue("status", projectCategoryDetailsData?.status ? "true" : "false");
    }

  }, [projectCategoryDetailsData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: projectCategoryId,
      "companyId": projectCategoryDetailsData?.companyId,
      "directorId": projectCategoryDetailsData?.directorId,
      "branchId": projectCategoryDetailsData?.branchId,
      "name": data.projectCategoryName,
      status: data?.status === 'true' ? true : false,

    };

    dispatch(updateprojectCategoryFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };



  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Projects Category  <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("projectCategoryName", {
                  required: "Projects Category is required",
                })}
                className={`${inputClassName} ${errors.projectCategoryName ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Projects Category"
              />
              {errors.projectCategoryName && (
                <p className="text-red-500 text-sm">
                  {errors.projectCategoryName.message}
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
              disabled={projectCategory}
              className={`${projectCategory ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {projectCategory ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditprojectCategory;
