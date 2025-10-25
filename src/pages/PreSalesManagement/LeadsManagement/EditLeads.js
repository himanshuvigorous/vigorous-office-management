
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { domainName, inputAntdSelectClassName, inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName } from "../../../constents/global";
import { useEffect } from "react";
import { Select } from "antd";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { getLeadCategoryList } from "../LeadsManagementCategory/LeadCategoryFeatures/_LeadCategory_reducers";
import { createLeadmanagementFeatureFunc, getLeadmanagementFeatureById, updateLeadmanagementFeatureFunc } from "./LeadmanagementFeature/_LeadmanagementFeature_reducers";
import moment from "moment";
import { decrypt } from "../../../config/Encryption";
import dayjs from "dayjs";


const { Option } = Select
function EditLeads() {
  const { loading: LeadmanagementFeatureLoading, LeadmanagementFeatureByIdData } = useSelector(state => state.LeadmanagementFeature)
  const { LeadCategoryListData } = useSelector((state) => state.leadCategory);
  const { register, handleSubmit, control, setValue, formState: { errors }, } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { loading: employeeLoading, employeList } = useSelector((state) => state.employe);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: '',
  });
  const CategoryId = useWatch({
    control,
    name: "CategoryId",
    defaultValue: '',
  });

  const { leadIdEnc } = useParams();
  const leadId = decrypt(leadIdEnc);

  useEffect(() => {
    let reqData = {
      _id: leadId,
    };
    dispatch(getLeadmanagementFeatureById(reqData));
  }, []);
  useEffect(() => {
    if (LeadmanagementFeatureByIdData) {
      setValue("leadName", LeadmanagementFeatureByIdData?.name);
      setValue("email", LeadmanagementFeatureByIdData?.email);
      setValue("location", LeadmanagementFeatureByIdData?.location);
      setValue("remarks", LeadmanagementFeatureByIdData?.remark);
      setValue("interstedin", LeadmanagementFeatureByIdData?.intrested);
      setValue("source", LeadmanagementFeatureByIdData?.source);
      setValue("mobile", LeadmanagementFeatureByIdData?.mobile);
      // setValue("followUpDate", dayjs(LeadmanagementFeatureByIdData.followUpDate));
            setValue("PDmobileCode", LeadmanagementFeatureByIdData?.mobile?.code);
      setValue("PDmobileno",  LeadmanagementFeatureByIdData?.mobile?.number);
      dispatch(employeSearch({
        text: "",
        status: true,
        sort: true,
        isTL: "",
        isHR: "",
        isManager: '',
        isPagination: false,
        departmentId: '',
        designationId: "",
        branchId: LeadmanagementFeatureByIdData?.branchId,
        isBranch: true,
              isDirector :true

      })).then((data) => {
        if (!data?.error) {
          setValue("employee", LeadmanagementFeatureByIdData?.assignedToId)
        }
      })
      dispatch(getLeadCategoryList({
        text: '',
        sort: true,
        isPagination: false,
        status: "",
        companyId: LeadmanagementFeatureByIdData?.companyId,
        branchId: LeadmanagementFeatureByIdData?.branchId,

      })).then((data)=>{
        if(!data?.error){
           setValue("CategoryId", LeadmanagementFeatureByIdData?.leadCategoryId)
           setValue("subcategory", LeadmanagementFeatureByIdData?.leadSubCategoryId)
        }
      })
    }
  }, [LeadmanagementFeatureByIdData]);
  const onSubmit = (data) => {
    const finalPayload = {
      _id: leadId,
      companyId: LeadmanagementFeatureByIdData?.companyId,
      directorId: LeadmanagementFeatureByIdData?.directorId,
      branchId: LeadmanagementFeatureByIdData?.branchId,
      mobile: {
        code: data?.PDmobileCode,
        number: + data?.PDmobileno,
      },
      "assignedToId": data?.employee,
      "leadCategoryId": data?.CategoryId,
      "leadSubCategoryId": data?.subcategory,
      "name": data?.leadName,
      "email": data?.email,
      "location": data?.location,
      "remark": data?.remarks,
      "intrested": data?.interstedin,
      "source": data?.source,
      "leadValue": 0,
      // "followUpDate": data?.followUpDate,
    };

    dispatch(updateLeadmanagementFeatureFunc(finalPayload)).then((data) => {
      if (!data?.error) {
        navigate(-1)
      }
    });
  }




  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Lead Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("leadName", {
                  required: "Lead Name is required",
                })}
                className={` ${inputClassName} ${errors.leadName ? " " : ""
                  } `}
                placeholder="Enter Lead Name"

              />
              {errors.leadName && (
                <p className="text-red-500 text-sm">
                  {errors.leadName.message}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-1">
              <div className="w-[150px]">
                <label className={`${inputLabelClassName}`}>
                  Code 
                </label>
                <Controller
                  control={control}
                  name="PDmobileCode"
                
                  render={({ field }) => (
                    <CustomMobileCodePicker
                      field={field}
                      errors={errors}

                    />
                  )}
                />
                {errors[`PDmobileCode`] && (
                  <p className={`${inputerrorClassNameAutoComplete}`}>
                    {errors[`PDmobileCode`].message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Mobile No 
                </label>
                <input
                  type="number"
                  {...register(`PDmobileno`, {
                  
                    minLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Must be exactly 10 digits",
                    },
                  })}
                  className={` ${inputClassName} ${errors[`PDmobileno`]
                    ? " "
                    : ""
                    }`}
                  placeholder="Enter Mobile No"
                  maxLength={10}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                />
                {errors[`PDmobileno`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`PDmobileno`].message}
                  </p>
                )}
              </div>
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Email 
              </label>
              <input
                type="text"
                {...register("email", {
                 
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={` ${inputClassName} ${errors.email
                  ? " "
                  : ""
                  }`}
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Category <span className="text-red-600">*</span>
              </label>

              <Controller
                name="CategoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.CategoryId ? '' : ''}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Category"
                  >
                    <Option value="">Select Category</Option>
                    {LeadCategoryListData && LeadCategoryListData.length > 0 &&
                      LeadCategoryListData.map((data, index) => {
                        return (
                          <Option key={index} value={data?._id}>
                            {data?.name}
                          </Option>
                        );
                      })
                    }


                  </Select>
                )}
              />

              {errors.CategoryId && (
                <p className="text-red-500 text-sm">
                  {errors.CategoryId.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Sub Category
              </label>

              <Controller
                name="subcategory"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.subcategory ? '' : ''}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Sub Category"
                  >
                    <Option value="">Select Sub Category</Option>
                    {(LeadCategoryListData?.find(data => data?._id == CategoryId)?.leadSubCategoryData || []) && (LeadCategoryListData?.find(data => data?._id == CategoryId)?.leadSubCategoryData || []).length > 0 &&
                      (LeadCategoryListData?.find(data => data?._id == CategoryId)?.leadSubCategoryData || []).map((data, index) => {
                        return (
                          <Option key={index} value={data?._id}>
                            {data?.name}
                          </Option>
                        );
                      })
                    }


                  </Select>
                )}
              />

              {errors.subcategory && (
                <p className="text-red-500 text-sm">
                  {errors.subcategory.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>Location <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("location", {
                  required: "location  is required",
                })}
                className={` ${inputClassName} ${errors.location ? " " : ""
                  } `}
                placeholder="Enter Location"

              />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>Intersted In <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("interstedin", {
                  required: "Intersted In is required",
                })}
                className={` ${inputClassName} ${errors.interstedin ? " " : ""
                  } `}
                placeholder="Enter Intersted In"

              />
              {errors.interstedin && (
                <p className="text-red-500 text-sm">
                  {errors.interstedin.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Source <span className="text-red-600">*</span>
              </label>
              <Controller
                name="source"
                control={control}
                rules={{ required: "Source is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.source ? '' : ''}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select source"
                  >
                    <Option value="">Select Source</Option>
                    <Option value="Call">Call</Option>
                    <Option value="Organic">Organic</Option>
                    <Option value="Social Media">Social Media</Option>
                    <Option value="Compaign">Compaign</Option>
                  </Select>
                )}
              />
              {errors.source && (
                <p className="text-red-500 text-sm">
                  {errors.source.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Select employee <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="employee"
                rules={{ required: "employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    className={`${inputAntdSelectClassName} mt-2`}
                  >
                    <Select.Option value="" selected>
                      {" "}
                      Select Employee
                    </Select.Option>
                    {employeeLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                      employeList?.map((element, index) => {
                        return (<Select.Option key={index} value={element?._id}>
                          {element?.fullName}
                        </Select.Option>)
                      })

                    }


                  </Select>
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
                </p>
              )}
            </div>
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Follow Up date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="followUpDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.followUpDate && (
                <p className="text-red-500 text-sm">
                  {errors.followUpDate.message}
                </p>
              )}
            </div> */}

            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Remark
              </label>
              <textarea
                rows={4}
                {...register("remarks")}
                className={`${inputClassName} ${errors.remarks ? "border-red-500" : ""}`}
                placeholder="Enter Remarks"
              />
              {errors.remarks && (
                <p className="text-red-500 text-sm">
                  {errors.remarks.message}
                </p>
              )}
            </div>



          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={LeadmanagementFeatureLoading}
              className={`${LeadmanagementFeatureLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 mt-3 px-4 rounded`}
            >
              {LeadmanagementFeatureLoading ? <Loader /> : 'Submit'}
            </button>
          </div>

        </form>


      </div>
    </GlobalLayout>
  )
}

export default EditLeads
