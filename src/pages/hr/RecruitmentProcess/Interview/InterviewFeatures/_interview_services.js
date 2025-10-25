import { apiCall } from "../../../../../config/Http";

async function getInterviewList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `employe/recruitment/interview/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/recruitment/interview/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function interviewSearch(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/interview/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getInterviewDetails(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/interview/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createInterview(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/interview/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateInterview(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/interview/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteInterview(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/interview/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

async function sendEmailInterview(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/interview/sendEmail", data);
    return response;
  } catch (error) {
    console.error("getonBoardingDetailsdddd:", error);
    return Promise.reject(error);
  }
}
async function statusUpdateApplication(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/interview/status", data);
    return response;
  } catch (error) {
    console.error("getonBoardingDetailsdddd:", error);
    return Promise.reject(error);
  }
}

export const interviewServices = {
  getInterviewList,
  getInterviewDetails,
  createInterview,
  updateInterview,
  deleteInterview,
  interviewSearch,
  sendEmailInterview,
  statusUpdateApplication
};