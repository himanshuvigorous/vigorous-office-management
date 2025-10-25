import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa6";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  getLeaveRequestList,
  updateLeaveRequestStatus,
} from "./LeaveRequestFeatures/_leave_request_reducers";
import { domainName, inputClassNameSearch, showSwal, sortByPropertyAlphabetically } from "../../../../constents/global";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import CreateLeaveRequestModal from "./CreateLeaveRequestModal";
import { FaCheck, FaFilePdf, FaImages } from "react-icons/fa";
import moment from "moment";
import EditLeaveRequestModal from "./EditLeaveRequestModal";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select, Tooltip, Dropdown, Modal } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { CgComment } from "react-icons/cg";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import CommonImageViewer from "../../../../global_layouts/ImageViewrModal/CommonImageViewer";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

function LeaveRequestList() {
  const { employeList } = useSelector((state) => state.employe);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      status: 'Pending'
    }
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaveRequestData, totalLeaverequestCount, loading } = useSelector((state) => state.leaveRequest);
  const { companyList } = useSelector((state) => state.company);


  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    leaveRequest: {}
  })

  const startDate = useWatch({
    control,
    name: "startDate",
    defaultValue: "",
  });
  const endDate = useWatch({
    control,
    name: "endDate",
    defaultValue: "",
  });

  const { branchList } = useSelector(
    (state) => state.branch
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const department = useWatch({
    control,
    name: "department",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const status = useWatch({
    control,
    name: "status",
    defaultValue: "Pending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [editModalId, setEditModalId] = useState(null);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const employeeId = useWatch({
    control,
    defaultValue: '',
    name: 'employeeId',


  })

  const limit = 10;
  const [searchText, setSearchText] = useState("");

  const filters = [CompanyId, BranchId, searchText, status, startDate, endDate, employeeId, department].join("-");
  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      getLeaveRequestListRequest();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  useEffect(() => {
    getLeaveRequestListRequest();
  }, [currentPage]);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType)
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: '',
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: true,
        isDirector: false,
      })
    )
  };

  const getLeaveRequestListRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        text: searchText,
        employeId: employeeId,
        departmentId: department,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : '',
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : '',
        sort: true,
        status: status,
        isPagination: true,
      },
    };
    dispatch(getLeaveRequestList(data));
  };
  const handleApprove = (id) => {
    Swal.fire({
      title: 'Approve Leave Request',
      input: 'textarea',
      inputLabel: 'Optional Remark',
      inputPlaceholder: 'Enter a remark (optional)...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateLeaveRequestStatus({
          _id: id,
          status: 'Approved',
          remark: result.value?.trim() || ''
        })).then((data) => {
          if (!data?.error) {
            getLeaveRequestListRequest();
            Swal.fire('Approved!', 'The leave request has been approved.', 'success');
          }
        });
      }
    });
  };



  const handleReject = (id) => {
    Swal.fire({
      title: 'Reject Leave Request',
      input: 'textarea',
      inputLabel: 'Reason for Rejection',
      inputPlaceholder: 'Enter your remarks here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && result.value.trim() !== '') {
        dispatch(updateLeaveRequestStatus({
          _id: id,
          status: 'Rejected',
          remark: result.value.trim()
        })).then(() => {
          getLeaveRequestListRequest();
          Swal.fire('Rejected!', 'The leave request has been rejected.', 'success');
        });
      } else if (result.isConfirmed) {
        Swal.fire('Error', 'Please provide a remark before rejecting.', 'error');
      }
    });
  };


  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const isPDF = (filename) => filename?.toLowerCase().endsWith(".pdf");
  const isImage = (filename) =>
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"].some(ext =>
      filename?.toLowerCase().endsWith(ext)
    );

  const onChange = (e) => {

    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>

      <>
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
                            <Tooltip placement="topLeft"  title="PDF Attachment" >
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
          <div class="2xl:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto gap-1">
            <div className="grid sm:grid-cols-4 grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 sm:gap-3 gap-1">
              {userInfoglobal?.userType === "admin" &&
                <div className="">
                  {/* <select
                   {...register("PDCompanyId", {
                     required: "company is required",
                   })}
                   className={` ${inputClassNameSearch} ${errors.PDCompanyId
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
                        className={`${inputClassNameSearch} `}
                        showSearch
                        disabled={loading}
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
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>}
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
                <div className="">
                  {/*             
             <select
               {...register("PDBranchId", {
                 required: "Branch is required",
               })}
               className={` ${inputClassNameSearch} ${errors.PDBranchId
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
             </select> */}
                  <Controller
                    control={control}
                    name="PDBranchId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        // onFocus={() => {
                        //   dispatch(
                        //     branchSearch({
                        //       text: "",
                        //       sort: true,
                        //       status: true,
                        //       companyId:
                        //         userInfoglobal?.userType === "admin"
                        //           ? CompanyId
                        //           : userInfoglobal?.userType === "company"
                        //             ? userInfoglobal?._id
                        //             : userInfoglobal?.companyId,
                        //     })
                        //   );
                        // }}
                        className={`inputAntdSelectClassNameFilterReport`}
                        disabled={loading}
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
                    )}
                  />
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>}
              <div className="">
                <Controller
                  name="employeeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      allowClear
                      className={`inputAntdSelectClassNameFilterReport`}
                      disabled={loading}
                      placeholder="Select Employee"
                      onFocus={handleEmployeeFocus}
                      // options={employeList?.map((element) => {
                      //   return {
                      //     label: element.fullName,
                      //     value: element._id,
                      //   }
                      // })}
                       showSearch
                       filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                    >
                      { sortByPropertyAlphabetically(employeList, 'fullName')?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        ))}
                     </Select>
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`inputAntdSelectClassNameFilterReport`}
                      disabled={loading}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onFocus={() => {
                        dispatch(
                          deptSearch({
                            text: "",
                            sort: true,
                            status: true,
                            isPagination: false,
                            companyId:
                              userInfoglobal?.userType === "admin"
                                ? CompanyId
                                : userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                            branchId: [
                              "admin",
                              "company",
                              "companyDirector",
                            ].includes(userInfoglobal?.userType)
                              ? BranchId
                              : userInfoglobal?.userType === "companyBranch"
                                ? userInfoglobal?._id
                                : userInfoglobal?.branchId,
                          })
                        );
                      }}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="Select Department"
                    >
                      <Select.Option value="">Select Department</Select.Option>
                      {depLoading ? (
                        <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>
                      ) : (
                        sortByPropertyAlphabetically(departmentListData)?.map(
                          (element) => (
                            <Select.Option key={element?._id} value={element?._id}>
                              {element?.name}
                            </Select.Option>
                          )
                        )
                      )}
                    </Select>
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker size={"middle"} disabled={loading} report={true} field={field} errors={errors} />
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="endDate"
                  control={control}
                  className={`inputAntdSelectClassNameFilterReport`}
                  render={({ field }) => (
                    <CustomDatePicker size={"middle"} disabled={loading} report={true} field={field} errors={errors} />
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="status"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`inputAntdSelectClassNameFilterReport`}
                      placeholder="Select Status"
                      disabled={loading}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value="Pending"> Pending </Select.Option>
                      <Select.Option value="Approved"> Approved </Select.Option>
                      <Select.Option value="Rejected"> Rejected </Select.Option>
                    </Select>
                  )}
                />
              </div>
              {/* <button
                onClick={() => {
                  setValue("PDBranchId", '')
                  setValue("PdCompanyId", "")
                  setValue("status", "")
                }}
                className="bg-header h-8 rounded-md hidden lg:flex px-2 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button> */}
            </div>
            <div className="2xl:flex hidden justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", '')
                  setValue("PdCompanyId", "")
                  setValue("endDate", "")
                  setValue("startDate", "")
                  setValue("status", "")
                  setValue("department", "")
                  setValue("employeeId", "")
                }}
                className="bg-header  py-1.5 my-0.5 rounded-md flex px-10 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
              {(canCreate) && <Tooltip placement="topLeft"  title='Add Leave Request'>
                <button
                  onClick={() => {
                    // navigate("/admin/leave-request-list/create");
                    setIsCraeteModalOpen(true);
                  }}
                  className="bg-header px-2 py-1.5 w-44 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Leave Request</span>
                </button>
              </Tooltip>}
            </div>
          </div>
          <div className="flex 2xl:hidden justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", '')
                setValue("PdCompanyId", "")
                setValue("endDate", "")
                setValue("startDate", "")
                setValue("status", "")
                setValue("department", "")
                setValue("employeeId", "")

              }}
              className="bg-header  py-1.5 my-0.5 rounded-md flex px-10 justify-center items-center  text-white">
              <span className="text-[12px]">Reset</span>
            </button>
            {(canCreate) && <Tooltip placement="topLeft"  title='Add Leave Request'>
              <button
                onClick={() => {
                  // navigate("/admin/leave-request-list/create");
                  setIsCraeteModalOpen(true);
                }}
                className="bg-header px-2 py-1.5 w-44 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Leave Request</span>
              </button>
            </Tooltip>}
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[5%]">S.No.</th>
                <th className="tableHead">Name</th>
                <th className="tableHead">Department </th>
                {/* <th className="tableHead">Reason</th> */}
                <th className="tableHead">Requested days</th>
                <th className="tableHead">from date</th>
                <th className="tableHead">from date Type</th>
                <th className="tableHead">to date</th>
                <th className="tableHead">to date Type</th>

                <th className="tableHead">Requested At</th>
                <th className="tableHead">Approved By</th>
                <th className="tableHead">Approved Date</th>

                {/* <th className="tableHead">Remark</th> */}
                <th className="tableHead">Status</th>
                {canUpdate && <th className="tableHead w-[10%]">Action</th>}
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
                {leaveRequestData && leaveRequestData?.length > 0 ? (
                  leaveRequestData?.map((element, index) => (
                    <tr
                      key={element?._id}
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="tableData">
                        {element?.employeName}
                      </td>
                      <td className="tableData">
                        {element?.employeData?.departmentName}
                      </td>
                      {/* <td className="tableData">
                        {element?.reason}
                      </td> */}
                      <td className="tableData">
                        {element?.requestDays}
                      </td>
                      <td className="tableData">
                        {moment(element?.startDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="tableData">
                        {element?.type === "Single" ? element?.subType : element?.startDateBreakDown}
                      </td>
                      <td className="tableData">
                        {moment(element?.endDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="tableData">
                        {element?.type === "Single" ? element?.subType : element?.endDateBreakDown}
                      </td>
                      <td className="tableData">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}
                      </td>
                      <td className="tableData">
                        {element?.status !== 'Pending' ? element?.updatedBy : '-'}
                      </td>
                      <td className="tableData">
                        {element?.status !== 'Pending' ? dayjs(element?.updatedAt).format('DD-MM-YYYY hh:mm a') : '-'}
                      </td>


                      <td className="tableData">
                        <Tooltip placement="topLeft"  title={`leave Status - ${element?.status}`}>
                          <span
                            className={`${element?.status === "Approved"
                              ? "bg-green-200 border-green-500 text-black"
                              : element?.status === "Pending"
                                ? "bg-yellow-200 border-yellow-500 text-black"
                                : element?.status === "Rejected"
                                  ? "bg-red-200 border-red-500 text-black"
                                  : element?.status === "Cancelled"
                                    ? "bg-gray-200 border-gray-500 text-black"
                                    : "bg-gray-200 border-gray-500 text-black"
                              } border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                          >
                            {element?.status ? element.status : "-"}
                          </span>
                        </Tooltip>
                      </td>

                      {canUpdate &&
                        <td className="tableData">

                          {canUpdate && (
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: 'view-doc',
                                    label: (
                                      <span
                                        onClick={() =>
                                          element?.attachment?.length > 0 &&
                                          setModal({ isOpen: true, data: element, leaveRequest: {} })
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
                                  {
                                    key: 'edit',
                                    label: (
                                      <span
                                        onClick={() => {
                                          if (element?.status === "Pending") {
                                            setisEditModalOpen(true);
                                            setEditModalId(element?._id);
                                          }
                                        }}
                                        className={`flex items-center ${element?.status === "Pending"
                                          ? 'text-[#3c8dbc] hover:text-[#337ab7]'
                                          : 'text-gray-400 cursor-not-allowed'
                                          }`}
                                      >
                                        <FaPenToSquare className="mr-2" size={16} />
                                        Edit Request
                                      </span>
                                    ),
                                    // disabled: element?.status !== "Pending",
                                  },
                                  {
                                    key: 'reject',
                                    label: (
                                      <span
                                        onClick={() => {
                                          // if (element?.status === "Pending") {
                                            handleReject(element?._id);
                                          // }
                                        }}
                                        className={`flex items-center text-red-600 hover:text-red-500 `}
                                      >
                                        <RiDeleteBin5Line className="mr-2" size={16} />
                                        Reject Request
                                      </span>
                                    ),
                                    // disabled: element?.status !== "Pending",
                                  },
                                  {
                                    key: 'approve',
                                    label: (
                                      <span
                                        onClick={() => {
                                          // if (element?.status === "Pending") {
                                            handleApprove(element?._id);
                                          // }
                                        }}
                                        className={`flex items-center text-green-600 hover:text-green-500`}
                                      >
                                        <FaCheck className="mr-2" size={16} />
                                        Approve Request
                                      </span>
                                    ),
                                    // disabled: element?.status !== "Pending",
                                  },
                                ],
                              }}
                              trigger={['click']}
                            >
                              <Tooltip placement="topLeft"  title="Actions">
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
                          )}

                        </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={13}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-center text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>}
        </div>
        <CustomPagination
          totalCount={totalLeaverequestCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        <CreateLeaveRequestModal
          isOpen={isCraeteModalOpen}
          onClose={() => setIsCraeteModalOpen(false)}
          fetchattendanceListData={getLeaveRequestListRequest}

        />
        <EditLeaveRequestModal
          isOpen={isEditModalOpen}
          onClose={() => { setisEditModalOpen(false); setEditModalId(null) }}
          leaveRequestId={editModalId}
          fetchattendanceListData={getLeaveRequestListRequest}

        />

      </>

    </GlobalLayout >
  );
}
export default LeaveRequestList;