import { apiCall } from "../../../../../config/Http";





async function getLeaveRequestList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/leaveRequest/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/leaveRequest/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function leaveRequestSearch(data) {

  try {
    const response = await apiCall("POST", "employe/leaveRequest/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getLeaveRequestDetails(data) {

  try {
    const response = await apiCall("POST", "employe/leaveRequest/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createLeaveRequest(data) {
  try {
    const response = await apiCall("POST", "employe/leaveRequest/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateleaveRequest(data) {

  try {
    const response = await apiCall("POST", "employe/leaveRequest/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteLeaveRequest(data) {

  try {
    const response = await apiCall("POST", "employe/leaveRequest/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateLeaveRequestStatus(data) {

  try {
    const response = await apiCall("POST", "employe/leaveRequest/status", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function getLeaveDashboard(data) {

  try {
    const response = await apiCall("POST", "employe/leaveRequest/dashboard", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const leaveRequestServices = {
  getLeaveRequestList,
  getLeaveRequestDetails,
  createLeaveRequest,
  updateleaveRequest,
  deleteLeaveRequest,
  leaveRequestSearch,
  updateLeaveRequestStatus,
  getLeaveDashboard
};