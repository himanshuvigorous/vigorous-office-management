import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { companyPageUpdate, getCompanyPageById } from "./CompanyPageFeatures/_companyPage_reducers";
import Loader from "../../../../global_layouts/Loader";
import ReactQuill from "react-quill";
import { Select } from "antd";
import { Option } from "antd/es/mentions";
// import { getCountryByIdFunc, updateCountryFunc } from "../../redux/_reducers/_country_reducers";


function EditCompanyPage() {
  const { loading: pageLoading } = useSelector((state) => state.page);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageIdEnc } = useParams();
  const pageId = decrypt(pageIdEnc)
  const [editorValue, setEditorValue] = useState(``);
  const { companyPageByIdData } = useSelector(state => state.page)
  useEffect(() => {
    let reqData = {
      _id: pageId,
    };
    dispatch(getCompanyPageById(reqData));
  }, []);

  useEffect(() => {
    if (companyPageByIdData && companyPageByIdData?.data) {

      setValue("title", companyPageByIdData?.data?.title);
      // setValue("content", companyPageByIdData?.data?.content);
      setEditorValue(companyPageByIdData?.data?.content);
      setValue("metatitle", companyPageByIdData?.data?.metaData.title);
      setValue("metadescription", companyPageByIdData?.data?.metaData.description);
      setValue("metakeywords", companyPageByIdData?.data?.metaData?.keywords?.join(", "));
      setValue("status", companyPageByIdData?.data?.status ? 'true':'false');
      setValue("type", companyPageByIdData?.data?.type);

    }
  }, [companyPageByIdData]);

  const onSubmit = (data) => {

    const finalPayload = {
      _id: pageId,
      "title": data?.title,
      // "content": data?.content,
      "content": editorValue,
      "metaData": {
        "title": data.metatitle,
        "description": data.metadescription,
        "keywords": data?.metakeywords
          ?.split(",") // Split the string by commas
          ?.map((keyword) => keyword.trim())
      },
      status: data?.status == "true" ? true : false,
      type: data?.type,
    };

    dispatch(companyPageUpdate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  }

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            {/* Title Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Title <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className={`${errors.title ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                placeholder="Enter Page Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            {/* Content Field */}
            {/* <div>
           <label className={`${inputLabelClassName}`}>Content <span className="text-red-600">*</span></label>
           <textarea
             {...register("content", { required: "Content is required" })}
             className={`${errors.content ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
             placeholder="Enter Page Content"
           />
           {errors.content && (
             <p className="text-red-500 text-sm">{errors.content.message}</p>
           )}
         </div> */}

          </div>

          <div className="mt-2 col-span-2">
            <label className={`${inputLabelClassName}`}>
              Content <span className="text-red-600">*</span>
            </label>
            <ReactQuill
              value={editorValue}
              onChange={handleEditorChange}
              placeholder="Write Your page view here"
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

          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            {/* Meta Title Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Meta Title</label>
              <input
                type="text"
                {...register("metatitle", { required: "Meta Title is required" })}
                className={`${errors.metatitle ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                placeholder="Enter Meta Title"
              />
              {errors.metatitle && (
                <p className="text-red-500 text-sm">{errors.metatitle.message}</p>
              )}
            </div>
            {/* Meta Description Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Meta Description</label>
              <textarea
                {...register("metadescription", { required: "Meta Description is required" })}
                className={`${errors.metadescription ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                placeholder="Enter Meta Description"
              />
              {errors.metadescription && (
                <p className="text-red-500 text-sm">{errors.metadescription.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {/* Meta Keywords Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Meta Keywords</label>
              <input
                type="text"
                {...register("metakeywords", { required: "Meta Keywords is required" })}
                className={`${errors.metakeywords ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                placeholder="Enter Meta Keywords (comma separated)"
              />
              {errors.metakeywords && (
                <p className="text-red-500 text-sm">{errors.metakeywords.message}</p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>
                Type <span className="text-red-600">*</span>
              </label>

              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.type ? '' : 'border-gray-300'}`}
                    placeholder="Select Type"
                     showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                  >
                    <Option value="">Select Type</Option>
                    <Option value="lendingPage">Lending Page</Option>
                    <Option value="page">page</Option>
                  </Select>
                )}
              />

              {errors.type && (
                <p className="text-red-500 text-sm">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
              {/* <select
                {...register("status", { required: "Status is required" })}
                className={`bg-white ${errors.status ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select> */}

               <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`mt-0 ${inputAntdSelectClassName} ${errors.status ? '' : 'border-gray-300'}`}
                    placeholder="Select Status"
                     showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    <Select.Option value="true">Active</Select.Option>
                    <Select.Option value="false">Inactive</Select.Option>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={pageLoading}
              className={`${pageLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {pageLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>

    </GlobalLayout>
  );
}

export default EditCompanyPage;
