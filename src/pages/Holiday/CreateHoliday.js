import { useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createHolidayFunc } from "../../redux/_reducers/_holiday_reducers";

function CreateHoliday() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const finalPayload = {
      holidayDate: data.holidayDate,
      holidayType: data?.holidayType,
      title: data?.title,
    };

    dispatch(createHolidayFunc(finalPayload)).then((data) => {
      navigate("/admin/holiday");
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <h2 className="text-2xl font-bold mb-4 col-span-2">Create Holiday</h2>
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            <div>
              <label className="block text-sm font-medium">Holiday Date</label>
              <input
                type="date"
                {...register("holidayDate", {
                  required: "Holiday Date is required",
                })}
                className={`mt-1 block w-full border ${
                  errors.holidayDate ? "border-[1px] " : "border-gray-300"
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
                className={`mt-1 block w-full border bg-white ${
                  errors.holidayType ? "border-[1px] " : "border-gray-300"
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
                className={`mt-1 block w-full border ${
                  errors.title ? "border-[1px] " : "border-gray-300"
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

export default CreateHoliday;
