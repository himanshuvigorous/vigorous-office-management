import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

import { RiDeleteBin5Line } from "react-icons/ri";

import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import moment from "moment/moment";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
  inputAntdSelectClassNameFilter,
  showSwal,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import {

  attendanceStatus,
  deleteattendanceg,
  getattendancegList,
} from "./AttendanceFeatures/_attendance_reducers";
import ManualAttendanceModal from "./ManualAttendanceModal";
import UpdateManualAttendanceModal from "./UpdateManualAttendanceModal ";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Select, Tooltip, Dropdown, Modal } from "antd";
import dayjs from "dayjs";
import { MdDoneAll } from "react-icons/md";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { PiDotsThreeOutlineVerticalBold } from 'react-icons/pi';
import { CgComment } from "react-icons/cg";
import { IoPersonSharp } from "react-icons/io5";
import { AiOutlineTags } from "react-icons/ai";

import { GoogleMap, Marker, } from '@react-google-maps/api';
import ListLoader from "../../../global_layouts/ListLoader";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";

function HrAttendanceManagment() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attendanceList, totalattendancegCount, loading } = useSelector(
    (state) => state.attendance
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [debouncedFilterText, setDebouncedFilterText] = useState(filterText);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isManualUpdateModalOpen, setIsManualUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const pageSize = 10;
  const { companyList } = useSelector((state) => state.company);
  const { employeList, laoding: employeelistLoading } = useSelector((state) => state.employe);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const employeeId = useWatch({
    control,
    name: "employeeId",
    defaultValue: "",
  });
  const Status = useWatch({
    control,
    name: "status",
    defaultValue: ["present"],
  });

  const startDate = useWatch({
    control,
    name: "startDate",
    defaultValue: dayjs(),
  });

  const endDate = useWatch({
    control,
    name: "endDate",
    defaultValue: dayjs(),
  });

  const isVerified = useWatch({
    control,
    name: "isVerified",
    defaultValue: "",
  });



  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId: userInfoglobal?.userType === "company"
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
  }

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
        dispatch(deleteattendanceg(reqData)).then((data) => {
          // fetchattendanceListData();
          if (currentPage > 1 && attendanceList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchattendanceListData();
          }
        });
      }
    });
  };



  const [empDetailModalData, setEmpDetailModalData] = useState({});
  const [empCheckInDetailModalOpen, setEmpCheckinDetailModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('')

  const handleEmployeeCheckInModal = (element, checkInOrCheckOut) => {
    setCheckIn(checkInOrCheckOut)
    setEmpCheckinDetailModalOpen(true);
    setEmpDetailModalData(element);
  };


  const handleApprove = (id) => {
    let reqData = {
      _id: id,
    };

    // Show confirmation Swal before proceeding with API call
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to Approve?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch the action to approve attendance
        dispatch(attendanceStatus(reqData)).then((data) => {
          if (!data.error) {
            // If success, show success Swal
            Swal.fire({
              title: "Approved!",
              text: "The attendance has been approved successfully.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              // Reload the attendance list
              fetchattendanceListData();
            });
          } else {
            // If error, show error Swal
            Swal.fire({
              title: "Error!",
              text: "There was an issue approving the attendance. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }).catch((error) => {
          // In case of network errors or unforeseen issues
          Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filterText]);
  useEffect(() => {
    if (CompanyId) {
      setValue("PDBranchId", "");
    }
  }, [CompanyId]);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const [searchText, setSearchText] = useState("");

  const filters = [CompanyId, debouncedFilterText, BranchId, searchText, Status, startDate, endDate, isVerified, employeeId].join("-");

  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      fetchattendanceListData();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);
  useEffect(() => {
    fetchattendanceListData(debouncedFilterText);
  }, [
    currentPage,

  ]);
  const fetchattendanceListData = (filterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        shift: "",
        workType: "",
        text: searchText,
        isPresentDay: Status,
        status: isVerified == 'true' ? true : isVerified == 'false' ? false : '',
        sort: true,
        isPagination: true,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
        employeId: employeeId ? employeeId : '',
      },
    };
    dispatch(getattendancegList(reqData));
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
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
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

  const onChange = (e) => {
    setSearchText(e);
  };


  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1 sm:space-y-[4px] space-y-1">
        <div className="2xl:flex justify-between items-center sm:space-y-[2px] space-y-1">
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 items-center py-1 text-[14px] rounded-md">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <Controller
                  name="PDCompanyId"
                  control={control}
                  rules={{
                    required: "Company is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Company"
                      disabled={loading}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyList?.map((element) => (
                        <Select.Option value={element?._id}>
                          {" "}
                          {element?.fullName}{" "}
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
              </div>
            )}
            {(userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <Controller
                    name="PDBranchId"
                    control={control}
                    rules={{
                      required: "Branch is required",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Select Branch"
                        disabled={loading}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? (<Select.Option disabled>
                          <ListLoader />
                        </Select.Option>) : (branchList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        )))}
                      </Select>
                    )}
                  />
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>
              )}


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
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }

                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  >
                    <Select.Option value="">Select Employee</Select.Option>
                    {employeelistLoading ? (<Select.Option disabled>
                      <ListLoader />
                    </Select.Option>) : (sortByPropertyAlphabetically(employeList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
            </div>
            <div className="">
              <Controller
                name="isVerified"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` w-32 ${inputAntdSelectClassNameFilter}`}
                    placeholder="Select isVerified"
                    showSearch
                    disabled={loading}
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select isVerified</Select.Option>
                    <Select.Option value="true"> Yes </Select.Option>
                    <Select.Option value='false'>No</Select.Option>
                  </Select>
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
                    mode="multiple"
                    {...field}
                    className={`   inputAntdMultiSelectClassNameFilterReport ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Status"
                    showSearch
                    disabled={loading}
                    defaultValue={"present"}
                  >
                   
                    <Select.Option value="present"> Present </Select.Option>
                    <Select.Option value="firstHalf">
                      {" "}
                      First Half{" "}
                    </Select.Option>
                    <Select.Option value="secondHalf">
                      {" "}
                      Second Half{" "}
                    </Select.Option>
                    <Select.Option value="leave">
                      {" "}
                      Leave{" "}
                    </Select.Option>
                    <Select.Option value="absent">
                      {" "}
                      Absent{" "}
                    </Select.Option>
                    <Select.Option value="off">
                      {" "}
                      OFF{" "}
                    </Select.Option>
                    <Select.Option value="holiday">
                      {" "}
                      holiday{" "}
                    </Select.Option>
                  </Select>
                )}
              />
            </div>
            <div>
              <Controller
                name="startDate"
                control={control}
                defaultValue={dayjs()}
                render={({ field }) => (
                  <CustomDatePicker
                    report={true}
                    disabled={loading}
                    size={"middle"} field={field} errors={errors} />
                )}
              />
            </div>
            <div>
              <Controller
                name="endDate"
                report={true}
                control={control}
                defaultValue={dayjs()}
                render={({ field }) => (
                  <CustomDatePicker size={"middle"}
                    disabled={loading}
                    report={true} field={field} errors={errors} />
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end items-center gap-2 ">
          <button
            onClick={() => {
              setValue("PDBranchId", "");
              setValue("PdCompanyId", "");
              setValue("status", ['present']);
              setValue("isVerified", "");
              setValue("startDate", dayjs());
              setValue("endDate", dayjs());
              setValue("employeeId", "");
            }}
            className="bg-header py-[5px] rounded-md flex px-5 justify-center items-center  text-white"
          >
            <span className="text-[12px]">Reset</span>
          </button>
          {(canCreate && canRead) &&
            <Tooltip placement="topLeft" title="Add Manual Attendence">
              <button
                onClick={() => setIsManualModalOpen(true)}

                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Manual Attendance</span>
              </button>
            </Tooltip>}
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          {canRead &&
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                  <th className="tableHead w-[5%]">
                    S.No.
                  </th>
                  <th className="tableHead w-[10%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Profile</span>
                    </div>
                  </th>
                  <th className="tableHead">
                    Employee Name
                  </th>

                  <th className="tableHead">
                    Attendance Date
                  </th>
                  <th className="tableHead">
                    Check-In Time
                  </th>
                  <th className="tableHead">
                    Check-Out Time
                  </th>
                  <th className="tableHead">
                    <div className="flex gap-1">Worked Hours (HH:MM)</div>
                  </th>
                  <th className="tableHead">
                    Pending Hours (HH:MM)
                  </th>
                  <th className="tableHead">
                    Overtime Hours (HH:MM)
                  </th>
                  <th className="tableHead">Is WFH</th>
                  <th className="tableHead">Status</th>
                  <th className="tableHead">Last Updated By</th>
                  <th className="tableHead">Is Verified</th>

                  {(canUpdate || canDelete) && <th className="tableHead w-[10%]">
                    Action
                  </th>}
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
                  {attendanceList && attendanceList?.length > 0 ? (
                    attendanceList?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * pageSize}
                        </td>

                        <td className="tableData">
                          {element.profileImage ? (
                            <img
                              alt=""
                              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                              className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                            />
                          ) : (
                            <img
                              alt=""
                              src={`/images/avatar.jpg`}
                              className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                            />
                          )}
                        </td>

                        <td className="tableData">
                          {element.employeName}
                        </td>

                        <td className="tableData">
                          {moment(element.attendanceDate).format("DD-MM-YYYY")}
                        </td>

                        <td className="tableData">
                          <div className="flex gap-2 justify-center items-center">
                            {element.checkInTime
                              ? dayjs(element.checkInTime).format("DD-MM-YYYY hh:mm A")
                              : "-"}
                            {element.checkInTime ?
                              <FaEye
                                onClick={() => handleEmployeeCheckInModal(element, 'checkin')}
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={14}
                              /> : ''}
                          </div>
                        </td>

                        <td className="tableData">
                          <div className="flex gap-2 justify-center items-center">
                            {element.checkOutTime
                              ? dayjs(element.checkOutTime).format("DD-MM-YYYY hh:mm A")
                              : "-"}
                            {element.checkOutTime ?
                              <FaEye
                                onClick={() => handleEmployeeCheckInModal(element, 'checkout')}
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={14}
                              /> : ''}
                          </div>
                        </td>

                        <td className="tableData">
                          {convertMinutesToHoursAndMinutes(element.workedHRS)}
                        </td>

                        <td className="tableData">
                          {convertMinutesToHoursAndMinutes(element.pendingHRS)}
                        </td>

                        <td className="tableData">
                          {convertMinutesToHoursAndMinutes(element.overtimeHRS)}
                        </td>



                    <td className="tableData">{element.isWFHapplied ? "Yes" : "No"}</td>

                        <td className="tableData">
                          <Tooltip placement="topLeft" title={`status - ${element.isPresentDay}`}>
                            <span
                              className={
                                (() => {
                                  switch (element.isPresentDay) {
                                    case "present":
                                      return "bg-[#E0FFBE] border-green-500"; // Green for present
                                    case "absent":
                                      return "bg-red-200 border-red-500"; // Red for absent
                                    case "leave":
                                      return "bg-yellow-300 border-yellow-500"; // Yellow for leave
                                    case "off":
                                      return "bg-gray-300 border-gray-500"; // Gray for off
                                    case "holiday":
                                      return "bg-blue-200 border-blue-500"; // Blue for holiday
                                    case "firstHalf":
                                      return "bg-orange-200 border-orange-500"; // Orange for first half
                                    case "secondHalf":
                                      return "bg-purple-200 border-purple-500"; // Purple for second half
                                    default:
                                      return "bg-white border-gray-400"; // Default case for undefined states
                                  }
                                })() +
                                " border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px] capitalize"
                              }
                            >
                              {element.isPresentDay}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="tableData">{element.updatedBy || "-"}</td>
                        <td className="tableData">{(element.status == false && element.isPresentDay=='present') ? "No" : 'Yes'}</td>

                        {(canUpdate || canDelete) &&
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2">
                              {canUpdate && <Tooltip placement="topLeft" title={(element?.status === false && element.isPresentDay=='present') ? "Approve Attendence" : "Alredy Approved"}>
                                <button
                                  disabled={element.isPresentDay !=='present' || element?.status !== false}
                                  onClick={() => handleApprove(element?._id)}
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted hover:bg-red-100"
                                  type="button"
                                >
                                  <MdDoneAll
                                    className={(element?.status === false && element.isPresentDay=='present') ? "text-cyan-600 hover:text-cyan-500" : "text-gray-400"}
                                    size={16}
                                  />
                                </button>
                              </Tooltip>}

                              <Tooltip placement="topLeft" title='More Actions'>
                                <Dropdown
                                  menu={{
                                    items: [
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
                                      canUpdate && {
                                        key: 'edit-attendance',
                                        label: (
                                          <span
                                            onClick={() => {
                                              setIsManualUpdateModalOpen(true);
                                              setUpdateId(element?._id);
                                            }}
                                            className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]"
                                          >
                                            <FaPenToSquare className="mr-2" size={16} />
                                            Edit Attendance
                                          </span>
                                        ),
                                      },
                                      canDelete && {
                                        key: 'delete-attendance',
                                        label: (
                                          <span
                                            onClick={() => handleDelete(element?._id)}
                                            className="flex items-center text-red-600 hover:text-red-500"
                                          >
                                            <RiDeleteBin5Line className="mr-2" size={16} />
                                            Delete Attendance
                                          </span>
                                        ),
                                      },
                                    ].filter(Boolean),
                                  }}
                                  trigger={['click']}
                                >
                                  <button
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <PiDotsThreeOutlineVerticalBold
                                      className="hover:text-[#337ab7] text-[#3c8dbc]"
                                      size={16}
                                    />
                                  </button>
                                </Dropdown>
                              </Tooltip>
                            </span>
                          </td>}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={15}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>}

            </table>}

          <Modal
            className="antmodalclassName sm:!w-[60%] !w-[100%] !h-[50%]"
            title={`Employee Name : ${empDetailModalData?.employeName} `}
            open={empCheckInDetailModalOpen}
            onCancel={() => setEmpCheckinDetailModalOpen(false)}
            footer={null}
          >
            <div className="flex justify-between items-center mb-4">
              <table className="w-full rounded-lg shadow-md overflow-hidden bg-white">
                <thead>
                  <tr>
                    <th className="text-header">
                      <div className="mt-2 ml-2">{` `}</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr className="hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <AiOutlineTags className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Address</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {(checkIn === 'checkin'
                          ? empDetailModalData?.checkInLocation?.address
                          : empDetailModalData?.checkOutLocation?.address) || 'N/A'}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoPersonSharp className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Distance From Branch
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {checkIn === 'checkin'
                          ? empDetailModalData?.checkInLocation?.disatnceInMeter
                          : empDetailModalData?.checkOutLocation?.disatnceInMeter}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-indigo-50">
                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <AiOutlineTags className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Latitude</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {checkIn === 'checkin'
                          ? empDetailModalData?.checkInLocation?.latitude
                          : empDetailModalData?.checkOutLocation?.latitude}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoPersonSharp className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Longitude</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {checkIn === 'checkin'
                          ? empDetailModalData?.checkInLocation?.longitude
                          : empDetailModalData?.checkOutLocation?.longitude}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md">
              {empDetailModalData && (

                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '400px'
                  }}
                  center={{
                    lat: checkIn === 'checkin'
                      ? empDetailModalData?.checkInLocation?.latitude
                      : empDetailModalData?.checkOutLocation?.latitude,
                    lng: checkIn === 'checkin'
                      ? empDetailModalData?.checkInLocation?.longitude
                      : empDetailModalData?.checkOutLocation?.longitude
                  }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lat: checkIn === 'checkin'
                        ? empDetailModalData?.checkInLocation?.latitude
                        : empDetailModalData?.checkOutLocation?.latitude,
                      lng: checkIn === 'checkin'
                        ? empDetailModalData?.checkInLocation?.longitude
                        : empDetailModalData?.checkOutLocation?.longitude
                    }}
                  />
                </GoogleMap>

              )}
            </div>

          </Modal>
        </div>
        <CustomPagination
          totalCount={totalattendancegCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
      {isManualModalOpen && (
        <ManualAttendanceModal
          isOpen={true}
          onClose={() => setIsManualModalOpen(false)}
          fetchattendanceListData={fetchattendanceListData}
        />
      )}
      {isManualUpdateModalOpen && (
        <UpdateManualAttendanceModal
          isOpen={true}
          onClose={() => setIsManualUpdateModalOpen(false)}
          updateId={updateId}
          fetchattendanceListData={fetchattendanceListData}
        />
      )}
    </GlobalLayout>
  );
}

export default HrAttendanceManagment;
