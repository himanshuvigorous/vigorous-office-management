import { useEffect, useState } from "react";
import { formButtonClassName, inputAntdSelectClassName, inputCalanderClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocument, fileUploadFunc, updateDocument } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { AiFillDelete } from "react-icons/ai";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, Select } from "antd";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import getUserIds from "../../../constents/getUserIds";

function KycDocuments({ clientData, fetchData }) {
  const [documents, setDocuments] = useState([
    { id: 1, documentType: "", documentNo: "", file: [] },
  ]);
  const { loadingUpdateFile } = useSelector((state) => state.fileUpload);
  const [formErrors, setFormErrors] = useState([]);
  const dispatch = useDispatch();
  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };

  const { control, register } = useForm()

  const { employeeDocumentList, employeeDocListloading } = useSelector(
    (state) => state.employeeDocument
  );


  useEffect(() => {
    dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
  }, [dispatch]);


  useEffect(() => {
    if (clientData) {
      const documentData = clientData?.data?.documentData?.length
        ? clientData.data.documentData.map((document) => ({
          _id: document?._id || "",
          documentType: document?.name || "",
          documentNo: document?.number || "",
          file: document?.filePath || [],
          endYear:document?.expireDate && dayjs(document?.expireDate) ,
        }))
        : [
          {
            _id: "",
            documentType: "",
            documentNo: "",
            file: [],
          },
        ];

      setDocuments([...documentData]);
    }
  }, [clientData])

  const handleInputChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
    const newFormErrors = [...formErrors];
    if (newFormErrors[index]?.[field]) {
      delete newFormErrors[index][field];
    }
    setFormErrors(newFormErrors);
  };

  const handleFileChange = (index, file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    const filePreviewUrl = URL.createObjectURL(file); // Create a preview URL for images

    // Show SweetAlert to confirm upload
    Swal.fire({
      title: 'Preview your file',
      html: `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                  <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
                  ${isPdf
          ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
          : `<img src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">`
        }
                  <br>
              </div>
          `,
      showCancelButton: true,
      confirmButtonText: 'Confirm!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          fileUploadFunc({
            filePath: file,
            isVideo: false,
            isMultiple: false,
          })
        ).then((data) => {
          if (!data.error) {
            const updatedDocuments = [...documents];
            updatedDocuments[index].file = [data?.payload?.data];
            setDocuments(updatedDocuments);
            const newFormErrors = [...formErrors];
            if (newFormErrors[index]?.file) {
              delete newFormErrors[index].file;
            }
            setFormErrors(newFormErrors);
          }
        });
      } else {

      }
    });
  };


  const handleDelete = (document, index) => {
    if (document?._id) {
      dispatch(deleteDocument({ _id: document?._id })).then((data) => {
        if (!data.error) {
          fetchData()
          // setDocuments((prevDocuments) =>
          //     prevDocuments.filter((_, index2) => index2 !== index)
          // );
        }
      });
    } else {
      setDocuments((prevDocuments) =>
        prevDocuments.filter((_, index2) => index2 !== index)
      );
    }
  };

  const validateForm = () => {
    let errors = [];
    documents.forEach((document, index) => {
      let error = {};
      if (!document.documentType) {
        error.documentType = "Document Type is required.";
      }
      if (!document.documentNo) {
        error.documentNo = "Document No is required.";
      }
      
      if (!document.file || document.file.length === 0) {
        error.file = "Document file is required.";
      }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0); // returns true if no errors
  };



  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const documentPayload = documents.map((doc, index) => {
        if (doc?._id) {
          return {
            userId: clientData?.data?._id,
            _id: doc?._id,
            name: doc?.documentType,
            number: doc?.documentNo,
            filePath: doc?.file,
            "expireDate": doc?.endYear ? dayjs(doc?.endYear) : null,
          };
        } else {
          return {
            userId: clientData?.data?._id,
            name: doc?.documentType,
            number: doc?.documentNo,
            filePath: doc?.file,
            "expireDate": doc?.endYear ? dayjs(doc?.endYear) : null,
          };
        }
      });

      const finalPayload = {
        documents: documentPayload,
        type: "documents",
      };
      await dispatch(updateDocument(finalPayload)).then((data) => {
        if (!data.error) {
          fetchData()
        }

      });
    }
  };

  const handleDeleteDoctImage = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = [];
    setDocuments(updatedDocuments);
  };



  return (
    <form autoComplete="off" onSubmit={onSubmit}>

      <div className="rounded-md ">

        {documents?.map((document, index) => (
          <div className="border border-gray-300 rounded-md my-2" key={index}>
            <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
              <div className="px-3 py-2 text-white font-semibold">  Document {index + 1}</div>
              <button
                type="button"
                onClick={() => handleDelete(document, index)}
                className="text-red-600 hover:text-red-800"
              >
                <AiFillDelete size={20} className="m-2" />
              </button>
            </div>
            <div
              key={index}
              className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
            >
              <div>
                <label className={`${inputLabelClassName}`}>
                  Document Type <span className="text-red-600">*</span>
                </label>
                <Select
                  value={document.documentType}
                  className={` ${inputAntdSelectClassName} ${formErrors.documentType ? "border-[1px] " : "border-gray-300"}`}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "documentType",
                      e
                    )
                  }
                  placeholder="Select Document Type"
                  showSearch


                >

                  <Select.Option value="">Select Document</Select.Option>
                  {employeeDocListloading ? (
                   <Select.Option disabled>
                  <Loader/>
                 </Select.Option>
                  ) : (
                    sortByPropertyAlphabetically(employeeDocumentList)
                      ?.filter((data) => data?.type === "General")
                      .map((type) => (
                        <Select.Option key={type.name} value={type.name}>
                          {type.name}
                        </Select.Option>
                      ))
                  )}

                </Select>

                {formErrors[index]?.documentType && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].documentType}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Document No <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={document.documentNo}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "documentNo",
                      e.target.value
                    )
                  }
                  className={`${inputClassName} ${formErrors[index]?.documentNo
                    ? "border-[1px] "
                    : ""
                    }`}
                  placeholder="Enter Document No"
                />
                {formErrors[index]?.documentNo && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].documentNo}
                  </p>
                )}
              </div>
              <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Expiry Date 
                          </label>
                          <DatePicker
                            className={`${inputCalanderClassName} py-2.5 ${formErrors[index]?.endYear ? "border-[1px] " : "border-gray-300"} `}
                            popupClassName={'!z-[1580]'}
                            value={document.endYear} onChange={(e) =>
                              handleInputChange(
                                index,
                                "endYear",
                                e
                              )} picker="date" />
                          {formErrors[index]?.endYear && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].endYear}
                            </p>
                          )}
                        </div>

              <div className="flex items-center gap-2">
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Upload Image <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    id={`documentUpload${index}`}
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(index, e.target.files[0])
                    }
                  />
                  <br />
                  <label
                    htmlFor={`documentUpload${index}`}
                    className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                  >
                    Upload Image
                  </label>
                </div>
                {document?.file?.length > 0
                  ? document.file.map((file, fileIndex) => (
                    <div key={fileIndex} className="relative">
                      <CommonImageViewer
                        // key={index}
                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                        alt={`Uploaded ${fileIndex + 1}`}

                      />
                      <button
                        className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={() => handleDeleteDoctImage(index, file)}
                      >
                        ✕
                      </button>
                    </div>

                  ))
                  : null}
                {formErrors[index]?.file && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].file}
                  </p>
                )}
              </div>

              {/* <div className="px-3 gap-4 items-end mb-3">
                      <button
                        type="submit"
                        onClick={() => handleDelete(document, index)}
                        className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                      >
                        <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                      </button>
                    </div> */}
            </div>
          </div>
        ))}
        <div className="flex justify-between px-3 pb-2">
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
          >
            Add More
          </button>
        </div>
      </div>
      <div className="flex justify-between px-3 pb-2">
        <button
          disabled={loadingUpdateFile}
          type="Submit"
          className={`${formButtonClassName}`}
        >
          {loadingUpdateFile ? "Submitting ..." : "Submit Details"}
        </button>
      </div>
    </form>
  )
}

export default KycDocuments
