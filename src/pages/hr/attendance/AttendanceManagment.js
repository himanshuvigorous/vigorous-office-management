import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import {
  FaAngleUp,
  FaAngleDown,
} from "react-icons/fa";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import moment from "moment/moment";
import { convertMinutesToHoursAndMinutes, domainName, handleSortLogic, inputAntdSelectClassNameFilter } from "../../../constents/global";
import { getattendanceListForEmployee, } from "./AttendanceFeatures/_attendance_reducers";
import dayjs from "dayjs";
import { Select, Tooltip } from "antd";
import ManualEmployeeAttendanceModal from "./ManualEmployeeAttendanceModal";
import usePermissions from "../../../config/usePermissions";
import { Controller, useForm, useWatch } from "react-hook-form";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import ListLoader from "../../../global_layouts/ListLoader";

function AttendanceManagment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { attendanceListForEmployee, totalattendancegCountForEmployee, loading } =
    useSelector((state) => state.attendance);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [debouncedFilterText, setDebouncedFilterText] = useState(filterText);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const { control, setValue, formState: { errors }, } = useForm();

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
    const status = useWatch({
    control,
    name: "status",
    defaultValue: ["present"],
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filterText]);


  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const pageSize = 30;

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (userInfoglobal?.userType === "employee" && userInfoglobal?._id) {

      fetchattendanceListData(debouncedFilterText);
    }
  }, [currentPage, debouncedFilterText, searchText, status, startDate, endDate]);
  const fetchattendanceListData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        shift: "",
        workType: "",
        text: searchText,
        status: '',
        isPresentDay: status ? status : '',
        sort: true,
        startDate: startDate ? dayjs(startDate)?.format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate)?.format("YYYY-MM-DD") : null,
        isPagination: true,
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        employeId:
          userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
      },
    };
    dispatch(getattendanceListForEmployee(reqData));
  };


  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [sortedList, setSortedList] = useState([]);

  useEffect(() => {

    if (attendanceListForEmployee) {
      handleSort();
    }
  }, [attendanceListForEmployee]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, attendanceListForEmployee);
    setSortedList(sortedList);
  };
  const onChange = (e) => {

    setSearchText(e);
  };


  if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    );
  }


  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1 mt-3">
        <div className="">
          <div className="xl:flex justify-between items-center md:space-y-0 space-y-1.5 py-1">
            <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-1.5">

              <div>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      report={true}
                      defaultValue={dayjs().subtract(1, 'month')}
                      size={"middle"} field={field} errors={errors} />
                  )}
                />
              </div>
              <Controller
                name="status"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                     mode="multiple"
                    className={` inputAntdMultiSelectClassNameFilterReport ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Status"
                    defaultValue={'present'}
                    showSearch
                  >
                    <Select.Option value="">Select Status</Select.Option>

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


              <div>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker report={true}
                      defaultValue={dayjs()}
                      size={"middle"} field={field} errors={errors} />
                  )}
                />
              </div>
            </div>
            {/* <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("status", "");
                  setValue("isVerified", "");
                  setValue("startDate", dayjs());
                  setValue("endDate", dayjs());
                }}
                className="bg-header py-[5px] rounded-md flex px-5 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && <Tooltip placement="topLeft"  title="Add Manual Attendence">
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Manual Attendance</span>
                </button>
              </Tooltip>}
            </div> */}

          </div>
          <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("status", ['present']);
                  setValue("isVerified", "");
                  setValue("startDate", dayjs());
                  setValue("endDate", dayjs());
                }}
                className="bg-header py-[5px] rounded-md flex px-5 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && <Tooltip placement="topLeft"  title="Add Manual Attendence">
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Manual Attendance</span>
                </button>
              </Tooltip>}
            </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                <th className="tableHead w-[5%]">
                  S.No.
                </th>
                <th className="tableHead ">
                  <div className="flex justify-start items-center gap-1">
                    Attendance Date
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("attendanceDate", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("attendanceDate", "desc")}
                      />
                    </div>
                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex gap-1">
                    Check-In Time

                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("checkInTime", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("checkInTime", "desc")}
                      />
                    </div>
                  </div>

                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Check-Out Time

                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("checkOutTime", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("checkOutTime", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Worked Hours (HH:MM)
                  </div>
                </th>
                <th className="tableHead">
                  Pending Hours (HH:MM)
                </th>
                <th className="tableHead">
                  Overtime Hours (HH:MM)
                </th>
                <th className="tableHead">Is WFH</th>
                <th className="tableHead">Status</th>
                <th className="tableHead">Is Verified</th>
              </tr>
            </thead>
            {loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <ListLoader />
                </td>
              </tr>
            ) : <tbody>
              {sortedList && sortedList?.length > 0 ? (
                sortedList?.map((element, index) => (
                  <tr
                    className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151]`}
                  >
                    <td className="tableData">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>

                    <td className="tableData">
                      {moment(element.attendanceDate).format("DD-MM-YYYY")}
                    </td>
                    <td className="tableData">
                      {element.checkInTime
                        ? dayjs(element.checkInTime).format('DD-MM-YYYY hh:mm A')
                        : "-"}
                    </td>
                    <td className="tableData">
                      {element.checkOutTime
                        ? dayjs(element.checkOutTime).format('DD-MM-YYYY hh:mm A')
                        : "-"}
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
                    </td>
                    <td className="tableData">{element.status ? "Yes" : 'No'}</td>
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
        </div>
        <CustomPagination
          totalCount={totalattendancegCountForEmployee}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        {isManualModalOpen && (
          <ManualEmployeeAttendanceModal
            isOpen={true}
            onClose={() => setIsManualModalOpen(false)}

            fetchattendanceListData={fetchattendanceListData}
          />
        )}
      </div>
    </GlobalLayout>
  );
}

export default AttendanceManagment;
