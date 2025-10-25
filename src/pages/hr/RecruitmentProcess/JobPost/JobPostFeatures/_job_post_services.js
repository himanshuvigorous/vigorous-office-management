import { apiCall } from "../../../../../config/Http";



async function getJobPostList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/recruitment/jobpost/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/recruitment/jobpost/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function jobPostSearch(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/jobpost/list", data);

 
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}

async function getJobPostDetails(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/jobpost/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function createJobPost(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/jobpost/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateJobPost(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/jobpost/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteJobPost(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/jobpost/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function statusJobPost(data) {

  try {
    const response = await apiCall("POST", "employe/recruitment/jobpost/status", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const jobPostServices = {
  getJobPostList,
  getJobPostDetails,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  jobPostSearch,
  statusJobPost
};