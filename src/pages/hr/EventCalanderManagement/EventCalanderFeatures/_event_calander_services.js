import { apiCall } from "../../../../config/Http";

async function getEventCalanderList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/event/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/event/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function eventCalanderSearch(data) {

  try {
    const response = await apiCall("POST", "employe/event/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function geteventCalanderDetails(data) {

  try {
    const response = await apiCall("POST", "employe/event/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createeventCalander(data) {
  try {
    const response = await apiCall("POST", "employe/event/create", data);
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

async function updateEventCalander(data) {

  try {
    const response = await apiCall("POST", "employe/event/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

async function deleteEventCalander(data) {

  try {
    const response = await apiCall("POST", "employe/event/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const eventCalanderServices = {
  getEventCalanderList,
  geteventCalanderDetails,
  createeventCalander,
  updateholidayDetails,
  deleteEventCalander,
  eventCalanderSearch,
  updateEventCalander
};