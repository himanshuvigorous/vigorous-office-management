import { apiCall } from "../../../../config/Http";


async function getadvanceList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/advance/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/advance/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function advanceSearch(data) {

  try {
    const response = await apiCall("POST", "finance/advance/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getadvanceDetails(data) {

  try {
    const response = await apiCall("POST", "finance/advance/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createadvance(data) {
  try {
    const response = await apiCall("POST", "finance/advance/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updateadvance(data) {

  try {
    const response = await apiCall("POST", "finance/advance/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deleteadvance(data) {

  try {
    const response = await apiCall("POST", "finance/advance/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const advanceServices = {
  getadvanceList,
  getadvanceDetails,
  createadvance,
  updateadvance,
  deleteadvance,
  advanceSearch
};