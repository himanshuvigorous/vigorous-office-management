import { apiCall } from "../../../../config/Http";


async function getvendoremployeeAdvanceList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/advanceVendor/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/advanceVendor/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function vendoremployeeAdvanceSearch(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getvendoremployeeAdvanceDetails(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createvendoremployeeAdvance(data) {
  try {
    const response = await apiCall("POST", "finance/advanceVendor/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updatevendoremployeeAdvance(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deletevendoremployeeAdvance(data) {

  try {
    const response = await apiCall("POST", "finance/advanceVendor/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const vendoremployeeAdvanceServices = {
  getvendoremployeeAdvanceList,
  getvendoremployeeAdvanceDetails,
  createvendoremployeeAdvance,
  updatevendoremployeeAdvance,
  deletevendoremployeeAdvance,
  vendoremployeeAdvanceSearch
};