import { apiCall } from "../../../../config/Http";


async function getfundTransferList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `project/fundTransfer/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `project/fundTransfer/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function fundTransferSearch(data) {

  try {
    const response = await apiCall("POST", "project/fundTransfer/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}
async function fundTransferreport(data) {

  try {
    const response = await apiCall("POST", "project/fundTransfer/report", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getfundTransferDetails(data) {

  try {
    const response = await apiCall("POST", "project/fundTransfer/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createfundTransfer(data) {
  try {
    const response = await apiCall("POST", "project/fundTransfer/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatefundTransfer(data) {

  try {
    const response = await apiCall("POST", "project/fundTransfer/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletefundTransfer(data) {

  try {
    const response = await apiCall("POST", "project/fundTransfer/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const fundTransferServices = {
  getfundTransferList,
  getfundTransferDetails,
  createfundTransfer,
  updatefundTransfer,
  deletefundTransfer,
  fundTransferSearch,
  fundTransferreport
};