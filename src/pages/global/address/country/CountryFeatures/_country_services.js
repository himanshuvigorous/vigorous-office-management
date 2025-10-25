import { apiCall } from "../../../../../config/Http";





async function getCountryList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `master/others/countries/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Country List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/countries/list`);
      return response;
    } catch (error) {
      console.error("Country List:", error);
      return Promise.reject(error);
    }
  }
}




async function countrySearch(data) {
  try {
    const response = await apiCall("POST", "master/others/countries/list", data);
    return response;
  } catch (error) {
    console.error("Country List:", error);
    return Promise.reject(error);
  }
}

async function getCountryById(data) {

  try {
    const response = await apiCall("POST", "master/others/countries/detail", data);
    return response;
  } catch (error) {
    console.error("Country:", error);
    return Promise.reject(error);
  }
}
async function countryCreate(data) {

  try {
    const response = await apiCall("POST", "master/others/countries/create", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}
async function countryUpdate(data) {

  try {
    const response = await apiCall("POST", "master/others/countries/update", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}
async function countryDelete(data) {

  try {
    const response = await apiCall("POST", "master/others/countries/delete", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}

export const countryServices = {
  getCountryList,
  getCountryById,
  countryCreate,
  countryUpdate,
  countryDelete,
  countrySearch,
};