import { apiCall } from "../../config/Http";


async function downloadExcelFunc(data) {
  if (data) {

    
    try {
      const response = await apiCall("POST", `download`, data);
      return response;
    } catch (error) {
      console.error("excelList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `download`, data);
      return response;
    } catch (error) {
      console.error("excelList:", error);
      return Promise.reject(error);
    }
  }
}




async function employeeAttendanceSummaryReportFunc(data) {
  
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/attendanceSummary?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  
}
async function financeProfitLossFunc(data) {
    try {
      const response = await apiCall(
        "POST",
        `finance/payment/profitLossReport`,
        data
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    } 
}



export const reportsServices2 = {
  downloadExcelFunc,
  employeeAttendanceSummaryReportFunc,
  financeProfitLossFunc
};