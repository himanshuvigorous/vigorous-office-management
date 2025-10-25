import { apiCall } from "../../../../../config/Http";



async function getIndustryList(data) {
  if (data) {
    const { currentPage, pageSize,reqData } = data
    try {
      const response = await apiCall("POST", `company/industry/list?page=${currentPage}&limit=${pageSize}`,reqData);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `company/industry/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}

async function indusSearch(data) {

  try {
    const response = await apiCall("POST", "company/industry/list", data);
    return response;
  } catch (error) {
    console.error("Industry List:", error);
    return Promise.reject(error);
  }
}

async function getIndustryById(data) {

  try {
    const response = await apiCall("POST", "company/industry/detail", data);
    return response;
  } catch (error) {
    console.error("Industry:", error);
    return Promise.reject(error);
  }
}
async function industryCreate(data) {

  try {
    const response = await apiCall("POST", "company/industry/create", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Industry error:", error);
    return Promise.reject(error);
  }
}
async function industryUpdate(data) {

  try {
    const response = await apiCall("POST", "company/industry/update", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Industry error:", error);
    return Promise.reject(error);
  }
}
async function industryDelete(data) {

  try {
    const response = await apiCall("POST", "company/industry/delete", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Industry error:", error);
    return Promise.reject(error);
  }
}

export const IndustryServices = {
  getIndustryList,
  getIndustryById,
  industryCreate,
  industryUpdate,
  industryDelete,
  indusSearch,
};