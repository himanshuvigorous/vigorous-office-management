import { apiCall } from "../../../../config/Http";


async function getcontraList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/contra/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/contra/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function contraSearch(data) {

  try {
    const response = await apiCall("POST", "finance/contra/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getcontraDetails(data) {

  try {
    const response = await apiCall("POST", "finance/contra/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createcontra(data) {
  try {
    const response = await apiCall("POST", "finance/contra/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatecontra(data) {

  try {
    const response = await apiCall("POST", "finance/contra/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletecontra(data) {

  try {
    const response = await apiCall("POST", "finance/contra/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const contraServices = {
  getcontraList,
  getcontraDetails,
  createcontra,
  updatecontra,
  deletecontra,
  contraSearch
};