import { apiCall } from "../../../../config/Http";


async function getpurchaseExpenceList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/purchase/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/purchase/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function purchaseExpenceSearch(data) {

  try {
    const response = await apiCall("POST", "finance/purchase/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getpurchaseExpenceDetails(data) {

  try {
    const response = await apiCall("POST", "finance/purchase/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createpurchaseExpence(data) {
  try {
    const response = await apiCall("POST", "finance/purchase/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatepurchaseExpence(data) {

  try {
    const response = await apiCall("POST", "finance/purchase/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletepurchaseExpence(data) {

  try {
    const response = await apiCall("POST", "finance/purchase/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const purchaseExpenceServices = {
  getpurchaseExpenceList,
  getpurchaseExpenceDetails,
  createpurchaseExpence,
  updatepurchaseExpence,
  deletepurchaseExpence,
  purchaseExpenceSearch
};