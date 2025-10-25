import { apiCall } from "../../../../config/Http";


async function getpaymentList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/payment/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/payment/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}

async function paymentSearch(data) {

  try {
    const response = await apiCall("POST", "finance/payment/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getpaymentDetails(data) {

  try {
    const response = await apiCall("POST", "finance/payment/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createpayment(data) {
  try {
    const response = await apiCall("POST", "finance/payment/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatepayment(data) {

  try {
    const response = await apiCall("POST", "finance/payment/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletepayment(data) {

  try {
    const response = await apiCall("POST", "finance/payment/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const paymentServices = {
  getpaymentList,
  getpaymentDetails,
  createpayment,
  updatepayment,
  deletepayment,
  paymentSearch
};