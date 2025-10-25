import { useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import { inputClassName, inputLabelClassName } from "../../../../constents/global";
import { updateDynamicPage, getDynamicPageById } from "./DynamicPageFeatures/dynamic_page_reducers";

function EditDynamicPage() {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageIdEnc } = useParams();
  const pageId = decrypt(pageIdEnc)

  const { dynamicPageByIdData } = useSelector(state => state.dynamicPage);

  useEffect(() => {
    let reqData = {
      _id: pageId,
    };

    dispatch(getDynamicPageById(reqData));
  }, []);

  useEffect(() => {
    if (dynamicPageByIdData && dynamicPageByIdData?.data) {
      setValue("name", dynamicPageByIdData?.data?.name);
      setValue("slug", dynamicPageByIdData?.data?.slug);
      setValue("status", dynamicPageByIdData?.data?.status);
    }
  }, [dynamicPageByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: pageId,
      "name": data?.name,
      "slug": data?.slug,
      "status": data?.status
    };

    dispatch(updateDynamicPage(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/dynamic-page");
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">

            {/* Name Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`${errors.name ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                placeholder="Enter Page Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>Slug <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("slug", { required: "Name is required" })}
                className={`${errors.slug ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                placeholder="Enter Page Name"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug.message}</p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
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
              )}
            </div>
          </div>
          <div className="flex justify-end ">
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
}

export default EditDynamicPage;
