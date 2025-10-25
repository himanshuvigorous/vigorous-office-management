
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { decrypt } from "../../../../config/Encryption";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { getExpenseTypeDetails, updateExpenseTypeFunc } from "./expenseTypeFeature/_expenseType_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";



function EditExpenseHead() {
  const { loading: expenceHead } = useSelector((state) => state.expenceHead);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expenceIdEnc } = useParams();
  const expenseHeadeId = decrypt(expenceIdEnc);
  const { expenseTypeDetailsData } = useSelector(
    (state) => state.expenceHead
  );
  useEffect(() => {
    let reqData = {
      _id: expenseHeadeId,
    };
    dispatch(getExpenseTypeDetails(reqData));
  }, []);

  useEffect(() => {
    if (expenseTypeDetailsData) {

      setValue("expenseHeadName", expenseTypeDetailsData?.name);
      setValue("status", expenseTypeDetailsData?.status ? "true" : "false");
    }

  }, [expenseTypeDetailsData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: expenseHeadeId,
      "companyId": expenseTypeDetailsData?.companyId,
      "directorId": expenseTypeDetailsData?.directorId,
      "branchId": expenseTypeDetailsData?.branchId,
      "name": data.expenseHeadName,
      status: data?.status === 'true' ? true : false,

    };

    dispatch(updateExpenseTypeFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };



  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Expense Head  <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("expenseHeadName", {
                  required: "Expense Head is required",
                })}
                className={`${inputClassName} ${errors.expenseHeadName ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Expense Head"
              />
              {errors.expenseHeadName && (
                <p className="text-red-500 text-sm">
                  {errors.expenseHeadName.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Status"
                  >
                    <Select.Option value="true">Active</Select.Option>
                    <Select.Option value="false">In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={expenceHead}
              className={`${expenceHead ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {expenceHead ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditExpenseHead;
