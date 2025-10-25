import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { formButtonClassName, inputAntdSelectClassName, inputClassName, inputLabelClassName, } from "../../../../constents/global";
import getUserIds from '../../../../constents/getUserIds';
import { useEffect } from "react";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { createbankNameFunc } from "./bankNameFeatures/_bankName_reducers";
import Loader from "../../../../global_layouts/Loader";
import { Select } from "antd";
import ListLoader from "../../../../global_layouts/ListLoader";

function CreateBankName() {
  const { loading: bankLoading } = useSelector(
    (state) => state.bankname
  );

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userCompanyId, userType } = getUserIds();
  const { companyList, companyListLoading } = useSelector((state) => state.company);

  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  useEffect(() => {
    if (userType === "admin") {
      dispatch(companySearch({ isPagination: false, text: "", sort: true, status: true }));
    }
  }, []);

  const onSubmit = (data) => {
    const finalPayload = {
      "name": data.bankname,
      companyId: companyId,
    };

    dispatch(createbankNameFunc(finalPayload)).then((data) => {
      !data.error && navigate(-1)
    });
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company<span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("companyId", {
                  required: "Company is required",
                })}
                className={` ${inputClassName} ${errors.companyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Company
                </option>
                {companyList?.map((type) => (
                  <option value={type?._id}>
                    {type?.fullName}({type?.userName})
                  </option>
                ))}
              </select> */}
              <Controller
                control={control}
                name="companyId"
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Company</Select.Option>
                    {companyListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : companyList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.companyId && (
                <p className="text-red-500 text-sm">
                  {errors.companyId.message}
                </p>
              )}
            </div>}

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("bankname", {
                  required: "bank name Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.bankname
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter bank name "
              />
              {errors.bankname && (
                <p className="text-red-500 text-sm">
                  {errors.bankname.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={bankLoading}
              className={`${bankLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {bankLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateBankName
