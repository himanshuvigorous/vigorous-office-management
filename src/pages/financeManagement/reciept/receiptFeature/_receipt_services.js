import { apiCall } from "../../../../config/Http";


async function getreceiptList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/receipt/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/receipt/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function receiptSearch(data) {

  try {
    const response = await apiCall("POST", "finance/receipt/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getreceiptDetails(data) {

  try {
    const response = await apiCall("POST", "finance/receipt/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createreceipt(data) {
  try {
    const response = await apiCall("POST", "finance/receipt/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatereceipt(data) {

  try {
    const response = await apiCall("POST", "finance/receipt/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletereceipt(data) {

  try {
    const response = await apiCall("POST", "finance/receipt/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const receiptServices = {
  getreceiptList,
  getreceiptDetails,
  createreceipt,
  updatereceipt,
  deletereceipt,
  receiptSearch
};