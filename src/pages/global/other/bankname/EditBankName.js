import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import getUserIds from '../../../../constents/getUserIds';
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";

import { getbankNameById, updatebankNameFunc } from "./bankNameFeatures/_bankName_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";



function EditBankName() {
    const {loading:bankLoading } = useSelector(
      (state) => state.bankname
    );
  

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();

  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userCompanyId, userType } = getUserIds();
  const { banknameIdEnc } = useParams();
  const banknameId = decrypt(banknameIdEnc);
  const { bankNameByIdData } = useSelector((state) => state.bankname);
  const { companyList ,companyListLoading} = useSelector((state) => state.company);

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (userType === "admin") {
          await dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }));
        }
        const reqData = {
          _id: banknameId,
        };
        await dispatch(getbankNameById(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (bankNameByIdData && bankNameByIdData?.data) {
      setValue("companyId", bankNameByIdData?.data?.companyId);
      setValue("bankname", bankNameByIdData?.data?.name);
      setValue("status", bankNameByIdData?.data?.status);
    }
  }, [bankNameByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: banknameId,
      name: data.bankname,
      status: data?.status,
      companyId:data?.companyId,
    };
    dispatch(updatebankNameFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userType === "admin" &&
              <div className="">
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
                        </Select.Option>: companyList?.map((type) => (
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
                  required: "bankname Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.bankname
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter bankname Name"
              />
              {errors.bankname && (
                <p className="text-red-500 text-sm">
                  {errors.bankname.message}
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
                    placeholder="Select Status"
                    showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                  >
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>


          </div>
          <div className="flex justify-end ">
          <button
              type="submit"
              disabled={bankLoading}
              className={`${bankLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 mt-3 px-4 rounded mt-3`}
            >
            {bankLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditBankName;
