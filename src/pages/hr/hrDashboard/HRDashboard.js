import { FaUser, FaUsers, FaCalendar, FaClock } from "react-icons/fa";
import HRMSDataCards from "../../../component/HRMSComponent/HRMSDashboard/HRMSDataCards";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import HRMSDynamicCard from "../../../component/HRMSComponent/HRMSDashboard/HRMSDynamicCard";
import HRMSMeetingTable from "../../../component/HRMSComponent/HRMSDashboard/HRMSMeetingTable";
import HRMSEventCalander from "../../../component/HRMSComponent/HRMSDashboard/HRMSEventCalander/HRMSEventCalander";
import HRMSAbsentTable from "../../../component/HRMSComponent/HRMSDashboard/HRMSAbsentTable";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveDashboard } from "../leaveRequestManagment/LeaveRequestModule/LeaveRequestFeatures/_leave_request_reducers";
import { domainName } from "../../../constents/global";
import LeaveDataModuleDashboard from "./LeaveDataModuleDashboard";

function HRDashboard() {
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const {leaveDashboardData} = useSelector(
    (state) => state.leaveRequest
  );
 
  const dummyData = [
    {
      totalData: 5253,
      totalDataIndex: "Total Employees",
      todayData: 56,
      todayDataIndex: "Today's Employees",
    },
    {
      totalData: 3400,
      totalDataIndex: "Total Visitors",
      todayData: 120,
      todayDataIndex: "Today's Visitors",
    },
    {
      totalData: 1200,
      totalDataIndex: "Total Registrations",
      todayData: 45,
      todayDataIndex: "Today's Registrations",
    },
    {
      totalData: 500,
      totalDataIndex: "Total Leaves",
      todayData: 8,
      todayDataIndex: "Today's Leaves",
    },
  ];

  useEffect(()=>{
    dispatch(getLeaveDashboard({
      employeId: userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
      companyId:  userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
  
    }))
      },[])
  return (
    <GlobalLayout>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {/* <div className="grid xl:grid-cols-2 grid-cols-1 gap-1 ">
          <HRMSDataCards
            IconComponent={
              <FaUser
                size={25}
                className="text-header flex justify-center items-center"
              />
            }
            title="Total Employees"
            totalCount={313}
            percentageChange={10}
            isPercentagePositive={true}
          />

          <HRMSDataCards
            IconComponent={
              <FaUsers
                size={30}
                className="text-header flex justify-center items-center"
              />
            }
            title="New Hires"
            totalCount={50}
            percentageChange={-5}
            isPercentagePositive={false}
          />

          <HRMSDataCards
            IconComponent={
              <FaCalendar
                size={30}
                className="text-header flex justify-center items-center"
              />
            }
            title="Upcoming Leave"
            totalCount={20}
            percentageChange={15}
            isPercentagePositive={true}
          />

          <HRMSDataCards
            IconComponent={
              <FaClock
                size={30}
                className="text-header flex justify-center items-center"
              />
            }
            title="Late Comers"
            totalCount={12}
            percentageChange={-3}
            isPercentagePositive={false}
          />
        </div> */}
        
       
        
        <div className="bg-white my-1 mx-1 rounded-xl shadow-lg relative flex-grow">
            <HRMSMeetingTable />
          </div>
      </div>
      <div >
         
        </div>
      <div className="grid xl:grid-cols-5 grid-cols-1 gap-2 xl:grid-rows-1 grid-rows-[auto,1fr]">
        <div className="xl:col-span-3 col-span-1">
          <HRMSEventCalander />
        </div>
        <div className="xl:col-span-2 col-span-1 flex flex-col space-y-1 py-3">
         
          <div className="bg-white my-1 mx-1 rounded-xl shadow-lg relative flex-grow">
          <LeaveDataModuleDashboard leaveDashboardData={leaveDashboardData} />
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
}

export default HRDashboard;
