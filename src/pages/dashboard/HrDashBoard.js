import NoticeBoard from "./NoticeBoard";
import UserDetails from "./UserDetails";
// import Calendar from 'react-calendar';
import { ImArrowUpRight, ImArrowUpRight2 } from "react-icons/im";
import Calendar from "./Calendar";
import {
  MdArrowOutward,
  MdOutlineCoPresent,
  MdOutlineMan,
  MdOutlineSecurity,
  MdPayment,
  MdTune,
} from "react-icons/md";
import { Empty, Popconfirm, Tooltip } from "antd";
import { updateLeaveRequestStatus } from "../hr/leaveRequestManagment/LeaveRequestModule/LeaveRequestFeatures/_leave_request_reducers";
import {
  attendanceStatus,
  deleteattendanceg,
} from "../hr/attendance/AttendanceFeatures/_attendance_reducers";
import { domainName } from "../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { hrDashboardFunc } from "../../redux/_reducers/_dashboard_reducers";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { FaCalendarAlt, FaEdit } from "react-icons/fa";
import {
  FaHandPeace,
  FaHireAHelper,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa6";
import { RiComputerLine, RiUserSearchFill } from "react-icons/ri";
import { IoIosMan, IoMdMan } from "react-icons/io";
import dayjs from "dayjs";
import ContactPerson from "../client/clientManagement/ContactPerson";
import { TbPigMoney } from "react-icons/tb";
import { AiOutlineInteraction } from "react-icons/ai";
import moment from "moment";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../../config/Encryption";
import { statuscashbook } from "../financeManagement/cashbook/cashbookFeature/_cashbook_reducers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { dynamicSidebarSearch } from "../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import Calendar2 from "./Calendar2";
import UpdateManualAttendanceModal from "../hr/attendance/UpdateManualAttendanceModal ";
import TodoList from "../global/other/todolistManagement/TodoList";
function HrDashBoard() {
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { hrDashboardData } = useSelector((state) => state?.dashboard);
  const dispatch = useDispatch();
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [attendanceRequest, setAttendanceRequest] = useState([]);
  const [openJobPost, setOpenJobPost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHrDashboard();
    dispatch(
      dynamicSidebarSearch({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        isPagination: false,
      })
    );
  }, []);
  const [combinedData, setCombinedData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startdateCalender, setStartDateCalender] = useState(
    moment().startOf("month")
  );
  const [pendingAprrovals, setPendingAprrovals] = useState([]);
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  const [endDateCalender, setEndDateCalender] = useState(
    moment().endOf("month")
  );
  const [userDetailsData, setuserDetailsdata] = useState({
    leaveData: [],
    birthdaydata: [],
    inActiveUserToday: [],
    inActiveEmployeeToday: [],
    wfhRequestData: []
  });
  useEffect(() => {
    if (hrDashboardData) {
      const leaveData = hrDashboardData?.todayOnLeave;
      const birthdaydata = hrDashboardData?.todayBirthday;
      const inActiveUserToday = hrDashboardData?.inActiveUserToday;
      const inActiveEmployeeToday = hrDashboardData?.inActiveEmployeToday;
      const wfhRequestData = hrDashboardData?.todayWFHEmployes
      setuserDetailsdata({
        leaveData,
        birthdaydata,
        inActiveUserToday,
        inActiveEmployeeToday,
        wfhRequestData
      });
    }
  }, [hrDashboardData]);

  const groupByDateForEvent = (events) => {
    const grouped = {};

    events.forEach((event) => {
      const formattedDate = moment(event.startDate).format("YYYY-MM-DD");

      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }
      grouped[formattedDate].push(event);
    });

    return grouped;
  };
  const groupByDateForHoliday = (events) => {
    const grouped = {};

    events.forEach((event) => {
      const formattedDate = moment(event.date).format("YYYY-MM-DD");

      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }
      grouped[formattedDate].push(event);
    });

    return grouped;
  };
  useEffect(() => {
    if (hrDashboardData) {
      const eventdata = hrDashboardData?.eventData;
      const groupedEvents = groupByDateForEvent(eventdata);

      const holidayData = hrDashboardData?.holidayData;
      const groupedHolidayData = groupByDateForHoliday(holidayData);

      const combined = [];

      Object.keys(groupedEvents).forEach((date) => {
        const eventDataForDate = groupedEvents[date];
        const holidayDataForDate = groupedHolidayData[date];

        combined.push({
          date,
          events: eventDataForDate || [],
          holidays: holidayDataForDate || [],
        });
      });

      Object.keys(groupedHolidayData).forEach((date) => {
        if (!groupedEvents[date]) {
          const holidayDataForDate = groupedHolidayData[date];
          combined.push({
            date,
            events: [],
            holidays: holidayDataForDate || [],
          });
        }
      });
      setCombinedData(combined);
    }
  }, [hrDashboardData]);

  useEffect(() => {
    if (hrDashboardData) {
      let array = [];
      let AttendanceArray = [];
      let jobPostArray = [];

      hrDashboardData?.branchEmployeLeavePending?.forEach((item) => {
        item?.LeavePendingReqData?.map((leaveItem) => {
          array.push({ employeename: item?.fullName, ...leaveItem });
        });
      });
      hrDashboardData?.branchEmployeAttendance?.forEach((item) => {
        item?.checkInEmployeList?.map((leaveItem) => {
          AttendanceArray.push({ ...leaveItem });
        });
      });
      hrDashboardData?.branchRecruitment?.forEach((item) => {
        item?.jobopeningsData?.forEach((jobItem) => {
          jobItem?.jobPosts?.forEach((jobPostItem) => {
            jobPostArray.push(jobPostItem);
          });
        });
      });
      setLeaveRequest(array);
      setAttendanceRequest(AttendanceArray);
      setOpenJobPost(jobPostArray);
    }
  }, [hrDashboardData]);


  const fetchHrDashboard = () => {
    dispatch(
      hrDashboardFunc({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        // branchId: '67a5ca1e769fadae3069e42d',
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: "",
        designationId: "",
        employeId: "",
        attendanceLimit: "",
        employeLimit: "",
      })
    );
  };



  const formattedLeaveRequest = hrDashboardData?.pendingLeaveReq ? hrDashboardData?.pendingLeaveReq.map((data) => ({
    img: data?.employeProfileImage,
    fullName: data?.employename,
    checkInTime: data?.startDate,
    checkOutTime: data?.endDate,
    status: data?.status,
    type: data?.type,
    subType: data?.subType,
    formatType: "leave",
    _id: data._id,
  })) : [];


  const [selectedAttendence, setSelectedAttendence] = useState()
  const [attendenceModal, setAttendenceModal] = useState(false);



  const handleAttendenceEdit = (approval) => {
    setSelectedAttendence(approval)
    setAttendenceModal(true)
  }


  console.log(selectedAttendence)

  const QUICK_ACTIONS = [
    {
      name: "Pay Roll",
      icons: FaMoneyBillWave,
      path: `/admin/payroll-list/${encrypt(
        sidebarListData?.find((data) => data?.slug == "payroll-list")?._id
      )}`,
    },
    {
      name: "Interviews",
      icons: MdPayment,
      path: `/admin/interview/${encrypt(
        sidebarListData?.find((data) => data?.slug == "interview")?._id
      )}`,
    },
    {
      name: "Employees",
      icons: IoMdMan,
      path: `/admin/employe/${encrypt(
        sidebarListData?.find((data) => data?.slug == "employe")?._id
      )}`,
    },
    {
      name: "Events",
      icons: RiComputerLine,
      path: `/admin/event-calander/${encrypt(
        sidebarListData?.find((data) => data?.slug == "event-calander")?._id
      )}`,
    },
    {
      name: "Holiday",
      icons: FaHandPeace,
      path: `/admin/holiday-calander/${encrypt(
        sidebarListData?.find((data) => data?.slug == "holiday-calander")?._id
      )}`,
    },
    {
      name: "Resignation",
      icons: AiOutlineInteraction,
      path: `/admin/resignation/${encrypt(
        sidebarListData?.find((data) => data?.slug == "resignationt")?._id
      )}`,
    },
  ];

  const handleQuickActions = (path) => {
    navigate(path);
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate((date) => newDate);
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    setStartDateCalender(moment(startDate));
    setEndDateCalender(moment(endDate));
    fetchHrDashboard();
  };
  const nextMonth = () => {
    const newdate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate((date) => newdate);
    const startDate = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    const endDate = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);

    setStartDateCalender(moment(startDate));
    setEndDateCalender(moment(endDate));
    fetchHrDashboard();
  };
  let leaveList = userDetailsData?.leaveData?.map((item) => {
    return {
      imgUrl: item?.employeProfileImage
        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.employeProfileImage}`
        : "/images/avatar.jpg",
      name:
        item?.employename && item.employename.includes(" ")
          ? item.employename.split(" ")[0]
          : item?.employename,
      tooltip: item?.employename,
      data: item
    };
  });
  let todayWfhRequstData = userDetailsData?.wfhRequestData?.map((item) => {
    return {
      imgUrl: item?.profileImage
        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.profileImage}`
        : "/images/avatar.jpg",
      name:
        item?.fullName && item.fullName.includes(" ")
          ? item.fullName.split(" ")[0]
          : item?.fullName,
      tooltip: item?.fullName,
      hasAttendanceMarked: item?.hasAttendanceMarked,
      data: item,
    };
  })
  let birthdaydata = userDetailsData?.birthdaydata?.map((item) => {
    return {
      imgUrl: item?.profileImage
        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.profileImage}`
        : "/images/avatar.jpg",
      name:
        item?.fullName && item.fullName.includes(" ")
          ? item.fullName.split(" ")[0]
          : item?.fullName,
      tooltip: item?.fullName,
    };
  });
  let inActiveUserToday = userDetailsData?.inActiveUserToday?.map((item) => {
    return {
      imgUrl: item?.profileImage
        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.profileImage}`
        : "/images/avatar.jpg",
      name:
        item?.fullName && item.fullName.includes(" ")
          ? item.fullName.split(" ")[0]
          : item?.fullName,
      tooltip: item?.fullName,
    };
  });


  let inActiveEmployeeToday = userDetailsData?.inActiveEmployeeToday?.map((item) => {
    return {
      imgUrl: item?.profileImage
        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.profileImage}`
        : "/images/avatar.jpg",
      name:
        item?.fullName && item.fullName.includes(" ")
          ? item.fullName.split(" ")[0]
          : item?.fullName,
      tooltip: item?.fullName,
    };
  });

  const handleApproval = (e) => {
    if (e.formatType === "attendance") {
      dispatch(
        attendanceStatus({
          _id: e?._id,
        })
      ).then((data) => {
        !data?.error && fetchHrDashboard();
      });
    }
    if (e.formatType === "leave") {
      dispatch(
        updateLeaveRequestStatus({
          _id: e?._id,
          status: "Approved",
        })
      ).then((data) => {
        !data?.error && fetchHrDashboard();
      });
    }
    if (e.formatType === "cashbook") {
      dispatch(
        statuscashbook({
          _id: e?._id,
          status: "Approved",
        })
      ).then((data) => {
        !data?.error && fetchHrDashboard();
      });
    }
  };

  const handleRequestRejection = (e) => {
    ;
    if (e.formatType === "leave") {
      dispatch(
        updateLeaveRequestStatus({
          _id: e._id,
          status: "Rejected",
        })
      ).then((data) => {
        fetchHrDashboard();
      });
    }

    if (e.formatType === "attendance") {
      dispatch(
        deleteattendanceg({
          _id: e?._id,
        })
      ).then((data) => {
        !data?.error && fetchHrDashboard();
      });
    }
    if (e.formatType === "cashbook") {
      dispatch(
        statuscashbook({
          _id: e?._id,
          status: "Reject",
        })
      ).then((data) => {
        !data?.error && fetchHrDashboard();
      });
    }
  };

  return (
    <>
      <div className="block xl:flex xl:gap-5 space-y-3 xl:space-y-0 px-2 xl:h-[calc(100vh-100px)] h-[calc(95vh-90px)] ">

        <div className="xl::w-[70%] w-full xl:h-[calc(100vh-100px)] h-full  hide-scrollbar-y">
          <div className="w-full xl:hidden block">
            <UserDetails
              leaveList={leaveList}
              birthdaydata={birthdaydata}
              inActiveUserToday={inActiveUserToday}
              inActiveEmployeeToday={inActiveEmployeeToday}
              todayWfhRequstData={todayWfhRequstData}
            />
          </div>
          <div className="grid  w-full lg:grid-cols-4 gap-2 grid-cols-2">
            <div className="w-full p-3 md:h-32 rounded-xl bg-[#e3d8ff]">
              <div className="flex flex-col gap-2">
                <div className="flex  items-center justify-between">
                  <IoIosMan size={24} />
                  <div onClick={() => {
                    handleQuickActions(`/admin/leave-request-list/${encrypt(
                      sidebarListData?.find(
                        (data) => data?.slug == "employe"
                      )?._id
                    )}`)
                  }} className="h-5 rounded-full bg-white w-5 flex justify-center items-center">
                    <MdArrowOutward />
                  </div>
                </div>

                <div className="font-semibold md:text-[15px] text-[12px]">
                  Active Employees
                </div>
                <div className="font-bold md:text-[30px] text-[15px] w-full flex justify-end">
                  {hrDashboardData?.employeData?.activeEmploye ?? 0}
                </div>
              </div>
            </div>

            <div className="w-full p-3 md:h-32 rounded-xl bg-[#c0f0d2]">
              <div className="flex flex-col gap-2">
                <div className="flex  items-center justify-between">
                  <FaCalendarAlt size={24} />
                  <div onClick={() => {
                    handleQuickActions(`/admin/leave-request-list/${encrypt(
                      sidebarListData?.find(
                        (data) => data?.slug == "leave-request-list"
                      )?._id
                    )}`)
                  }} className="h-5 rounded-full bg-white w-5 flex justify-center items-center">
                    <MdArrowOutward />
                  </div>
                </div>

                <div className="font-semibold md:text-[15px] text-[12px]">
                  On Leave
                </div>
                <div className="font-bold md:text-[30px] text-[15px] w-full flex justify-end">
                  {hrDashboardData?.employeesOnLeaveCount ?? 0}
                </div>
              </div>
            </div>

            <div className="w-full p-3 md:h-32 rounded-xl bg-[#edbeae]">
              <div className="flex flex-col gap-2">
                <div className="flex  items-center justify-between">
                  <MdOutlineCoPresent size={24} />
                  <div onClick={() => {
                    handleQuickActions(`/admin/all-employee-attendance/${encrypt(
                      sidebarListData?.find(
                        (data) => data?.slug == "leave-request-list"
                      )?._id
                    )}`)
                  }} className="h-5 rounded-full bg-white w-5 flex justify-center items-center">
                    <MdArrowOutward />
                  </div>
                </div>

                <div className="font-semibold md:text-[15px] text-[12px]">
                  Present
                </div>
                <div className="font-bold md:text-[30px] text-[15px] w-full flex justify-end">
                  {hrDashboardData?.todayAttendanceSummary?.statusCounts?.present ?? 0}
                </div>
              </div>
            </div>

            <div className="w-full p-3 md:h-32 rounded-xl bg-[#bed3fe]">
              <div className="flex flex-col gap-2">
                <div className="flex  items-center justify-between">
                  <RiUserSearchFill size={24} />
                  <div onClick={() => {
                    handleQuickActions(`/admin/all-employee-attendance/${encrypt(
                      sidebarListData?.find(
                        (data) => data?.slug == "leave-request-list"
                      )?._id
                    )}`)
                  }} className="h-5 rounded-full bg-white w-5 flex justify-center items-center">
                    <MdArrowOutward />
                  </div>
                </div>

                <div className="font-semibold md:text-[15px] text-[12px]">
                  Absent
                </div>
                <div className="font-bold md:text-[30px] text-[15px] w-full flex justify-end">
                  {hrDashboardData?.todayAttendanceSummary?.statusCounts?.absent ?? 0}

                </div>
              </div>
            </div>
          </div>

          <TodoList />

          <div className="grid grid-cols-1  pt-3 md:grid-cols-[0.7fr_1.3fr] gap-6 w-full   ">
            <div className="md:min-w-[350px] min-w-full">
              {" "}
              {/* <Calendar
                combinedData={combinedData}
                currentDate={currentDate}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                companyDashboardData={hrDashboardData}
              /> */}
              <Calendar2
                combinedData={combinedData}
                currentDate={currentDate}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                companyDashboardData={hrDashboardData}
              />
            </div>

            <div className="flex w-full overflow-y-auto  mt-2 bg-white p-2.5 rounded-xl flex-col gap-2">
              <div className="flex w-full justify-between">
                <span className="text-header font-semibold text-[20px]">
                  Leave Request{" "}
                </span>
                <div
                  onClick={() => {
                    handleQuickActions(
                      `/admin/leave-request-list/${encrypt(
                        sidebarListData?.find(
                          (data) => data?.slug == "leave-request-list"
                        )?._id
                      )}`
                    );
                  }}
                  className="h-5 rounded-full bg-[#bed3fe] w-5 flex justify-center items-center"
                >
                  <MdArrowOutward />
                </div>{" "}
              </div>
              <div className="w-full flex flex-col  gap-2   rounded-lg">
                <div className=" overflow-x-auto">



                  <table className=" w-full   divide-y divide-gray-200">
                    <thead className="bg-gray-50 w-full">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y w-full  divide-gray-200">
                      {formattedLeaveRequest?.length > 0 ? (
                        formattedLeaveRequest.map((approval) => (
                          <tr key={approval._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={
                                    approval.img
                                      ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${approval.img}`
                                      : "/images/images/avatar.jpg"
                                  }
                                  className="w-8 h-8 rounded-full mr-2 ring-1 ring-amber-300"
                                  alt={approval.fullName}
                                />
                                <span className="text-sm font-medium text-gray-900">
                                  {approval.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`text-xs ${approval?.formatType === "attendance"
                                  ? "bg-blue-100 text-blue-800"
                                  : approval?.formatType === "leave"
                                    ? "bg-cyan-100 text-blue-800"
                                    : approval?.formatType === "cashbook"
                                      ? "bg-rose-100 text-blue-800"
                                      : "bg-gray-100 text-blue-800"
                                  } px-2 py-1 rounded shadow-sm shadow-black`}
                              >
                                {approval.formatType}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-500">
                                {approval.formatType === "attendance" &&
                                  approval.shift}
                                {approval.formatType === "leave" &&
                                  `${approval.type} (${approval.subType})`}
                                {approval.formatType === "cashbook" &&
                                  `₹ ${approval.amount}`}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span
                                  className={`text-xs ${approval.formatType === "attendance"
                                    ? "text-green-600"
                                    : "text-red-500"
                                    }`}
                                >
                                  {approval.checkInTime ? dayjs(approval.checkInTime).format(
                                    "YYYY-MM-DD HH:mm"
                                  ) : '-'}
                                </span>
                                {approval.formatType === "attendance" && (
                                  <span className="text-xs text-red-500">
                                    {approval.checkOutTime ? dayjs(approval.checkOutTime).format(
                                      "YYYY-MM-DD HH:mm"
                                    ) : '-'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Popconfirm
                                  title={`${approval?.formatType === "attendance"
                                    ? "Attendance"
                                    : approval?.formatType === "leave"
                                      ? "Leave"
                                      : approval?.formatType === "cashbook"
                                        ? "Cashbook"
                                        : ""
                                    }`}
                                  description={`Are you sure to Approve this ${approval?.formatType === "attendance"
                                    ? "Attendance"
                                    : approval?.formatType === "leave"
                                      ? "Leave"
                                      : approval?.formatType === "cashbook"
                                        ? "Cashbook"
                                        : ""
                                    }`}
                                  onConfirm={() => handleApproval(approval)}
                                  //onCancel={cancel}
                                  okText="Yes"
                                  cancelText="No"
                                >

                                  <button
                                    // onClick={() => handleApproval(approval)}
                                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                  >
                                    <IoCheckmark size={16} />
                                  </button>

                                </Popconfirm>

                                <Popconfirm
                                  title={`${approval?.formatType === "attendance"
                                    ? "Attendance"
                                    : approval?.formatType === "leave"
                                      ? "Leave"
                                      : approval?.formatType === "cashbook"
                                        ? "Cashbook"
                                        : ""
                                    }`}
                                  description={`Are you sure to Delete this ${approval?.formatType === "attendance"
                                    ? "Attendance"
                                    : approval?.formatType === "leave"
                                      ? "Leave"
                                      : approval?.formatType === "cashbook"
                                        ? "Cashbook"
                                        : ""
                                    }`}
                                  onConfirm={() =>
                                    handleRequestRejection(approval)
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                    <RxCross2 size={16} />
                                  </button>
                                </Popconfirm>



                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (

                        <tr >
                          <td colSpan={5}>
                            <div className="flex  justify-center items-center h-full w-full">
                              <Empty />
                            </div>
                          </td>
                        </tr>

                      )}
                    </tbody>
                  </table>


















                </div>
              </div>
            </div>

          </div>

          <div className="w-full xl:space-y-5 space-y-3  md:grid-cols-3 grid grid-cols-1 gap-5">
            <div className="flex w-full  h-[218px] mt-4 bg-white p-2.5 rounded-xl flex-col gap-2">
              <div className="flex w-full justify-between">
                <span className="text-[#F37199] font-semibold text-[20px]">
                  Hiring Application{" "}
                </span>
                <div
                  onClick={() => {
                    handleQuickActions(
                      `/admin/application/${encrypt(
                        sidebarListData?.find(
                          (data) => data?.slug == "application"
                        )?._id
                      )}`
                    );
                  }}
                  className="h-5 rounded-full bg-[#bed3fe] w-5 flex justify-center items-center"
                >
                  <MdArrowOutward />
                </div>{" "}
              </div>
              <div className="w-full flex flex-col gap-2 h-[90%] overflow-x-auto  rounded-lg">
                {hrDashboardData?.appliedApplication?.length > 0 ? hrDashboardData?.appliedApplication?.map((event) => {
                  return (
                    <div
                      key={event?._id}
                      className="grid grid-cols-[0.5fr_1.5fr_1fr] gap-2  justify-between border-b p-2 rounded-xl shadow-sm shadow-black items-center"
                    >
                      <div className="flex   justify-start items-center rounded-xl px-2 ">
                        {event.profileImage ? (
                          <img
                            alt=""
                            className="min-w-10 min-h-10  w-10 h-10 rounded-full"
                            src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${event.profileImage}`}
                          />
                        ) : (
                          <div className="min-w-9 min-h-9  w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col w-full  justify-start items-center">
                        <span className="truncate text-[12px] text-overflow:ellipsis   text-start w-full">
                          {event?.fullName}
                        </span>
                        <span className="text-[10px] w-full  text-start">
                          {event?.address?.state}
                        </span>
                      </div>

                      <div className="w-full p-1 bg-[#FFF5FD] rounded-lg  text-[13px] text-center truncate text-overflow:ellipsis">
                        {event?.designationName}
                      </div>
                    </div>
                  );
                }) : <div className="flex justify-center items-center h-full w-full">
                  <Empty />
                </div>}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="md:text-[22px] text-[16px]">Hiring Updates</div>
              <div className="w-full bg-white rounded-xl flex justify-between p-[15px]">
                <span className="text-[13px] font-semibold">
                  {" "}
                  Shortlisted Candidates
                </span>
                <div className=" flex min-h-6 min-w-6 text-[12px] rounded-full bg-[#d6f379] justify-center items-center">
                  {hrDashboardData?.applicationData?.shortlistedApplication || 0}
                </div>
              </div>
              <div className="w-full  bg-white rounded-xl flex justify-between p-[15px]">
                <span className="text-[13px] font-semibold">
                  {" "}
                  UpComming Interviews
                </span>
                <div className=" flex  min-h-6 min-w-6 text-[12px] rounded-full bg-[#edbeae]  justify-center items-center">
                  {hrDashboardData?.upcommingInterview || 0}
                </div>
              </div>
              <div className="w-full bg-white rounded-xl flex justify-between p-[15px]">
                <span className="text-[13px] font-semibold">
                  Rejected Applications
                </span>
                <div className=" flex min-h-6 min-w-6 text-[12px] rounded-full bg-red-300 justify-center items-center">
                  {hrDashboardData?.applicationData?.rejectedApplication || 0}
                </div>
              </div>
            </div>

            {/*Quick Response*/}
            <div className="w-full rounded-xl h-56 flex flex-col p-4 gap-2 bg-white">
              <div className="text-[18px]">Quick Actions</div>
              <div className="grid pt-2 overflow-auto 2xl:grid-cols-3 gap-2 grid-cols-2">
                {QUICK_ACTIONS?.map((element, index) => {
                  const IconComponent = element.icons;
                  return (
                    <div
                      key={index}
                      className="w-full bg-[#f6f4f0] rounded-lg justify-center items-center p-2 flex flex-col"
                      onClick={() => {
                        handleQuickActions(element?.path);
                      }}
                    >
                      <div>
                        <IconComponent size={20} />
                      </div>
                      <span className="text-[11px]">{element?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>


          <div className="flex w-full  mt-6 bg-white p-2.5 rounded-xl flex-col gap-2">
            <div className="flex w-full justify-between">
              <span className="text-header font-semibold text-[20px]">
                Pending Attendance{" "}
              </span>
              <div
                onClick={() => {
                  handleQuickActions(
                    `/admin/all-employee-attendance/${encrypt(
                      sidebarListData?.find(
                        (data) => data?.slug == "all-employee-attendance"
                      )?._id
                    )}`
                  );
                }}
                className="h-5 rounded-full bg-[#bed3fe] w-5 flex justify-center items-center"
              >
                <MdArrowOutward />
              </div>{" "}
            </div>
            <div className="w-full flex flex-col  gap-2   rounded-lg">
              <div className=" overflow-x-auto">



                <table className=" w-full   divide-y divide-gray-200">
                  <thead className="bg-gray-50 w-full">
                    <tr>


                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>

                      {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th> */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        check In Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        check Out Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y w-full  divide-gray-200">
                    {hrDashboardData?.pendingAttendance?.length > 0 ? (
                      hrDashboardData?.pendingAttendance?.map((approval) => (
                        <tr key={approval._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={
                                  approval.img
                                    ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${approval.employeProfileImage}`
                                    : "/images/images/avatar.jpg"
                                }
                                className="w-8 h-8 rounded-full mr-2 ring-1 ring-amber-300"
                                alt={approval.employename}
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {approval.employename}
                              </span>
                            </div>
                          </td>



                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-col">


                              <span className="text-xs text-green-500">
                                {approval.checkInTime ? dayjs(approval.checkInTime).format(
                                  "YYYY-MM-DD HH:mm"
                                ) : '-'}
                              </span>

                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-col">


                              <span className="text-xs text-red-500">
                                {approval.checkOutTime ? dayjs(approval.checkOutTime).format(
                                  "YYYY-MM-DD HH:mm"
                                ) : '-'}
                              </span>

                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Popconfirm
                                title={`${approval?.formatType === "attendance"
                                  ? "Attendance"
                                  : approval?.formatType === "leave"
                                    ? "Leave"
                                    : approval?.formatType === "cashbook"
                                      ? "Cashbook"
                                      : ""
                                  }`}
                                description={`Are you sure to Approve this ${approval?.formatType === "attendance"
                                  ? "Attendance"
                                  : approval?.formatType === "leave"
                                    ? "Leave"
                                    : approval?.formatType === "cashbook"
                                      ? "Cashbook"
                                      : ""
                                  }`}
                                onConfirm={() => handleApproval(approval)}
                                //onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >

                                <button
                                  // onClick={() => handleApproval(approval)}
                                  className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                >
                                  <IoCheckmark size={16} />
                                </button>

                              </Popconfirm>

                              <Popconfirm
                                title={`${approval?.formatType === "attendance"
                                  ? "Attendance"
                                  : approval?.formatType === "leave"
                                    ? "Leave"
                                    : approval?.formatType === "cashbook"
                                      ? "Cashbook"
                                      : ""
                                  }`}
                                description={`Are you sure to Delete this ${approval?.formatType === "attendance"
                                  ? "Attendance"
                                  : approval?.formatType === "leave"
                                    ? "Leave"
                                    : approval?.formatType === "cashbook"
                                      ? "Cashbook"
                                      : ""
                                  }`}
                                onConfirm={() =>
                                  handleRequestRejection(approval)
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <button className="p-1 rounded-full bg-red-100 text-gray-600 hover:bg-red-200">
                                  <RxCross2 size={16} />
                                </button>
                              </Popconfirm>

                              <Popconfirm
                                title={`edit`}
                                onConfirm={() =>
                                  handleAttendenceEdit(approval)
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                  <FaEdit size={16} />
                                </button>
                              </Popconfirm>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (

                      <tr >
                        <td colSpan={5}>
                          <div className="flex  justify-center items-center h-full w-full">
                            <Empty />
                          </div>
                        </td>
                      </tr>

                    )}
                  </tbody>
                </table>


















              </div>
            </div>
          </div>




          <div className="flex w-full mt-7 overflow-x-auto bg-white p-2.5 rounded-xl flex-col gap-2">
            <div className="flex w-full overflow-x-auto justify-between">
              <span className="text-header font-semibold text-[20px]">
                Visitor List{" "}
              </span>
              <div
                onClick={() => {
                  handleQuickActions(
                    `/admin/leave-request-list/${encrypt(
                      sidebarListData?.find(
                        (data) => data?.slug == "leave-request-list"
                      )?._id
                    )}`
                  );
                }}
                className="h-5 rounded-full bg-[#bed3fe] w-5 flex justify-center items-center"
              >
                <MdArrowOutward />
              </div>{" "}
            </div>
            <div className="w-full flex flex-col h-[295px] gap-2 overflow-y-auto  rounded-lg">
              <div className="  overflow-x-auto">



                <table className=" w-full  divide-y divide-gray-200">
                  <thead className="bg-gray-50 w-full">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check In Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check Out Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y w-full  divide-gray-200">
                    {hrDashboardData?.visitorlist?.length > 0 ? (
                      hrDashboardData?.visitorlist?.map((approval) => (
                        <tr key={approval?._id} className="hover:bg-gray-50">
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.name || "-"}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.checkInTime ? dayjs(approval?.checkInTime).format('DD-MM-YYYY hh:mm a') : "-"}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.checkOutTime ? dayjs(approval?.checkOutTime).format('DD-MM-YYYY hh:mm a') : "-"}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.reason || "-"}
                            </div>
                          </td>


                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          No Visitors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
          <div className="xl:hidden mt-4 block w-full">
            <NoticeBoard />
          </div>
        </div>

        <div className="xl:w-[30%] w-full xl:h-[calc(100vh-100px)] pb-5 hide-scrollbar-y ">
          <div className="w-full hidden xl:block space-y-3">
            <UserDetails
              leaveList={leaveList}
              birthdaydata={birthdaydata}
              inActiveUserToday={inActiveUserToday}
              inActiveEmployeeToday={inActiveEmployeeToday}
              todayWfhRequstData={todayWfhRequstData}
            />
            <div className="xl:block hidden w-full">
              <NoticeBoard />
            </div>
          </div>
        </div>

        {attendenceModal && <UpdateManualAttendanceModal isOpen={attendenceModal} onClose={() => setAttendenceModal(false)} fetchattendanceListData={fetchHrDashboard} updateId={selectedAttendence?._id} />}


      </div>


    </>
  );
}

export default HrDashBoard;
