import { apiCall } from "../../../../../config/Http";





async function getwfhRequestList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/wfhRequest/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/wfhRequest/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function wfhRequestSearch(data) {

  try {
    const response = await apiCall("POST", "employe/wfhRequest/list", data);
    return response;
  } catch (error) {
    console.error("wfh Type List:", error);
    return Promise.reject(error);
  }
}

async function getwfhRequestDetails(data) {

  try {
    const response = await apiCall("POST", "employe/wfhRequest/detail", data);
    return response;
  } catch (error) {
    console.error("wfh Type:", error);
    return Promise.reject(error);
  }
}
async function createwfhRequest(data) {
  try {
    const response = await apiCall("POST", "employe/wfhRequest/create", data);
    return response;
  } catch (error) {
    console.error("wfh Type error:", error);
    return Promise.reject(error);
  }
}
async function updatewfhRequest(data) {

  try {
    const response = await apiCall("POST", "employe/wfhRequest/update", data);
    return response;
  } catch (error) {
    console.error("wfh Type error:", error);
    return Promise.reject(error);
  }
}
async function deletewfhRequest(data) {

  try {
    const response = await apiCall("POST", "employe/wfhRequest/delete", data);
    return response;
  } catch (error) {
    console.error("wfh Type error:", error);
    return Promise.reject(error);
  }
}
async function updatewfhRequestStatus(data) {

  try {
    const response = await apiCall("POST", "employe/wfhRequest/status", data);
    return response;
  } catch (error) {
    console.error("wfh Type error:", error);
    return Promise.reject(error);
  }
}
async function getwfhDashboard(data) {

  try {
    const response = await apiCall("POST", "employe/wfhRequest/dashboard", data);
    return response;
  } catch (error) {
    console.error("wfh Type error:", error);
    return Promise.reject(error);
  }
}

export const wfhRequestServices = {
  getwfhRequestList,
  getwfhRequestDetails,
  createwfhRequest,
  updatewfhRequest,
  deletewfhRequest,
  wfhRequestSearch,
  updatewfhRequestStatus,
  getwfhDashboard
};