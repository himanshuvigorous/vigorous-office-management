import { apiCall } from "../../../../../config/Http";





async function getassignLeaveData (data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/assign/leave/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/assign/leave/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function assignLeaveDataSearch(data) {

  try {
    const response = await apiCall("POST", "employe/assign/leave/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getAssignLeaveDetails(data) {

  try {
    const response = await apiCall("POST", "employe/assign/leave/employelist", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function assignMultipleLeave(data) {

  try {
    const response = await apiCall("POST", "employe/assign/leave/assignLeave", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createAssignLeaves(data) {
  try {
    const response = await apiCall("POST", "employe/assign/leave/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateTotalLeave(data) {

  try {
    const response = await apiCall("POST", "employe/assign/leave/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

async function employeeListAsssignedleave(data) {

  try {
    const response = await apiCall("POST", "employe/assign/leave/employelist", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteAssignedLeaveEmployee(data) {

  try {
    const response = await apiCall("POST", "employe/assign/leave/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}


export const assignrequestServices = {
  getassignLeaveData,
  getAssignLeaveDetails,
  createAssignLeaves,
  updateTotalLeave,
  assignMultipleLeave,
  assignLeaveDataSearch,
  employeeListAsssignedleave,
  deleteAssignedLeaveEmployee

};