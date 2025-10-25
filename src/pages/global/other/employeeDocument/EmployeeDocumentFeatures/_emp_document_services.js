import { apiCall } from "../../../../../config/Http";


async function getEmployeeDocument(reqData) {

  if(reqData){
    const {currentPage , pageSize , data} = reqData
  try {
    const response = await apiCall("POST", `master/others/documentType/list?page=${currentPage}&limit=${pageSize}`,data);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/others/documentType/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function empDoctSearch(data) {
  try {
    const response = await apiCall("POST", "master/others/documentType/list", data);
    return response;
  } catch (error) {
    console.error("GST Type List:", error);
    return Promise.reject(error);
  }
}

async function getEmployeeDocDetails(data) {

  try {
    const response = await apiCall("POST", "master/others/documentType/detail", data);
    return response;
  } catch (error) {
    console.error("GST Type:", error);
    return Promise.reject(error);
  }
}
async function createEmployeeDoc(data) {
  try {
    const response = await apiCall("POST", "master/others/documentType/create", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function updateEmployeeDoc(data) {

  try {
    const response = await apiCall("POST", "master/others/documentType/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteEmployeeDoc(data) {

  try {
    const response = await apiCall("POST", "master/others/documentType/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

export const employeeDocumentServices = {
  getEmployeeDocument,
  getEmployeeDocDetails,
  createEmployeeDoc,
  updateEmployeeDoc,
  deleteEmployeeDoc,
  empDoctSearch
};