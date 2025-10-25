import { apiCall } from "../../../config/Http";


async function getTimeSlotList(data) {
  try {
    const { page, limit, reqPayload } = data;
    const response = await apiCall("POST", `master/others/timeslot/list?page=${page}&&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("timeSlotstList:", error);
    return Promise.reject(error);
  }
}
async function timeSlotSearch(data) {
  try {
    const response = await apiCall("POST", `master/others/timeslot/list`, data);
    return response;
  } catch (error) {
    console.error("timeSlotstList:", error);
    return Promise.reject(error);
  }
}


async function TimeSlotsCreate(data) {
  try {
    const response = await apiCall("POST", "master/others/timeslot/create", data);
    return response;
  } catch (error) {
    console.error("user create error:", error);
    return Promise.reject(error);
  }
}


async function TimeSlotsDelete(data) {
  try {
    const response = await apiCall("POST", "master/others/timeslot/delete", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}


async function TimeSlotsUpdate(data) {
  try {
    const response = await apiCall("POST", "master/others/timeslot/update", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function departmentSearch(data) {
  try {
    const response = await apiCall("POST", "master/department/department/list", data);
    return response;
  } catch (error) {
    console.error("timeSlotstList:", error);
    return Promise.reject(error);
  }
}

async function getTimeSlotsById(data) {
  try {
    const response = await apiCall("POST", "master/others/timeslot/detail", data);
    return response;
  } catch (error) {
    console.error("department:", error);
    return Promise.reject(error);
  }
}







export const TimeSlotsServices = {
  getTimeSlotList,
  TimeSlotsCreate,
  TimeSlotsDelete,
  TimeSlotsUpdate,
  getTimeSlotsById,
  timeSlotSearch,
  departmentSearch,
};