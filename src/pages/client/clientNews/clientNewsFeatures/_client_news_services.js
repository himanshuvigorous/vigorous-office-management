import { apiCall } from "../../../../config/Http";


async function getClientNewsList(data) {

  if (data) {
    const { page, limit ,reqPayload } = data
    try {
      const response = await apiCall("POST", `client/news/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Proposal List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/news/list`);
      return response;
    } catch (error) {
      console.error("Proposal List:", error);
      return Promise.reject(error);
    }
  }
}

async function clientNewsSearch(data) {

  try {
    const response = await apiCall("POST", "searchClientGroup", data);
    return response;
  } catch (error) {
    console.error("Proposal List:", error);
    return Promise.reject(error);
  }
}
async function getClientNewsDetails(data) {

  try {
    const response = await apiCall("POST", "client/news/detail", data);
    return response;
  } catch (error) {
    console.error("Proposal:", error);
    return Promise.reject(error);
  }
}
async function createClientNews(data) {

  try {
    const response = await apiCall("POST", "client/news/create", data);
    return response;
  } catch (error) {
    console.error("Proposal error:", error);
    return Promise.reject(error);
  }
}
async function updateClientNews(data) {

  try {
    const response = await apiCall("POST", "client/news/update", data);
    return response;
  } catch (error) {
    console.error("Proposal error:", error);
    return Promise.reject(error);
  }
}
async function deleteClientNews(data) {

  try {
    const response = await apiCall("POST", "client/news/delete", data);
    return response;
  } catch (error) {
    console.error("Proposal error:", error);
    return Promise.reject(error);
  }
}

export const clientNewzServices = {
  getClientNewsList,
  getClientNewsDetails,
  createClientNews,
  updateClientNews,
  deleteClientNews,
  clientNewsSearch
};