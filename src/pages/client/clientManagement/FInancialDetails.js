
import { useEffect, useState } from "react";
import { formButtonClassName, generateFinancialYearPairs, getDefaultFinacialYear, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocument, fileUploadFunc, updateDocument } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { AiFillDelete } from "react-icons/ai";
import { Select } from "antd";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";
import Swal from "sweetalert2";
import Loader from "../../../global_layouts/Loader";
import getUserIds from "../../../constents/getUserIds";

function FInancialDetails({clientData ,  fetchData}) {
    const [documents, setDocuments] = useState([
        { id: 1, name: "", documentNo: "",isPeriod: "",quarterName: "",monthName: "", file: [] },
      ]);
        const quarter = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

      const { loadingUpdateFile } = useSelector((state) => state.fileUpload);
      const [formErrors, setFormErrors] = useState([]);
      const dispatch = useDispatch();
      const handleAddMore = () => {
        setDocuments([...documents, { id: Date.now() }]);
      };

      const { employeeDocumentList, employeeDocListloading} = useSelector(
        (state) => state.employeeDocument
      );


      useEffect(() => {
        dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
      }, [dispatch]);




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
        const filePreviewUrl = URL.createObjectURL(file); // Create a preview URL for non-PDF files
    
        // Show SweetAlert to confirm upload
        Swal.fire({
            title: 'Preview your file',
            html: `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                    <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
                    ${
                        isPdf
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
                // Proceed with file upload only if the user confirms
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
    
                        // Remove error for this file field if it exists
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
              //   prevDocuments.filter((_, index2) => index2 !== index)
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
          if (!document.name) {
            error.name = "Document Type is required.";
          }
          if (!document.year) {
            error.year = "Year is required.";
          }
          if (!document.isPeriod) {
            error.isPeriod = "type is required.";
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


      useEffect(()=>{
        if(clientData){
            const documentData = clientData?.data?.financeData?.length
            ? clientData?.data.financeData.map((element) => ({
                _id: element?._id || "",
                name: element?.name || "",
                year: element?.yearRange || "",
                file: element?.filePath || [],
                isPeriod:element?.type || '',
            quarterName:element?.monthQuaters || '',
            monthName:element?.monthName || '',
              }))
            : [{ _id: "", name: "", year: getDefaultFinacialYear(), file: [] }];
        
          setDocuments([...documentData]);
        }
        },[clientData])

const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {

        const financialInfoPayload = documents.map((element, index) => {
          if (element?._id) {
            return {
                 userId: clientData?.data?._id ,
              _id: element?._id,
              name: element?.name,
              yearRange: element?.year,
              filePath: element?.file,
               type: element?.isPeriod,
            monthName: (element?.isPeriod =='Quaterly' || element?.isPeriod =='Yearly' )  ? '' : element?.monthName,
              monthQuaters: element?.isPeriod !='Quaterly' ?'': element?.quarterName,
            };
          } else {
            return {
                 userId: clientData?.data?._id ,
              name: element?.name,
              yearRange: element?.year,
              filePath: element?.file,
               type: element?.isPeriod,
             monthName: (element?.isPeriod =='Quaterly' || element?.isPeriod =='Yearly' )  ? '' : element?.monthName,
              monthQuaters: element?.isPeriod !='Quaterly' ?'': element?.quarterName,
            };
          }
        });

        const finalPayload = {
          financialInfo: financialInfoPayload,
          type: "financial",
        };

        await dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            fetchData()
            
          }

        });
      }
  };
  const financialYearPairs = generateFinancialYearPairs();
  const handleDeleteDocImage = (index, file) => {
    const updatedDocs = [...documents];
    updatedDocs[index].file = [];
    setDocuments(updatedDocs);
};
    return (
        <form autoComplete="off" onSubmit={onSubmit}>
             
        <div className="rounded-md">
          {documents?.map((document, index) => 
          {
            const dropdownType = document.isPeriod;
            return (
             <div key={index} className="border border-gray-300 rounded-md my-2">
             <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                 <div className="px-3 py-2 text-white font-semibold">Financial Document {index + 1}</div>
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
                            value={document.name}
                            className={` ${inputAntdSelectClassName} ${formErrors.name ? "border-[1px] " : "border-gray-300"}`}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "name",
                                e
                              )
                            }
                            placeholder="Select Document Type"
                            showSearch

                          >
                            <Select.Option value="">Select Document</Select.Option>
                            {employeeDocListloading?   <Select.Option disabled>
                  <Loader/>
                 </Select.Option>:(employeeDocumentList
                              ?.filter((data) => data?.type === "Financial")
                              
                              .map((type) => (
                                <Select.Option key={type.name} value={type.name}>
                                  {type.name}
                                </Select.Option>
                              )))}

                          </Select>
              
                {formErrors[index]?.name && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].name}
                  </p>
                )}
              </div>
             
              <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Year <span className="text-red-600">*</span>
                          </label>
                          <Select
                          defaultValue={getDefaultFinacialYear()}
                            value={document.year}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "year",
                                e
                              )
                            }
                            className={`${inputAntdSelectClassName} ${formErrors[index]?.name ? "border-[1px] " : ""}`}
                          >
                            <Select.Option value="">Select Financial Year</Select.Option>
                            {financialYearPairs.map((yearPair) => (
                              <Select.Option key={yearPair} value={yearPair}>
                                {yearPair}
                              </Select.Option>
                            ))}
                          </Select>
                          
                          {formErrors[index]?.year && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].year}
                            </p>
                          )}
                        </div>

                           <div>
                                                    <label className={`${inputLabelClassName}`}>
                                                      Type <span className="text-red-600">*</span>
                                                    </label>
                        
                                                    <Select
                                                      defaultValue={""}
                                                      onChange={(e) =>
                                                        handleInputChange(index, "isPeriod", e)
                                                      }
                                                      value={document?.isPeriod}
                                                      className={`${inputAntdSelectClassName} `}
                                                    >
                                                      <Select.Option value="">
                                                        Select Type
                                                      </Select.Option>
                                                      <Select.Option value="Quaterly">
                                                        {" "}
                                                        Quaterly
                                                      </Select.Option>
                                                      <Select.Option value="Monthly">
                                                        Monthly
                                                      </Select.Option>
                                                      <Select.Option value="Yearly">
                                                        Yearly
                                                      </Select.Option>
                                                    </Select>
                        
                                                    {formErrors[index]?.isPeriod && (
                                                      <p className="text-red-600 text-sm">
                                                        {formErrors[index].isPeriod}
                                                      </p>
                                                    )}
                                                  </div>
                        
                                                  {dropdownType === "Quaterly" && (
                                                    <div>
                                                      <label className={`${inputLabelClassName}`}>
                                                        Quarter <span className="text-red-600">*</span>
                                                      </label>
                        
                                                      <Select
                                                        defaultValue={""}
                                                        className={`${inputAntdSelectClassName} `}
                                                        onChange={(e) =>
                                                          handleInputChange(index, "quarterName", e)
                                                        }
                                                        value={document?.quarterName}
                                                      >
                                                        <Select.Option value="">
                                                          Select Quarter
                                                        </Select.Option>
                                                        {quarter.map((qtr) => (
                                                          <Select.Option key={qtr} value={qtr}>
                                                            {qtr}
                                                          </Select.Option>
                                                        ))}
                                                      </Select>
                        
                                                      {formErrors[index]?.quarterName && (
                                                        <p className="text-red-600 text-sm">
                                                          {formErrors[index].quarterName}
                                                        </p>
                                                      )}
                                                    </div>
                                                  )}
                        
                                                  {dropdownType === "Monthly" && (
                                                    <div>
                                                      <label className={`${inputLabelClassName}`}>
                                                        Month <span className="text-red-600">*</span>
                                                      </label>
                        
                                                      <Select
                                                        defaultValue={""}
                                                        className={`${inputAntdSelectClassName} `}
                                                        onChange={(e) =>
                                                          handleInputChange(index, "monthName", e)
                                                        }
                                                        value={document?.monthName}
                                                      >
                                                        <Select.Option value="">
                                                          Select Month
                                                        </Select.Option>
                                                        {months.map((month) => (
                                                          <Select.Option key={month} value={month}>
                                                            {month}
                                                          </Select.Option>
                                                        ))}
                                                      </Select>
                        
                                                      {formErrors[index]?.monthName && (
                                                        <p className="text-red-600 text-sm">
                                                          {formErrors[index].monthName}
                                                        </p>
                                                      )}
                                                    </div>
                                                  )}


                        {/* <div>
                <label className={`${inputLabelClassName}`}>
                  Year <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={document.year}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "year",
                      e.target.value
                    )
                  }
                  className={`${inputClassName} ${
                    formErrors[index]?.year
                      ? "border-[1px] "
                      : ""
                  }`}
                  placeholder="Enter Year"
                />
                {formErrors[index]?.year && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].year}
                  </p>
                )}
              </div> */}
              <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload Image  <span className="text-red-600">*</span>
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
                                  onClick={() => handleDeleteDocImage(index, file)}
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


              {/* <div className="flex items-center gap-2">
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Upload <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
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
                    Upload
                  </label>
                </div>
                {document?.file?.length > 0
                  ? document.file.map((file, index) => (
                      <img
                        key={index}
                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                        alt={`Uploaded ${index + 1}`}
                        className="w-20 h-20 shadow rounded-sm"
                      />
                    ))
                  : null}
                {formErrors[index]?.file && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].file}
                  </p>
                )}
              </div> */}

              {/* <div className="px-3 gap-4 items-end mb-3">
                <button
                  type="button"
                  onClick={() => handleDelete(document, index)}
                  className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                >
                  <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                </button>
              </div> */}
            </div>
            </div>
          )})}
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
            // disabled={loadingUpdateFile}
            type="Submit"
            className={`${formButtonClassName}`}
          >
            {loadingUpdateFile ? "Submitting ..." : "Submit Details"}
          </button>
        </div>
      </form>
    )
}

export default FInancialDetails
