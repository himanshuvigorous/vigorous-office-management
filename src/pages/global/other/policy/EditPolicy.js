import { useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import {
  domainName,
  inputClassName,
  inputLabelClassName,
} from "../../../../constents/global";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import ReactQuill from "react-quill";
import { getPolicyDetails, updatecommonEmail } from "./policyFeatures/policy_reducers";
import { fileUploadFunc } from "../fileManagement/FileManagementFeatures/_file_management_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";


const EditPolicy = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { policyIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const policyId = decrypt(policyIdEnc);
  const { policyDetails } = useSelector((state) => state.policy);

  const [editorValue, setEditorValue] = useState(``);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    attachments: [],
  }); useEffect(() => {
    dispatch(employeSearch());
  }, []);
  useEffect(() => {
    let reqData = {
      _id: policyId,
    };
    dispatch(getPolicyDetails(reqData));
  }, []);

  useEffect(() => {
    if (policyDetails) {
    
      setValue("title", policyDetails?.title);
      setEditorValue(policyDetails?.content);
    }
  }, [policyDetails]);

  const onSubmit = (data) => {

    const finalPayload = {
      _id: policyId,
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      title: data?.title,
      content: editorValue
    };

    dispatch(updatecommonEmail(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/policy");
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, res.payload?.data]
        }));
      }
    });
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => {
      const updatedAttachments = prev.attachments.filter((_, i) => i !== index);
      return { ...prev, attachments: updatedAttachments };
    });
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">
            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>
              <select
                {...register("PDCompanyId", {
                  required: "company is required",
                })}
                className={` ${inputClassName} ${errors.PDCompanyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Comapany
                </option>
                {companyList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}
              </select>
              {errors.PDCompanyId && (
                <p className="text-red-500 text-sm">
                  {errors.PDCompanyId.message}
                </p>
              )}
            </div>}
            {/* {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Branch <span className="text-red-600">*</span>
                        </label>
                        <select
                          {...register("PDBranchId", {
                            required: "Branch is required",
                          })}
                          className={` ${inputClassName} ${errors.PDBranchId
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        >
                          <option className="" value="">
                            Select Branch
                          </option>
                          {branchList?.map((type) => (
                            <option value={type?._id}>{type?.fullName}</option>
                          ))}
                        </select>
                        {errors.PDBranchId && (
                          <p className="text-red-500 text-sm">
                            {errors.PDBranchId.message}
                          </p>
                        )}
                      </div>
                      } */}

            <div className="">
              <label className={`${inputLabelClassName}`}>Title</label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`${inputClassName} ${errors.title ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="mt-4 col-span-2">
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

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">

            <div className="pt-0 mt-6">
              <div className="font-medium mb-2">Attachments:</div>
              {!isPreview ? (
                <div className="space-y-4">
                  <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer">
                    <FaRegFile className="mr-2" /> Add Attachments
                  </label>

                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <a
                          href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                          className="flex items-center space-x-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaRegFile className="text-gray-500" />
                          <span className="text-sm text-gray-600">{file}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Attachments preview logic */}
                </div>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
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
};

export default EditPolicy;