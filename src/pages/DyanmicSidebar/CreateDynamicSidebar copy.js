import { useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { inputClassName } from "../../constents/global";
import { dynamicSidebarCreate } from "./DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { decrypt } from "../../config/Encryption";

function CreateDynamicSidebar() {
  const {SidebarIdEnc} = useParams()
const sidebarId = decrypt(SidebarIdEnc)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (data) => {
  if(sidebarId){
    const finalPayload = {
      'parentPageId':sidebarId,
      "name": data?.title,
      "icon": data?.icon,
      "status": data?.status,
    };
    dispatch(dynamicSidebarCreate(finalPayload)).then((data) => {
      !data.error && navigate("/admin/dynamic-sidebar");
    });
  } else{
    const finalPayload = {
      "name": data?.title,
      "icon": data?.icon,
      "status": data?.status,
    };
    dispatch(dynamicSidebarCreate(finalPayload)).then((data) => {
      !data.error && navigate("/admin/dynamic-sidebar");
    });
  }

   
  };

 
  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div>
              <label className="block text-sm font-normal">Title</label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`${inputClassName} ${
                  errors.title ? "border-[1px] " : "border-gray-300"
                } `}
                placeholder="Enter Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-normal">Icon</label>
              <input
                type="text"
                {...register("icon", {
                  required: "Icon is required",
                })}
                className={`${inputClassName} ${
                  errors.icon ? "border-[1px] " : "border-gray-300"
                } `}
                placeholder="Enter Icon"
              />
              {errors.icon && (
                <p className="text-red-500 text-sm">{errors.icon.message}</p>
              )}
            </div>
           
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                {...register("status", {
                  required: "Status is required",
                })}
                className={` ${inputClassName} ${errors.status ? "border-[1px] " : "border-gray-300"
                  } `}
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Not Active</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">
                  {errors.status.message}
                </p>
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

export default CreateDynamicSidebar;
