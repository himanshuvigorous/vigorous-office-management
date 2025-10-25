import { apiCall } from "../../../../../config/Http";

async function getAllowanceList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `master/allowance/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/allowance/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function allowanceListSearch(data) {
  try {
    const response = await apiCall("POST", "master/allowance/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function allowanceCreate(data) {
  try {
    const response = await apiCall("POST", "master/allowance/create", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function allowanceDetails(data) {
  try {
    const response = await apiCall("POST", "master/allowance/detail", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function allowanceUpdate(data) {
  try {
    const response = await apiCall("POST", "master/allowance/update", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function allowanceDelete(data) {
  try {
    const response = await apiCall("POST", "master/allowance/delete", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}


export const allowanceServices = {
  getAllowanceList,
  allowanceListSearch,
  allowanceCreate,
  allowanceDetails,
  allowanceUpdate,
  allowanceDelete

};
