import React, { useState, useEffect } from "react";
import NoticeBoard from "./NoticeBoard";
import UserDetails from "./UserDetails";
import { Doughnut, Bar } from "react-chartjs-2";
import { ImArrowUpRight2 } from "react-icons/im";
import Calendar from "./Calendar";

import { MdArrowOutward, MdTune } from "react-icons/md";
import { FaCommentDots } from "react-icons/fa";
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
import { RxEnter } from "react-icons/rx";
import {
  domainName,
  inputCalanderClassName,
  inputClassName,
  inputLabelClassName,
} from "../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import {
  companyDashboard,
  hrDashboardFunc,
} from "../../redux/_reducers/_dashboard_reducers";
import { Button, DatePicker, Dropdown, Empty, Menu, Modal } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

import {
  dynamicSidebarSearch,
  getsidebarList,
} from "../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../../config/Encryption";
import {
  invoiceSummary,
  pendingInvoiceSummary,
} from "../financeManagement/invoice/invoiceFeature/_invoice_reducers";
import { Controller, useForm, useWatch } from "react-hook-form";
import Swiper from "swiper";
import { SwiperSlide } from "swiper/react";
import {
  getLeaveRequestList,
  updateLeaveRequestStatus,
} from "../hr/leaveRequestManagment/LeaveRequestModule/LeaveRequestFeatures/_leave_request_reducers";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  incrementList,
  incrementStatusUpdate,
} from "../hr/employeeSalary/employeeSalaryModule/employeeSalaryFeatures/_employee_salary_reducers";
import { dashboardTaskReq } from "../taskManagement/addTask/addTaskFeatures/_addTask_reducers";
import TaskList from "../taskManagement/addTask/TaskList";
import CustomDatePicker from "../../global_layouts/DatePicker/CustomDatePicker";
import { updateGeneralVisitor } from "../visitorManagement/visitor/visitorFeatures/_visitor_reducers";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import Loader2 from "../../global_layouts/Loader/Loader2";
import CountUp from "react-countup";
import QuickLinksSection from "./QuickLinksSection";
import QuickLinksSectionManager from "./QuickLinksSectionManager";
import TodoList from "../global/other/todolistManagement/TodoList";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const currentYear = new Date().getFullYear();
const years = [];
for (let i = currentYear - 20; i <= currentYear + 20; i++) {
  years.push(i);
}

const CompanyDashBoard = () => {
  const [commonTaskReq, setCommonTaskReq] = useState([]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    register,
  } = useForm();
  const [isTaskModal, setIsTaskModal] = useState(false);
  const [isClientModal, setIsClientModal] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [fromDateNew, setFromDateNew] = useState("");
  const [toDateNew, setToDateNew] = useState("");
  const [selectedFilterTask, setSelectedFilterTask] = useState("");
  const [fromDateNewTask, setFromDateNewTask] = useState("");
  const { invoiceSummarydata, pendingInvoiceSummarydata } = useSelector(
    (state) => state.invoice
  );
  const [toDateNewTask, setToDateNewTask] = useState("");
  const [isDateModalVisibleTask, setIsDateModalVisibleTask] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const { companyDashboardData, companyDashboard_loading } = useSelector(
    (state) => state?.dashboard
  );
  const { leaveRequestData, totalLeaverequestCount, loading } = useSelector(
    (state) => state.leaveRequest
  );
  const params = new URLSearchParams();
  const { incrementListData } = useSelector((state) => state.salaryDetails);
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startdateCalender, setStartDateCalender] = useState(
    moment().startOf("month")
  );

  const [visitorData, setVisitorData] = useState({});
  const [empArray, setEmpArray] = useState([]);
  const [empModal, setEmpModal] = useState(false);
  const handleEmployeeModal = (element) => {
    setEmpArray(element ? element : []);
    setEmpModal(true);
  };

  const handleTaskSummary = () => {
    params.set("filterDate", selectedFilterTask);
    if (selectedFilterTask == 'Custom Date') {
      params.set('toDateNew', toDateNewTask)
      params.set('fromDateNew', fromDateNewTask)
    }
    navigate(
      `/admin/overall-task-report/${encrypt(
        sidebarListData?.find((data) => data?.slug == "task-list")?._id
      )}?${params.toString()}`
    );
  };

  const getCurrentLocation = async () => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        showNotification({
          message: "API key for Google Geolocation is missing.",
          type: "error",
        });
        throw new Error("Missing API key");
      }

      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.location) {
        const { lat, lng } = data.location;
        return { lat, lng };
      } else {
        showNotification({
          message: "Unable to get location from Google API.",
          type: "error",
        });
        throw new Error("Location data not available");
      }
    } catch (error) {
      console.error("Error with Google Geolocation API:", error);
      showNotification({
        message: "Error fetching location from Google API. Please try again.",
        type: "error",
      });
      throw error;
    }
  };

  const { timeDurationStart, timeDurationEnd, date, ...restVisitorData } =
    visitorData;

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Leave Request",
      input: "textarea",
      inputLabel: "Reason for Rejection",
      inputPlaceholder: "Enter your remarks here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value.trim() !== "") {
        dispatch(
          updateLeaveRequestStatus({
            _id: id,
            status: "Rejected",
            remark: result.value.trim(),
          })
        ).then(() => {
          getLeaveRequestListRequest();
          Swal.fire(
            "Rejected!",
            "The leave request has been rejected.",
            "success"
          );
        });
      } else if (result.isConfirmed) {
        Swal.fire(
          "Error",
          "Please provide a remark before rejecting.",
          "error"
        );
      }
    });
  };

  useEffect(() => {
    if (companyDashboardData) {
      const commentList = companyDashboardData?.commentReq || [];
      const taskReq = companyDashboardData?.taskReq || [];
      setCommonTaskReq([...commentList, ...taskReq]);
    }
  }, [companyDashboardData]);

  const handleTaskReject = (task) => {
    Swal.fire({
      title: "Reject Task Request",
      input: "textarea",
      inputLabel: "Reason for Rejection",
      inputPlaceholder: "Enter your remarks here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value.trim() !== "") {
        dispatch(
          dashboardTaskReq({
            taskCommentId: task?._id,
            status: "reject",
            description: result.value?.trim() || "",
            attechment: "",
            type: task?.type == "taskReq" ? "approvelReq" : "commentReplay",
          })
        ).then(() => {
          companydashboardfunc();
          Swal.fire(
            "Rejected!",
            "The Task request has been rejected.",
            "success"
          );
        });
      } else if (result.isConfirmed) {
        Swal.fire(
          "Error",
          "Please provide a remark before rejecting.",
          "error"
        );
      }
    });
  };
  const { hrDashboardData } = useSelector((state) => state?.dashboard);
  const select1 = useWatch({ control, name: "select1", defaultValue: "" });
  const select2 = useWatch({ control, name: "select2", defaultValue: "" });
  const select3 = useWatch({ control, name: "select3", defaultValue: "" });
  const select4 = useWatch({ control, name: "select4", defaultValue: "" });
  const select5 = useWatch({ control, name: "select5", defaultValue: "" });
  const select6 = useWatch({ control, name: "select6", defaultValue: "" });
  const handleInvoiceSummary = () => {
    // Map month names to two-digit numbers
    const monthMap = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12"
    };

    // Convert month name to number
    const month = monthMap[select3]; // select3 is month name (e.g., "August")
    const year = select4; // select4 is year (e.g., "2025")

    // Calculate startDate and endDate for the entire month
    const startDate = `${year}-${month}-01`;

    // Get the last day of the month
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

    // Set date parameters
    params.set("startDate", startDate);
    params.set("endDate", endDate);

    // Set status and layoutId based on select1 and select2
    params.set("status", select1);   // Assuming select1 is the status (e.g., "PendingPayment")
    params.set("layoutId", select2); // Assuming select2 is the layoutId (e.g., "68ac51aeafb3ceafbbe33327")

    // Optional: clean up old keys if necessary
    params.delete("month");
    params.delete("year");

    // Always set the fromDashboard flag
    params.set("fromDashboard", "dashboard");

    // Find route
    const slug = sidebarListData?.find(
      (data) => data?.slug === "finance-invoice-summmary-statuswise"
    )?._id;

    // Navigate to new URL
    navigate(
      `/admin/finance-invoice-summmary-statuswise/${encrypt(slug)}?${params.toString()}`
    );
  };


  const handlePendingInVoice = () => {
    params.set("month", select5);
    params.set("year", select6);
    params.set("fromDashboard", "dashboard");
    navigate(
      `/admin/pending-invoice-report/${encrypt(
        sidebarListData?.find(
          (data) => data?.slug == "pending-invoice-report"
        )?._id
      )}?${params.toString()}`
    );
  };

  const [endDateCalender, setEndDateCalender] = useState(
    moment().endOf("month")
  );
  const dispatch = useDispatch();
  const [userDetailsData, setuserDetailsdata] = useState({
    leaveData: [],
    wfhRequestData: [],
    birthdaydata: [],
    inActiveUserToday: [],
  });
  const [hruserDetailsData, setHruserDetailsdata] = useState({
    leaveData: [],
    birthdaydata: [],
    inActiveUserToday: [],
    wfhRequestData: []
  });

  const handleTask = () => {
    setIsTaskModal(!isTaskModal);
  };
  const handleClient = () => {
    setIsClientModal(!isClientModal);
  };
  const navigate = useNavigate();
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  useEffect(() => {
    if (
      userInfoglobal?.userType === "employee" &&
      userInfoglobal?.roleKey === "manager"
    ) {
      fetchHrDashboard();
    }
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
  useEffect(() => {
    if (hrDashboardData) {
      const leaveData = hrDashboardData?.todayOnLeave;
      const birthdaydata = hrDashboardData?.todayBirthday;
      const inActiveUserToday = hrDashboardData?.inActiveUserToday;
      const wfhRequestData = hrDashboardData?.todayWFHEmployes
      setHruserDetailsdata({
        leaveData,
        birthdaydata,
        inActiveUserToday,
        wfhRequestData
      });
    }
  }, [hrDashboardData]);
  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve Leave Request",
      input: "textarea",
      inputLabel: "Optional Remark",
      inputPlaceholder: "Enter a remark (optional)...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateLeaveRequestStatus({
            _id: id,
            status: "Approved",
            remark: result.value?.trim() || "",
          })
        ).then((data) => {
          if (!data?.error) {
            getLeaveRequestListRequest();
            Swal.fire(
              "Approved!",
              "The leave request has been approved.",
              "success"
            );
          }
        });
      }
    });
  };

  const handleTaskApprove = (task, requestFor) => {
    Swal.fire({
      title:
        requestFor == "forApprove" ? "Approve Task Request" : "Comment Request",
      input: "textarea",
      inputLabel: requestFor == "forApprove" ? "Description" : "Comment",
      inputPlaceholder:
        requestFor == "forApprove"
          ? "Enter a Description"
          : "Enter a Comment....",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: requestFor == "forApprove" ? "Approve" : "Submit",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          dashboardTaskReq({
            taskCommentId: task?._id,
            status: requestFor == "forApprove" ? "approved" : "replay",
            description: result.value?.trim() || "",
            attechment: "",
            type: task?.type == "taskReq" ? "approvelReq" : "commentReplay",
          })
        ).then((data) => {
          if (!data?.error) {
            companydashboardfunc();
            Swal.fire(
              requestFor == "forApprove" ? "Approved!" : "Commented",
              `The Task request has been ${requestFor == "forApprove" ? "approved" : "Commented"
              }`,
              "success"
            );
          }
        });
      }
    });
  };
  const handleStatusIncrement = (id, status) => {
    Swal.fire({
      title: "Change Increment Request",
      text: "Are you sure you want to change the status of this increment request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: status == "Approved" ? "Approve" : "Reject",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          incrementStatusUpdate({
            _id: id,
            status: status,
          })
        ).then((data) => {
          if (!data?.error) {
            fetchIncrementList();
            Swal.fire(
              status == "Approved" ? "Approve" : "Reject",
              "The increment request status has been updated.",
              "success"
            );
          }
        });
      }
    });
  };

  useEffect(() => {
    if (userInfoglobal?.roleKey === "manager") {
      getLeaveRequestListRequest();
    }
    fetchIncrementList();
  }, []);
  const fetchIncrementList = () => {
    dispatch(
      incrementList({
        text: "",
        status: "Pending",
        sort: true,
        isPagination: false,
        directorId: "",
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        employeId: "",
      })
    );
  };

  const getLeaveRequestListRequest = () => {
    const data = {
      // currentPage: currentPage,
      // pageSize: limit,
      reqData: {
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        // text: searchText,

        departmentId: userInfoglobal?.departmentId,
        sort: true,
        status: "Pending",
        isPagination: true,
      },
    };
    dispatch(getLeaveRequestList(data));
  };

  const handleActiveUser = () => {
    params.set("isActive", "true");

    navigate(
      `/admin/employe/${encrypt(
        sidebarListData?.find((data) => data?.slug == "employe")?._id
      )}?${params.toString()}`
    );
  };

  const handleReciept = () => {
    params.set("filter", "today");

    navigate(
      `/admin/finance-reciept-report/${encrypt(
        sidebarListData?.find((data) => data?.slug == "finance-reciept-report")
          ?._id
      )}?${params.toString()}`
    );
  };
  const handleTodayTask = (date, status) => {
    params.set("filterDate", date);

    navigate(
      `/admin/overall-task-report/${encrypt(
        sidebarListData?.find((data) => data?.slug == "overall-task-report")
          ?._id
      )}?${params.toString()}`
    );
  };
  const handlePayment = () => {
    params.set("date", "today");
    navigate(
      `/admin/finance-payment-report/${encrypt(
        sidebarListData?.find((data) => data?.slug == "finance-payment-report")
          ?._id
      )}?${params.toString()}`
    );
  };

  useEffect(() => {
    companydashboardfunc();
    dispatch(
      dynamicSidebarSearch({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        isPagination: false,
      })
    );
    dispatch(
      invoiceSummary({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.departmentId
            : "",
        invoiceLayoutId: select2,
        monthName: months[moment().month()].toLowerCase(),
        year: moment().year(),
        sort: false,
        status: "",
        isPagination: true,
      })
    );
    dispatch(
      pendingInvoiceSummary({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.departmentId
            : "",
        monthName: months[moment().month()].toLowerCase(),
        year: moment().year(),
        sort: false,
        status: "",
        isPagination: true,
      })
    );
    setValue("select1", "");
    setValue("select2", "");
    setValue("select3", months[moment().month()].toLowerCase());
    setValue("select4", moment().year());
    setValue("select5", months[moment().month()].toLowerCase());
    setValue("select6", moment().year());
  }, []);
  const companydashboardfunc = () => {
    dispatch(
      companyDashboard({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.departmentId
            : "",
        calenderFilter: {
          startDate: startdateCalender?.format("YYYY-MM-DD"),
          endDate: endDateCalender?.format("YYYY-MM-DD"),
        },
        clientFilter: {
          startDate: fromDateNew ? dayjs(fromDateNew).format("YYYY-MM-DD") : "",
          endDate: toDateNew ? dayjs(toDateNew).format("YYYY-MM-DD") : "",
        },
        taskFilter: {
          startDate: fromDateNewTask
            ? dayjs(fromDateNewTask).format("YYYY-MM-DD")
            : "",
          endDate: toDateNewTask
            ? dayjs(toDateNewTask).format("YYYY-MM-DD")
            : "",
        },
      })
    );
    // .then((res)=>{
    //   const data = res?.payload?.data;
    //   const commentList = data?.commentReq || [];
    //   const taskReq=data?.taskReq || []
    //   setCommonTaskReq([...commentList, ...taskReq])

    // })
  };

  const data = {
    labels: ["Admin", "Branch", "Manager", "HR", "Employee", "Trainee"],
    datasets: [
      {
        label: "Staff",
        data: [
          companyDashboardData?.staffSummary?.directorCount ?? 0,
          companyDashboardData?.staffSummary?.branchCount ?? 0,
          companyDashboardData?.staffSummary?.managerCount ?? 0,
          companyDashboardData?.staffSummary?.HRCount ?? 0,
          companyDashboardData?.staffSummary?.designationEmployeCount ?? 0,
          companyDashboardData?.staffSummary?.traineeCount ?? 0,
        ],
        backgroundColor: [
          "#FF0000",
          "#1AA4FF",
          "#00CC00",
          "#FFCC00",
          "#074173",
          "#d4f5db",
        ],
        hoverBackgroundColor: [
          "#FF0000",
          "#1AA4FF",
          "#00CC00",
          "#FFCC00",
          "#074173",
          "#d4f5db",
        ],
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
    cutout: "80%",
  };
  const STATUS_COLORS = {
    pending: '#FFA704',
    rejected: '#FF0000',
    assigned: '#1AA4FF',
    restart: '#24C600',
    reassigned: '#074173',
    reqRejected: '#d4f5db',
    accepted: '#1AA4FF',
    reassignToOther: '#FFA704',
    pendingAtClient: '#FFA704',
    pendingAtDepartment: '#1AA4FF',
    pendingAtColleague: '#24C600',
    pendingAtManager: '#FF0000',
    workInProgress: '#1AA4FF',
    pendingForApproval: '#FFA704',
    pendingForFee: '#24C600',
    stop: '#FF0000'
  };


  // Format status names for display
  const formatStatusName = (status) => {
    return status
      .replace(/_/g, ' ')
      .replace(/(^|\s)\w/g, l => l.toUpperCase());
  };
  const taskData = {
    labels: Object.keys(companyDashboardData?.taskSummery?.taskSummary?.statusOverview || {}).map(
      status => {
        const statusMap = {
          pending: "Self Assign",
          rejected: "Rejected",
          assigned: "Assigned",
          restart: "Restart",
          reassigned: "Reassigned",
          reqRejected: "Request Rejected",
          accepted: "Accepted",
          reassignToOther: "Reassign To Other",
          pendingAtClient: "Pending At Client",
          pendingAtDepartment: "Pending At Department",
          pendingAtColleague: "Pending At Colleague",
          pendingAtManager: "Pending At Manager",
          workInProgress: "Work In Progress",
          pendingForApproval: "Pending For Approval",
          pendingForFee: "Pending For Fee",
          completed: "Completed",
          stop: "Stop"
        };
        return statusMap[status] || status;
      }
    ),
    datasets: [
      {
        label: 'Total Tasks',
        data: Object.values(companyDashboardData?.taskSummery?.taskSummary?.statusOverview || {}).map(status => status.total),
        backgroundColor: '#074173',
        borderWidth: 0,
        borderRadius: 4
      },
      {
        label: 'Overdue Tasks',
        data: Object.values(companyDashboardData?.taskSummery?.taskSummary?.statusOverview || {}).map(status => status.overdue),
        backgroundColor: '#FF0000',
        borderWidth: 0,
        borderRadius: 4
      }
    ]
  };

  const clientData = {
    labels: ["Total Client", "Active Client", "InActive Client"],
    datasets: [
      {
        label: "Clients",
        data: [
          companyDashboardData?.clientSummery?.totalClient ?? 0,
          companyDashboardData?.clientSummery?.activeClient ?? 0,
          companyDashboardData?.clientSummery?.inactiveClient ?? 0,
        ],
        backgroundColor: [
          "#074173", // Admin - Red
          "#FFA704", // Manager - Blue
          "#22c55e", // Manager - Blue
        ],
        hoverBackgroundColor: ["#074173", "#FFA704", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };
  const taskOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      }
    },
    barPercentage: 0.6,
    categoryPercentage: 0.8
  };
  const clientOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "Client Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
    if (companyDashboardData) {
      const eventdata = companyDashboardData?.calender?.eventData;
      const groupedEvents = groupByDateForEvent(eventdata);

      const holidayData = companyDashboardData?.calender?.holidayData;
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
  }, [companyDashboardData]);
  useEffect(() => {
    if (companyDashboardData) {
      const leaveData = companyDashboardData?.todayOnLeave;
      const birthdaydata = companyDashboardData?.todayBithday;
      const inActiveUserToday = companyDashboardData?.inactiveToday;
      const inActiveEmployeToday = companyDashboardData?.inActiveEmployeToday;
      const wfhRequestData = companyDashboardData?.todayWFHEmployes
      setuserDetailsdata({
        leaveData,
        birthdaydata,
        inActiveUserToday,
        inActiveEmployeToday,
        wfhRequestData,
      });
    }
  }, [companyDashboardData]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleFilterSelect = (filter) => {
    if (filter === "Custom Date") {
      setFromDateNew(null);
      setToDateNew(null);
      setIsDateModalVisible(true);
      setIsClientModal(false);
    } else {
      let fromDate,
        toDate = dayjs();
      switch (filter) {
        case "Last Week":
          fromDate = dayjs().subtract(7, "days");
          break;
        case "Last Month":
          fromDate = dayjs().subtract(1, "month").startOf("month");
          toDate = dayjs().subtract(1, "month").endOf("month");
          break;
        case "Last Year":
          fromDate = dayjs().subtract(1, "year").startOf("year");
          toDate = dayjs().subtract(1, "year").endOf("year");
          break;
        default:
          fromDate = dayjs().subtract(7, "days");
      }
      setFromDateNew(fromDate);
      setToDateNew(toDate);
      dispatch(
        companyDashboard({
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
          branchId:
            userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "companyDirector"
              ? ""
              : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
          departmentId:
            userInfoglobal?.userType === "employee"
              ? userInfoglobal?.departmentId
              : "",
          clientFilter: {
            startDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : "",
            endDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : "",
          },
          taskFilter: {
            startDate: fromDateNewTask
              ? dayjs(fromDateNewTask).format("YYYY-MM-DD")
              : "",
            endDate: toDateNewTask
              ? dayjs(toDateNewTask).format("YYYY-MM-DD")
              : "",
          },
          calenderFilter: {
            startDate: startdateCalender
              ? startdateCalender?.format("YYYY-MM-DD")
              : "",
            endDate: endDateCalender
              ? endDateCalender?.format("YYYY-MM-DD")
              : "",
          },
        })
      );
      setSelectedFilter(filter);
      setIsClientModal(false);
    }
  };

  const handleDateOk = () => {
    if (fromDateNew && toDateNew) {
      dispatch(
        companyDashboard({
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
          branchId:
            userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "companyDirector"
              ? ""
              : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
          departmentId:
            userInfoglobal?.userType === "employee"
              ? userInfoglobal?.departmentId
              : "",
          clientFilter: {
            startDate: fromDateNew
              ? dayjs(fromDateNew).format("YYYY-MM-DD")
              : "",
            endDate: toDateNew ? dayjs(toDateNew).format("YYYY-MM-DD") : "",
          },
          taskFilter: {
            startDate: fromDateNewTask
              ? dayjs(fromDateNewTask).format("YYYY-MM-DD")
              : "",
            endDate: toDateNewTask
              ? dayjs(toDateNewTask).format("YYYY-MM-DD")
              : "",
          },
          calenderFilter: {
            startDate: startdateCalender
              ? startdateCalender?.format("YYYY-MM-DD")
              : "",
            endDate: endDateCalender
              ? endDateCalender?.format("YYYY-MM-DD")
              : "",
          },
        })
      ).then((data) => {
        if (!data?.error) {
          setSelectedFilter("Custom Date");
          setIsDateModalVisible(false);
        }
      });
    }
  };
  const handleDateCancel = () => {
    setIsDateModalVisible(false);
    setFromDateNew(null);
    setToDateNew(null);
  };
  const handleFromDateChange = (date) => {
    setFromDateNew(date);
  };

  const handleToDateChange = (date) => {
    setToDateNew(date);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleFilterSelect("Last Week")}>
        Last Week
      </Menu.Item>
      <Menu.Item onClick={() => handleFilterSelect("Last Month")}>
        Last Month
      </Menu.Item>
      <Menu.Item onClick={() => handleFilterSelect("Last Year")}>
        Last Year
      </Menu.Item>
      <Menu.Item onClick={() => handleFilterSelect("Custom Date")}>
        Custom Date
      </Menu.Item>
    </Menu>
  );
  const handleFilterSelectTask = (filter) => {
    if (filter === "Custom Date") {
      setIsDateModalVisibleTask(true);
      setIsTaskModal(false);
      setFromDateNewTask(null);
      setToDateNewTask(null);
    } else {
      let fromDate,
        toDate = dayjs();
      switch (filter) {
        case "Last Week":
          fromDate = dayjs().subtract(7, "days");
          break;
        case "Last Month":
          fromDate = dayjs().subtract(1, "month").startOf("month");
          toDate = dayjs().subtract(1, "month").endOf("month");
          break;
        case "Last Year":
          fromDate = dayjs().subtract(1, "year").startOf("year");
          toDate = dayjs().subtract(1, "year").endOf("year");
          break;
        default:
          fromDate = dayjs().subtract(7, "days");
      }
      setFromDateNewTask(fromDate);
      setToDateNewTask(toDate);
      dispatch(
        companyDashboard({
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
          branchId:
            userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "companyDirector"
              ? ""
              : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
          departmentId:
            userInfoglobal?.userType === "employee"
              ? userInfoglobal?.departmentId
              : "",
          taskFilter: {
            startDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : "",
            endDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : "",
          },
          calenderFilter: {
            startDate: startdateCalender
              ? startdateCalender?.format("YYYY-MM-DD")
              : "",
            endDate: endDateCalender
              ? endDateCalender?.format("YYYY-MM-DD")
              : "",
          },
          clientFilter: {
            startDate: fromDateNew
              ? dayjs(fromDateNew).format("YYYY-MM-DD")
              : "",
            endDate: toDateNew ? dayjs(toDateNew).format("YYYY-MM-DD") : "",
          },
        })
      );
      setSelectedFilterTask(filter);
      setIsTaskModal(false);
    }
  };

  const handleDateOkTask = () => {
    if (fromDateNewTask && toDateNewTask) {
      dispatch(
        companyDashboard({
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
          branchId:
            userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "companyDirector"
              ? ""
              : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
          departmentId:
            userInfoglobal?.userType === "employee"
              ? userInfoglobal?.departmentId
              : "",
          taskFilter: {
            startDate: fromDateNewTask
              ? dayjs(fromDateNewTask).format("YYYY-MM-DD")
              : "",
            endDate: toDateNewTask
              ? dayjs(toDateNewTask).format("YYYY-MM-DD")
              : "",
          },
          calenderFilter: {
            startDate: startdateCalender
              ? startdateCalender?.format("YYYY-MM-DD")
              : "",
            endDate: endDateCalender
              ? endDateCalender?.format("YYYY-MM-DD")
              : "",
          },
          clientFilter: {
            startDate: fromDateNew
              ? dayjs(fromDateNew).format("YYYY-MM-DD")
              : "",
            endDate: toDateNew ? dayjs(toDateNew).format("YYYY-MM-DD") : "",
          },
        })
      ).then((data) => {
        if (!data?.error) {
          setSelectedFilterTask("Custom Date");
          setIsDateModalVisibleTask(false);
        }
      });
    }
  };
  const handleDateCancelTask = () => {
    setIsDateModalVisibleTask(false);
    setFromDateNewTask(null);
    setToDateNewTask(null);
  };
  const handleFromDateChangeTask = (date) => {
    setFromDateNewTask(date);
  };

  const handleToDateChangeTask = (date) => {
    setToDateNewTask(date);
  };

  const TaskMenu = (
    <Menu>
      <Menu.Item onClick={() => handleFilterSelectTask("Last Week")}>
        Last Week
      </Menu.Item>
      <Menu.Item onClick={() => handleFilterSelectTask("Last Month")}>
        Last Month
      </Menu.Item>
      <Menu.Item onClick={() => handleFilterSelectTask("Last Year")}>
        Last Year
      </Menu.Item>
      <Menu.Item onClick={() => handleFilterSelectTask("Custom Date")}>
        Custom Date
      </Menu.Item>
    </Menu>
  );

  const prevMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate((date) => newDate);
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    setStartDateCalender(moment(startDate));
    setEndDateCalender(moment(endDate));
    dispatch(
      companyDashboard({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.departmentId
            : "",
        taskFilter: {
          startDate: fromDateNewTask
            ? dayjs(fromDateNewTask).format("YYYY-MM-DD")
            : "",
          endDate: toDateNewTask
            ? dayjs(toDateNewTask).format("YYYY-MM-DD")
            : "",
        },
        calenderFilter: {
          startDate: startDate ? moment(startDate)?.format("YYYY-MM-DD") : "",
          endDate: endDate ? moment(endDate)?.format("YYYY-MM-DD") : "",
        },
        clientFilter: {
          startDate: fromDateNew ? dayjs(fromDateNew).format("YYYY-MM-DD") : "",
          endDate: toDateNew ? dayjs(toDateNew).format("YYYY-MM-DD") : "",
        },
      })
    );
  };
  const nextMonth = () => {
    const newdate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate((date) => newdate);
    const startDate = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    const endDate = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
    setStartDateCalender(moment(startDate));
    setEndDateCalender(moment(endDate));
    dispatch(
      companyDashboard({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId:
          userInfoglobal?.userType === "employee"
            ? userInfoglobal?.departmentId
            : "",
        taskFilter: {
          startDate: fromDateNewTask
            ? dayjs(fromDateNewTask).format("YYYY-MM-DD")
            : "",
          endDate: toDateNewTask
            ? dayjs(toDateNewTask).format("YYYY-MM-DD")
            : "",
        },
        calenderFilter: {
          startDate: startDate ? moment(startDate)?.format("YYYY-MM-DD") : "",
          endDate: endDate ? moment(endDate)?.format("YYYY-MM-DD") : "",
        },
        clientFilter: {
          startDate: fromDateNew ? dayjs(fromDateNew).format("YYYY-MM-DD") : "",
          endDate: toDateNew ? dayjs(toDateNew).format("YYYY-MM-DD") : "",
        },
      })
    );
  };
  let leaveList =
    userInfoglobal?.roleKey === "manager"
      ? hruserDetailsData?.leaveData?.map((item) => {
        return {
          imgUrl: item?.employeProfileImage
            ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.employeProfileImage}`
            : "/images/avatar.jpg",
          name:
            item?.employename && item.employename.includes(" ")
              ? item.employename.split(" ")[0]
              : item?.employename,
          tooltip: item?.employename,
          data: item,
        };
      })
      : userDetailsData?.leaveData?.map((item) => {
        return {
          imgUrl: item?.employeProfileImage
            ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.employeProfileImage}`
            : "/images/avatar.jpg",
          name:
            item?.employename && item.employename.includes(" ")
              ? item.employename.split(" ")[0]
              : item?.employename,
          tooltip: item?.employename,
        };
      });

  let todayWfhRequstData = userInfoglobal?.roleKey === "manager"
    ? hruserDetailsData?.wfhRequestData?.map((item) => {
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
    : userDetailsData?.wfhRequestData?.map((item) => {
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
    });
  let birthdaydata =
    userInfoglobal?.roleKey === "manager"
      ? hruserDetailsData?.birthdaydata?.map((item) => {
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
      })
      : userDetailsData?.birthdaydata?.map((item) => {
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

  let inActiveEmployeToday = userDetailsData?.inActiveEmployeToday?.map(
    (item) => {
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
    }
  );

  return (
    <>
      <div className="block xl:flex xl:gap-5 space-y-3 overflow-auto  xl:space-y-0 px-2 xl:h-[calc(100vh-100px)] h-[calc(95vh-90px)] md:h-[calc(100vh-100px)] ">
        <div className="xl::w-[70%] w-full xl:h-[calc(100vh-100px)] h-full hide-scrollbar-y">
          <div className="w-full xl:hidden block">
            <UserDetails
              leaveList={leaveList}
              birthdaydata={birthdaydata}
              inActiveUserToday={inActiveUserToday}
              todayWfhRequstData={todayWfhRequstData}
            // inActiveEmployeeToday={inActiveEmployeToday}
            />
          </div>
          <div className="lg:flex justify-between items-start lg:space-x-5 space-y-3 lg:space-y-0">
            <div className="xl-w-[50%] lg:w-[55%] w-full h-full grid grid-cols-2 sm:grid-cols-2 gap-[20px]">
              <div class="w-full h-full relative !bg-header rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px]  cardOuter !bg-header">
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none">
                    <CountUp
                      end={companyDashboardData?.visitors?.thisMonth ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8]  3xl:text-[16px] xl:text-[13px]  sm:text-[12px] text-[9px] ">
                    Total Visitors
                  </div>
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none mt-[13px]">
                    <CountUp
                      end={companyDashboardData?.visitors?.today ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8]  3xl:text-[16px] xl:text-[13px]  sm:text-[12px] text-[9px]">
                    Today Visitors
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[2.5rem] lg:h-[3.7rem] h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
                  <div
                    onClick={() => {
                      navigate(
                        `/admin/visitor/${encrypt(
                          sidebarListData?.find(
                            (data) => data?.slug == "visitor"
                          )?._id
                        )}`
                      );
                    }}
                    class="flex cursor-pointer items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
                  >
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
              <div class="w-full h-full relative bg-[#f3f4f6] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px]  cardOuter !bg-header ">
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none ">
                    <CountUp
                      end={(companyDashboardData?.staffSummary?.directorCount || 0) +
                        (companyDashboardData?.staffSummary?.branchCount || 0) +
                        (companyDashboardData?.staffSummary
                          ?.designationEmployeCount || 0) +
                        (companyDashboardData?.staffSummary?.managerCount || 0) +
                        (companyDashboardData?.staffSummary?.traineeCount || 0) +
                        (companyDashboardData?.staffSummary?.HRCount || 0)}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />

                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]  sm:text-[12px] text-[9px]">
                    Total Active Users
                  </div>
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none mt-[13px]">
                    <CountUp
                      end={companyDashboardData?.activeUsersCountByUserType
                        ?.totalActiveUsers ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px] sm:text-[12px] text-[9px]">
                    Today Active Users
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[2.5rem] lg:h-[3.7rem] h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
                  <div
                    onClick={() => {
                      handleActiveUser();
                    }}
                    className="flex cursor-pointer items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
                  >
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
              <div class="w-full h-full relative !bg-header rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px] border-0 cardOuter !bg-header">
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none">
                    ₹<CountUp
                      end={companyDashboardData?.receiptData?.thisMonth ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px]  sm:text-[12px] text-[9px] xl:text-[13px]">
                    Total Receipts
                  </div>
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none mt-[13px]">
                    ₹<CountUp
                      end={companyDashboardData?.receiptData?.today ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px]  sm:text-[12px] text-[9px] xl:text-[13px]">
                    Today Receipts
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[2.5rem] lg:h-[3.7rem] h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] ">
                  <div
                    onClick={() => {
                      handleReciept();
                    }}
                    className="flex cursor-pointer items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
                  >
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
              <div class="w-full h-full relative !bg-header rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px]  cardOuter !bg-header ">
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none">
                    ₹<CountUp
                      end={companyDashboardData?.payment?.thisMonth ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px]  sm:text-[12px] text-[9px] xl:text-[13px]">
                    Total Payments
                  </div>
                  <div class="3xl:text-[22px] lg:text-[20px] text-[18px] font-[500] text-white leading-none mt-[13px]">
                    ₹ <CountUp
                      end={companyDashboardData?.payment?.today ?? 0}
                      duration={1}
                      separator=","
                      style={{ color: "white" }}
                    />
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px]  sm:text-[12px] text-[9px] xl:text-[13px]">
                    Today Payments
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[2.5rem] lg:h-[3.7rem] h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] ">
                  <div
                    onClick={() => {
                      handlePayment();
                    }}
                    className="flex cursor-pointer items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
                  >
                    <ImArrowUpRight2 className="lg:text-[20px] sm:text:[18px] text-[18px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white  word-break xl-w-[50%] lg:w-[55%] w-full grid grid-cols-1 rounded-xl relative">
              <div className="w-full flex flex-col items-center space-y-4 xl:px-[15px] lg:px-4 px-[12px] lg:py-4 py-3">
                <div className="w-full flex justify-between items-center">
                  <span className="3xl:text-[20px] font-[500] text-header flex-none">
                    Staff Summmary
                  </span>
                  {/* <BsThreeDotsVertical className="cursor-pointer" /> */}
                </div>
                {companyDashboardData?.staffSummary?.directorCount != 0 ||
                  companyDashboardData?.staffSummary?.HRCount != 0 ||
                  companyDashboardData?.staffSummary?.branchCount != 0 ||
                  companyDashboardData?.staffSummary?.employeCount != 0 ||
                  companyDashboardData?.staffSummary?.managerCount != 0 ||
                  companyDashboardData?.staffSummary?.ownerCount != 0 ||
                  companyDashboardData?.staffSummary?.traineeCount != 0 ? (
                  <div className="3xl:w-44 xl:w-[100px] 3xl:h-44 xl:h-[100px] ">
                    <Doughnut data={data} options={options} />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full w-full">
                    <Empty />
                  </div>
                )}

                <div className="w-full grid 3xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 grid-cols-3 gap-4 !pr-5">
                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg 3xl:px-1.5 px-1 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] rounded bg-[#FF0000] flex-none"></span>
                      <span className="lg:text-[12px] text-[9px] font-[400] ">
                        Director
                      </span>
                    </div>

                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.staffSummary?.directorCount ?? 0}
                    </div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg 3xl:px-1.5 px-1 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] rounded bg-[#1AA4FF] flex-none"></span>
                      <span className="lg:text-[12px] text-[9px] font-[400]">
                        Branch
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.staffSummary?.branchCount ?? 0}
                    </div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg 3xl:px-1.5 px-1 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] rounded bg-green-500 flex-none"></span>
                      <span className="lg:text-[12px] text-[9px] font-[400]">
                        Manager
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.staffSummary?.managerCount ?? 0}
                    </div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg 3xl:px-1.5 px-1 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] rounded bg-yellow-500 flex-none"></span>
                      <span className="lg:text-[12px] text-[9px] font-[400]">
                        HR
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.staffSummary?.HRCount ?? 0}
                    </div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg 3xl:px-1.5 px-1 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] rounded bg-[#074173] flex-none"></span>
                      <div className="lg:text-[12px] text-[11px] truncate whitespace-nowrap font-[400] word-break">
                        Employee
                      </div>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.staffSummary
                        ?.designationEmployeCount ?? 0}
                    </div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg 3xl:px-1.5 px-1 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] rounded bg-[#d4f5db] flex-none"></span>
                      <span className="lg:text-[12px] truncate whitespace-nowrap text-[11px] font-[400]">
                        Trainee
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.staffSummary?.traineeCount ?? 0}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 lg:w-16 w-[2.5rem] lg:h-16 h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                <div
                  onClick={() => {
                    params.set("status", "true");
                    navigate(
                      `/admin/employe-report/${encrypt(
                        sidebarListData?.find((data) => data?.slug == "employe")
                          ?._id
                      )}?${params.toString()}`
                    );
                  }}
                  class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
                >
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                </div>
              </div>
            </div>
          </div>
          {userInfoglobal?.userType !== "employee" && <QuickLinksSection />}
          <TodoList />
          {/* {userInfoglobal?.userType !== "employee" && <QuickLinksSectionManager center={'task-list'} />} */}
          {userInfoglobal?.userType === "employee" && userInfoglobal?.roleKey === "manager" && <QuickLinksSectionManager />}
          <div class="w-full  grid md:grid-cols-2 grid-cols-1 gap-5 my-2">
            <div class="w-full space-y-3 lg:px-4 px-[15px] py-2.5 h-72 relative bg-[#ffff]  rounded-xl text-header ">
              <p class="text-left 3xl:text-[20px] lg:text-lg text-[14px] font-[500]">
                Invoice Summary
              </p>
              <form className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white rounded">
                  <Controller
                    name="select1"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          setValue("select1", e.target.value);
                          dispatch(
                            invoiceSummary({
                              companyId:
                                userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                              branchId:
                                userInfoglobal?.userType === "company" ||
                                  userInfoglobal?.userType === "admin" ||
                                  userInfoglobal?.userType ===
                                  "companyDirector"
                                  ? ""
                                  : userInfoglobal?.userType ===
                                    "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,
                              departmentId:
                                userInfoglobal?.userType === "employee"
                                  ? userInfoglobal?.departmentId
                                  : "",
                              invoiceLayoutId: select2,
                              monthName: select3,
                              year: select4,
                              sort: false,
                              status: e.target.value,
                              isPagination: true,
                            })
                          );
                        }}
                        className="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none"
                      >
                        <option value="">
                          Select Payment type
                        </option>
                        <option value="PendingPayment">
                          Pending Payment
                        </option>
                        <option value="Paid">Paid</option>
                      </select>
                    )}
                  />
                </div>
                <div className="flex items-center bg-white rounded">
                  <Controller
                    name="select2"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          setValue("select2", e.target.value);
                          dispatch(
                            invoiceSummary({
                              companyId:
                                userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                              branchId:
                                userInfoglobal?.userType === "company" ||
                                  userInfoglobal?.userType === "admin" ||
                                  userInfoglobal?.userType ===
                                  "companyDirector"
                                  ? ""
                                  : userInfoglobal?.userType ===
                                    "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,
                              departmentId:
                                userInfoglobal?.userType === "employee"
                                  ? userInfoglobal?.departmentId
                                  : "",
                              invoiceLayoutId: e.target.value,
                              monthName: select3,
                              year: select4,
                              sort: false,
                              status: select1,
                              isPagination: true,
                            })
                          );
                        }}
                        className="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none"
                      >
                        <option value="">Address</option>
                        {companyDashboardData?.invoiceLayout.map(
                          (invoice, index) => (
                            <option key={index} value={invoice?._id}>
                              {invoice?.firmName}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  />
                </div>
                <div className="flex items-center bg-white rounded">
                  <Controller
                    name="select3"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          setValue("select3", e.target.value);
                          dispatch(
                            invoiceSummary({
                              companyId:
                                userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                              branchId:
                                userInfoglobal?.userType === "company" ||
                                  userInfoglobal?.userType === "admin" ||
                                  userInfoglobal?.userType ===
                                  "companyDirector"
                                  ? ""
                                  : userInfoglobal?.userType ===
                                    "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,
                              departmentId:
                                userInfoglobal?.userType === "employee"
                                  ? userInfoglobal?.departmentId
                                  : "",
                              invoiceLayoutId: select2,
                              monthName: e.target.value,
                              year: select4,
                              sort: false,
                              status: select1,
                              isPagination: true,
                            })
                          );
                        }}
                        className="bg-transparent capitalize w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none"
                      >
                        <option value="">Month</option>
                        {months.map((month, index) => (
                          <option key={index} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <div className="flex items-center bg-white rounded">
                  <Controller
                    name="select4"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          setValue("select4", e.target.value);
                          dispatch(
                            invoiceSummary({
                              companyId:
                                userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                              branchId:
                                userInfoglobal?.userType === "company" ||
                                  userInfoglobal?.userType === "admin" ||
                                  userInfoglobal?.userType ===
                                  "companyDirector"
                                  ? ""
                                  : userInfoglobal?.userType ===
                                    "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,
                              departmentId:
                                userInfoglobal?.userType === "employee"
                                  ? userInfoglobal?.departmentId
                                  : "",
                              invoiceLayoutId: select2,
                              monthName: select3,
                              year: e.target.value,
                              sort: false,
                              status: select1,
                              isPagination: true,
                            })
                          );
                        }}
                        className="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none"
                      >
                        <option value="">Year</option>
                        {years.map((year, index) => (
                          <option key={index} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </form>

              <div className="space-y-1.5 ">
                <div className="flex justify-between items-center">
                  <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                    Invoice Billed
                  </span>
                  <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                    ₹ {(invoiceSummarydata?.invoiceBilled ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                    GST Charged
                  </span>
                  <div>
                    <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                      ₹ {(invoiceSummarydata?.gstCharged ?? 0).toFixed(2)}
                    </span>
                    <hr className="bg-black " />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                    Total Billed
                  </span>
                  <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                    ₹ {(invoiceSummarydata?.totalBilled ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  handleInvoiceSummary();
                }}
                className="absolute bottom-0 right-0 lg:w-16 w-[2.5rem] lg:h-16 h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]"
              >
                <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px] text-black" />
                </div>
              </div>
            </div>
            <div class="w-full relative h-72 py-2.5 bg-[#ffff] rounded-xl space-y-3 lg:px-4 px-[15px] text-header">
              <p class="text-left lg:text-lg text-[14px] font-[500] lg:font-nomal">
                Pending Invoices
              </p>
              <form className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white rounded">
                  <Controller
                    name="select5"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          setValue("select5", e.target.value);
                          dispatch(
                            pendingInvoiceSummary({
                              companyId:
                                userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                              branchId:
                                userInfoglobal?.userType === "company" ||
                                  userInfoglobal?.userType === "admin" ||
                                  userInfoglobal?.userType ===
                                  "companyDirector"
                                  ? ""
                                  : userInfoglobal?.userType ===
                                    "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,
                              departmentId:
                                userInfoglobal?.userType === "employee"
                                  ? userInfoglobal?.departmentId
                                  : "",
                              monthName: e.target.value,
                              year: select6,
                            })
                          );
                        }}
                        className="bg-transparent capitalize w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none"
                      >
                        <option value="">Month</option>
                        {months.map((month, index) => (
                          <option key={index} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div className="flex items-center bg-white rounded">
                  <Controller
                    name="select6"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          setValue("select6", e.target.value);
                          dispatch(
                            pendingInvoiceSummary({
                              companyId:
                                userInfoglobal?.userType === "company"
                                  ? userInfoglobal?._id
                                  : userInfoglobal?.companyId,
                              branchId:
                                userInfoglobal?.userType === "company" ||
                                  userInfoglobal?.userType === "admin" ||
                                  userInfoglobal?.userType ===
                                  "companyDirector"
                                  ? ""
                                  : userInfoglobal?.userType ===
                                    "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,
                              departmentId:
                                userInfoglobal?.userType === "employee"
                                  ? userInfoglobal?.departmentId
                                  : "",
                              monthName: select5,
                              year: e.target.value,
                            })
                          );
                        }}
                        className="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none"
                      >
                        <option value="">Year</option>
                        {years.map((year, index) => (
                          <option key={index} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </form>
              <div className="w-full space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                    Total Tasks
                  </span>
                  <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                    {pendingInvoiceSummarydata?.totalTasks ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                    Total Clients
                  </span>
                  <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                    {pendingInvoiceSummarydata?.totalClients ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                    Total Charged
                  </span>
                  <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                    ₹ {pendingInvoiceSummarydata?.totalCharged ?? 0}
                  </span>
                </div>
              </div>

              <div
                onClick={() => {
                  handlePendingInVoice();
                }}
                className="absolute bottom-0 right-0 lg:w-16 w-[2.5rem] lg:h-16 h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]"
              >
                <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px] text-black" />
                </div>
              </div>
            </div>
          </div>



          <div className="w-full lg:flex gap-3 overflow-hidden my-2">
            <div className="3xl:w-[54%] xl:w-[49%] sm:w-full relative rounded-xl bg-white  xl:mb-0">
              <Calendar
                combinedData={combinedData}
                currentDate={currentDate}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                companyDashboardData={companyDashboardData}
              />
            </div>
            <div className="3xl:w-[45%] xl:w-[50%] sm:w-full relative bg-[#ffff] rounded-xl">
              <div className="w-full h-full flex flex-col justify-between items-center space-y-4 md:px-10 lg:px-[15px] xl:px-[15px] px-3 py-3">
                <div className="w-full flex justify-between items-center">
                  <span className="text-left 3xl:text-[20px] font-[500] text-header">
                    Client Summary
                  </span>
                  <div className="flex items-center ">
                    {selectedFilter && (
                      <span className="text-sm mr-2 text-header">
                        {selectedFilter === "Custom Date" &&
                          fromDateNew &&
                          toDateNew
                          ? `${dayjs(fromDateNew).format(
                            "MMM D, YYYY"
                          )} - ${dayjs(toDateNew).format("MMM D, YYYY")}`
                          : selectedFilter}
                      </span>
                    )}
                    <div className="relative">
                      <Dropdown overlay={menu} trigger={["click"]}>
                        <div onClick={handleClient}>
                          <MdTune className="cursor-pointer" size={24} />
                        </div>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <Bar data={clientData} options={clientOptions} />
                <div className="w-full grid grid-cols-[0.5fr_0.5fr] lg:gap-4 gap-2 md:pr-20 pr-16">
                  <div className="max-w-[100px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] flex-none rounded bg-[#074173]"></span>
                      <span className="lg:text-[12px] whitespace-nowrap sm:text-[11px] text-[10px] font-[400]">
                        Total Client
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.clientSummery?.totalClient || 0}
                    </div>
                  </div>
                  <div className="max-w-[100px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] flex-none rounded bg-[#eab308]"></span>
                      <span className="lg:text-[12px] whitespace-nowrap sm:text-[11px] text-[10px] font-[400]">
                        Active
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.clientSummery?.activeClient || 0}
                    </div>
                  </div>
                  <div className="max-w-[100px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] flex-none rounded bg-[#22c55e]"></span>
                      <span className="lg:text-[12px] whitespace-nowrap sm:text-[11px] text-[10px] font-[400]">
                        In-Active
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">
                      {companyDashboardData?.clientSummery?.inactiveClient || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 lg:w-16 w-[2.5rem] lg:h-16 h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                <div
                  onClick={() => {
                    params.set("status", "true");
                    navigate(
                      `/admin/client-allclient-report/${encrypt(
                        sidebarListData?.find((data) => data?.slug == "employe")
                          ?._id
                      )}?${params.toString()}`
                    );
                  }}
                  className="flex cursor-pointer items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
                >
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px] text-black" />
                </div>
              </div>

              <Modal
                title="Select Date Range"
                visible={isDateModalVisible}
                onOk={handleDateOk}
                onCancel={handleDateCancel}
                className="antmodalclassName"
                centered
                okButtonProps={{ disabled: !fromDateNew || !toDateNew }}
              >
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block mb-2">From Date:</label>
                    <DatePicker
                      value={fromDateNew}
                      onChange={handleFromDateChange}
                      getPopupContainer={(triggerNode) => document.body}
                      popupStyle={{ zIndex: 1600 }}
                      style={{ width: "100%" }}
                      className={` ${inputCalanderClassName}  `}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">To Date:</label>
                    <DatePicker
                      value={toDateNew}
                      onChange={handleToDateChange}
                      style={{ width: "100%" }}
                      getPopupContainer={() => document.body}
                      popupStyle={{ zIndex: 1600 }}
                      className={` ${inputCalanderClassName}  `}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </div>

          <div className="w-full relative rounded-xl bg-white mb-3 xl:mb-0">

            <div className="w-full flex flex-col items-center space-y-4 md:px-10 xl:px-[15px] lg:px-[10px] px-3 py-3">
              {/* Task Summary Header */}
              <div className="w-full flex lg:flex-row justify-between items-center">
                <span className="text-left 3xl:text-[20px] font-[500] text-header">
                  Task Summary
                </span>
                <div className="flex items-center">
                  {selectedFilterTask && (
                    <span className="text-sm mr-2 text-header">
                      {selectedFilterTask === "Custom Date" && fromDateNewTask && toDateNewTask
                        ? `${dayjs(fromDateNewTask).format("MMM D, YYYY")} - ${dayjs(toDateNewTask).format("MMM D, YYYY")}`
                        : selectedFilterTask}
                    </span>
                  )}
                  <div className="relative">
                    <Dropdown overlay={TaskMenu} trigger={["click"]}>
                      <div onClick={handleTask}>
                        <MdTune className="cursor-pointer" size={24} />
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>

              {/* Total Count Block */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4 mb-4">
                <div className="w-full border-[1px] rounded-lg px-4 py-3 bg-blue-50">
                  <div className="text-sm text-gray-600">Total Tasks</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {companyDashboardData?.taskSummery?.taskSummary?.totalTask || 0}
                  </div>
                </div>
                <div onClick={() => handleTodayTask('today')} className="w-full border-[1px] rounded-lg px-4 py-3 bg-green-50">
                  <div className="text-sm text-gray-600">Today Tasks</div>
                  <div className="text-2xl font-bold text-green-800">
                    {companyDashboardData?.taskSummery?.todayTaskSummary?.totalTask || 0}
                  </div>
                </div>
                <div className="w-full border-[1px] rounded-lg px-4 py-3 bg-red-50">
                  <div className="text-sm text-gray-600">OverDue Tasks</div>
                  <div className="text-2xl font-bold text-red-800">
                    {companyDashboardData?.taskSummery?.taskSummary?.statusOverview ? Object.entries(companyDashboardData?.taskSummery?.taskSummary?.statusOverview)?.reduce((acc, cur) => {
                      const [statusname, value] = cur
                      if (statusname !== "stop" && statusname !== "completed") {
                        acc = acc + (value?.overdue || 0)
                      }
                      return acc
                    }, 0) : 0}
                  </div>
                </div>
              </div>



              {/* Status Mapping for Display */}
              {(() => {
                const statusMap = {
                  pending: "Self Assign",
                  rejected: "Rejected",
                  assigned: "Assigned",
                  restart: "Restart",
                  reassigned: "Reassigned",
                  reqRejected: "Request Rejected",
                  accepted: "Accepted",
                  reassignToOther: "Reassign To Other",
                  pendingAtClient: "Pending At Client",
                  pendingAtDepartment: "Pending At Department",
                  pendingAtColleague: "Pending At Colleague",
                  pendingAtManager: "Pending At Manager",
                  workInProgress: "Work In Progress",
                  pendingForApproval: "Pending For Approval",
                  pendingForFee: "Pending For Fee",
                  completed: "Completed",
                  stop: "Stop"
                };

                const statusMap2 = {
                  pending: "Pending",
                  rejected: "Rejected",
                  assigned: "Assigned",
                  restart: "re_start",
                  reassigned: "re_assigned",
                  reqRejected: "request_rejected",
                  accepted: "Accepted",
                  reassignToOther: "reAssign_to_other",
                  pendingAtClient: "Pending_at_client",
                  pendingAtDepartment: "Pending_at_department",
                  pendingAtColleague: "Pending_at_colleague",
                  pendingAtManager: "Pending_at_manager",
                  workInProgress: "Work_in_progress",
                  pendingForApproval: "Pending_for_approval",
                  pendingForFee: "Pending_for_fees",
                  completed: "Completed",
                  stop: "Task_Stop"
                };
                const center = (userInfoglobal?.userType === "employee" && userInfoglobal?.roleKey === "manager") ? 'manager-task-list' : 'task-list'
                const managerTaskListId = sidebarListData?.find(data => data?.slug === center)?._id;
                // Get the status overview data and sort it by name alphabetically
                const statusData = companyDashboardData?.taskSummery?.taskSummary?.statusOverview || {};
                const sortedStatuses = Object.entries(statusData).sort(
                  ([statusA], [statusB]) => {
                    const nameA = statusMap[statusA] || statusA;
                    const nameB = statusMap[statusB] || statusB;
                    return nameA.localeCompare(nameB);
                  }
                );

                return (
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                    {sortedStatuses.map(([status, { total, overdue }]) => (
                      <div key={status} onClick={() => navigate(`/admin/${center}/${encrypt(managerTaskListId)}?status=${statusMap2[status]}`)} className="w-full border-[1px] rounded-lg px-2 py-1 cursor-pointer">
                        <div className="flex justify-start gap-1 items-center">
                          <span
                            className="w-3 h-3 3xl:w-[10px] 3xl:h-[10px] xl:w-[9px] xl:h-[8px] flex-none rounded"
                            style={{ backgroundColor: STATUS_COLORS[status] || '#cccccc' }}
                          ></span>
                          <span className="lg:text-[12px] xl:text-[10px] sm:text-[11px] text-[10px] font-[400]">
                            {statusMap[status] || status}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Total:</span>
                          <span className="text-sm font-bold">{total ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Today:</span>
                          <span className="text-sm font-bold">{companyDashboardData?.taskSummery?.todayTaskSummary?.[status] || 0}</span>
                        </div>
                        {/* <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Overdue:</span>
                          <span className="text-sm font-bold">{overdue ?? 0}</span>
                        </div> */}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>


            <div className="absolute bottom-0 right-0 lg:w-16 w-[2.5rem] lg:h-16 h-[2.5rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
              <div
                onClick={() => {
                  handleTaskSummary();
                }}
                className="flex cursor-pointer items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full"
              >
                <ImArrowUpRight2 className="lg:text-[20px] text:[18px] text-black" />
              </div>
            </div>

            <Modal
              title="Select Date Range"
              className="antmodalclassName"
              visible={isDateModalVisibleTask}
              onOk={handleDateOkTask}
              onCancel={handleDateCancelTask}
              centered
              okButtonProps={{ disabled: !fromDateNewTask || !toDateNewTask }}
            >
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block mb-2">From Date:</label>
                  <DatePicker
                    value={fromDateNewTask}
                    onChange={handleFromDateChangeTask}
                    getPopupContainer={(triggerNode) => document.body}
                    popupStyle={{ zIndex: 1600 }}
                    style={{ width: "100%" }}
                    className={` ${inputCalanderClassName}  `}
                  />
                </div>
                <div>
                  <label className="block mb-2">To Date:</label>
                  <DatePicker
                    value={toDateNewTask}
                    onChange={handleToDateChangeTask}
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => document.body}
                    popupStyle={{ zIndex: 1600 }}
                    className={` ${inputCalanderClassName}  `}
                  />
                </div>
              </div>
            </Modal>
          </div>



          {userInfoglobal?.roleKey === "manager" && (
            <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
              <div className="py-2 px-4 text-header">Leave Request List</div>
              <div className=" w-full  overflow-x-auto">
                {leaveRequestData?.length > 0 ? (
                  <table className=" w-full  divide-y divide-gray-200">
                    <thead className="bg-gray-50 w-full">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Name
                        </th>

                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          reason
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Start Date
                        </th>

                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          End Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Sub Type
                        </th>

                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y w-full  divide-gray-200">
                      {leaveRequestData?.length > 0 ? (
                        leaveRequestData?.map((approval) => (
                          <tr key={approval._id} className="hover:bg-gray-50">
                            <td className="px-4 text-xs py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {approval?.employeName || "-"}
                              </div>
                            </td>

                            <td className="px-4 text-xs py-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                {approval?.reason || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                              <div className="flex flex-col">
                                {dayjs(approval?.startDate).format(
                                  "DD-MM-YYYY"
                                ) || "-"}
                              </div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={` text-sm  flex items-center `}>
                                {dayjs(approval?.endDate).format(
                                  "DD-MM-YYYY"
                                ) || "-"}
                              </div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                              <div className="flex flex-col">
                                {approval?.type || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                              <div className="flex flex-col">
                                {approval?.subType || "-"}
                              </div>
                            </td>

                            <td className="px-4 py-3 !text-center whitespace-nowrap ">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReject(approval?._id)}
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                  disabled={approval?.status !== "Pending"}
                                >
                                  <RiDeleteBin5Line
                                    // className={` ${"text-red-600 hover:text-red-500"}`}
                                    className={` ${approval?.status === "Pending"
                                      ? "text-red-600 hover:text-red-500"
                                      : "text-gray-600 hover:text-gray-500"
                                      }`}
                                    size={16}
                                  />
                                </button>
                                <button
                                  onClick={() => handleApprove(approval?._id)}
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                  disabled={approval?.status !== "Pending"}
                                >
                                  <FaCheck
                                    // className={` ${"text-green-600 hover:text-green-500"}`}
                                    className={` ${approval?.status === "Pending"
                                      ? "text-green-600 hover:text-green-500"
                                      : "text-gray-600 hover:text-gray-500"
                                      }`}
                                    size={16}
                                  />
                                </button>
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
          )}

          {(userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "companyBranch" ||
            userInfoglobal?.userType === "companyDirector"
          ) && (
              <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
                <div className="py-2 px-4 text-header">Salary Increament</div>
                <div className=" w-full  overflow-x-auto">
                  {incrementListData?.docs?.length > 0 ? (
                    <table className=" w-full  divide-y divide-gray-200">
                      <thead className="bg-gray-50 w-full">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            S.No
                          </th>

                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Employe Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Is Percentage
                          </th>

                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Percentage
                          </th>

                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Amount
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Next Increment date
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Remark
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Status
                          </th>

                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y w-full  divide-gray-200">
                        {incrementListData?.docs &&
                          incrementListData?.docs?.length > 0 ? (
                          incrementListData?.docs?.map((element, index) => (
                            <tr key={element._id} className="hover:bg-gray-50">
                              <td className="px-4 text-xs py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  {index + 1 || "-"}
                                </div>
                              </td>

                              <td className="px-4 text-xs py-3 whitespace-nowrap">
                                <div className="flex flex-col">
                                  {element?.employeName || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-xs">
                                <div className="flex flex-col">
                                  {element?.isPercentage ? "YES" : "NO" || "-"}
                                </div>
                              </td>

                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className={` text-sm  flex items-center `}>
                                  {element?.incrementPercentage || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-xs">
                                <div className="flex flex-col">
                                  {element?.incrementAmount || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-xs">
                                <div className="flex flex-col">
                                  {moment(element?.nextIncrementDate).format(
                                    "YYYY-MM-DD"
                                  ) || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs">
                                <div className="flex whitespace-normal break-words max-w-72  flex-col">
                                  {element?.remark || "-"}
                                </div>
                              </td>

                              <td className="px-4 py-3 whitespace-nowrap text-xs">
                                <span
                                  className={`${element?.status
                                    ? "bg-[#E0FFBE] border-green-500"
                                    : "bg-red-200 border-red-500"
                                    } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                                >
                                  {element?.status ?? "-"}
                                </span>
                              </td>

                              <td className="px-4 py-3 !text-center whitespace-nowrap ">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleStatusIncrement(
                                        element?._id,
                                        "Rejected"
                                      )
                                    }
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                    disabled={element?.status !== "Pending"}
                                  >
                                    <RiDeleteBin5Line
                                      // className={` ${"text-red-600 hover:text-red-500"}`}
                                      className={` ${element?.status === "Pending"
                                        ? "text-red-600 hover:text-red-500"
                                        : "text-gray-600 hover:text-gray-500"
                                        }`}
                                      size={16}
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusIncrement(
                                        element?._id,
                                        "Approved"
                                      )
                                    }
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                    disabled={element?.status !== "Pending"}
                                  >
                                    <FaCheck
                                      // className={` ${"text-green-600 hover:text-green-500"}`}
                                      className={` ${element?.status === "Pending"
                                        ? "text-green-600 hover:text-green-500"
                                        : "text-gray-600 hover:text-gray-500"
                                        }`}
                                      size={16}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9}>
                              <div className="flex justify-center items-center h-full w-full">
                                <Empty />
                              </div>
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
            )}

          <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
            <div className="py-2 px-4 text-header">Request Task List</div>
            <div className=" w-full  overflow-x-auto">
              {commonTaskReq?.length > 0 ? (
                <table className=" w-full  divide-y divide-gray-200">
                  <thead className="bg-gray-50 w-full">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Request Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Employee Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Client Name
                      </th>

                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Task Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        requestFor
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Request Date
                      </th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                       Update By
                      </th>                   */}

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y w-full  divide-gray-200">
                    {commonTaskReq?.length > 0 ? (
                      commonTaskReq?.map((approval) => (
                        <tr key={approval._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 !text-center whitespace-nowrap ">
                            <div className="flex gap-2">
                              {approval?.type !== "commentReq" && (
                                <button
                                  onClick={() => handleTaskReject(approval)}
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <RiDeleteBin5Line
                                    // className={` ${"text-red-600 hover:text-red-500"}`}
                                    className={`text-red-600 hover:text-red-500`}
                                    size={16}
                                  />
                                </button>
                              )}
                              {approval?.type !== "commentReq" && (
                                <button
                                  onClick={() =>
                                    handleTaskApprove(approval, "forApprove")
                                  }
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <FaCheck
                                    // className={` ${"text-green-600 hover:text-green-500"}`}
                                    className={`text-green-600 hover:text-green-500`}
                                    size={16}
                                  />
                                </button>
                              )}

                              {approval?.type == "commentReq" && (
                                <button
                                  onClick={() =>
                                    handleTaskApprove(approval, "forComment")
                                  }
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <FaCommentDots
                                    // className={` ${"text-green-600 hover:text-green-500"}`}
                                    className={` ${approval?.status === "Pending"
                                      ? "text-green-600 hover:text-green-500"
                                      : "text-gray-600 hover:text-gray-500"
                                      }`}
                                    size={16}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.type === "commentReq"
                                ? "Comment Request"
                                : approval?.type === "taskReq" &&
                                  approval?.isSelfAssigned
                                  ? "Self Assign Request"
                                  : "Reassign Request"}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.assignTo || "-"}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.clientName || "-"}
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
                              {moment(approval?.createdAt).format(
                                "DD-MM-YYYY"
                              ) || "-"}
                            </div>
                          </td>
                          {/* <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {approval?.updateBy || "-"}
                            </div>
                          </td> */}


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

          <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
            <div className="py-2 px-4 text-header">Latest Task List</div>
            <div className=" w-full  overflow-x-auto">
              {companyDashboardData?.latestTask?.length > 0 ? (
                <table className=" w-full  divide-y divide-gray-200">
                  <thead className="bg-gray-50 w-full">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Client Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Task Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Period
                      </th>

                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Employee Name
                      </th>

                      {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Financial Year
                      </th> */}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Date of Assignment
                      </th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        fee
                      </th> */}

                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y w-full  divide-gray-200">
                    {companyDashboardData?.latestTask?.length > 0 ? (
                      companyDashboardData?.latestTask?.map((approval) => (
                        <tr key={approval._id} className="hover:bg-gray-50">
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.clientDetails?.fullName || "-"}
                            </div>
                          </td>
                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.taskName || "-"}
                            </div>
                          </td>

                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {approval?.financialYear || "-"}
                            </div>
                          </td>

                          <td className="px-4 text-xs py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                {" "}
                                {approval?.employeeDetails[0]?.fullName}
                              </div>{" "}
                              {approval?.employeeDetails?.length > 1 ? (
                                <div className="text-header flex justify-center items-center gap-1 rounded-full  text-semibold text-sm">
                                  {" "}
                                  +{" "}
                                  <div
                                    onClick={() => {
                                      handleEmployeeModal(
                                        approval?.employeeDetails
                                      );
                                    }}
                                    className="border justify-center items-center flex h-7 w-7 bg-header  text-white text-[12px] rounded-full "
                                  >
                                    {approval?.employeeDetails?.length - 1}{" "}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                          {/* <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {approval?.remarks || "-"}
                            </div>
                          </td> */}

                          {/* <td className="px-4 py-3 whitespace-nowrap">
                            <div
                              className={` text-sm  flex items-center `}
                            >
                              {approval?.financialYear || "-"}
                            </div>
                          </td> */}
                          <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {moment(approval?.createdAt).format(
                                "DD-MM-YYYY"
                              ) || "-"}
                            </div>
                          </td>
                          {/* <td className="px-4 py-3 whitespace-nowrap text-xs">
                            <div className="flex flex-col">
                              {approval?.fee || "-"}
                            </div>
                          </td> */}

                          <td className="px-4 py-3 !text-center whitespace-nowrap ">
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
                          </td>
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

          <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
            <div className="py-2 px-4 text-header">Latest client List</div>
            <div className=" w-full overflow-auto ">
              <table className=" w-full  divide-y divide-gray-200">
                <thead className="bg-gray-50 w-full">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Profile
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Group Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      client Name
                    </th>

                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      mobile
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Created At
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Created By
                    </th> */}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Action
                    </th>

                    {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th> */}

                    {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Profile
                          </th>

                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Round Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meeting Url
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th> */}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y w-full  divide-gray-200">
                  {companyDashboardData?.latestClient?.length > 0 ? (
                    companyDashboardData?.latestClient?.map((data) => (
                      <tr key={data._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <img
                            src={
                              data.profileImage
                                ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${data.profileImage}`
                                : "/images/avatar.jpg"
                            }
                            className="w-8 h-8 rounded-full mr-2 ring-1 ring-amber-300"
                            alt={"img"}
                          />
                        </td>

                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.groupName || "-"}
                          </div>
                        </td>

                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.fullName || "-"}
                          </div>
                        </td>

                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.mobile?.code || "-"}{" "}
                            {data?.mobile?.number || "-"}
                          </div>
                        </td>
                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.email || "-"}
                          </div>
                        </td>
                        {/* <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {dayjs(data?.createdAt).format("YYYY-MM-DD hh:mm a") ||
                              "-"}
                          </div>
                        </td>
                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.createdBy || "-"}
                          </div>
                        </td> */}
                        <td className="px-4 py-3 whitespace-nowrap ">
                          <div
                            onClick={() => {
                              navigate(
                                `/admin/client/clientView/${encrypt(data?._id)}`
                              );
                            }}
                            className="h-5 rounded-full bg-[#DC2E8D] text-white w-5 flex justify-center items-center"
                          >
                            <MdArrowOutward />
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
                        No Latest Clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Modal
            className="antmodalclassName w-full sm:!w-[60%] !h-[50%]"
            title="Employees"
            open={empModal}
            onCancel={() => setEmpModal(false)}
            footer={null}
          >
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead>
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap  w-[5%]">
                    S.No.
                  </th>

                  <th className="border-none p-2 whitespace-nowrap ">
                    Employee Name
                  </th>
                  {/*           
                            <th className="border-none p-2 whitespace-nowrap ">Email</th>
                            <th className="border-none p-2 whitespace-nowrap ">Mobile</th> */}
                </tr>
              </thead>
              {empArray.length == 0 ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={15}
                    className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {empArray && empArray?.length > 0 ? (
                    empArray?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-[#DDDDDD] text-[#374151] text-[14px]`}
                      >
                        <td className="whitespace-nowrap  border-none p-2">
                          {index + 1}
                        </td>

                        {/* <td className="whitespace-nowrap  border-none p-2">
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
                                          </td> */}

                        <td className="whitespace-nowrap  border-none p-2">
                          {element?.fullName}
                        </td>

                        {/* <td className="whitespace-nowrap  border-none p-2">
                                      {element?.email || "-"}
                                    </td>
          
                                    <td className="whitespace-nowrap  border-none p-2">
                                      {element?.mobile?.code || "-"}{" "}
                                      {element?.mobile?.number || "-"}
                                    </td> */}

                        {/* <td className="whitespace-nowrap text-center  border-none p-2">
                                            <div onClick={()=>{handleDepartmentModal(element)}} className="flex justify-center items-center rounded-md h-10 w-10 border-2 border-cyan-500">
                                              {element?.departmentData?.length || 0}
                                            </div>
                                          </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={15}
                        className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </Modal>

          {/* <div className="w-full flex flex-col  gap-2 bg-white mt-3 hide-scrollbar-y  rounded-lg">
            
            <div className="py-2 px-4 text-header">Visitor List</div>
            <div className=" w-full overflow-auto ">

              <table className=" w-full  divide-y divide-gray-200">
                <thead className="bg-gray-50 w-full">
                  <tr>
                   
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Visitor Name
                    </th>
                    
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      mobile
                    </th>
                  
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Check In Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Check Out Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Created At
                    </th>
                   
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Action
                    </th>
                  
                  </tr>
                </thead>

                <tbody className="bg-white divide-y w-full  divide-gray-200">
                  {companyDashboardData?.generalVisitors?.length > 0 ? (
                    companyDashboardData?.generalVisitors?.map((data) => (
                      <tr key={data._id} className="hover:bg-gray-50">
                       
                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.name || "-"}
                          </div>
                        </td>

                     
                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.mobile?.code || "-"} {data?.mobile?.number || "-"}
                          </div>
                        </td>

                         <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.checkInTime ? dayjs(data?.checkInTime).format('DD-MM-YYYY hh:mm a') : "-"}
                          </div>
                        </td>

                            <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {data?.checkOutTime ? dayjs(data?.checkOutTime).format('DD-MM-YYYY hh:mm a') : "-"}
                          </div>
                        </td>

                       
                        <td className="px-4 text-xs py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {dayjs(data?.createdAt).format("YYYY-MM-DD hh:mm a") ||
                              "-"}
                          </div>
                        </td>
                       
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            disabled={(data?.checkOutTime&&data?.checkInTime)}
                            onClick={() => {
                              handleVisitors(data)
                            }}
                            className={`h-6 rounded-full ${(data?.checkOutTime&&data?.checkInTime) ? 'bg-gray-400' : ' bg-[#DC2E8D]'} text-white w-6 flex justify-center items-center`}
                          >
                            <RxEnter />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No Visitor Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div> */}

          <div className="xl:hidden block w-full mt-3">
            <NoticeBoard />
          </div>
        </div>
        <div className="xl:w-[30%] w-full xl:h-[calc(100vh-100px)] pb-5 hide-scrollbar-y ">
          <div className="w-full  hidden xl:block space-y-3">
            <UserDetails
              leaveList={leaveList}
              birthdaydata={birthdaydata}
              inActiveUserToday={inActiveUserToday}
              todayWfhRequstData={todayWfhRequstData}
            // inActiveEmployeeToday={inActiveEmployeToday}
            />
          </div>

          <div className="xl:block hidden w-full">
            <NoticeBoard />
          </div>
        </div>
      </div>
    </>
  );
};
export default CompanyDashBoard;
