import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
} from "../../../../constents/global";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import ReactQuill from "react-quill";
import { getcommonEmailDetails, updatecommonEmail } from "./commonEmailFeatures/_common_email_reducers";
import { Select } from "antd";
import getUserIds from "../../../../constents/getUserIds";
import Loader from "../../../../global_layouts/Loader";


const EditCommonEmail = () => {
  const { loading: commonEmailTemplate } = useSelector((state) => state.emailTemplate);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    userCompanyId,
    userType
  } = getUserIds();

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const { emailTemplateIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const emailTemplateId = decrypt(emailTemplateIdEnc);
  const { commonEmailDetails } = useSelector((state) => state.emailTemplate);

  const [editorValue, setEditorValue] = useState(``);
  // useEffect(() => {
  //   dispatch(employeSearch());
  // }, []);
  useEffect(() => {
    let reqData = {
      _id: emailTemplateId,
    };
    dispatch(getcommonEmailDetails(reqData));
  }, []);

  useEffect(() => {
    if (commonEmailDetails) {

      setValue("templateName", commonEmailDetails?.title);
      setValue("status", commonEmailDetails?.status);
      setEditorValue(commonEmailDetails?.content);
    }
  }, [commonEmailDetails]);

  const onSubmit = (data) => {

    const finalPayload = {
      _id: emailTemplateId,
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ?  commonEmailDetails?.branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      title: data?.templateName,
      status: data?.status,
      content: editorValue
    };

    dispatch(updatecommonEmail(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">

            <div className="">
              <label className={`${inputLabelClassName}`}>Template Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("templateName", {
                  required: "Template Name is required",
                })}
                className={`${inputClassName} ${errors.templateName ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Template Name"
              />
              {errors.templateName && (
                <p className="text-red-500 text-sm">{errors.templateName.message}</p>
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
                    <Select.Option value="">Select Status</Select.Option>

                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

          </div>

          <div className="mt-4 col-span-2">
            <label className={`${inputLabelClassName}`}>Content <span className="text-red-600">*</span></label>
            <ReactQuill
              value={editorValue}
              onChange={handleEditorChange}
              placeholder="Write the email body here"
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'align': [] }],
                  ['link', 'image', 'video'],
                  ['blockquote', 'code-block'],
                  ['clean']
                ],
              }}
              formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'clean']}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={commonEmailTemplate}
              className={`${commonEmailTemplate ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {commonEmailTemplate ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditCommonEmail;
