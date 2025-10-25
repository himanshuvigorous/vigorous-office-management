import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../constents/global";
import { dynamicSidebarCreate } from "./DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { decrypt } from "../../config/Encryption";
import { slugData } from "./sidebarjson";
import { useState } from "react";
import { iconData } from "./dynamicSidebarIcon";
import Loader from "../../global_layouts/Loader";
import { Select } from "antd";

function CreateDynamicSidebar() {
  const { SidebarIdEnc } = useParams();
  const sidebarId = decrypt(SidebarIdEnc);
  const { loading: sideBarLoading } = useSelector((state) => ({

    loading: state.dynamicSidebar.loading || false,
  }));

  const {
    register,
    handleSubmit,
    control,
    setValue, // Use setValue from useForm hook here
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const finalPayload = {
      parentPageId: sidebarId || undefined,
      name: data?.title,
      icon: data?.iconClass,
      slug: data?.slug,
      status: true,
    };

    dispatch(dynamicSidebarCreate(finalPayload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
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
        <form
          autoComplete="off"
          className="mt-5 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {/* Title Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Title <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`${inputClassName} ${errors.title
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
                placeholder="Enter Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>


            <div>
             
              <Controller
                name="slug"
                control={control}
                rules={{ required: "Slug is required" }}
                render={({ field }) => (
                  <>
                    <label className={inputLabelClassName}>Slug</label>
                    <Select
                      {...field}
                      showSearch
                      onChange={(value) => field.onChange(value)}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      className={`${inputAntdSelectClassName} ${errors.slug ? "border-[1px]" : "border-gray-300"}`}
                    >
                      <Select.Option value="">Select Slug</Select.Option>
                      {slugData.map((item, index) => (
                        <Select.Option key={index} value={item.slug}>
                          {item.sidebarName}
                        </Select.Option>
                      ))}
                    </Select>
                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                  </>
                )}
              />
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug.message}</p>
              )}
            </div>


            {!sidebarId && <div className="relative w-full ">
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
                <div className="text-sm text-gray-500">
                  {isOpen ? "▲" : "▼"}
                </div>
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
                defaultValue={selectedIconClass}
                render={({ field }) => (
                  <input {...field} type="hidden" value={selectedIconClass} />
                )}
              />
            </div>}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={sideBarLoading}
              className={`${sideBarLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {sideBarLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default CreateDynamicSidebar;
