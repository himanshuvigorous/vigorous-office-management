import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import { getIndustryByIdFunc, updateIndustryFunc } from "./IndustryFeature/_industry_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";



function EditIndustry() {
  const {  loading:industryLoading } = useSelector(state => state.industry)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { industryIdEnc } = useParams();
  const industryId = decrypt(industryIdEnc);

  const { industryByIdData } = useSelector(state => state.industry)
  useEffect(() => {
    let reqData = {
      _id: industryId,
    };
    dispatch(getIndustryByIdFunc(reqData));
  }, []);

  useEffect(() => {
    if (industryByIdData && industryByIdData?.data) {

      setValue("industryName", industryByIdData?.data?.name);
      setValue("status", industryByIdData?.data?.status);

    }

  }, [industryByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: industryId,
      "name": data?.industryName,
      "status": data?.status,
    };
    dispatch(updateIndustryFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-0 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Industry Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("industryName", {
                  required: "Industry Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.industryName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Industry Name"
              />
              {errors.industryName && (
                <p className="text-red-500 text-sm">
                  {errors.industryName.message}
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
                    placeholder="Select Status"
                  >
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
          </div>
          <div className="flex justify-end ">
          <button
              type="submit"
              disabled={industryLoading}
              className={`${industryLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 mt-3 rounded`}
            >
            {industryLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default EditIndustry;