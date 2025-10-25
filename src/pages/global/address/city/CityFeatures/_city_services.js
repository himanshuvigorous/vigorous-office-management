import { apiCall } from "../../../../../config/Http";


async function getCityList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `master/others/city/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Country List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/city/list`);
      return response;
    } catch (error) {
      console.error("Country List:", error);
      return Promise.reject(error);
    }
  }
}

async function citySearch(data) {
  try {
    const response = await apiCall("POST", "master/others/city/list", data);
    return response;
  } catch (error) {
    console.error("City List:", error);
    return Promise.reject(error);
  }
}

async function getCityById(data) {
  try {
    const response = await apiCall("POST", "master/others/city/detail", data);
    return response;
  } catch (error) {
    console.error("City:", error);
    return Promise.reject(error);
  }
}

async function createCityFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/city/create", data);
    return response;
  } catch (error) {
    console.error("City error:", error);
    return Promise.reject(error);
  }
}

async function updateCityData(data) {
  try {
    const response = await apiCall("POST", "master/others/city/update", data);
    return response;
  } catch (error) {
    console.error("City error:", error);
    return Promise.reject(error);
  }
}

async function deleteCityFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/city/delete", data);
    return response;
  } catch (error) {
    console.error("City error:", error);
    return Promise.reject(error);
  }
}

export const cityServices = {
  getCityList,
  getCityById,
  updateCityData,
  createCityFunc,
  deleteCityFunc,
  citySearch,
};