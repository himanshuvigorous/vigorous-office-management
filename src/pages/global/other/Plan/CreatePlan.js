import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { inputClassName, inputDisabledClassName, inputLabelClassName ,inputAntdSelectClassName } from "../../../../constents/global";
import { createPlanFunc } from "./PlanFeatures/_plan_reducers";
import { useEffect } from "react";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import { ColorPicker, Select ,Popover } from "antd";
import { MdInfoOutline } from "react-icons/md";
import BillingCycleTable from "./BillingCycleTable";
import Swal from "sweetalert2";



     

    
function CreatePlan() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const rgbaToHex = (r, g, b, a) => {
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  function calculatePlanDays(interval, intervalCount, billingCycle) {
    const averageDays = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };
  
    const daysPerInterval = averageDays[interval] || 30;
    return intervalCount * billingCycle * daysPerInterval;
  }
  
  const handleColorChange = (color) => {

    const { r, g, b, a } = color.metaColor;

    const hexColor = rgbaToHex(r, g, b, a);

    setValue('colorCode', hexColor);
  };

  const handleTextInputChange = (e) => {

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
  const billingCycle = useWatch({
    control,
    name: "billingCycle",
    defaultValue: "",
  });
  const intervalCount = 1
  const intervalCycle = useWatch({
    control,
    name: "intervalCycle",
    defaultValue: "",
  });
  

  const onSubmit = (data) => {
    const { billingCycle,  intervalCycle, price } = data;

  const message = getConfirmationMessage({
    billingCycle,
    intervalCount,
    intervalCycle,
    amount: price,
    days:intervalCycle && intervalCount && billingCycle
    ? +calculatePlanDays(intervalCycle, intervalCount, billingCycle)
    : 0,
  });

  Swal.fire({
    title: 'Please Confirm',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    customClass: {
      cancelButton: 'bg-rose-500',
      confirmButton:"bg-header"
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const finalPayload = {
        title: data.title,
        description: data.description,
        price: data.price,
        cutPrice: data.cutPrice,
        colorCode: data.colorCode,
        days:
          intervalCycle && intervalCount && billingCycle
            ? +calculatePlanDays(intervalCycle, intervalCount, billingCycle)
            : '',
        discountExpireIn: data.expireIn,
        features: data?.features,
        interval: data?.intervalCycle,
        intervalCount: intervalCount,
        billingCycle: data?.billingCycle,
      };

      dispatch(createPlanFunc(finalPayload)).then((res) => {
        if (!res.error) {
          navigate('/admin/plan');
        }
      });
    }
  });
  };
  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
        <BillingCycleTable />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div>
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
                </label>
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
              <label className={`${inputLabelClassName}`}>
                Description <span className="text-red-600">*</span>
                </label>
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
              <label className={`${inputLabelClassName}`}>
                Price (₹) <span className="text-red-600">*</span>
                </label>
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
            <div>
              <label className={`${inputLabelClassName}`}>
                Color Code <span className="text-red-600">*</span>
              </label>
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
            <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Interval <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      name="intervalCycle"
                      control={control} 
                      rules={{
                        required: "Interval is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.intervalCycle ? "border-[1px] " : "border-gray-300"}`}
   
                          placeholder="Select Interval"
                          showSearch
                        >
                          <Select.Option value="">Select Interval</Select.Option>
                          <Select.Option value="weekly">Weekly</Select.Option>
                          <Select.Option value="monthly">Monthly</Select.Option>
                          <Select.Option value="yearly">Yearly</Select.Option>
                        </Select>
                      )}
                    />

                    {errors.intervalCycle && (
                      <p className="text-red-500 text-sm">
                        {errors.intervalCycle.message}
                      </p>
                    )}
                  </div>
                  {/* <div>
              <label className={`${inputLabelClassName} flex gap-2 items-center `}>
                Interval Count <span className="text-red-600">*</span>
              </label>
              <input 
                type="number"
                {...register("intervalCount", {
                  required: "Interval Count is required",
                })}
                className={`${inputClassName} ${errors.intervalCount ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Interval Count"
              />
              {errors.intervalCount && (
                <p className="text-red-500 text-sm">
                  {errors.intervalCount.message}
                </p>
              )}
            </div> */}
            <div>
              <label className={`${inputLabelClassName} flex gap-2 items-center `}>
              Billing Cycle<span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("billingCycle", {
                  required: "Billing Cycle is required",
                })}
                className={`${inputClassName} ${errors.billingCycle ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Billing Cycle"
              />
              {errors.billingCycle && (
                <p className="text-red-500 text-sm">
                  {errors.billingCycle.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName} flex gap-2 items-center `}>
                Duration (Days)   <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                disabled
                value={(intervalCycle && intervalCount &&  billingCycle) ? calculatePlanDays(intervalCycle , intervalCount , billingCycle) : ""}
                className={`${inputDisabledClassName} ${errors.duration ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Duration"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>
         
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Features <span className="text-red-600">*</span>
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
                    placeholder="Please write and press enter"

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

export default CreatePlan;


const getConfirmationMessage = ({
  billingCycle,
  intervalCount,
  intervalCycle,
  amount,
  days
}) => {
  const unitMap = {
    Daily: 'day',
    Weekly: 'week',
    'Bi-Weekly': '2 weeks',
    Monthly: 'month',
    Quarterly: '3 months',
    'Half-Yearly': '6 months',
    Yearly: 'year',
    'Bi-Yearly': '2 years',
  };

  const unit = unitMap[billingCycle] || 'unit';
  const totalAmount = amount * billingCycle;
  const totalDuration = days

  return `⚠️ You are about to create a ${ intervalCycle } Plan that bills ₹${amount} every ${intervalCount} ${unit} for ${billingCycle} cycles (total: ₹${totalAmount} over ${totalDuration}). Confirm before creating`;
};
