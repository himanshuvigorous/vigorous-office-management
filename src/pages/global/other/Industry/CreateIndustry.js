import { useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createIndustryFunc } from "./IndustryFeature/_industry_reducers";
import { inputClassName, inputLabelClassName } from "../../../../constents/global";
import Loader from "../../../../global_layouts/Loader";



function CreateIndustry() {
  const {  loading:industryLoading } = useSelector(state => state.industry)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = (data) => {
    const finalPayload = {
      "name":data?.industryName,
      "status":data?.status
  
    }
    dispatch(createIndustryFunc(finalPayload)).then((data) => {
     !data.error &&  navigate(-1)
    });
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("industryName", {
                  required: "Industry Name is required",
                })}
                className={`${inputClassName}${errors.industryName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Industry Name"
              />
              {errors.industryName && (
                <p className="text-red-500 text-sm">
                  {errors.industryName.message}
                </p>
              )}
            </div>
            <div>
        {/* <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
        <select
          {...register("status", { required: "Status is required" })}
          className={`bg-white ${errors.status ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
        >
          <option value="">Select Status</option>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )} */}
      </div>
          </div>
          <div className="flex justify-end ">
          <button
              type="submit"
              disabled={industryLoading}
              className={`${industryLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {industryLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}
export default CreateIndustry