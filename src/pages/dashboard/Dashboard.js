import React, { useEffect } from "react";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName } from "../../constents/global";
import AdminDashboard from "./AdminDashboard";

import EmployeeDashboard from "./EmployeeDashboard";
import CompanyDashBoard from "./CompanyDashBoard";
import HrDashBoard from "./HrDashBoard";

const Dashboard = () => {
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <GlobalLayout>
      <div className="p-2">
        {userInfoglobal?.userType === "admin" && <AdminDashboard />}
        {(userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "companyBranch" || (userInfoglobal?.userType === "employee" &&
            userInfoglobal?.roleKey === "manager")) && (
            <CompanyDashBoard />
          )}
        {userInfoglobal?.userType === "employee" &&
          userInfoglobal?.roleKey === "hr" && <HrDashBoard />}
        {userInfoglobal?.userType === "employee" &&
          userInfoglobal?.roleKey !== "hr" && userInfoglobal?.roleKey !== "manager" && <EmployeeDashboard />}
      </div>
    </GlobalLayout>
  );
};
export default Dashboard;
