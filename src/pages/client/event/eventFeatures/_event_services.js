import { apiCall } from "../../../../config/Http";


async function getEventDataList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `client/event/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Event List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/event/list`);
      return response;
    } catch (error) {
      console.error("Event List:", error);
      return Promise.reject(error);
    }
  }
}

async function eventSearch(data) {

  try {
    const response = await apiCall("POST", "searchEvent", data);
    return response;
  } catch (error) {
    console.error("Event List:", error);
    return Promise.reject(error);
  }
}
async function getEventDetails(data) {

  try {
    const response = await apiCall("POST", "client/event/detail", data);
    return response;
  } catch (error) {
    console.error("Event:", error);
    return Promise.reject(error);
  }
}
async function createEventFunc(data) {

  try {
    const response = await apiCall("POST", "client/event/create", data);
    return response;
  } catch (error) {
    console.error("Event error:", error);
    return Promise.reject(error);
  }
}
async function updateEventFunc(data) {

  try {
    const response = await apiCall("POST", "client/event/update", data);
    return response;
  } catch (error) {
    console.error("Event error:", error);
    return Promise.reject(error);
  }
}
async function deleteEventData(data) {

  try {
    const response = await apiCall("POST", "client/event/delete", data);
    return response;
  } catch (error) {
    console.error("Event error:", error);
    return Promise.reject(error);
  }
}

export const eventServices = {
  getEventDataList,
  getEventDetails,
  createEventFunc,
  updateEventFunc,
  deleteEventData,
  eventSearch
};