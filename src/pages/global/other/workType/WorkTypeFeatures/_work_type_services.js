import { apiCall } from "../../../../../config/Http";


async function getWorkTypeList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `master/others/workType/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/workType/list`);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  }
}
async function leaveTypeSearch(data) {

  try {
    const response = await apiCall("POST", "master/leaveType/list", data);
    return response;
  } catch (error) {
    console.error("Work Type List:", error);
    return Promise.reject(error);
  }
}

async function getWorkTypeDetails(data) {

  try {
    const response = await apiCall("POST", "master/others/workType/detail", data);
    return response;
  } catch (error) {
    console.error("Work Type:", error);
    return Promise.reject(error);
  }
}
async function createWorkType(data) {
  try {
    const response = await apiCall("POST", "master/others/workType/create", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function updateWorkType(data) {

  try {
    const response = await apiCall("POST", "master/others/workType/update", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteWorkType(data) {

  try {
    const response = await apiCall("POST", "master/others/workType/delete", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}

export const workTypeServices = {
  getWorkTypeList,
  getWorkTypeDetails,
  createWorkType,
  updateWorkType,
  deleteWorkType,

  leaveTypeSearch,
};