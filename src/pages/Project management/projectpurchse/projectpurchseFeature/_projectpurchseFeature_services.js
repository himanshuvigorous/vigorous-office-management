import { apiCall } from "../../../../config/Http";


async function getprojetpurchaseExpenceList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `project/purchase/expense/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `project/purchase/expense/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function projetpurchaseExpenceSearch(data) {

  try {
    const response = await apiCall("POST", "project/purchase/expense/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getprojetpurchaseExpenceDetails(data) {

  try {
    const response = await apiCall("POST", "project/purchase/expense/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createprojetpurchaseExpence(data) {
  try {
    const response = await apiCall("POST", "project/purchase/expense/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updateprojetpurchaseExpence(data) {

  try {
    const response = await apiCall("POST", "project/purchase/expense/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deleteprojetpurchaseExpence(data) {

  try {
    const response = await apiCall("POST", "project/purchase/expense/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const projetpurchaseExpenceServices = {
  getprojetpurchaseExpenceList,
  getprojetpurchaseExpenceDetails,
  createprojetpurchaseExpence,
  updateprojetpurchaseExpence,
  deleteprojetpurchaseExpence,
  projetpurchaseExpenceSearch
};