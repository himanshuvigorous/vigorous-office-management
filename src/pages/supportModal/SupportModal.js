import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  domainName,
  inputClassName,
  inputLabelClassName,
} from "../../constents/global";
import getUserIds from "../../constents/getUserIds";
import { useDispatch, useSelector } from "react-redux";
import { fileUploadFunc } from "../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createSupportModalFunc } from "./supportFeatures/_supportmodal_reducer";
import { FaRegFile, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const SupportModal = ({ setSupportModalOpen }) => {
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setDocuments((prev) => [...prev, res.payload?.data]);
      }
    });
  };
  const handleRemoveFile = (index) => {
    setDocuments((prev) => {
      const updatedDocuments = prev.filter((_, i) => i !== index);
      return updatedDocuments;
    });
  };

  const handleSupportSubmit = (data) => {
    const payload = {
      companyId: userCompanyId,
      directorId: userDirectorId,
      branchId: userBranchId,
      title: data?.title,
      description: data?.description,
      attachment: documents,

      userType:
        userType === "employee"
          ? "companyBranch"
          : userType === "company"
          ? "admin"
          : userType === "companyBranch"
          ? "company"
          : "",
    };
    dispatch(createSupportModalFunc(payload)).then(()=>{
       Swal.fire(
                            'Support Request',
                            'Support Request has been Regenerated.',
                            'success'
                        ).then((data)=>{
                          setSupportModalOpen(false)
                        })
    })

  };

  return (
    <div>
      {" "}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560] px-2"
        onClick={() => setSupportModalOpen(false)}
      >
        <div
          className="animate-slideInFromTop bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl max-h-[60vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            autoComplete="off"
            className="space-y-4 text-black"
            onSubmit={handleSubmit(handleSupportSubmit)}
          >
            {/* Current Password */}

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className={`${inputLabelClassName}`}
              >
                Title
              </label>
              <input
                type="title"
                id="title"
                className={`${inputClassName}`}
                placeholder="Enter Title"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="text-red-500">Please enter Title</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className={`${inputLabelClassName}`}
              >
                Description
              </label>
              <input
                type="Description"
                id="description"
                className={`${inputClassName}`}
                placeholder="Description"
                {...register("description", {
                  required: "Enter description",
                })}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="px-3">
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex justify-start items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                >
                  <FaRegFile className="mr-2" />
                  Add Image
                </label>

                <div className="space-y-2">
                  {documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
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
            </div>

            <button
              type="submit"
              className="w-full bg-header text-white py-2 px-4 rounded-lg  focus:outline-none focus:ring-2 "
            >
              {`Sumbit`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
