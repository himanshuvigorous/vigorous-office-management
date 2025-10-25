import { apiCall } from "../../../../../config/Http";


async function getInterviewRoundTypeList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `master/others/interviewRound/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/interviewRound/list`);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  }
}
async function searchInterviewRoundTypeList(data) {
    try {
      const response = await apiCall("POST", `master/others/interviewRound/list`,data);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  
}
async function getInterviewRoundTypeDetails(data) {
  try {
    const response = await apiCall("POST", "master/others/interviewRound/detail", data);
    return response;
  } catch (error) {
    console.error("Work Type:", error);
    return Promise.reject(error);
  }
}
async function createInterviewRoundType(data) {
  try {
    const response = await apiCall("POST", "master/others/interviewRound/create", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function updateInterviewRoundType(data) {

  try {
    const response = await apiCall("POST", "master/others/interviewRound/update", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteInterviewRoundType(data) {

  try {
    const response = await apiCall("POST", "master/others/interviewRound/delete", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}

export const interviewRoundTypeServices = {
  getInterviewRoundTypeList,
  getInterviewRoundTypeDetails,
  createInterviewRoundType,
  updateInterviewRoundType,
  deleteInterviewRoundType,
  searchInterviewRoundTypeList
};