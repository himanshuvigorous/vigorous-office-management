import { useEffect, useState } from "react";
import { adminDashboard } from "../../redux/_reducers/_dashboard_reducers";
import { useDispatch, useSelector } from "react-redux";
import MetricCard from "./MetricCard";
import { FaCalendarCheck } from "react-icons/fa";
import { BsEyeFill } from "react-icons/bs";
import CompanyListModalDashboard from "./CompanyListModalDashboard";
import { IoIosMan } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { FaMoneyBill, FaRegBuilding, FaRegistered } from "react-icons/fa6";
import { ImMan } from "react-icons/im";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  ArcElement,
  LineElement,
  elements,
} from "chart.js";
import { Empty, Flex, Progress, Tooltip } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import "swiper/css/navigation";
import "swiper/css/pagination";
import { RiBuilding4Fill, RiPassExpiredLine } from "react-icons/ri";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../../config/Encryption";
import { dynamicSidebarSearch } from "../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { domainName } from "../../constents/global";
import TodoList from "../global/other/todolistManagement/TodoList";

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const [colors, setColors] = useState([])
  // Register required components
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );



  Chart.register(
    BarController,
    LineController,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale
  );
  const [viewCompanyModal, setViewCompanyModal] = useState({
    data: null,
    isOpen: false,
  });
  const { adminDashboardData } = useSelector((state) => state?.dashboard);
  useEffect(() => {
    dispatch(adminDashboard());
  }, []);

  const [chartData, setChartData] = useState({
    labels: [],
    companyCounts: [],
    colorCodes: [],
  });



  useEffect(() => {
    if (adminDashboardData?.planDistribution) {
      const labels = [];
      const companyCounts = [];
      const colorCodes = [];

      adminDashboardData.planDistribution.forEach(
        ({ title, companyCount, colorCode }) => {
          labels.push(title);
          companyCounts.push(companyCount);
          colorCodes.push(colorCode);
        }
      );

      setChartData({ labels, companyCounts, colorCodes });
    }
  }, [adminDashboardData]);



  const data = {
    labels: chartData?.labels,
    datasets: [
      {
        label: "plan",
        data: chartData?.companyCounts,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
    cutout: "80%",
  };

  const revenueChartData = {
    labels: [
      "Label 1",
      "Label 2",
      "Label 3",
      "Label 4",
      "Label 5",
      "Label 6",
      "Label 7",
    ],
    datasets: [
      {
        type: "bar", // Bar chart for visual bars
        label: "Bar Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "transparent", // Semi-transparent bars
        borderColor: "transparent",
        borderWidth: 1,
      },
      {
        type: "line", // Line chart overlay
        label: "Line Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false, // Ensures it's a line and not filled
        tension: 0.4, // Makes the line smooth
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Today Task Chart",
      },
    },
    scales: {
      y: {
        type: "linear", // Linear scale for numerical values
        beginAtZero: true,
      },
      x: {
        type: "category",
      },
    },
  };


  useEffect(() => {
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

  const monthlyEarningOption = {
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

  const totalMonthlyEarning = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly INCOME",
        data: [
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 1)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 2)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 3)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 4)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 5)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 6)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 7)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 8)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 9)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 10)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 11)
            ?.totalRevenue ?? 0,
          adminDashboardData?.monthlyRevenue?.find((data) => data?.month == 12)
            ?.totalRevenue ?? 0,

          // employeeDashboardData?.taskData?.totalTask ?? 0,
          // employeeDashboardData?.taskData?.accepted ?? 0,
          // employeeDashboardData?.taskData?.assigned ?? 0,
          // employeeDashboardData?.taskData?.completed ?? 0,
          // employeeDashboardData?.taskData?.overdueTask ?? 0,
          // employeeDashboardData?.taskData?.stop ?? 0,
          // employeeDashboardData?.taskData?.workInProgress ?? 0,
        ],
        backgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#ffbf69",
          "#E0FFFF",
          "#F0E68C",
          "#00A693",
          "#008080",
          "#D8BFD8",
        ],
        hoverBackgroundColor: [
          "#acd8aa",
          "#dee2ff",
          "#ade8f4",
          "#feeafa",
          "#ffba08",
          "#1a659e",
          "#ffbf69",
          "#E0FFFF",
          "#F0E68C",
          "#00A693",
          "#008080",
          "#D8BFD8",
        ],
        borderWidth: 0,
      },
    ],
  };

  const conicColors = {
    "0%": "#87d068",
    "50%": "#ffe58f",
    "100%": "#ffccc7",
  };

  const handleCompanyQuickActions = (path) => {
    navigate(`/admin/${path}`);
  };


  function generateRandomColors(count) {
    const colors = [];
    const letters = '0123456789ABCDEF';

    for (let i = 0; i < count; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }

    return colors;
  }

  useEffect(() => {
    const titles = adminDashboardData?.planDistribution;
    if (titles && titles.length > 0) {
      setColors(generateRandomColors(titles.length));
    }
  }, [adminDashboardData]);



  return (
    // <div className="h-[90vh] overflow-y-auto">
    //   {viewCompanyModal.isOpen && (
    //     <CompanyListModalDashboard
    //       data={viewCompanyModal.data}
    //       onClose={() => setViewCompanyModal({ isOpen: false, data: null })}
    //     />
    //   )}
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    //     <MetricCard
    //       borderColor={"border-teal-800"}
    //       image={<FaCalendarCheck className="text-4xl text-blue-400" />}
    //       name={"Active Plans Companies"}
    //       greentext={"Plans"}
    //       size={adminDashboardData?.runningPlanCompany?.length}
    //     />
    //     <MetricCard
    //       borderColor={"border-cyan-800"}
    //       image={<FaCalendarCheck className="text-4xl text-blue-400" />}
    //       name={"Expiring Soon"}
    //       greentext={"Plans"}
    //       size={adminDashboardData?.expireSooPlanComapny?.length}
    //     />
    //     <MetricCard
    //       borderColor={"border-rose-800"}
    //       image={<FaCalendarCheck className="text-4xl text-blue-400" />}
    //       name={"Expired Plans"}
    //       greentext={"Plans"}
    //       size={adminDashboardData?.expiredPlanComapny?.length}
    //     />
    //   </div>
    //   <div className="overflow-x-auto">
    //     <table className="w-full max-w-full rounded-xl overflow-hidden my-2 table-auto">
    //       <thead className="sticky top-0 bg-header text-white">
    //         <tr className="capitalize text-[15px] h-[40px] text-center">
    //           <th colSpan={6}>Running Plan Company</th>
    //         </tr>
    //         <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] font-[500] h-[40px]">
    //           <th className="border-none p-2 whitespace-nowrap w-[10%]">
    //             S.no.
    //           </th>
    //           <th className="border-none p-2 whitespace-nowrap">Plan Name</th>
    //           <th className="border-none p-2 whitespace-nowrap">Description</th>
    //           <th className="border-none p-2 whitespace-nowrap">Duration</th>
    //           <th className="border-none p-2 whitespace-nowrap">Price</th>
    //           <th className="border-none p-2 whitespace-nowrap w-[10%]">
    //             Listed Companies
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {adminDashboardData?.runningPlanCompany &&
    //         adminDashboardData?.runningPlanCompany?.length > 0 ? (
    //           adminDashboardData?.runningPlanCompany?.map((element, index) => (
    //             <tr
    //               className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${
    //                 index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
    //               }`}
    //             >
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {index + 1}
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.title ?? "-"}
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.description ?? "-"}
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.days} days
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.price} ₹
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 <div className="flex gap-2 items-center justify-center">
    //                   {`${element?.activeComapnydata?.length} ` ?? "-"}
    //                   <BsEyeFill
    //                     onClick={() => {
    //                       setViewCompanyModal({
    //                         isOpen: true,
    //                         data: element?.activeComapnydata,
    //                       });
    //                     }}
    //                     className="cursor-pointer text-header"
    //                   />
    //                 </div>
    //               </td>
    //             </tr>
    //           ))
    //         ) : (
    //           <tr className="bg-white bg-opacity-5">
    //             <td
    //               colSpan={6}
    //               className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
    //             >
    //               Record Not Found
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>
    //   </div>
    //   <div className="overflow-x-auto">
    //     <table className="w-full max-w-full rounded-xl overflow-hidden my-2 table-auto">
    //       <thead className="sticky top-0 bg-header text-white">
    //         <tr className="capitalize text-[15px] h-[40px] text-center">
    //           <th colSpan={6}>Expired Plan Company</th>
    //         </tr>
    //         <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] font-[500] h-[40px]">
    //           <th className="border-none p-2 whitespace-nowrap w-[10%]">
    //             S.no.
    //           </th>
    //           <th className="border-none p-2 whitespace-nowrap">Plan Name</th>
    //           <th className="border-none p-2 whitespace-nowrap">Description</th>
    //           <th className="border-none p-2 whitespace-nowrap">Duration</th>
    //           <th className="border-none p-2 whitespace-nowrap">Price</th>
    //           <th className="border-none p-2 whitespace-nowrap w-[10%]">
    //             Listed Companies
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {adminDashboardData?.expiredPlanComapny &&
    //         adminDashboardData?.expiredPlanComapny?.length > 0 ? (
    //           adminDashboardData?.expiredPlanComapny?.map((element, index) => (
    //             <tr
    //               className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${
    //                 index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
    //               }`}
    //             >
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {index + 1}
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.title ?? "-"}
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.description ?? "-"}
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.days} days
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 {element?.price} ₹
    //               </td>
    //               <td className="whitespace-nowrap border-none p-2">
    //                 <div className="flex gap-2 items-center justify-center">
    //                   {`${element?.inActiveComapnydata?.length} ` ?? "-"}
    //                   <BsEyeFill
    //                     onClick={() => {
    //                       setViewCompanyModal({
    //                         isOpen: true,
    //                         data: element?.inActiveComapnydata,
    //                       });
    //                     }}
    //                     className="cursor-pointer text-header"
    //                   />
    //                 </div>
    //               </td>
    //             </tr>
    //           ))
    //         ) : (
    //           <tr className="bg-white bg-opacity-5">
    //             <td
    //               colSpan={6}
    //               className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
    //             >
    //               Record Not Found
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
    <div className="h-[calc(100vh-100px)] pb-5 overflow-y-auto w-full">
      <div className="grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-x-4 md:gap-y-7 gap-6 py-4 pb-4 ">
        <div className="w-full relative 3xl:p-4 xl:py-3 xl:px-3 px-3 py-3 flex flex-col md:h-44 h-40 rounded-md bg-white">
          <div
            className="absolute 3xl:h-16 3xl:w-16 xl:w-[50px] xl:h-[50px] w-14 h-14 -top-6 rounded-full  left-8 bg-[#FD9108]"
            style={{ boxShadow: "4px 2px 10px gray" }}
          >
            <div className="text-white h-full w-full flex justify-center items-center">
              <ImMan size={35} />
            </div>
          </div>

          <div className="flex-col  flex justify-center items-end 2xl:mt-0 md:mt-5 mt-4 mb-4 ">
            <div className="md:text-[13px] w-full text-[12px] 3xl:pt-2 !xl:pt-2 ">
              Total Office Registered
            </div>
            <span className="md:text-[13px] text-[11px] p-2">
              {adminDashboardData?.officeData?.totalRegisteredOffice || 0}
            </span>
          </div>
          <div
            onClick={() => {
              handleCompanyQuickActions("company");
            }}
            className="w-full cursor-pointer mx-auto flex justify-between items-center pt-2 bottom-0 border-t mt-auto"
          >
            <span className="md:text-[12px] whitespace-nowrap text-[10px]  flex items-end cursor-pointer text-header gap-2 overflow-scrollbar-zero">
              {" "}
              Office List{" "}
            </span>
            <div className="h-5 rounded-full bg-[#DC2E8D] text-white w-5 flex justify-center items-center">
              <MdArrowOutward />
            </div>
          </div>
        </div>

        <div className="w-full relative 3xl:p-4 xl:py-3 xl:px-3 px-3 py-3 flex flex-col md:h-44 h-40 rounded-md bg-white">
          <div
            className="absolute 3xl:h-16 3xl:w-16 xl:w-[50px] xl:h-[50px] w-14 h-14 -top-6 rounded-full  left-8 bg-[#59AD5F]"
            style={{ boxShadow: "4px 2px 10px gray" }}
          >
            <div className="text-white h-full w-full flex justify-center items-center">
              <RiBuilding4Fill size={25} />
            </div>
          </div>

          <div className="flex-col  flex justify-center items-end 2xl:mt-0 md:mt-5 mt-4 mb-4 ">
            <div className="md:text-[13px] w-full text-[12px] 3xl:pt-2 !xl:pt-2 ">
              Active Offices
            </div>
            <span className="md:text-[13px] text-[11px] p-2">
              {adminDashboardData?.officeData?.totalActiveOffice || 0}
            </span>
          </div>
          <div
            onClick={() => {
              handleCompanyQuickActions("company");
            }}
            className="overflow-x-auto flex justify-between items-center mt-auto pt-2 border-t"
          >
            <span className="md:text-[12px] whitespace-nowrap text-[10px]  flex items-end cursor-pointer text-header gap-2 overflow-scrollbar-zero">
              {" "}
              Active Office List
            </span>
            <div className="h-5 rounded-full bg-[#DC2E8D] text-white w-5 flex justify-center items-center">
              <MdArrowOutward />
            </div>
          </div>
        </div>

        <div className="w-full relative 3xl:p-4 xl:py-3 xl:px-3 px-3 py-3 flex flex-col md:h-44 h-40 rounded-md bg-white">
          <div
            className="absolute 3xl:h-16 3xl:w-16 xl:w-[50px] xl:h-[50px] w-14 h-14 -top-6 rounded-full left-8 bg-[#E9413F]"
            style={{ boxShadow: "4px 2px 10px gray" }}
          >
            <div className="text-white h-full w-full flex justify-center items-center">
              <FaRegistered size={30} />
            </div>
          </div>

          <div className="flex-col  flex justify-center items-end 2xl:mt-0 md:mt-5 mt-4 mb-4 ">
            <div className="md:text-[13px] w-full text-[12px] 3xl:pt-2 !xl:pt-2 ">
              Total User Register
            </div>
            <span className="md:text-[13px] text-[11px] p-2">
              {adminDashboardData?.allCompanyEmployes || 0}
            </span>
          </div>
          <div
            onClick={() => {
              handleCompanyQuickActions("company");
            }}
            className="w-full mt-auto pt-2 overflow-x-auto flex justify-between items-center border-t "
          >
            <span className="md:text-[12px] whitespace-nowrap text-[10px]  flex items-end cursor-pointer text-header gap-2 overflow-scrollbar-zero">
              {" "}
              Register User List
            </span>
            <div className="h-5 rounded-full bg-[#DC2E8D] text-white w-5 flex justify-center items-center">
              <MdArrowOutward />
            </div>
          </div>
        </div>

        <div className="w-full relative 3xl:p-4 xl:py-3 xl:px-3 px-3 py-3 flex flex-col md:h-44 h-40 rounded-md bg-white">
          <div
            className="absolute 3xl:h-16 3xl:w-16 xl:w-[50px] xl:h-[50px] w-14 h-14 -top-6 rounded-full left-8 bg-[#16B3CA]"
            style={{ boxShadow: "4px 2px 10px gray" }}
          >
            <div className="text-white h-full w-full flex justify-center items-center">
              <FaMoneyBill size={30} />
            </div>
          </div>

          <div className="flex-col  flex justify-center items-end 2xl:mt-0 md:mt-5 mt-4 mb-4 ">
            <div className="md:text-[13px] w-full text-[12px] 3xl:pt-2 !xl:pt-2 ">
              Current Subscription Revanue
            </div>
            <span className="md:text-[13px] text-[11px] p-2">
              {adminDashboardData?.officeData?.totalRevenue || 0}
            </span>
          </div>
          <div
            onClick={() => {
              handleCompanyQuickActions("plan");
            }}
            className="w-full flex justify-between items-center mt-auto pt-2 border-t "
          >
            <span className="md:text-[12px] whitespace-nowrap text-[10px]  flex items-end cursor-pointer text-header gap-2 overflow-scrollbar-zero">
              {" "}
              Revanue List
            </span>
            <div className="h-5 rounded-full bg-[#DC2E8D] text-white w-5 flex justify-center items-center">
              <MdArrowOutward />
            </div>
          </div>
        </div>
        <div className="w-full relative 3xl:p-4 xl:py-3 xl:px-3 px-3 py-3 flex flex-col md:h-44 h-40 rounded-md bg-white">
          <div
            className="absolute 3xl:h-16 3xl:w-16 xl:w-[50px] xl:h-[50px] w-14 h-14 -top-6 rounded-full left-8 bg-[#E9413F]"
            style={{ boxShadow: "4px 2px 10px gray" }}
          >
            <div className="text-white h-full w-full flex justify-center items-center">
              <RiPassExpiredLine size={30} />
            </div>
          </div>

          <div className="flex-col  flex justify-center items-end 2xl:mt-0 md:mt-5 mt-4 mb-4 ">
            <div className="md:text-[13px] w-full text-[12px] 3xl:pt-2 !xl:pt-2 ">
              Expire Soon Company
            </div>
            <span className="md:text-[13px] text-[11px] p-2">
              {adminDashboardData?.expireSoonCompany?.length || 0}
            </span>
          </div>
          <div
            onClick={() => {
              handleCompanyQuickActions("company");
            }}
            className="w-full overflow-x-auto flex justify-between items-center bottom-0 border-t mt-auto pt-2"
          >
            <span className={`md:text-[12px] whitespace-nowrap text-[10px]  flex items-end cursor-pointer text-header gap-2 overflow-scrollbar-zero overflow-scrollbar-zero`}>
              {" "}
              Expire Soon Company
            </span>
            <div className="h-5 rounded-full bg-[#DC2E8D] text-white w-5 flex justify-center items-center">
              <MdArrowOutward />
            </div>
          </div>
        </div>
      </div>
      <TodoList />


      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {/* <div className="w-full h-full bg-white flex-col rounded-md py-4 px-2 flex justify-center items-center ">

          <Bar data={revenueChartData} options={revenueChartOptions} />
          <div className="text-[rgb(255,99,132)]">revenue</div>
        </div> */}

        {/* Monthly revenue */}

        <div className="w-full col-span-2  rounded-xl bg-white p-2">
          <div className="p-2">Monthly Income</div>
          <Bar data={totalMonthlyEarning} options={monthlyEarningOption} />

          {/* <div className="flex  mt-4 gap-4 flex-wrap">
            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#acd8aa]"></div>
              <div className="text-[10px]">8</div>
              <div className="text-[10px]">Jan</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#dee2ff]"></div>
              <div className="text-[10px]">5</div>
              <div className="text-[10px]">Feb</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#ade8f4]"></div>
              <div className="text-[10px]">5</div>
              <div className="text-[10px]">March</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#feeafa]"></div>
              <div className="text-[10px]">3</div>
              <div className="text-[10px]">April</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#ffba08]"></div>
              <div className="text-[10px]">4</div>
              <div className="text-[10px]">May</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#1a659e]"></div>
              <div className="text-[10px]">3</div>
              <div className="text-[10px]">June</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#ffbf69]"></div>
              <div className="text-[10px]">2</div>
              <div className="text-[10px]">July</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#E0FFFF]"></div>
              <div className="text-[10px]">2</div>
              <div className="text-[10px]">Aug</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#F0E68C]"></div>
              <div className="text-[10px]">2</div>
              <div className="text-[10px]">Sep</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#00A693]"></div>
              <div className="text-[10px]">2</div>
              <div className="text-[10px]">Oct</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#008080]"></div>
              <div className="text-[10px]">2</div>
              <div className="text-[10px]">Nov</div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-1 w-1  rounded-full bg-[#D8BFD8]"></div>
              <div className="text-[10px]">2</div>
              <div className="text-[10px]">Dec</div>
            </div>
          </div> */}
        </div>

        {/*Subscriptions*/}


        <div className="flex w-full  gap-2 bg-white rounded-xl shadow-sm p-4 flex-col justify-center items-center">
          <div className="text-center">Plan Distribution</div>
          <div className="bg-white grid grid-cols-1   rounded-xl relative">
            {adminDashboardData?.planDistribution.find((element) => { return element?.companyCount > 0 }) ?
              <div className="w-full flex flex-col items-center space-y-4 lg:px-10 px-[12px] lg:py-4 py-3">
                <div className="w-32 md:w-36 h-32 xl:w-60 xl:h-60  md:h-36 p-2 ">
                  <Doughnut data={data} options={options} />
                </div>
              </div> : <div className="flex justify-center items-center h-full w-full">
                <Empty />
              </div>}
            <div className="grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2  md:grid-cols-2 gap-4 justify-center items-center ">
              {adminDashboardData?.planDistribution?.map((plan, index) => {
                return (
                  <Tooltip placement="topLeft"
                    title={`Plan Title :- ${plan?.title}`}
                  >
                    <div className="w-full border-[1px] lg:rounded-xl rounded-lg px-1.5 py-[3px]">
                      <div className="flex justify-start gap-1 items-center">
                        <span className={`lg:w-3 lg:h-3 w-[10px] h-[10px] rounded  flex-none`} style={{ backgroundColor: colors[index] }}></span>
                        <div className="lg:text-[12px] text-[9px] font-[400]  overflow-hidden truncate">
                          {plan?.title}
                        </div>
                      </div>
                      <div className="ml-auto text-sm font-bold">
                        {plan?.companyCount}
                      </div>
                    </div>

                    {/* <div
                  className={`whitespace-nowrap flex  overflow-hidden text-overflow:ellipsis   flex-col border-[1px] gap-1 px-1 rounded-sm justify-start items-start text-[12px] md:text-[14px]`}
                  // style={{ borderColor: plan?.colorCode, backgroundColor: `${plan.colorCode}20`, }}
                >
                  <div className="flex gap-1 justify-end items-center">
                  <div
                    className={`h-2 w-2 rounded-full`}
                    style={{ backgroundColor: plan?.colorCode }}
                  />
                  
                  <div className="w-20  truncate ">{plan?.title}</div>
                  </div>
                  <div className="font-semibold">{plan?.companyCount}</div>
                </div> */}
                  </Tooltip>

                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2  md:grid-cols-2 grid-cols-1">
        <div className="w-full flex flex-col h-[350px] gap-2 bg-white mt-4 overflow-y-auto  rounded-lg">
          <div className="py-3 px-4 md:text-[18px] text-[16px] text-black">
            New Registration office List
          </div>
          <div className=" w-full  overflow-auto">

            <table className=" w-full  divide-y divide-gray-200">
              <thead className="bg-gray-50 w-full">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
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
                {adminDashboardData?.newOfficeData?.length > 0 ? (
                  adminDashboardData?.newOfficeData.map((data) => (
                    <tr key={data._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <img
                          src={
                            data.profileImage
                              ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${data.profileImage}`
                              : "/images/avatar.jpg"
                          }
                          className="w-8 h-8 rounded-full mr-2 ring-1 ring-amber-300"
                          alt={data.fullName}
                        />
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.fullName || "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {dayjs(data?.createdAt).format("YYYY-MM-DD hh:mm") ||
                            "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.email || "-"}
                        </div>
                      </td>

                      {/* <td className="px-4 py-3 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    {data?.profileType || "-"}
                                  </div>
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    {data?.roundName || "-"}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    {data?.meetingUrl || "-"}
                                  </div>
                                </td> */}
                      {/* <td className="px-4 py-3 whitespace-nowrap ">
                                  <div className="flex space-x-2">
                                    <Popconfirm
                                      title={`${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      description={`Are you sure to Approve this ${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      // onConfirm={() => handledata(data)}
                                      //onCancel={cancel}
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <button
                                        // onClick={() => handledata(data)}
                                        className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                      >
                                        <IoCheckmark size={16} />
                                      </button>
                                    </Popconfirm>

                                    <Popconfirm
                                      title={`${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      description={`Are you sure to Delete this ${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      // onConfirm={() =>
                                      //  // handleRequestRejection(approval)
                                      // }
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                        <RxCross2 size={16} />
                                      </button>
                                    </Popconfirm>
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
                      No pending approvals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>

        {/* pending Payments */}
        <div className="w-full flex flex-col md:h-[350px] h-auto gap-2 bg-white mt-4 overflow-auto  rounded-lg">
          <div className="py-3 px-4 md:text-[18px] text-[16px] text-black">
            Pending Payment
          </div>
          <div className=" !w-full  overflow-x-auto">

            <table className=" w-full  divide-y divide-gray-200">
              <thead className="bg-gray-50 w-full">
                <tr>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Company ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    start Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                    end Date
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
                {adminDashboardData?.pendingCompanyPlans?.length > 0 ? (
                  adminDashboardData?.pendingCompanyPlans.map((data) => (
                    <tr key={data._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <img
                          src={
                            data?.companyProfile?.profileImage
                              ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${data?.companyProfile?.profileImage}`
                              : "/images/avatar.jpg"
                          }
                          className="w-8 h-8 rounded-full mr-2 ring-1 ring-amber-300"
                          alt={data.fullName}
                        />
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.companyProfile?.fullName || "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.companyProfile?.mobile?.code || "-"}{" "}
                          {data?.companyProfile?.mobile?.number || "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.companyProfile?.email || "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.status || "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.title || "-"}
                        </div>
                      </td>

                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.price || "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {data?.days || "-"}
                        </div>
                      </td>

                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {dayjs(data?.startDate).format("YYYY-MM-DD") ||
                            "-"}
                        </div>
                      </td>
                      <td className="px-4 text-xs py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {dayjs(data?.endDate).format("YYYY-MM-DD") || "-"}
                        </div>
                      </td>

                      {/* <td className="px-4 py-3 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    {data?.profileType || "-"}
                                  </div>
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    {data?.roundName || "-"}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    {data?.meetingUrl || "-"}
                                  </div>
                                </td> */}
                      {/* <td className="px-4 py-3 whitespace-nowrap ">
                                  <div className="flex space-x-2">
                                    <Popconfirm
                                      title={`${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      description={`Are you sure to Approve this ${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      // onConfirm={() => handledata(data)}
                                      //onCancel={cancel}
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <button
                                        // onClick={() => handledata(data)}
                                        className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                      >
                                        <IoCheckmark size={16} />
                                      </button>
                                    </Popconfirm>

                                    <Popconfirm
                                      title={`${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      description={`Are you sure to Delete this ${
                                        data?.formatType === "attendance"
                                          ? "Attendance"
                                          : data?.formatType === "leave"
                                          ? "Leave"
                                          : data?.formatType === "cashbook"
                                          ? "Cashbook"
                                          : ""
                                      }`}
                                      // onConfirm={() =>
                                      //  // handleRequestRejection(approval)
                                      // }
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                        <RxCross2 size={16} />
                                      </button>
                                    </Popconfirm>
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
                      No pending approvals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>


          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
