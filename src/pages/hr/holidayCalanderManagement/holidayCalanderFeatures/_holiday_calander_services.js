import { apiCall } from "../../../../config/Http";



async function getHolidayCalanderList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/holiday/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/holiday/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function HolidayCalanderSearch(data) {

  try {
    const response = await apiCall("POST", "employe/holiday/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getHolidayCalanderDetails(data) {

  try {
    const response = await apiCall("POST", "employe/holiday/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createholidayCalander(data) {
  try {
    const response = await apiCall("POST", "employe/holiday/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateholidayDetails(data) {

  try {
    const response = await apiCall("POST", "employe/holiday/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteHolidayCalander(data) {

  try {
    const response = await apiCall("POST", "employe/holiday/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const leaveRequestServices = {
  getHolidayCalanderList,
  getHolidayCalanderDetails,
  createholidayCalander,
  updateholidayDetails,
  deleteHolidayCalander,
  HolidayCalanderSearch
};