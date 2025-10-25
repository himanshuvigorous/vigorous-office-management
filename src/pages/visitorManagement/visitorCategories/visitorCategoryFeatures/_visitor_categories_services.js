import { apiCall, apiCallForm } from "../../../../config/Http";


async function getVisitorCatList(data) {
  const { page, limit } = data
  try {
    const response = await apiCall("POST", `master/visitor/category/list?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    console.error("visitorCatlist:", error);
    return Promise.reject(error);
  }
}

async function visitorCatSearch(data) {
  try {
    const response = await apiCall("POST", "master/visitor/category/list", data);
    return response;
  } catch (error) {
    console.error("visitorCatlist:", error);
    return Promise.reject(error);
  }
}

async function createVisitorCat(data) {

  try {
    const response = await apiCall("POST", "master/visitor/category/create", data);
    return response;
  } catch (error) {
    console.error("visitor category create error:", error);
    return Promise.reject(error);
  }
}

async function getVisitorCatDetails(data) {
  try {
    const response = await apiCall("POST", "master/visitor/category/detail", data);
    return response;
  } catch (error) {
    console.error("getVisitorCatDetails:", error);
    return Promise.reject(error);
  }
}

async function updateVisitorCat(data) {
  try {
    const response = await apiCall("POST", "master/visitor/category/update", data);
    return response;
  } catch (error) {
    console.error("updateVisitorCat:", error);
    return Promise.reject(error);
  }
}

async function deleteVisitorCat(data) {
  try {
    const response = await apiCall("POST", "master/visitor/category/delete", data);
    return response;
  } catch (error) {
    console.error("deleteVisitorCat:", error);
    return Promise.reject(error);
  }
}

export const visitorCatServices = {
  getVisitorCatList,
  visitorCatSearch,
  createVisitorCat,
  getVisitorCatDetails,
  updateVisitorCat,
  deleteVisitorCat,
};