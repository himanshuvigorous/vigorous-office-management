import { apiCall } from "../../../../config/Http";



async function getLeadCategoryList(data = {}) {
  try {
    const { page, limit, reqPayload } = data;

    let url = "master/leadCategory/list";
    let payload = data;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
      payload = reqPayload || {};
    }

    const response = await apiCall("POST", url, payload);
    return response;
  } catch (error) {
    console.error("LeadCategoryList:", error);
    return Promise.reject(error);
  }
}


async function getLeadCategoryById(data) {
  try {
    const response = await apiCall("POST", "master/leadCategory/detail", data);
    return response;
  } catch (error) {
    console.error("LeadCategory:", error);
    return Promise.reject(error);
  }
}

async function LeadCategoryCreate(data) {
  try {
    const response = await apiCall("POST", "master/leadCategory/create", data);
    return response;
  } catch (error) {



    console.error("user create error:", error);
    return Promise.reject(error);
  }
}

async function LeadCategoryUpdate(data) {
  try {
    const response = await apiCall("POST", "master/leadCategory/update", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function LeadCategoryDelete(data) {
  try {
    const response = await apiCall("POST", "master/leadCategory/delete", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

export const LeadCategoryServices = {
  getLeadCategoryList,
  LeadCategoryCreate,
  LeadCategoryUpdate,
  LeadCategoryDelete,
  getLeadCategoryById,
};