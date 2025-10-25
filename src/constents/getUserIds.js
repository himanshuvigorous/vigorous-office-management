import { domainName } from "./global";

const getUserIds = () => {
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

  if (!userInfoglobal) {
    return {
      userCompanyId: "",
      userDirectorId: "",
      userBranchId: "",
      userEmployeId: "",
      userDepartmentId: "",
      userDesignationId: "",
      userType: "",
      useronboardingId: "",
    };
  }

  return {
    userCompanyId: userInfoglobal?.userType !== "company" ? userInfoglobal?.companyId : userInfoglobal?._id || "",
    userDirectorId: userInfoglobal?.userType !== "companyDirector" ? userInfoglobal?.directorId : userInfoglobal?._id || "",
    userBranchId: userInfoglobal?.userType !== "companyBranch" ? userInfoglobal?.branchId : userInfoglobal?._id || "",
    userEmployeId: userInfoglobal?.userType === "employee" ?  userInfoglobal?._id  : userInfoglobal?.employeId ,
    userDepartmentId: userInfoglobal?.departmentId,
    userDesignationId: userInfoglobal?.designationId,
    userType: userInfoglobal?.userType,
    useronboardingId: userInfoglobal?.onboardingId || "",
  };
};

export default getUserIds;