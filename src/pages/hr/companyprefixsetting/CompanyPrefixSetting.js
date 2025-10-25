import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  domainName,
  formButtonClassName,
  inputAntdSelectClassName,
  inputClassName,
  inputDisabledClassName,
  inputLabelClassName,
} from "../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import getUserIds from "../../../constents/getUserIds";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { Select } from "antd";
import usePermissions from "../../../config/usePermissions";
import {
  getCompanyPrefixDetails,
  updateCompanyPrefix,
} from "./companyPrefixSettingsFeatures/_company_prefix_setting_reducer";
import Loader from "../../../global_layouts/Loader";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import Swal from "sweetalert2";

const CompanyPrefixSetting = () => {
   
  const fileInputRefs = useRef();
  const lastFetchedCompanyId = useRef(null);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const { companyList } = useSelector((state) => state.company);
  const { companyPrefixData, loading: companyPrefixLoading } = useSelector((state) => state.companyPrefix);
  const [editable, setEditable] = useState(false);

  const { userType } = getUserIds();

  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const resolvedCompanyId =
    userInfoglobal?.userType === "admin"
      ? getValues("companyId")
      : userInfoglobal?.userType === "company"
        ? userInfoglobal?._id
        : userInfoglobal?.companyId;

  const handleImageDelete = () => {
    if (fileInputRefs.current) {
      fileInputRefs.current.value = "";
    }
    setUploadedLogo('');
  };

  const handleFileChange = (file) => {
    if (!file) return;


    const selectedFile = file;

    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = "";

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;
      const isPdf = file.type === "application/pdf";

      // Show SweetAlert to confirm upload
      Swal.fire({
        title: "Preview your file",
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
              ${isPdf
            ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
            : `<img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">` // Display image preview for non-PDF files
          }
              <br>
            </div>
          `,
        showCancelButton: true,
        confirmButtonText: "Confirm!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the updated selectedFile (which could be the original or changed file)
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
              isVideo: false,
              isMultiple: false,
            })
          ).then((res) => {
            if (!res.error) {

              setUploadedLogo(res?.payload?.data);
              Swal.fire("Success", "File uploaded successfully", "success");
            }
          });
        } else {
          // Handle the cancel case

        }
      });
    };

    // Read the file to generate the preview
    fileReader.readAsDataURL(file);
  };


  const fetchCompanyPrefixData = () => {
    if (lastFetchedCompanyId.current === resolvedCompanyId) return; // avoid refetching same
    lastFetchedCompanyId.current = resolvedCompanyId;

   if(userType === "company"){
    dispatch(getCompanyPrefixDetails({ companyId: resolvedCompanyId }));
   }
  };

  useEffect(() => {
    if (userType === "admin") {
      dispatch(companySearch({ isPagination: false, text: "", sort: true, status: true }));
    }
  }, []);

  useEffect(() => {
    if (
      resolvedCompanyId &&
      (userInfoglobal?.userType === "company" ||
        userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector") &&
      !editable
    ) {
      fetchCompanyPrefixData();
    }
  }, [resolvedCompanyId, editable]);

  useEffect(() => {
    setValue("companyId", companyPrefixData?.companyId || "");
    setValue("branchPrefix", companyPrefixData?.branchUserNamePrefix || "");
    setValue("DirectorUserPrefix", companyPrefixData?.directorUserNamePrefix || "");
    setValue("tagLine", companyPrefixData?.tagline || "");
    setValue("JWTTokenExprTime", companyPrefixData?.JWTTokenExprTime || "");
    setValue("smtpHost", companyPrefixData?.smtpHost || "");
    setValue("smtpPort", companyPrefixData?.smtpPort || "");
    setValue("smtpSecure", companyPrefixData?.smtpSecure == true ? true : false );
    setValue("smtpUser", companyPrefixData?.smtpUser || "");
    setValue("smtpPassword", companyPrefixData?.smtpPassword || "");
    setUploadedLogo(companyPrefixData?.logo || '');
  }, [companyPrefixData]);

  const onSubmit = (data) => {
    const reqPayload = {
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : data?.companyId,
      directorUserNamePrefix: data?.DirectorUserPrefix,
      branchUserNamePrefix: data?.branchPrefix,
      tagline: data?.tagLine,
      logo: uploadedLogo || '',
      JWTTokenExprTime: data?.JWTTokenExprTime,
      smtpHost: data?.smtpHost ?? "",
      smtpPort: + data?.smtpPort ?? "",
      smtpSecure: (data?.smtpSecure == 'true' || data?.smtpSecure == true) ? true : false,
      smtpUser: data?.smtpUser ?? "",
      smtpPassword: data?.smtpPassword ?? "",

    };
    dispatch(updateCompanyPrefix(reqPayload)).then((res) => {
      if (!res.error) fetchCompanyPrefixData();
    });
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  if (userInfoglobal?.userType !== "company") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an authorized user. This page is viewable for Company only.
          </p>
        </div>
      </GlobalLayout>
    )
  }

  return (
    <GlobalLayout>
      {canRead && (
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center !capitalize">
            {canUpdate && (
              <button onClick={() => setEditable(!editable)} type="button" className={formButtonClassName}>
                {editable ? "Cancel" : "Edit"}
              </button>
            )}
            {canUpdate && (
              <button
                type="submit"
                disabled={companyPrefixLoading || !editable}
                className={`${companyPrefixLoading || !editable ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
              >
                {companyPrefixLoading ? <Loader /> : 'Submit'}
              </button>
            )}
          </div>

          <div className="border border-header mt-2 rounded-lg">
            <div className="bg-header text-white py-2 px-4 rounded-t-lg">Prefix Settings</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
              {(userType === "admin" || userType === "companyDirector") && (
                <div>
                  <label className={inputLabelClassName}>
                    Company <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("companyId", { required: "Company is required" })}
                    className={`${inputClassName} ${errors.companyId ? "border-[1px]" : "border-gray-300"}`}
                  >
                    <option value="">Select Company</option>
                    {companyList?.map((type) => (
                      <option key={type?._id} value={type?._id}>
                        {type?.fullName} ({type?.userName})
                      </option>
                    ))}
                  </select>
                  {errors.companyId && <p className="text-red-500 text-sm">{errors.companyId.message}</p>}
                </div>
              )}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Logout Time
                </label>
                <Controller
                  name="JWTTokenExprTime"
                  control={control}
                  disabled={!editable}

                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select  Logout Time"
                    >
                      <Select.Option value="">Select Logout Time</Select.Option>
                      <Select.Option value="30m">30 minutes</Select.Option>
                      <Select.Option value="1h">1 hour</Select.Option>
                      <Select.Option value="6h">6 hours</Select.Option>
                      <Select.Option value="12h">12 hours</Select.Option>
                      <Select.Option value="24h">1 day</Select.Option>
                      <Select.Option value="3d">3 days</Select.Option>
                      <Select.Option value="7d">7 days</Select.Option>
                      <Select.Option value="30d">1 month (30 days)</Select.Option>
                      <Select.Option value="60d">2 months (60 days)</Select.Option>
                      <Select.Option value="90d">3 months (90 days)</Select.Option>
                      <Select.Option value="120d">4 months (120 days)</Select.Option>
                      <Select.Option value="240d">8 months (240 days)</Select.Option>
                      <Select.Option value="365d">1 year</Select.Option>

                    </Select>
                  )}
                />

                {errors.JWTTokenExprTime && (
                  <p className="text-red-500 text-sm">
                    {errors.JWTTokenExprTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className={inputLabelClassName}>Branch Username Prefix</label>
                <input
                  type="text"
                  disabled={!editable}
                  {...register("branchPrefix")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.branchPrefix ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="Branch Username Prefix"
                />
              </div>

              <div>
                <label className={inputLabelClassName}>Director Username Prefix</label>
                <input
                  type="text"
                  disabled={!editable}
                  {...register("DirectorUserPrefix")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.DirectorUserPrefix ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="Director Username Prefix"
                />
              </div>

              <div>
                <label className={inputLabelClassName}>Tagline</label>
                <input
                  type="text"
                  disabled={!editable}
                  {...register("tagLine")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.tagLine ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="Tagline"
                />
              </div>
              <div>
                <label className={inputLabelClassName}>Smtp Host</label>
                <input
                  type="text"
                  disabled={!editable}
                  {...register("smtpHost")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.smtpHost ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="smtp Host"
                />
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  SMTP Port
                </label>

                <Controller
                  name="smtpPort"
                  control={control}
                  disabled={!editable}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.smtpPort ? "border-[1px]" : "border-gray-300"}`}
                      placeholder="Select SMTP Port"
                    >
                      <Select.Option value="">Select SMTP Port</Select.Option>
                      <Select.Option value={587}>587 (TLS - STARTTLS)</Select.Option>
                      <Select.Option value={465}>465 (SSL)</Select.Option>
                    </Select>
                  )}
                />

                {errors.smtpPort && (
                  <p className="text-red-500 text-sm">
                    {errors.smtpPort.message}
                  </p>
                )}
              </div>

              {/* <div>
                <label className={inputLabelClassName}>smtpPort</label>
                <input
                  type="number"
                  disabled={!editable}
                  {...register("smtpPort")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.smtpPort ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="smtpPort"
                />
              </div> */}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Is SMTP Secure
                </label>
                <Controller
                  name="smtpSecure"
                  control={control}
                  disabled={!editable}

                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.smtpSecure ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select  Is SMTP Secure"
                    >
                      <Select.Option value="">Select Is SMTP Secure"</Select.Option>
                      <Select.Option value={true}>True</Select.Option>
                      <Select.Option value={false}>False</Select.Option>

                    </Select>
                  )}
                />

                {errors.smtpSecure && (
                  <p className="text-red-500 text-sm">
                    {errors.smtpSecure.message}
                  </p>
                )}
              </div>
              <div>
                <label className={inputLabelClassName}>smtp User</label>
                <input
                  type="text"
                  disabled={!editable}
                  {...register("smtpUser")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.smtpUser ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="smtp User"
                />
              </div>
              <div>
                <label className={inputLabelClassName}>smtp Password</label>
                <input
                  type="text"
                  disabled={!editable}
                  {...register("smtpPassword")}
                  className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.smtpPassword ? "border-[1px]" : "border-gray-300"}`}
                  placeholder="smtp Password"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <div>
                  
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    ref={fileInputRefs}
                    className="hidden"
                    disabled={!editable}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                  <label
                    htmlFor="documentUpload"
                    className={`${!editable ? 'bg-gray-400' : 'bg-header'} text-white mt-2 py-1.5 px-3 text-sm rounded cursor-pointer`}
                    onClick={() => fileInputRefs.current?.click()}
                  >
                    Upload
                  </label>
                </div>

                {uploadedLogo && (
                  <div className="relative">
                    <CommonImageViewer src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${uploadedLogo}`} />
                    <button
                     disabled={!editable}
                      className={`absolute -top-1 -right-2  text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ${editable ? 'bg-red-600' : 'bg-gray-300'}`}
                      onClick={handleImageDelete}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </form>
      )}
    </GlobalLayout>
  );
};

export default CompanyPrefixSetting;
