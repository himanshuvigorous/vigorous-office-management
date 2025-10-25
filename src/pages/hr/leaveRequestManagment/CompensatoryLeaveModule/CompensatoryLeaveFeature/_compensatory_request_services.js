import { apiCall } from "../../../../../config/Http";





async function getCompensatoryLeaveRequestList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/compensatory/leave/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/compensatory/leave/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}


async function getCompensatoryLeaveRequestDetails(data) {

  try {
    const response = await apiCall("POST", "employe/compensatory/leave/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createCompensatoryLeaveRequest(data) {
  try {
    const response = await apiCall("POST", "employe/compensatory/leave/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateCompensatoryLeaveRequest(data) {
  try {
    const response = await apiCall("POST", "employe/compensatory/leave/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateCompensatoryLeaveRequestStatus(data) {

  try {
    const response = await apiCall("POST", "employe/compensatory/leave/status", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}


export const compensatoryLeaveRequestServices = {
  getCompensatoryLeaveRequestList,
  getCompensatoryLeaveRequestDetails,
  createCompensatoryLeaveRequest,
  updateCompensatoryLeaveRequest,
  updateCompensatoryLeaveRequestStatus

};