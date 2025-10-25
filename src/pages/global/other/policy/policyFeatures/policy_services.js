import { apiCall } from "../../../../../config/Http";


async function getpolicyList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `master/policy/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/policy/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function commonEmailSearch(data) {

  try {
    const response = await apiCall("POST", "master/policy/list", data);
    return response;
  } catch (error) {
    console.error("common Email List:", error);
    return Promise.reject(error);
  }
}

async function getPolicyDetails(data) {

  try {
    const response = await apiCall("POST", "master/policy/detail", data);
    return response;
  } catch (error) {
    console.error("common Email:", error);
    return Promise.reject(error);
  }
}
async function createPolicyFunc(data) {
  try {
    const response = await apiCall("POST", "master/policy/create", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function updatecommonEmail(data) {

  try {
    const response = await apiCall("POST", "master/policy/update", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function deletePolicyFunc(data) {

  try {
    const response = await apiCall("POST", "master/policy/delete", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}

export const policyServices = {
  getpolicyList,
  getPolicyDetails,
  createPolicyFunc,
  updatecommonEmail,
  deletePolicyFunc,
  commonEmailSearch
};