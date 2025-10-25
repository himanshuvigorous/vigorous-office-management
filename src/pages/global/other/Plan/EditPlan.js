import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import moment from "moment";
import { getPlanByIdFunc, updatePlanFunc } from "./PlanFeatures/_plan_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { ColorPicker, Select } from "antd";

function EditPlan() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planIdEnc } = useParams();
  const planId = decrypt(planIdEnc);
  const { planByIdData } = useSelector((state) => state.plan);
  const rgbaToHex = (r, g, b, a) => {
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };


  const handleColorChange = (color) => {

    const { r, g, b, a } = color.metaColor;

    const hexColor = rgbaToHex(r, g, b, a);

    setValue('colorCode', hexColor);
  };

  const handleTextInputChange = (e) => {

  };
  useEffect(() => {
    let reqData = {
      _id: planId,
    };
    dispatch(getPlanByIdFunc(reqData));
  }, []);
  useEffect(() => {
    if (planByIdData && planByIdData?.data) {
      setValue("title", planByIdData?.data?.title);
      setValue("description", planByIdData?.data?.description);
      setValue("cutPrice", planByIdData?.data?.cutPrice);
      setValue("colorCode", planByIdData?.data?.colorCode);
      setValue("price", planByIdData?.data?.price);
      setValue("duration", planByIdData?.data?.days);
      setValue("status", planByIdData?.data?.status);
      setValue(
        "expireIn",
        moment(planByIdData.data.discountExpireIn)?.format("YYYY-MM-DD")
      );
      setValue("features", planByIdData.data.features);
    }
  }, [planByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: planId,
      status: data?.status,
      title: data.title,
      description: data.description,
      price: data.price,
      cutPrice: data.cutPrice,
      colorCode: data.colorCode,
      days: + data.duration,
      // discountExpireIn: data.expireIn,
      "features": data?.features,
    };

    dispatch(updatePlanFunc(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/plan");
    });
  };
  const colorCodeWatch = useWatch({
    control,
    name: "colorCode",
    defaultValue: "",
  });
  const baseAmount = useWatch({
    control,
    name: "price",
    defaultValue: "",
  });
  const discountPercentage = useWatch({
    control,
    name: "cutPrice",
    defaultValue: "",
  });
  // useEffect(() => {
  //   if (baseAmount && discountPercentage) {
  //     const discountValue = (baseAmount * discountPercentage) / 100;
  //     const calculatedFinalPrice = baseAmount - discountValue;
  //     setValue("finalPriceDiscounted", calculatedFinalPrice);
  //   } else {
  //     setValue("finalPriceDiscounted", 0);
  //   }
  // }, [baseAmount, discountPercentage]);
  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-0 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div>
              <label className={`${inputLabelClassName}`}>Title <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`${inputClassName} ${errors.title ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>Description <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("description", {
                  required: "Description is required",
                })}
                className={`${inputClassName} ${errors.description ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>Price (₹) <span className="text-red-600">*</span></label>
              <input
                type="number"
                {...register("price", {
                  required: "Price is required",
                })}
                className={`${inputClassName} ${errors.price ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* <div>
              <label className={`${inputLabelClassName}`}>Discount %</label>
              <input
                type="number"
                {...register("cutPrice", {
                  required: "Discounted Price is required",
                })}
                className={`${inputClassName} ${errors.cutPrice ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Discounted Price"
              />
              {errors.cutPrice && (
                <p className="text-red-500 text-sm">
                  {errors.cutPrice.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>Discounted  %</label>
              <input
              disabled
              readOnly
                type="number"
                {...register("finalPriceDiscounted", {
                  required: "Discounted Price is required",
                })}
                className={`${inputClassName} ${
                  errors.finalPriceDiscounted ? "border-[1px] " : "border-gray-300"
                } `}
                placeholder="Enter Discounted Price"
              />
              {errors.finalPriceDiscounted && (
                <p className="text-red-500 text-sm">
                  {errors.finalPriceDiscounted.message}
                </p>
              )}
            </div> */}

            <div>
              <label className={`${inputLabelClassName}`}>Color Code <span className="text-red-600">*</span></label>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={colorCodeWatch}
                  {...register("colorCode", {
                    required: "Color Code is required",
                    pattern: {
                      value: /^#[0-9A-Fa-f]{6}$/,
                      message: "Enter a valid Hex color code (e.g., #FF5733)",
                    },
                  })}
                  onChange={handleTextInputChange}
                  className={`${errors.colorCode ? "border-[1px] " : "border-gray-300"} w-full py-2 pl-3 pr-16 rounded`}
                  placeholder="#FF5733"
                  maxLength={7}
                />
                <ColorPicker
                  value={colorCodeWatch}
                  onChange={handleColorChange}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 md:w-75 w-1/2 h-10 cursor-pointer"
                />
              </div>
              {errors.colorCode && (
                <p className="text-red-500 text-sm">
                  {errors.colorCode.message}
                </p>
              )}
            </div>
            {/* <div>
              <label className={`${inputLabelClassName}`}>Logo</label>
              {planByIdData?.data?.logo && (
                <div className="mb-2">
                  <img
                    alt=""
                    src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${planByIdData?.data?.logo}`}
                    className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("logo", {
                  required: "Logo file is required",
                })}
                className={`${inputClassName} ${
                  errors.logo ? "border-[1px] " : "border-gray-300"
                }`}
              />
              {errors.logo && (
                <p className="text-red-500 text-sm">{errors.logo.message}</p>
              )}
            </div> */}

            <div>
              <label className={`${inputLabelClassName}`}>
                Duration (Days) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("duration", {
                  required: "Duration is required",
                })}
                className={`${inputClassName} ${errors.duration ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Duration"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Expire In  <span className="text-red-600">*</span>
              </label>
              <Controller
                name="expireIn"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div> */}
            {/* <div>
              <label className={`${inputLabelClassName}`}>Expire In</label>
              <input
                type="date"
                {...register("expireIn", {
                  required: "Expire In is required",
                })}
                className={`${inputClassName} ${
                  errors.expireIn ? "border-[1px] " : "border-gray-300"
                }`}
              />
              {errors.expireIn && (
                <p className="text-red-500 text-sm">
                  {errors.expireIn.message}
                </p>
              )}
            </div> */}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Status</label>
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Features<span className="text-red-600">*</span>
              </label>

              <Controller
                name="features"
                control={control}
                defaultValue={[]}
                rules={{
                  required: "At least one feature is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="tags"
                    placeholder="Please select"

                    style={{
                      width: '100%',
                    }}
                    className={`${inputClassName}`}
                  />
                )}
              />

              {errors.features && (
                <p className="text-red-500 text-sm">
                  {errors.features.message}
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

export default EditPlan;
