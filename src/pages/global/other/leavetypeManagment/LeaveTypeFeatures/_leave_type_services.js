import { apiCall } from "../../../../../config/Http";


async function getLeaveTypeList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `master/leaveType/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/leaveType/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function leaveTypeSearch(data) {

  try {
    const response = await apiCall("POST", "master/leaveType/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getLeaveTypeDetails(data) {

  try {
    const response = await apiCall("POST", "master/leaveType/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createLeaveType(data) {
  try {
    const response = await apiCall("POST", "master/leaveType/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateleaveType(data) {

  try {
    const response = await apiCall("POST", "master/leaveType/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteLeaveType(data) {

  try {
    const response = await apiCall("POST", "master/leaveType/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const leaveTypeServices = {
  getLeaveTypeList,
  getLeaveTypeDetails,
  createLeaveType,
  updateleaveType,
  deleteLeaveType,
  leaveTypeSearch
};