import { useEffect, useState } from "react";
import { domainName } from "../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import {
  employeeDashboardFunc,
  hrDashboardFunc,
} from "../../redux/_reducers/_dashboard_reducers";
import { Empty, Flex, Popconfirm, Progress } from "antd";
import Calendar from "./Calendar";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { ImArrowUpRight2 } from "react-icons/im";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaHandPeace, FaMoneyBillWave } from "react-icons/fa6";
import { MdArrowOutward, MdPayment } from "react-icons/md";
import { IoMdMan } from "react-icons/io";
import { RiComputerLine, RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineInteraction } from "react-icons/ai";
import UserDetails from "./UserDetails";
import NoticeBoard from "./NoticeBoard";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmark } from "react-icons/io5";
import moment from "moment";
import { encrypt } from "../../config/Encryption";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { dynamicSidebarSearch } from "../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import Swal from "sweetalert2";
import { dashboardTaskReq } from "../taskManagement/addTask/addTaskFeatures/_addTask_reducers";
import { FaCheck, FaCommentDots } from "react-icons/fa";
import usePermissions from "../../config/usePermissions";
import Calendar2 from "./Calendar2";
import { employeePenaltyTypeSearch, getEmployeePenaltyList } from "../EmployeePenaltie/employeePenaltyFeatures/_employeePenalty_reducers";
import TodoList from "../global/other/todolistManagement/TodoList";

function EmployeeDashboard() {
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const navigate = useNavigate();
  const { hrDashboardData, employeeDashboardData } = useSelector(
    (state) => state?.dashboard
  );
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const [chartType, setChartType] = useState('bar');

  const [endDateCalender, setEndDateCalender] = useState(
    moment().endOf("month")
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startdateCalender, setStartDateCalender] = useState(
    moment().startOf("month")
  );
  const [combinedData, setCombinedData] = useState([]);

  const dispatch = useDispatch();
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [attendanceRequest, setAttendanceRequest] = useState([]);
  const [openJobPost, setOpenJobPost] = useState([]);
  const [userDetailsData, setuserDetailsdata] = useState({
    leaveData: [],
    birthdaydata: [],
    inActiveUserToday: [],
    inActiveEmployeToday: [],
    wfhRequestData: []
  });
  const { PageRoleData } = useSelector((state) => state.rolePermission);
  const [pendingAprrovals, setPendingAprrovals] = useState([]);
  useEffect(() => {
    if (hrDashboardData) {
      const leaveData = hrDashboardData?.todayOnLeave;
      const birthdaydata = hrDashboardData?.todayBirthday;
      const inActiveUserToday = hrDashboardData?.inActiveUserToday;
      const inActiveEmployeToday = hrDashboardData?.inActiveEmployeToday;
      const wfhRequestData = hrDashboardData?.todayWFHEmployes
      setuserDetailsdata({
        leaveData,
        birthdaydata,
        inActiveUserToday,
        inActiveEmployeToday,
        wfhRequestData
      });
    }
  }, [hrDashboardData]);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );





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

  const { employeePenaltyListData, totaemployeePenaltyCount, loading } =
    useSelector((state) => state.employeePenalty);
  const handleTaskApprove = (task, requestFor) => {
    Swal.fire({
      title: requestFor == 'forApprove' ? 'Approve Task Request' : 'Comment Request',
      input: 'textarea',
      inputLabel: requestFor == 'forApprove' ? 'Description' : 'Comment',
      inputPlaceholder: requestFor == 'forApprove' ? 'Enter a Description' : 'Enter a Comment....',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      confirmButtonText: requestFor == 'forApprove' ? 'Approve' : 'Submit',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {
        dispatch(
          dashboardTaskReq(
            {
              taskCommentId: task?._id,
              status: requestFor == 'forApprove' ? 'approved' : 'replay',
              description: result.value?.trim() || '',
              attechment: "",
              type: task?.type == 'taskReq' ? 'approvelReq' : 'commentReplay'
            }
          )).then((data) => {
            if (!data?.error) {
              dispatch(
                employeeDashboardFunc({
                  companyId: userInfoglobal?.companyId,
                  branchId: userInfoglobal?.branchId,
                  departmentId: "",
                  designationId: "",
                  employeId: userInfoglobal?._id,
                })
              )
              Swal.fire(requestFor == 'forApprove' ? 'Approved!' : 'Commented', `The Task request has been ${requestFor == 'forApprove' ? 'approved' : 'Commented'}`, 'success');
            }
          });
      }
    });
  };

  const fetchPenltyList = () => {

    const reqData = {
      directorId: "",
      companyId: userInfoglobal?.companyId || '',
      branchId: userInfoglobal?.branchId || '',
      text: '',
      sort: true,
      status: 'Pending',
      isPagination: false,

      employeId: userInfoglobal?._id,
      penaltyId: "",
      issueDate: "",
    };

    dispatch(employeePenaltyTypeSearch(reqData));
  };

  useEffect(() => {
    fetchPenltyList();
  }, []);




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
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
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


  let inActiveEmployeToday = userDetailsData?.inActiveEmployeToday?.map((item) => {
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
  const conicColors = {
    "0%": "#b6ccfe",
    "50%": "#b8b8ff",
    "100%": "#5aa9e6",
  };

  useEffect(() => {
    dispatch(
      employeeDashboardFunc({
        companyId: userInfoglobal?.companyId,
        branchId: userInfoglobal?.branchId,
        departmentId: "",
        designationId: "",
        employeId: userInfoglobal?._id,
      })
    );
  }, []);

  useEffect(() => {
    if (employeeDashboardData) {
      const formattedAssignTask = (
        employeeDashboardData?.assigntasks ?? []
      ).map((data) => ({
        id: data?.code,
        fullName: data?.taskName,
        email: "",
        taskType: data?.taskType,
        hsnCode: data?.taskTypeData?.HSNCode,
        status: data?.status,
        roundName: "",
        profileType: "",
        meetingUrl: "",
        // shift: data?.shift,
        formatType: "assignTask",
        _id: data._id,
      }));

      const formattedInterviewTask = (
        employeeDashboardData?.interviewData ?? []
      ).map((data) => ({
        id: "",
        fullName: data?.fullName,
        email: data?.email,
        date: data?.date,
        status: data?.status,
        roundName: data?.roundName,
        profileType: data?.profileType,
        meetingUrl: data?.meetingUrl,
        type: data?.type,

        formatType: "interview",
        _id: data._id,
      }));

      if (formattedAssignTask.length > 0 || formattedInterviewTask.length > 0) {
        setPendingAprrovals([
          ...formattedInterviewTask,
          ...formattedAssignTask,
        ]);
      }
    }
  }, [employeeDashboardData]);

  const totalTaskOption = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "Total Task  Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const todayTaskOption = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "Today Task  Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const totalTaskData = {
    labels: [
      "Total Task",
      "Accepted Task",
      "Assigned Task",
      "completed Task",
      "OverdueTask",
      "Stop Task",
      "work IN Progress",
    ],
    datasets: [
      {
        label: "Total Task",
        data: [
          employeeDashboardData?.taskData?.totalTask ?? 0,
          employeeDashboardData?.taskData?.accepted ?? 0,
          employeeDashboardData?.taskData?.assigned ?? 0,
          employeeDashboardData?.taskData?.completed ?? 0,
          employeeDashboardData?.taskData?.overdueTask ?? 0,
          employeeDashboardData?.taskData?.stop ?? 0,
          employeeDashboardData?.taskData?.workInProgress ?? 0,
        ],
        backgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#ffbf69",
        ],
        hoverBackgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#ffbf69",
        ],
        borderWidth: 0,
      },
    ],
  };
  const todayTask = {
    labels: [
      "Total Task",
      "Accepted Task",
      "Assigned Task",
      "completed Task",
      "OverdueTask",
      "Stop Task",
      "work IN Progress",
    ],
    datasets: [
      {
        label: "Today Task",
        data: [
          employeeDashboardData?.todayTaskData?.totalTask ?? 0,
          employeeDashboardData?.todayTaskData?.accepted ?? 0,
          employeeDashboardData?.todayTaskData?.assigned ?? 0,
          employeeDashboardData?.todayTaskData?.completed ?? 0,
          employeeDashboardData?.todayTaskData?.overdueTask ?? 0,
          employeeDashboardData?.todayTaskData?.stop ?? 0,
          employeeDashboardData?.todayTaskData?.workInProgress ?? 0,
        ],
        backgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#ffbf69",
        ],
        hoverBackgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#ffbf69",
        ],
        borderWidth: 0,
      },
    ],
  };

  const data = {
    labels: ["Present", "Leave", "First Half day", "Second half Day", "Absent", "Holiday", "Off"],
    datasets: [
      {
        label: "attendence",
        data: [
          employeeDashboardData?.attendanceData?.totalPresent ?? 0,
          employeeDashboardData?.attendanceData?.totalLeave ?? 0,
          employeeDashboardData?.attendanceData?.totalFirstHalfday ?? 0,
          employeeDashboardData?.attendanceData?.totalSecondHalfday ?? 0,
          employeeDashboardData?.attendanceData?.totalAbsent ?? 0,
          employeeDashboardData?.attendanceData?.totalHoliday ?? 0,
          employeeDashboardData?.attendanceData?.totalOff ?? 0,

        ],
        backgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#69ff8fff",
        ],
        hoverBackgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#69ff8fff",
        ],
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };
  const QUICK_ACTIONS = [
    {
      name: "Pay Slip",
      icons: FaMoneyBillWave,
      path: "employee-payroll",
    },
    {
      name: "Employee Penalty",
      icons: MdPayment,
      path: "employee-penalties",
    },
    {
      name: "Interview List",
      icons: IoMdMan,
      path: "employee-interview",
    },
    {
      name: "Employee Task",
      icons: RiComputerLine,
      path: "employee-task-list",
    },
    // {
    //   name: "Holiday",
    //   icons: FaHandPeace,

    // },
    // {
    //   name: "Resignation",
    //   icons: AiOutlineInteraction,

    // },
  ];
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
  const fetchHrDashboard = () => {
    dispatch(
      hrDashboardFunc({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "branch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // We'll manually create the legend with Tailwind CSS
      },
      tooltip: {
        enabled: true, // Enable tooltips when hovering
      },
    },
    maintainAspectRatio: false,
    cutout: "80%", // Thin ring-like doughnut
  };

  const handleQuickActions = (path) => {
    navigate(
      `/admin/${path}/${encrypt(
        sidebarListData?.find((data) => data?.slug == `${path}`)?._id
      )}`
    );
  };

  return (
    <div className="block xl:flex xl:gap-5 space-y-3 xl:space-y-0 px-2 xl:h-[calc(100vh-100px)] h-[calc(95vh-90px)] ">
      <div className="xl::w-[70%] w-full xl:h-[calc(100vh-100px)] h-full  hide-scrollbar-y">
        <div className="w-full xl:hidden block">
          <UserDetails
            leaveList={leaveList}
            birthdaydata={birthdaydata}
            inActiveUserToday={inActiveUserToday}
            inActiveEmployeeToday={inActiveEmployeToday}
            todayWfhRequstData={todayWfhRequstData}
          />
        </div>
        <div className="w-full lg:overflow-y-auto ">
          <div className="w-full grid md:grid-cols-2 gap-2 grid-cols-1">

            <div className="w-full h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              {/* Header with month display and chart switcher */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">My Attendance</h3>
                    <p className="text-xs text-gray-500">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Chart Type Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['doughnut', 'bar'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`p-1 rounded-md text-xs ${chartType === type ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                    >
                      {type === 'doughnut' && 'Doughnut'}

                      {type === 'bar' && 'Bar'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Chart Area */}
              <div className="p-4 h-64">
                {chartType === 'doughnut' && (
                  <Doughnut
                    data={data}
                    options={{
                      ...options,
                      animation: { animateScale: true, animateRotate: true },
                      cutout: '70%'
                    }}
                  />
                )}
                {chartType === 'pie' && (
                  <Pie
                    data={data}
                    options={{
                      ...options,
                      animation: { animateScale: true, animateRotate: true }
                    }}
                  />
                )}
                {chartType === 'bar' && (
                  <Bar
                    data={{
                      ...data,
                      datasets: data.datasets.map(d => ({
                        ...d,
                        borderRadius: 4,
                        barThickness: 30
                      }))
                    }}
                    options={{
                      ...options,
                      scales: { y: { beginAtZero: true } }
                    }}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                {data.labels.map((label, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                    />
                    <span className="text-xs text-gray-700 truncate">{label}</span>
                    <span className="text-xs font-medium ml-auto">
                      {data.datasets[0].data[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <TodoList />
            <div className="h-full">
              <Calendar2
                combinedData={combinedData}
                currentDate={currentDate}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                companyDashboardData={hrDashboardData}
              />
            </div>
          </div>
          <div className="w-full rounded-xl mt-3 flex flex-col p-4 gap-3 bg-white shadow-sm border border-gray-100">
            <div className="text-lg font-medium text-gray-800">Quick Actions</div>
            <div className="pt-1 pb-2 overflow-x-auto">
              <div className="flex justify-between items-center gap-3">
                {QUICK_ACTIONS?.map((element, index) => {
                  const IconComponent = element.icons;
                  const isPermission = PageRoleData?.permissions?.find(
                    (permission) => permission?.pageId === sidebarListData?.find((data) => data?.slug == element?.path)?._id
                  )?.canRead;

                  if (!isPermission) return null;

                  return (
                    <button
                      key={index}
                      className="group relative bg-gray-50 hover:bg-primary-50 cursor-pointer 
                       w-full h-24 rounded-xl flex flex-col items-center justify-center p-3 
                       transition-all duration-200 ease-in-out border border-gray-200 hover:border-primary-100
                       hover:shadow-xs active:scale-95"
                      onClick={() => handleQuickActions(element?.path)}
                    >
                      <div className="p-2 rounded-full bg-white group-hover:bg-primary-100/20 transition-colors duration-200 mb-2">
                        <IconComponent
                          size={20}
                          className="text-gray-600 group-hover:text-primary-600 transition-colors duration-200"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-primary-700 whitespace-nowrap transition-colors duration-200">
                        {element?.name}
                      </span>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-100/30 pointer-events-none transition-all duration-200" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid  gap-2 md:grid-cols-2 grid-cols-1">
            <div className="w-full flex flex-col h-[295px] gap-2 bg-white mt-3 overflow-y-auto  rounded-lg">
              <div className="py-2 px-4 flex justify-between text-green-600">
                <span>Penalty List</span>
                <div
                  onClick={() => {
                    handleQuickActions("employee-penalties");
                  }}
                  className="h-5 rounded-full bg-green-600 text-white w-5 flex justify-center items-center"
                >
                  <MdArrowOutward />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {employeePenaltyListData?.length > 0 ? (
                  <div className="h-full overflow-auto custom-scrollbar">
                    <Swiper
                      spaceBetween={12}
                      slidesPerView="auto"
                      loop={false}
                      grabCursor={true}
                      className="px-3 py-2"
                    >
                      <SwiperSlide className="!w-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {['Name', 'Penalty Name', 'Reason', 'Issue Date'].map((header) => (
                                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {employeePenaltyListData?.map((data) => (
                              <tr key={data?._id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {data?.employeName || "-"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {data?.penaltyName || "-"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {data?.reason || "-"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                  {dayjs(data?.issueDate).format("MMM D, YYYY h:mm A") || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center p-4 text-center">
                    <Empty className="mb-3" />
                    <p className="text-gray-500 text-sm">No interviews scheduled</p>
                    {/* <button 
            onClick={() => handleQuickActions("employee-interview")}
            className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Schedule an interview
          </button> */}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col h-[295px] gap-2 bg-white mt-3 overflow-y-auto  rounded-lg">
              <div className="py-2 px-4 text-pink-600">Assigned task List</div>
              <div className="flex-1 overflow-hidden">
                {pendingAprrovals.filter(t => t?.formatType === "assignTask").length > 0 ? (
                  <div className="h-full overflow-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {["Name", "Task Type", "HSN Code", "Status", "Actions"].map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingAprrovals
                          .filter(t => t?.formatType === "assignTask")
                          .map((approval) => (
                            <tr key={approval._id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                    <span className="text-xs text-gray-600">
                                      {approval?.fullName?.charAt(0) || "U"}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {approval?.fullName || "-"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {approval?.taskType || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {approval?.hsnCode || "-"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs ${approval?.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : approval?.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}>
                                  {approval?.status || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <button
                                  onClick={() => navigate(`/admin/task/view/${encrypt(approval?._id)}/${encrypt("employee")}`)}
                                  className="p-1 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors duration-200"
                                  title="View Task"
                                >
                                  <MdArrowOutward className="text-sm" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center p-4 text-center">
                    <Empty className="mb-3" />
                    <p className="text-gray-500 text-sm">No tasks assigned</p>
                    {/* <button 
            onClick={() => navigate("/admin/task/create")}
            className="mt-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Create a new task
          </button> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
            <div className="py-2 px-4 text-header">Request Task List</div>
            <div className=" w-full  overflow-x-auto">
              {employeeDashboardData?.commentReq?.length > 0 ? (


                <table className=" w-full  divide-y divide-gray-200">
                  <thead className="bg-gray-50 w-full">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Employee Name
                      </th>

                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Task Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        requestFor
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Update AT
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Update By
                      </th>


                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y w-full  divide-gray-200">
                    {employeeDashboardData?.commentReq?.length > 0 ? (

                      employeeDashboardData?.commentReq?.map((approval) => (
                        <tr
                          key={approval._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.assignTo || "-"}
                            </div>
                          </td>

                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex flex-col">
                              {approval?.taskName || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {approval?.requestFor || "-"}
                            </div>
                          </td>


                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {moment(approval?.updatedAt).format('DD-MM-YYYY') || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {approval?.updateBy || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 !text-center whitespace-nowrap ">

                            <div className="flex gap-2">




                              {approval?.type == 'commentReq' && <button
                                onClick={() => handleTaskApprove(approval, 'forComment')}
                                className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                type="button"

                              >
                                <FaCommentDots
                                  // className={` ${"text-green-600 hover:text-green-500"}`}
                                  className={` ${approval?.status === "Pending" ? "text-green-600 hover:text-green-500" : "text-gray-600 hover:text-gray-500"}`}
                                  size={16}
                                />

                              </button>}
                            </div>
                          </td>

                          {/* <td className="px-4 py-3 !text-center whitespace-nowrap ">
                                      <div
                                        onClick={() => {
                                          navigate(
                                            `/admin/task/view/${encrypt(
                                              approval?._id
                                            )}/${encrypt(`employee`)}`
                                          );
                                        }}
                                        className="h-5 rounded-full text-center bg-[#DC2E8D] text-white w-5 flex justify-center items-center"
                                      >
                                        <MdArrowOutward />
                                      </div>
                                    </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          No Task found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

              ) : (
                <div className="flex justify-center items-center h-full w-full">
                  <Empty />
                </div>
              )}
            </div>
          </div>

          <div className="mt-3  gap-2  grid grid-cols-1 md:grid-cols-2">
            <div className="w-full  rounded-xl bg-white p-2">
              <Bar data={totalTaskData} options={totalTaskOption} />

              <div className="flex  mt-4 gap-4 flex-wrap">
                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#acd8aa]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.totalTask}
                  </div>
                  <div className="text-[10px]">Total Task</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#dee2ff]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.accepted}
                  </div>
                  <div className="text-[10px]">Total Accepted</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#ade8f4]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.assigned}
                  </div>
                  <div className="text-[10px]">Total assigned</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#feeafa]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.completed}
                  </div>
                  <div className="text-[10px]">Total completed</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#ffba08]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.overdueTask}
                  </div>
                  <div className="text-[10px]">Total overdueTask</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#1a659e]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.stop}
                  </div>
                  <div className="text-[10px]">Total stop Task</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#ffbf69]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.taskData?.workInProgress}
                  </div>
                  <div className="text-[10px]">workInProgress</div>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl bg-white p-2">
              <Bar data={todayTask} options={todayTaskOption} />
              <div className="flex  mt-4 gap-4 flex-wrap">
                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#acd8aa]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.totalTask}
                  </div>
                  <div className="text-[10px]">Total Task</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#dee2ff]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.accepted}
                  </div>
                  <div className="text-[10px]">Total Accepted</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#ade8f4]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.assigned}
                  </div>
                  <div className="text-[10px]">Total assigned</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#feeafa]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.completed}
                  </div>
                  <div className="text-[10px]">Total completed</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#ffba08]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.overdueTask}
                  </div>
                  <div className="text-[10px]">Total overdueTask</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#1a659e]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.stop}
                  </div>
                  <div className="text-[10px]">Total stop Task</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="h-1 w-1  rounded-full bg-[#ffbf69]"></div>
                  <div className="text-[10px]">
                    {employeeDashboardData?.todayTaskData?.workInProgress}
                  </div>
                  <div className="text-[10px]">workInProgress</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full block xl:hidden ">

            <div className="xl:hidden mt-3 block w-full">
              <NoticeBoard />
            </div>
          </div>
        </div>
      </div>
      <div className="xl:w-[30%] w-full xl:h-[calc(100vh-100px)] pb-5 hide-scrollbar-y ">
        <div className="w-full hidden xl:block space-y-3">
          <UserDetails
            leaveList={leaveList}
            birthdaydata={birthdaydata}
            inActiveUserToday={inActiveUserToday}
            inActiveEmployeeToday={inActiveEmployeToday}
            todayWfhRequstData={todayWfhRequstData}
          />
          <div className="xl:block hidden w-full">
            <NoticeBoard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
