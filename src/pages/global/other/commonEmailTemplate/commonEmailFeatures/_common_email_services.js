import { apiCall } from "../../../../../config/Http";


async function getcommonEmailList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `master/emailTemplate/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/emailTemplate/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function commonEmailSearch(data) {

  try {
    const response = await apiCall("POST", "master/emailTemplate/list", data);
    return response;
  } catch (error) {
    console.error("common Email List:", error);
    return Promise.reject(error);
  }
}

async function getcommonEmailDetails(data) {

  try {
    const response = await apiCall("POST", "master/emailTemplate/detail", data);
    return response;
  } catch (error) {
    console.error("common Email:", error);
    return Promise.reject(error);
  }
}
async function createcommonEmail(data) {
  try {
    const response = await apiCall("POST", "master/emailTemplate/create", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function updatecommonEmail(data) {

  try {
    const response = await apiCall("POST", "master/emailTemplate/update", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function deletecommonEmail(data) {

  try {
    const response = await apiCall("POST", "master/emailTemplate/delete", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}

export const commonEmailServices = {
  getcommonEmailList,
  getcommonEmailDetails,
  createcommonEmail,
  updatecommonEmail,
  deletecommonEmail,
  commonEmailSearch
};