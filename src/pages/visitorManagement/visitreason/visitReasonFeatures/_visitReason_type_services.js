import { apiCall } from "../../../../config/Http";



async function getVisitReasonTypeList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `master/visitor/visitReason/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/visitor/visitReason/list`);
      return response;
    } catch (error) {
      console.error("visit Reason List:", error);
      return Promise.reject(error);
    }
  }
}

async function getVisitReasonSeachList(data) {

  if (data) {
    const {  reqData } = data
    try {
      const response = await apiCall("POST", `master/visitor/visitReason/list`, data);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/visitor/visitReason/list`);
      return response;
    } catch (error) {
      console.error("visit Reason List:", error);
      return Promise.reject(error);
    }
  }
}
// async function leaveTypeSearch(data) {

//   try {
//     const response = await apiCall("POST", "master/leaveType/list", data);
//     return response;
//   } catch (error) {
//     console.error("Work Type List:", error);
//     return Promise.reject(error);
//   }
// }

async function getVisitReasonTypeDetails(data) {

  try {
    const response = await apiCall("POST", "master/visitor/visitReason/detail", data);
    return response;
  } catch (error) {
    console.error("Work Type:", error);
    return Promise.reject(error);
  }
}
async function createVisitReasonType(data) {
  try {
    const response = await apiCall("POST", "master/visitor/visitReason/create", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function updateVisitReasonType(data) {

  try {
    const response = await apiCall("POST", "master/visitor/visitReason/update", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteVisitReasonType(data) {

  try {
    const response = await apiCall("POST", "master/visitor/visitReason/delete", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}

export const VisitReasonTypeServices = {
  getVisitReasonTypeList,
  getVisitReasonTypeDetails,
  createVisitReasonType,
  updateVisitReasonType,
  deleteVisitReasonType,
  getVisitReasonSeachList
};