import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../config/Encryption";
import { useEffect, useState } from "react";
import { inputClassName, inputLabelClassName } from "../../constents/global";
import { dynamicPageUpdate, getsidebarById } from "./DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { slugData } from "./sidebarjson";
import { iconData } from "./dynamicSidebarIcon";



function EditDynamicSidebar() {
  const {
    register,
    handleSubmit,
    control,
    setValue, // Use setValue from useForm hook here
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { SidebarIdEnc } = useParams();
  const sidebarId = decrypt(SidebarIdEnc);
  const { sidebarDetailsData, loading } = useSelector((state) => state.dynamicSidebar);
  useEffect(() => {
    let reqData = {
      _id: sidebarId,
    };
    dispatch(getsidebarById(reqData));
  }, []);
  useEffect(() => {

    if (sidebarDetailsData && sidebarDetailsData?.data) {
      setValue("title", sidebarDetailsData?.data?.name);
      setValue("status", sidebarDetailsData?.data?.status);
      setValue("iconClass", sidebarDetailsData?.data?.icon);
      setValue("slug", sidebarDetailsData?.data?.slug);
      setSelectedIconClass(sidebarDetailsData?.data?.icon);
    }
  }, [sidebarDetailsData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: sidebarId,
      name: data?.title,
      icon: sidebarDetailsData?.data?.parentPageId ? null : data?.iconClass,
      slug: data?.slug,
      status: true,
      parentPageId:sidebarDetailsData?.data?.parentPageId,
    };

    dispatch(dynamicPageUpdate(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/dynamic-sidebar");
    });
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("Select an icon");
  const [selectedIconClass, setSelectedIconClass] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleIconSelect = (iconClass, label) => {
    setSelectedIcon(label);
    setSelectedIconClass(iconClass);
    setIsOpen(false);

    // Correctly set the value in the form using setValue from useForm hook
    setValue("iconClass", iconClass); // This updates the form state
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {/* Title Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Title <span className="text-red-600">*</span></label>
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

            {/* Slug Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Slug</label>
              <select
                {...register("slug")}
                className={` ${inputClassName} ${
                  errors.slug ? "border-[1px] " : "border-gray-300"
                } `}
              >
                <option value="">Select Slug</option>
                {slugData.map((item, index) => (
                  <option key={index} value={item?.slug}>
                    {item?.sidebarName}
                  </option>
                ))}
              </select>
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug.message}</p>
              )}
            </div>

    
            {/* <div>
              <label className={`${inputLabelClassName}`}>Status</label>
              <select
                {...register("status", {
                  required: "Status is required",
                })}
                className={` ${inputClassName} ${
                  errors.status ? "border-[1px] " : "border-gray-300"
                } `}
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Not Active</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div> */}
           {! sidebarDetailsData?.data?.parentPageId &&  <div className="relative w-full ">
            <label className={`${inputLabelClassName}`}>Icon <span className="text-red-600">*</span></label>
            <div
              className={`${inputClassName} flex justify-between items-center`}
              onClick={toggleDropdown}
            >
              <div className="flex items-center space-x-2">
                <span
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: selectedIcon }}
                />
              </div>
              <div className="text-sm text-gray-500">{isOpen ? "▲" : "▼"}</div>
            </div>

            {/* Dropdown options */}
            {isOpen && (
              <div className="flex flex-wrap absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {iconData.map((icon, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleIconSelect(icon.iconClass, icon.label);
                    }}
                    dangerouslySetInnerHTML={{ __html: icon.label }}
                  />
                ))}
              </div>
            )}

            {/* Hidden form control for selected icon */}
            <Controller
              name="iconClass"
              control={control}
              // defaultValue={selectedIconClass}
              render={({ field }) => (
                <input {...field} type="hidden" value={selectedIconClass} />
              )}
            />
          </div>}
          </div>

      
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditDynamicSidebar;
