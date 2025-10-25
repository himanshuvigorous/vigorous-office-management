import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";

import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, showSwal, } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { CgComment } from "react-icons/cg";
import { Modal, Select, Tooltip, Dropdown } from "antd";
import getUserIds from "../../../../constents/getUserIds";

import { BsPassFill } from "react-icons/bs";
import { MdBookmarkAdded, MdRemoveCircle } from "react-icons/md";
import moment from "moment";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { getTerminationList } from "./terminationFeatures/termination_reducers";
import { deleteResignFunc, statusResignFunc } from "../resignation/resignationFeatures/resignation_reducers";
import { FaFilePdf, FaImages, FaRegFileImage } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";

import CommonImageViewer from "../../../../global_layouts/ImageViewrModal/CommonImageViewer";
import usePermissions from "../../../../config/usePermissions";


function TerminationList() {
  const { register, control, setValue, formState: { errors } } = useForm();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const { userCompanyId, userBranchId, userType } = getUserIds();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { TerminationData, totalTerminationCount, loading } = useSelector((state) => state.Termination);
  // const [status, setStatus] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );


  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    Termination: {}
  })

  
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
 
      const [searchParams, setSearchParams] = useSearchParams();
      const initialPage = parseInt(searchParams.get("page")) || 1;
      const initialLimit = 10;
      const initialBranchId = searchParams.get("branchId")|| "";
      const initialStatus = searchParams.get("status")|| ""; 
    
      const [currentPage, setCurrentPage] = useState(initialPage);
      const [limit, setLimit] = useState(initialLimit);
      const [status, setStatus] = useState(initialStatus);
      const [searchText, setSearchText] = useState("");
      const [branchId, setBranchId] = useState(initialBranchId);
    
      useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (branchId) params.set("branchId", branchId);
        if (status) params.set("status", status);
        setSearchParams(params);
      }, [branchId, status,currentPage, searchText, ]);
      useEffect(() => {
        getTerminationRequest();
      }, [branchId, status, currentPage, searchText, ]);
    
      const handleResetFilters = () => {
        setCurrentPage(1);
        setBranchId("");
        setStatus("");
        setSearchText("");
      };
      const onChange = (e) => {
        setSearchText(e);
      };
    
      const onPaginationChange = (page) => setCurrentPage(page);
      const handleBranchChange = (value) => {
        setBranchId(value);
        setCurrentPage(1);
      };
    
     
      const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
      };
      
        
  


  const getTerminationRequest = () => {
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
        type: "termination"
      }
    };
    dispatch(getTerminationList(data));
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
          getTerminationRequest()
            if (currentPage > 1 && TerminationData?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        getTerminationRequest();    
          } 
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

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleStatusUpdate = (element, status) => {
    Swal.fire({
      title: 'Provide feedback & date',
      input: 'textarea',
      inputLabel: 'Feedback (optional)',
      inputPlaceholder: 'Type your feedback here...',
      showCancelButton: true,
      confirmButtonText: `Update as ${status}`,
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Feedback cannot be empty';
        }
        return null;
      },
      html: status === 'Approved'
        ? `
          <div style="margin-top: 1rem;">
            <label for="custom-date-picker">Select Date:</label>
            <input 
    type="date" 
    id="custom-date-picker" 
    min="${moment().format('YYYY-MM-DD')}"
    style="
      width: 100%;
      margin-top: 0.5rem;
      padding: 4px 11px;
      height: 40px;
      font-size: 14px;
      line-height: 1.5715;
      color: rgba(0, 0, 0, 0.85);
      background-color: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      transition: all 0.3s;
      box-sizing: border-box;
    "
  />
          </div>`
        : '',
      preConfirm: () => {
        const popup = Swal.getPopup();
        const feedback = popup.querySelector('textarea')?.value.trim();
        const selectedDate = popup.querySelector('#custom-date-picker')?.value;

        if (!feedback) {
          Swal.showValidationMessage('Feedback is required');
          return false;
        }

        if (!selectedDate && status === 'Approved') {
          Swal.showValidationMessage('Please select a future date');
          return false;
        }

        const currentDate = moment().format('YYYY-MM-DD');
        if (selectedDate <= currentDate) {
          Swal.showValidationMessage('The selected date must be in the future');
          return false;
        }

        return { feedback, date: selectedDate };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { feedback, date } = result.value;
        dispatch(
          statusResignFunc({
            _id: element?._id,
            status: status,
            reason: feedback,
            approvalDate: status === 'Approved' ? date : status === 'Completed' ? element?.approvalDate : '',
          })
        ).then((data) => {
          if (!data?.error) {
            getTerminationRequest();
            Swal.fire('Success', 'Status updated', 'success');
          }
        });
      }
    });
  };

  

  const isPDF = (filename) => filename?.toLowerCase().endsWith(".pdf");
  const isImage = (filename) =>
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"].some(ext =>
      filename?.toLowerCase().endsWith(ext)
    );

  return (
    <GlobalLayout onChange={onChange}>

      <Modal
        className="antmodalclassName"
        title={`Attached Docs	For ${modal?.data?.employeName}`}
        width={1000}
        footer={false}
        open={modal.isOpen}
        onOk={() => setModal({ open: false, data: {} })}
        onCancel={() => setModal({ open: false, data: {} })}
      >
        <table className="w-full max-w-full rounded-xl">
          <thead>          
          </thead>
          <tbody>
            <tr>
              <td className="whitespace-nowrap text-center p-2">
           
                <div className="flex flex-col space-y-4">
                  {modal?.data?.attachment && Array.isArray(modal?.data?.attachment) ? (
                    modal.data.attachment.map((file, fileIndex) => {
                      const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;

                      if (isImage(file)) {
                        return (
                          <div key={fileIndex} className="flex items-center gap-2">
                            <p className="font-[500] text-[12px] text-black">({fileIndex + 1})</p>
                            <CommonImageViewer
                              src={url}
                              alt={`Uploaded ${fileIndex + 1}`}
                            />
                          </div>
                        );
                      } else if (isPDF(file)) {
                        return (
                          <Tooltip placement="topLeft"  title={`PDF Attachment ${fileIndex + 1}`} key={fileIndex}>
                            <div className="flex items-center gap-2">
                              <p className="font-[500] text-[12px] text-black">({fileIndex + 1})</p>
                              <button
                                onClick={() => window.open(url, "_blank")}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                                type="button"
                              >
                                <FaFilePdf className="text-red-600 hover:text-red-700" size={26} />
                              </button>
                            </div>
                          </Tooltip>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : modal?.data?.attachment ? (
                    (() => {
                      const file = modal.data.attachment;
                      const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;

                      if (isImage(file)) {
                        return (
                          <CommonImageViewer
                            src={url}
                            alt="Uploaded Image"
                          />
                        );
                      } else if (isPDF(file)) {
                        return (
                          <Tooltip placement="topLeft"  title="PDF Attachment">
                            <button
                              onClick={() => window.open(url, "_blank")}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted hover:border-gray-800"
                              type="button"
                            >
                              <FaFilePdf className="text-red-600 hover:text-red-700" size={26} />
                            </button>
                          </Tooltip>
                        );
                      } else {
                        return null;
                      }
                    })()
                  ) : (
                    <span className="text-gray-600 text-sm text-center">No File Attached</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>


      <div className="">
        <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
          <div className="sm:flex items-center sm:space-x-2">
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
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
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
              <div className='flex justify-center sm:mb-0 mb-1 items-center space-x-2 text-[14px] rounded-md'>

                {/* <select
                      {...register("PDBranchId")}
                      className="bg-white focus:outline-none"
                    >
                      <option className="" value="">Select Branch</option>
                      {branchList?.map((type) => (
                        <option value={type?._id}>{type?.fullName}</option>
                      ))}
                    </select> */}
             
                    <Select
               
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
                      value={branchId}
                      onChange={handleBranchChange}
                      className={`${inputAntdSelectClassNameFilter} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
                    </Select>
                 
              </div>}
            {/* <Select
              className={` ${inputAntdSelectClassNameFilter} `}
              value={status}
              onChange={(e) => {
                setStatus(e);
              }}
              placeholder="Select Status"
              showSearch
              filterOption={(input, option) =>
                String(option?.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Select.Option value="">Select Status</Select.Option>
              <Select.Option value='Requested'>Requested</Select.Option>
              <Select.Option value='Approved'>Approved</Select.Option>
              <Select.Option value='Rejected'>Rejected</Select.Option>
              <Select.Option value='Completed'>Completed</Select.Option>
            </Select> */}


           
                <Select
                  defaultValue={""}
                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  value={status}
                  onChange={handleStatusChange}
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value='Requested'>Requested</Select.Option>
                  <Select.Option value='Approved'>Approved</Select.Option>
                  <Select.Option value='Rejected'>Rejected</Select.Option>
                  <Select.Option value='Completed'>Completed</Select.Option>
                </Select>
          
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
               handleResetFilters()
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
              <span className="text-[12px]">Reset</span>
            </button>
           {canCreate && <Tooltip placement="topLeft"  title="Create Termination">
              <button
                onClick={() => {
                  navigate("/admin/Termination/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Termination</span>
              </button>
            </Tooltip>}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead">Employee Name</th>
                {/* <th className="tableHead">Description</th> */}
                <th className="tableHead">Apply Date</th>
                <th className="tableHead">Notice Period(days)</th>
                {/* <th className="tableHead">Attachments</th> */}
                <th className="tableHead">Status</th>
                {/* <th className="tableHead">More</th> */}
                <th className="tableHead">Action</th>
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {TerminationData && TerminationData?.length > 0 ? (
                  TerminationData?.map((element, index) => (
                    <React.Fragment key={element._id}>
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>

                        <td className="tableData">{element?.employeName ?? "-"}</td>
                        {/* <td className="whitespace p-2">{element?.description}</td> */}
                        <td className="tableData">{moment(element?.applyDate).format("DD-MM-YYYY")}</td>
                        <td className="tableData">{element?.noticePeriod}</td>

                       

                        <td className="tableData">
                          <span
                            className={`border-[1px] px-2 py-1.5 rounded-lg text-[12px] text-black ${element?.status === "Completed"
                              ? "bg-[#E0FFBE] border-green-600"
                              : element?.status === "Requested"
                                ? "bg-blue-100 border-blue-500"
                                : element?.status === "Approved"
                                  ? "bg-yellow-100 border-yellow-500"
                                  : element?.status === "Rejected"
                                    ? "bg-red-200 border-red-500"
                                    : "bg-gray-100 border-gray-300"
                              }`}
                          >
                            {element?.status}
                          </span>
                        </td>

                    

                        <td className="tableData">
                          
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'view-doc',
                                  label: (
                                    <span
                                      onClick={() =>
                                        element?.attachment?.length > 0 &&
                                        setModal({ isOpen: true, data: element, resignation: {} })
                                      }
                                      className={`flex items-center ${element?.attachment?.length > 0
                                        ? 'text-rose-700 hover:text-rose-700'
                                        : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                      <FaImages className="mr-2" size={16} />
                                      View Document
                                    </span>
                                  ),
                                  disabled: !(element?.attachment?.length > 0),
                                },
                                {
                                  key: 'view-comment',
                                  label: (
                                    <span
                                      onClick={() =>
                                        showSwal(element?.reason || "Data not available")
                                      }
                                      className="flex items-center text-blue-800 hover:text-blue-700"
                                    >
                                      <CgComment className="mr-2" size={16} />
                                      View Comment
                                    </span>
                                  ),
                                },
                                {
                                  key: 'view-desc',
                                  label: (
                                    <span
                                      onClick={() =>
                                        showSwal(element?.description || "Data not available")
                                      }
                                      className="flex items-center text-blue-800 hover:text-blue-700"
                                    >
                                      <CgComment className="mr-2" size={16} />
                                      View Description
                                    </span>
                                  ),
                                },
                                // {
                                //   type: 'divider',
                                // },
                               canUpdate && {
                                  key: 'reject',
                                  label: (
                                    <span
                                      onClick={() => !["Completed", "Rejected", "Approved"].includes(element?.status) && handleStatusUpdate(element, "Rejected")}
                                      className={`flex items-center ${["Completed", "Rejected", "Approved"].includes(element?.status)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-500'
                                        }`}
                                    >
                                      <MdRemoveCircle className="mr-2" size={16} />
                                      Reject
                                    </span>
                                  ),
                                  disabled: ["Completed", "Rejected", "Approved"].includes(element?.status),
                                },
                              canUpdate &&  {
                                  key: 'approve',
                                  label: (
                                    <span
                                      onClick={() => !["Completed", "Rejected", "Approved"].includes(element?.status) && handleStatusUpdate(element, "Approved")}
                                      className={`flex items-center ${["Completed", "Rejected", "Approved"].includes(element?.status)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-teal-500 hover:text-teal-500'
                                        }`}
                                    >
                                      <BsPassFill className="mr-2" size={16} />
                                      Approve
                                    </span>
                                  ),
                                  disabled: ["Completed", "Rejected", "Approved"].includes(element?.status),
                                },
                             canUpdate &&   {
                                  key: 'complete',
                                  label: (
                                    <span
                                      onClick={() =>
                                        !["Completed", "Rejected", "Requested"].includes(element?.status) &&
                                        handleStatusUpdate(element, "Completed")
                                      }
                                      className={`flex items-center ${["Completed", "Rejected", "Requested"].includes(element?.status)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-green-500 hover:text-green-500'
                                        }`}
                                    >
                                      <MdBookmarkAdded className="mr-2" size={16} />
                                      Complete
                                    </span>
                                  ),
                                  disabled: ["Completed", "Rejected", "Requested"].includes(element?.status),
                                },
                              canUpdate &&  {
                                  key: 'edit',
                                  label: (
                                    <span
                                      onClick={() =>
                                        !["Completed", "Rejected", "Approved"].includes(element?.status) &&
                                        navigate(`/admin/termination/edit/${encrypt(element?._id)}`)
                                      }
                                      className={`flex items-center ${["Completed", "Rejected", "Approved"].includes(element?.status)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-[#3c8dbc] hover:text-[#337ab7]'
                                        }`}
                                    >
                                      <FaPenToSquare className="mr-2" size={16} />
                                      Edit
                                    </span>
                                  ),
                                  disabled: ["Completed", "Rejected", "Approved"].includes(element?.status),
                                },
                            canDelete &&    {
                                  key: 'delete',
                                  label: (
                                    <span
                                      onClick={() =>
                                        !["Completed", "Rejected", "Approved"].includes(element?.status) &&
                                        handleDelete(element?._id)
                                      }
                                      className={`flex items-center ${["Completed", "Rejected", "Approved"].includes(element?.status)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-red-600 hover:text-red-500'
                                        }`}
                                    >
                                      <RiDeleteBin5Line className="mr-2" size={16} />
                                      Delete
                                    </span>
                                  ),
                                  disabled: ["Completed", "Rejected", "Approved"].includes(element?.status),
                                },
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft"  title="More Actions">
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <PiDotsThreeOutlineVerticalBold
                                  className="hover:text-[#337ab7] text-[#3c8dbc]"
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                          </Dropdown>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td colSpan={6} className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        {TerminationData?.length > 0 &&
          <CustomPagination
            totalCount={totalTerminationCount}
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
export default TerminationList;
