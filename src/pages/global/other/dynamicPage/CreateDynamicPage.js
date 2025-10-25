import { useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { inputClassName, inputLabelClassName } from "../../../../constents/global";
import { createDynamicPage } from "./DynamicPageFeatures/dynamic_page_reducers";

function CreateDynamicPage() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const finalPayload = {
      "name": data.name,
      "parentPageId": "",
      status: data.status,
    };
    dispatch(createDynamicPage(finalPayload)).then((data) => {
      !data.error && navigate("/admin/dynamic-page");
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            {/* Name Field */}
            <div>
              <label className={`${inputLabelClassName}`}>
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`${errors.name ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
                placeholder="Enter Page Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Slug <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("slug", { required: "Slug is required" })}
                className={`${errors.slug ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
                placeholder="Enter Slug"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug.message}</p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              <select
                {...register("status", { required: "Status is required" })}
                className={`bg-white ${errors.status ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
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

export default CreateDynamicPage;
