import { useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../config/Encryption";
import { useEffect } from "react";
import {
  getHolidayByIdFunc,
  updateHolidayFunc,
} from "../../redux/_reducers/_holiday_reducers";

function EditHoliday() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { holidayIdEnc } = useParams();
  const holidayId = decrypt(holidayIdEnc);
  const { HolidayByIdData } = useSelector((state) => state.holiday);

  useEffect(() => {
    let reqData = {
      id: holidayId,
    };
    dispatch(getHolidayByIdFunc(reqData));
  }, []);

  useEffect(() => {
    if (HolidayByIdData && HolidayByIdData?.data) {
      setValue("holidayDate", HolidayByIdData?.data?.holidayDate);
      setValue("holidayType", HolidayByIdData?.data?.holidayType);
      setValue("title", HolidayByIdData?.data?.title);
    }
  }, [HolidayByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      id: holidayId,
      holidayDate: data.holidayDate,
      holidayType: data?.holidayType,
      title: data?.title,
    };

    dispatch(updateHolidayFunc(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/holiday");
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <h2 className="text-2xl font-bold mb-4 col-span-2">
          Edit Holiday : {HolidayByIdData?.data?.title}
        </h2>
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            <div>
              <label className="block text-sm font-medium">Holiday Date</label>
              <input
                type="date"
                {...register("holidayDate", {
                  required: "Holiday Date is required",
                })}
                defaultValue={HolidayByIdData?.data?.holidayDate}
                className={`mt-1 block w-full border ${errors.holidayDate ? "border-[1px] " : "border-gray-300"
                  } p-2 rounded`}
                placeholder="Select Holiday Date"
              />
              {errors.holidayDate && (
                <p className="text-red-500 text-sm">
                  {errors.holidayDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Holiday Type</label>
              <select
                {...register("holidayType", {
                  required: "Holiday Type is required",
                })}
                className={`mt-1 block w-full border bg-white ${errors.holidayType ? "border-[1px] " : "border-gray-300"
                  } p-2 rounded`}
              >
                <option value="">Select Holiday Type</option>
                <option value="Full Day">Full Day</option>
                <option value="Half Day">Half Day</option>
              </select>
              {errors.holidayType && (
                <p className="text-red-500 text-sm">
                  {errors.holidayType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Holiday Title</label>
              <input
                type="text"
                {...register("title", {
                  required: "Holiday Title is required",
                })}
                className={`mt-1 block w-full border ${errors.title ? "border-[1px] " : "border-gray-300"
                  } p-2 rounded`}
                placeholder="Enter Holiday Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
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

export default EditHoliday;
