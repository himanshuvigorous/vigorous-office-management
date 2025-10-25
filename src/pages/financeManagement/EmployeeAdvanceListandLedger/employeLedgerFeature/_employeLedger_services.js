import { apiCall } from "../../../../config/Http";


async function getemployeLedgerList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/advanceVendor/employeAdvanceList?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/advanceVendor/employeAdvanceList`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function employeLedgerSearch(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/employeAdvanceList", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getemployeLedgerDetails(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createemployeLedger(data) {
  try {
    const response = await apiCall("POST", "finance/advanceVendor/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updateemployeLedger(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deleteemployeLedger(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const employeLedgerServices = {
  getemployeLedgerList,
  getemployeLedgerDetails,
  createemployeLedger,
  updateemployeLedger,
  deleteemployeLedger,
  employeLedgerSearch
};