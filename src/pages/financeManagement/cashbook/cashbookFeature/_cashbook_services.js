import { apiCall } from "../../../../config/Http";


async function getcashbookList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/cashbook/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/cashbook/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
  
}
async function getEmployeecashbookDetails(data) {

  const {currentPage , pageSize,reqData} = data
  if(currentPage && pageSize){
  try {
    const response = await apiCall("POST", `finance/cashbook/cashbook?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/cashbook/cashbook`,data);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
  
}

async function getEmployeeCashbookList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/cashbook/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/cashbook/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}




async function getCashbookEmployeeList(data) {


    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/cashbook/employeList?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Cashbook Employee List:", error);
    return Promise.reject(error);
  }
  }




async function cashbookSearch(data) {

  try {
    const response = await apiCall("POST", "finance/cashbook/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getcashbookDetails(data) {

  try {
    const response = await apiCall("POST", "finance/cashbook/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createcashbook(data) {
  try {
    const response = await apiCall("POST", "finance/cashbook/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatecashbook(data) {

  try {
    const response = await apiCall("POST", "finance/cashbook/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletecashbook(data) {

  try {
    const response = await apiCall("POST", "finance/cashbook/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function statuscashbook(data) {

  try {
    const response = await apiCall("POST", "finance/cashbook/status", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const cashbookServices = {
  getcashbookList,
  getcashbookDetails,
  createcashbook,
  updatecashbook,
  deletecashbook,
  cashbookSearch,
  statuscashbook,
  getEmployeeCashbookList,
  getEmployeecashbookDetails,
  getCashbookEmployeeList
};