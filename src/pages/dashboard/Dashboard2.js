import React, { useState, useEffect } from "react";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import NoticeBoard from "./NoticeBoard";
import UserDetails from "./UserDetails";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Doughnut, Bar } from "react-chartjs-2";
// import Calendar from 'react-calendar';
import { ImArrowUpRight2 } from "react-icons/im";
import Calendar from "./Calendar";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdTune } from "react-icons/md";

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
import { FaSearch } from "react-icons/fa";
import { LoginDetails } from "../../component/LoginDetails/LoginDetails";
import NoticeBoardModal from "../../component/NoticeBoardModal/NoticeBoardModal";
import { domainName } from "../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { adminDashboard } from "../../redux/_reducers/_dashboard_reducers";

// import BarChart from "./BarChart";

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
const Dashboard2 = () => {
  const [isTaskModal, setIsTaskModal] = useState(false);
  const [isClientModal, setIsClientModal] = useState(false);
  const {adminDashboardData ,adminDashboard_loading} = useSelector((state)=>state?.dashboard)
  // const adminDashboardData  = useSelector((state)=>state)
const dispatch = useDispatch()
  const handleTask = () => {
    setIsTaskModal(!isTaskModal);
  };
  const handleClient = () => {
    setIsClientModal(!isClientModal);
  };
  useEffect(()=>{
if(userInfoglobal?.userType === "admin"){
  dispatch(adminDashboard())
}
  },[])



 const data = {
    labels: ["Admin", "Manager", "Sub-Admin", "Employee", "Receptionist"],
    datasets: [
      {
        label: "User Roles",
        data: [30, 30, 30, 30, 30], // Sample data
        backgroundColor: [
          "#FF0000", // Admin - Red
          "#1AA4FF", // Manager - Blue
          "#00CC00", // Sub-Admin - Green
          "#FFCC00", // Employee - Yellow
          "#074173", // Receptionist - Navy
        ],
        hoverBackgroundColor: [
          "#FF0000",
          "#1AA4FF",
          "#00CC00",
          "#FFCC00",
          "#074173",
        ],
        borderWidth: 1,
        cutout: "70%", // To make the chart a thinner ring
      },
    ],
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

  const taskData = {
    labels: [
      "Total Task",
      "Not Started",
      "In-Progress",
      "Task-Stopped",
      "Complete",
      "Overdue",
    ],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          "#074173", // Admin - Red
          "#FFA704", // Manager - Blue
          "#1AA4FF", // Sub-Admin - Green
          "#24C600", // Employee - Yellow
          "#FF0000", // Receptionist - Navy
        ],
        hoverBackgroundColor: [
          "#074173",
          "#FFA704",
          "#1AA4FF",
          "#24C600",
          "#FF0000",
        ],
        borderWidth: 0,
      },
    ],
  };

  const clientData = {
    labels: ["Total Task", "Not Started", "Done"],
    datasets: [
      {
        label: "Sales",
        data: [10, 80, 160],
        backgroundColor: [
          "#074173", // Admin - Red
          "#FFA704", // Manager - Blue
          "#FFA704", // Manager - Blue
        ],
        hoverBackgroundColor: ["#074173", "#FFA704"],
        borderWidth: 0,
      },
    ],
  };

  const taskOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Sales Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const clientOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Sales Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const events = {
    "2024-10-04": { type: "Meeting", color: "green" },
    "2024-10-08": { type: "Event", color: "orange" },
    "2024-10-10": { type: "To-Do", color: "blue" },
    "2024-10-12": { type: "Holiday", color: "blue" },
    "2024-10-25": { type: "Overdue", color: "red" },
  };

  const eventColors = {
    "To-Do": "bg-blue-500",
    Event: "bg-orange-500",
    Holiday: "bg-indigo-700",
    Meeting: "bg-green-500",
    Overdue: "bg-red-500",
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <GlobalLayout>
      {/* <div className="w-full h-full bg-gray-100"> */}

      <div className="block xl:flex xl:gap-5 space-y-3 xl:space-y-0 px-2 overflow-y-auto lg:overflow-hidden h-[90vh]">
        <div className="w-full lg:hidden block">
          <UserDetails />
        </div>
        <div className="xl:w-[76%] lg:h-[85vh] w-full space-y-3 overflow-y-auto">
          <div className="lg:flex justify-between items-start lg:space-x-5 space-y-3 lg:space-y-0">
            <div className="lg:w-[50%] w-full h-full grid grid-cols-2 gap-[20px]">
              <div class="w-full h-full relative bg-[#f3f4f6] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px] border-0 cardOuter !bg-header">
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none">
                    5452
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Total Visitors
                  </div>
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none mt-[13px]">
                    52
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Today Visitors
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[3rem] lg:h-[3.7rem] h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
                  <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
              <div class="w-full h-full relative bg-[#f3f4f6] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px] border-0 cardOuter !bg-header ">
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none ">
                    69
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Total Active Users
                  </div>
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none mt-[13px]">
                    39
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Today Active Users
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[3rem] lg:h-[3.7rem] h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
                  <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
              <div class="w-full h-full relative bg-[#f3f4f6] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px] border-0 cardOuter !bg-header">
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none">
                    $5869.21
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Total Receipts
                  </div>
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none mt-[13px]">
                    $00.25
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Today Receipts
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[3rem] lg:h-[3.7rem] h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
                  <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
              <div class="w-full h-full relative bg-[#f3f4f6] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
                <div class="w-full 3xl:p-[19px] p-[13px] border-0 cardOuter !bg-header ">
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none">
                    $6452.21
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Total Payments
                  </div>
                  <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none mt-[13px]">
                    $52.25
                  </div>
                  <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
                    Today Payments
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[3rem] lg:h-[3.7rem] h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
                  <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                    <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white lg:w-[50%] w-full grid grid-cols-1 rounded-xl relative">
              <div className="w-full flex flex-col items-center space-y-4 lg:px-10 px-[12px] lg:py-4 py-3">
                <div className="w-full flex justify-between items-center">
                  <span className="3xl:text-[20px] font-[500] text-header flex-none">
                    Staff Summmary
                  </span>
                  {/* <BsThreeDotsVertical className="cursor-pointer" /> */}
                </div>
                <div className="w-44 h-44 ">
                  <Doughnut data={data} options={options} />
                </div>
                <div className="w-full grid md:grid-cols-3 grid-cols-3 gap-4">
                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg px-1.5 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] rounded bg-[#FF0000] flex-none"></span>
                      <span className="lg:text-[12px] text-[11px] font-[400]">
                        Admin
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg px-1.5 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] rounded bg-[#1AA4FF] flex-none"></span>
                      <span className="lg:text-[12px] text-[11px] font-[400]">
                        Manager
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg px-1.5 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] rounded bg-green-500 flex-none"></span>
                      <span className="lg:text-[12px] text-[11px] font-[400]">
                        Sub-Admin
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg px-1.5 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] rounded bg-yellow-500 flex-none"></span>
                      <span className="lg:text-[12px] text-[11px] font-[400]">
                        Employee
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="w-full border-[1px] lg:rounded-xl rounded-lg px-1.5 py-[3px]">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] rounded bg-header flex-none"></span>
                      <span className="lg:text-[12px] text-[11px] font-[400]">
                        Receptionist
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 lg:w-16 w-[3rem] lg:h-16 h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:flex lg:gap-4 lg:space-y-0 space-y-3">
            <div className="2xl:w-[35%] lg:w-[40%] w-full">
              <Calendar />
            </div>
            <div className="2xl:w-[65%] lg:w-[60%] w-full">
              <div class="w-full h-full grid grid-cols-2 gap-5">
                <div class="w-full space-y-3 lg:px-4 px-[15px] py-2.5 h-72 lg:h-full relative bg-[#ffff]  rounded-xl text-header ">
                  <p class="text-left 3xl:text-[20px] lg:text-lg text-[14px] font-[500]">
                    Invoice Summary
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div class="flex items-center bg-white rounded">
                      <select class="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none">
                        <option>Alfredo</option>
                        <option>Westervelt</option>
                        <option>Alfredo</option>
                      </select>
                    </div>
                    <div class="flex items-center bg-white rounded">
                      <select class="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none">
                        <option>Alfredo</option>
                        <option>Westervelt</option>
                        <option>Alfredo</option>
                      </select>
                    </div>
                    <div class="flex items-center bg-white rounded">
                      <select class="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none">
                        <option>Alfredo</option>
                        <option>Westervelt</option>
                        <option>Alfredo</option>
                      </select>
                    </div>
                    <div class="flex items-center bg-white rounded">
                      <select class="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none">
                        <option>Alfredo</option>
                        <option>Westervelt</option>
                        <option>Alfredo</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 ">
                    <div className="flex justify-between items-center">
                      <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                        Invoice Billed
                      </span>
                      <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                        $25698
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                        GST Charged
                      </span>
                      <div>
                        <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                          $25698
                        </span>
                        <hr className="bg-black " />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                        Total Billed
                      </span>
                      <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                        $25698
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 lg:w-16 w-[3rem] lg:h-16 h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                    <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                      <ImArrowUpRight2 className="lg:text-[20px] text:[18px] text-black" />
                    </div>
                  </div>
                </div>
                <div class="w-full relative h-72 lg:h-full py-2.5 bg-[#ffff] rounded-xl space-y-3 lg:px-4 px-[15px] text-header">
                  <p class="text-left lg:text-lg text-[14px] font-[500] lg:font-nomal">
                    Pending Invoices
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div class="flex items-center bg-white rounded">
                      <select class="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none">
                        <option>Alfredo</option>
                        <option>Westervelt</option>
                        <option>Alfredo</option>
                      </select>
                    </div>
                    <div class="flex items-center bg-white rounded">
                      <select class="bg-transparent w-full p-1 border border-gray-100 rounded-sm text-header text-[11px] lg:text-sm font-normal focus:outline-none">
                        <option>Alfredo</option>
                        <option>Westervelt</option>
                        <option>Alfredo</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                        Total Tasks
                      </span>
                      <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                        698
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                        Total Clients
                      </span>
                      <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                        128
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="lg:text-[14px] sm:text-[16px] text-[12px]">
                        Total Charged
                      </span>
                      <span className="text-black lg:text-[14px] sm:text-[16px] text-[12px]">
                        $25698.25
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 right-0 lg:w-16 w-[3rem] lg:h-16 h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                    <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                      <ImArrowUpRight2 className="lg:text-[20px] text:[18px] text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full xl:flex xl:gap-3">
            <div className="xl:w-[55%] w-full relative rounded-xl bg-white mb-3 xl:mb-0">
              <div className="w-full flex flex-col items-center space-y-4 md:px-10 px-[15px] py-3">
                <div className="w-full flex lg:flex-row justify-between items-center">
                  <span className="text-left 3xl:text-[20px] font-[500] text-header">
                    Task Summmary
                  </span>
                  <div className="relative">
                    <div onClick={handleTask}>
                      <MdTune className="cursor-pointer" size={24} />
                    </div>
                    {isTaskModal && (
                      <div
                        className="absolute top-full right-0 z-10 bg-white border border-gray-300 shadow-lg rounded py-2 px-3"
                        style={{ minWidth: "150px" }}
                      >
                        <p>Last Week</p>
                        <p>Last month</p>
                        <p>Last Year</p>
                        <p>Custom Date</p>
                      </div>
                    )}
                  </div>
                </div>
                <Bar data={taskData} options={taskOptions} />
                <div className="w-full grid grid-cols-3 md:grid-cols-3 gap-4 md:pr-20 pr16">
                  <div className="w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-[#FF0000]"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        Total Task
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-blue-600"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        Not Started
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-green-500"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        In-Progress
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>
                </div>
                <div className="w-full gap-2 flex items-start md:pr-20 sm:pr-16 pr-[2.8rem]">
                  <div className="max-w-[85px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-yellow-500"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        Task-Stop
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="max-w-[85px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-blue-900"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        Complete
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>

                  <div className="max-w-[85px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-blue-900"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        Overdue
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 lg:w-16 w-[3rem] lg:h-16 h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                </div>
              </div>
            </div>
            <div className="xl:w-[45%]  w-full relative bg-[#ffff] rounded-xl">
              <div className="w-full flex flex-col items-center space-y-4 md:px-10 px-[15px] py-3">
                <div className="w-full flex justify-between items-center">
                  <span className="text-left 3xl:text-[20px] font-[500] text-header">
                    Client Summmary
                  </span>
                  <div className="relative">
                    <div onClick={handleClient}>
                      <MdTune className="cursor-pointer" size={24} />
                    </div>
                    {isClientModal && (
                      <div
                        className="absolute top-full right-0 z-10 bg-white border border-gray-300 shadow-lg rounded py-2 px-3"
                        style={{ minWidth: "150px" }}
                      >
                        <p>Last Week</p>
                        <p>Last month</p>
                        <p>Last Year</p>
                        <p>Custom Date</p>
                      </div>
                    )}
                  </div>
                </div>
                <Bar data={clientData} options={clientOptions} />
                <div className="w-full grid grid-cols-2 lg:gap-4 gap-2 md:pr-20 pr-16">
                  <div className="max-w-[100px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-yellow-500"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        Active
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>
                  <div className="max-w-[100px] sm:max-w-full w-full border-[1px] rounded-lg px-2 py-1">
                    <div className="flex justify-start gap-1 items-center">
                      <span className="lg:w-3 lg:h-3 w-[10px] h-[10px] flex-none rounded bg-green-500"></span>
                      <span className="lg:text-[12px] sm:text-[11px] text-[10px] font-[400]">
                        In-Active
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-bold">30</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 lg:w-16 w-[3rem] lg:h-16 h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem]">
                <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
                  <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-[24%] w-full h-full space-y-3">
          <div className="w-full hidden lg:block">
            <UserDetails />
          </div>
          <NoticeBoard />
        </div>
      </div>
    </GlobalLayout>
  );
};
export default Dashboard2;
