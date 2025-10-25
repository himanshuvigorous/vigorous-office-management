import { useEffect, useState } from "react";
import {
  formButtonClassName,
  inputAntdSelectClassName,
  inputCalanderClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import {
  deleteService,
  updateService,
} from "./clientFeatures/_client_reducers";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { DigitalSignatureTypeSearch } from "../../clientService/sigantureServiceFeatures/_digital_signature_type_reducers";
import { useNavigate } from "react-router-dom";
import ListLoader from "../../../global_layouts/ListLoader";

function DigitalSignature({ clientData, fetchData }) {
  const [documents, setDocuments] = useState([
    { id: 1, documentType: "", documentNo: "", file: [] },
  ]);
  const { DigitalSignatureTypeList,loading:digitSignLoading } = useSelector(
    (state) => state.digitalSignatureType
  );
  const { loadingUpdateFile } = useSelector((state) => state.fileUpload);
  const [formErrors, setFormErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };
  useEffect(() => {
    dispatch(
      DigitalSignatureTypeSearch({
        branchId: clientData?.data?.branchId,
        companyId: clientData?.data?.companyId,
      })
    );
  }, []);
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
  const handleDelete = (document, index) => {
    if (document?._id) {
      dispatch(deleteService({ _id: document?._id })).then((data) => {
        if (!data.error) {
          fetchData();
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
        error.name = "Name is required.";
      }
      if (!document.signatureType) {
        error.signatureType = "Signature Type is required.";
      }
      if (!document.startDate) {
        error.startDate = "Start Date is required.";
      }
      if (!document.endDate) {
        error.endDate = "End Date is required.";
      }

      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const documentPayload = documents.map((doc, index) => {
        if (doc?._id) {
          return {
            _id: doc?._id,
            name: doc?.name,
            startDate: doc?.startDate,
            expiryDate: doc?.endDate,
            signatureTypeId: doc?.signatureType,
          };
        } else {
          return {
            name: doc?.name,
            startDate: doc?.startDate,
            expiryDate: doc?.endDate,
            signatureTypeId: doc?.signatureType,
          };
        }
      });
      const finalPaylaod = {
        companyId: clientData?.data?.companyId,
        directorId: "",
        branchId: clientData?.data?.branchId,
        clientId: clientData?.data?._id,
        type: "Signature",
        signatureArr: documentPayload,
      };
      dispatch(updateService(finalPaylaod)).then((res) => {
        if (!res?.error) {
          fetchData();
        }
      });
      navigate(-1);
    }
  };
  useEffect(() => {
    if (clientData) {
      const documentData = clientData?.data?.signatureData?.length
        ? clientData.data.signatureData.map((document) => ({
            _id: document?._id || "",
            name: document?.name || "",
            startDate: dayjs(document?.startDate) || "",
            endDate: dayjs(document?.expiryDate) || "",
            file: document?.attechment || [],
            signatureType: document?.signatureTypeId || "",
          }))
        : [
            {
              documentType: "",
              documentNo: "",
              file: [],
              signatureType: "",
            },
          ];

      setDocuments([...documentData]);
    }
  }, [clientData]);
  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <div className="rounded-md">
        {documents?.map((document, index) => (
          <div key={index} className="border border-gray-300 rounded-md my-2">
            <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
              <div className="px-3 py-2 text-white font-semibold">
                {" "}
                digital Signature {index + 1}
              </div>
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleDelete(document, index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <AiFillDelete size={20} className="m-2" />
                </button>
              )}
            </div>
            <div
              key={index}
              className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
            >
              <div>
                <label className={`${inputLabelClassName}`}>
                  Signature Type <span className="text-red-600">*</span>
                </label>
                <Select
                  value={document.signatureType}
                  className={` ${inputAntdSelectClassName} ${
                    formErrors.signatureType
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                  onChange={(e) => handleInputChange(index, "signatureType", e)}
                  placeholder="Select Signature Type"
                  showSearch
                >
                  <Select.Option value="">Select Signature Type</Select.Option>
                  {digitSignLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>:sortByPropertyAlphabetically(DigitalSignatureTypeList?.docs)?.map((type) => (
                    <Select.Option key={type._id} value={type._id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
                {formErrors[index]?.signatureType && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].signatureType}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={document?.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  className={`${inputClassName} ${
                    formErrors[index]?.name ? "border-[1px] " : ""
                  }`}
                  placeholder="Enter  Name"
                />
                {formErrors[index]?.name && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].name}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Start Date <span className="text-red-600">*</span>
                </label>
                <DatePicker
                  size={"large"}
                  picker={"date"}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current.isBefore(dayjs().endOf("day"), "day");
                  }}
                  value={
                    document?.startDate ? dayjs(document?.startDate) : null
                  }
                  onChange={(date) =>
                    handleInputChange(index, "startDate", date)
                  }
                  className={` ${inputCalanderClassName} ${
                    formErrors[index]?.startDate
                      ? "border-[1px] "
                      : ""
                  } `}
                  popupClassName={"!z-[1580]"}
                />
                {formErrors[index]?.startDate && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].startDate}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  End Date <span className="text-red-600">*</span>
                </label>
                <DatePicker
                  size={"large"}
                  picker={"date"}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current.isBefore(dayjs().endOf("day"), "day");
                  }}
                  value={document?.endDate ? dayjs(document?.endDate) : null}
                  onChange={(date) => handleInputChange(index, "endDate", date)}
                  className={` ${inputCalanderClassName} ${
                    formErrors[index]?.endDate
                      ? "border-[1px] "
                      : ""
                  } `}
                  popupClassName={"!z-[1580]"}
                />
                {formErrors[index]?.endDate && (
                  <p className="text-red-600 text-sm">
                    {formErrors[index].endDate}
                  </p>
                )}
              </div>
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
  );
}

export default DigitalSignature;
