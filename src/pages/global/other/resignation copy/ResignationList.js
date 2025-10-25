import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import Loader from "../../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { CgEyeAlt } from "react-icons/cg";
import { DatePicker, Select, Tooltip } from "antd";
import getUserIds from "../../../../constents/getUserIds";
import { HiOutlineFilter } from "react-icons/hi";
import { deleteResignFunc, getResignationList, statusResignFunc } from "./resignationFeatures/resignation_reducers";
import { BsPassFill } from "react-icons/bs";
import { MdBookmarkAdded, MdRemoveCircle } from "react-icons/md";
import moment from "moment";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import ReactDOM from "react-dom/client";
import withReactContent from "sweetalert2-react-content";

function ResignationList() {
  const MySwal = withReactContent(Swal)
  const { register, control, formState: { errors } } = useForm();
  const { userCompanyId, userBranchId, userType } = getUserIds();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resignationData, totalresignCount, loading } = useSelector((state) => state.resignation);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });
  const limit = 10;

  useEffect(() => {
    getResignationRequest();
  }, [currentPage, branchId, companyId, searchText, status]);

  const getResignationRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId: companyId || "",
        branchId: branchId || "",
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
        type: "resignation"
      }
    };
    dispatch(getResignationList(data));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteResignFunc(reqData)).then((data) => {
          getResignationRequest()
        });
      }
    });
  };
  useEffect(() => {
    if (
      companyId ||
      userType === "company" ||
      userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId
        })
      );
    }
  }, [companyId])
  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // State to store the selected template data

  // Function to open the modal with the template details
  const openModal = (template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTemplate(null);
  };




;

const handleStatusUpdate = (element, status) => {
  MySwal.fire({
    title: 'Provide feedback & date',
    html: `<div id="swal-react-container"></div>`,
    showCancelButton: true,
    confirmButtonText: `Update as ${status}`,
    cancelButtonText: 'Cancel',
    focusConfirm: false,
    didOpen: () => {
      const container = document.getElementById("swal-react-container");

      if (container) {
        const root = ReactDOM.createRoot(container);

        root.render(
          <div className="flex flex-col gap-4">
            <textarea
              id="feedback"
              className="swal2-textarea"
              placeholder="Type your feedback here..."
            />
            <DatePicker
               getPopupContainer={(triggerNode) => triggerNode.parentNode}
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current <= moment().endOf("day")
              }
              onChange={(date, dateString) => {
                let existingInput = document.getElementById("selected-date");
                if (!existingInput) {
                  existingInput = document.createElement("input");
                  existingInput.id = "selected-date";
                  existingInput.type = "hidden";
                  document.body.appendChild(existingInput);
                }
                existingInput.value = dateString;
              }}
            />
          </div>
        );
      }
    },
    preConfirm: () => {
      const feedback = document.getElementById("feedback")?.value?.trim();
      const selectedDate = document.getElementById("selected-date")?.value;

      if (!feedback) {
        Swal.showValidationMessage("Feedback is required");
        return false;
      }

      if (!selectedDate) {
        Swal.showValidationMessage("Please select a future date");
        return false;
      }

      return { feedback, date: selectedDate };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { feedback, date } = result.value;

      // Dispatch to API
      dispatch(
        statusResignFunc({
          _id: element?._id,
          status: status,
          reason: feedback,
          applyDate: date,
        })
      ).then((data) => {
        if (!data?.error) {
          getResignationRequest();
        }
      });
    }
  });
};

  const onChange = (e) => {
    
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>

      <div className="">
        <div className="md:flex justify-between items-center md:space-y-0 space-y-2 py-1">
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-2 sm:space-y-0 space-y-2">
            {userType === "admin" &&
              <div className='flex justify-center items-center space-x-2 text-[14px] rounded-md'>

                {/* <select
                      {...register("PDCompanyId")}
                      className="bg-white focus:outline-none"
                    >
                      <option className="" value="">Select Comapany</option>
                      {companyList?.map((type) => (
                        <option value={type?._id}>{type?.fullName}</option>
                      ))}
                    </select> */}

                <Controller
                  control={control}
                  name="PDCompanyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      // onFocus={() => {
                      //   dispatch(
                      //     companySearch({
                      //       text: "",
                      //       sort: true,
                      //       status: true,
                      //       isPagination: false,
                      //     })
                      //   );
                      // }}
                      className={`${inputAntdSelectClassNameFilter} `}
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>}
            {(userType === "admin" || userType === "company" || userType === "companyDirector") &&
              <div className='flex justify-center items-center space-x-2 text-[14px] rounded-md'>

                {/* <select
                      {...register("PDBranchId")}
                      className="bg-white focus:outline-none"
                    >
                      <option className="" value="">Select Branch</option>
                      {branchList?.map((type) => (
                        <option value={type?._id}>{type?.fullName}</option>
                      ))}
                    </select> */}
                <Controller
                  control={control}
                  name="PDBranchId"
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      // onFocus={() => {
                      //   dispatch(
                      //     companySearch({
                      //       text: "",
                      //       sort: true,
                      //       status: true,
                      //       isPagination: false,
                      //     })
                      //   );
                      // }}
                      className={`${inputAntdSelectClassNameFilter} `}
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>}

            <Select
              className={` ${inputAntdSelectClassNameFilter} `}
              value={status}
              onChange={(e) => {
                setStatus(e);
              }}
              placeholder="Select Status"
              showSearch
            >
              <Select.Option value="">Select Status</Select.Option>
              <Select.Option value='Requested'>Requested</Select.Option>
              <Select.Option value='Approved'>Approved</Select.Option>
              <Select.Option value='Rejected'>Rejected</Select.Option>
              <Select.Option value='Completed'>Completed</Select.Option>
            </Select>
          </div>
          <div className="flex justify-end items-center">
            <button
              onClick={() => {
                navigate("/admin/resignation/create");
              }}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Add Resignation</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap">Title</th>
                <th className="p-2 whitespace-nowrap">Employee Name</th>
                <th className="p-2 whitespace-nowrap">Description</th>
                <th className="p-2 whitespace-nowrap">Apply Date</th>
                <th className="p-2 whitespace-nowrap">Notice Period(days)</th>
                <th className=" p-2 whitespace-nowrap">
                  Created At
                </th>
                <th className=" p-2 whitespace-nowrap">
                  Created By
                </th>
                <th className="p-2 whitespace-nowrap">Status</th>
                <th className="p-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {resignationData && resignationData?.length > 0 ? (
                  resignationData?.map((element, index) => (
                    <React.Fragment key={element._id}>
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} text-[14px] border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="whitespace-nowrap p-2">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="whitespace-nowrap p-2">{element?.title}</td>
                        <td className="whitespace-nowrap p-2">{element?.employeName ?? "-"}</td>
                        <td className="whitespace p-2">{element?.description}</td>
                        <td className="whitespace-nowrap p-2">{moment(element?.applyDate).format("DD-MM-YYYY hh:mm a")}</td>

                        <td className="whitespace-nowrap p-2">{element?.noticePeriod}</td>
                        <td className="whitespace-nowrap p-2">{moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}</td>
                        <td className="whitespace-nowrap p-2">{element?.createdBy}</td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          <span
                            className={`${element?.status ? "bg-[#E0FFBE] border-green-500" : "bg-red-200 "} border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap p-2">
                          <span className="py-1.5 flex justify-start items-center space-x-2.5">
                            <Tooltip placement="topLeft"  title={``}>
                              <button
                                onClick={() => handleStatusUpdate(element, "Rejected")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                                disabled={element?.status !== "Requested"}

                              >
                                <MdRemoveCircle
                                  className={element?.status === "Requested" ? "hover:text-red-500 text-red-500" : "text-gray-500"}
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                            <Tooltip placement="topLeft"  title={``}>
                              <button

                                onClick={() => handleStatusUpdate(element, "Approved")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                                disabled={element?.status !== "Requested"}

                              >
                                <BsPassFill
                                  className={element?.status === "Requested" ? "hover:text-teal-500 text-teal-500" : "text-gray-500"}
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                            <Tooltip placement="topLeft"  title={``}>
                              <button
                                onClick={() => handleStatusUpdate(element, "Completed")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                                disabled={element?.status !== "Approved"}

                              >
                                <MdBookmarkAdded
                                  className={(element?.status !== "Approved") ? "!text-gray-500" : " hover:text-green-500 text-green-500"}
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                            <Tooltip placement="topLeft"  title='Edit'>
                              <button
                                onClick={() => {
                                  navigate(`/admin/resignation/edit/${encrypt(element?._id)}`);
                                }}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <FaPenToSquare className="hover:text-[#337ab7] text-[#3c8dbc]" size={16} />
                              </button>
                            </Tooltip>
                            {/* <Tooltip placement="topLeft"  title='View Details'>
                                  <button
                                    onClick={() => openModal(element)}
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <CgEyeAlt className="text-cyan-600 hover:text-cyan-500" size={16} />
                                  </button>
                                </Tooltip> */}
                            <Tooltip placement="topLeft"  title='Delete'>
                              <button
                                onClick={() => handleDelete(element?._id)}
                                className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <RiDeleteBin5Line className="text-red-600 hover:text-red-500" size={16} />
                              </button>
                            </Tooltip>
                          </span>
                        </td>

                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td colSpan={6} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        {resignationData?.length > 0 &&
          <CustomPagination
            totalCount={totalresignCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}
      </div>

      {modalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1501]" onClick={closeModal}>
          <div className="animate-slideInFromTop bg-white rounded-lg px-6 pt-6 pb-3 w-[800px] max-h-[70vh] overflow-y-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="mt-4">
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }}></div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-header rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </GlobalLayout>
  );
}
export default ResignationList;
