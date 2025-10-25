import { apiCall } from "../../../../../config/Http";


async function getbankAccountList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `master/branch/bankDetails/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Bank Account List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/branch/bankDetails/list`);
      return response;
    } catch (error) {
      console.error("Bank Account List:", error);
      return Promise.reject(error);
    }
  }
}
async function bankAccountSearch(data) {

  try {
    const response = await apiCall("POST", "master/branch/bankDetails/list", data);
    return response;
  } catch (error) {
    console.error("Bank Account List:", error);
    return Promise.reject(error);
  }
}

async function getbankAccountDetails(data) {

  try {
    const response = await apiCall("POST", "master/branch/bankDetails/detail", data);
    return response;
  } catch (error) {
    console.error("Bank Account:", error);
    return Promise.reject(error);
  }
}
async function createbankAccount(data) {
  try {
    const response = await apiCall("POST", "master/branch/bankDetails/create", data);
    return response;
  } catch (error) {
    console.error("Bank Account error:", error);
    return Promise.reject(error);
  }
}
async function updatebankAccount(data) {

  try {
    const response = await apiCall("POST", "master/branch/bankDetails/update", data);
    return response;
  } catch (error) {
    console.error("Bank Account error:", error);
    return Promise.reject(error);
  }
}
async function deletebankAccount(data) {

  try {
    const response = await apiCall("POST", "master/branch/bankDetails/delete", data);
    return response;
  } catch (error) {
    console.error("Bank Account error:", error);
    return Promise.reject(error);
  }
}

export const bankAccountServices = {
  getbankAccountList,
  getbankAccountDetails,
  createbankAccount,
  updatebankAccount,
  deletebankAccount,
  bankAccountSearch
};