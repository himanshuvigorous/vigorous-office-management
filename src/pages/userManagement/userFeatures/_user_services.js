import { apiCall, apiCallForm } from "../../../config/Http";


async function getUserList(data) {
  const {currentPage , pageSize} = data
  try {
    const response = await apiCall("POST", `list?page=${currentPage}&limit=${pageSize}`);
    return response;
  } catch (error) {
    console.error("userlist:", error);
    return Promise.reject(error);
  }
}

async function userSearch(data) {
  try {
    const response = await apiCall("POST", "/userSearch", data);
    return response;
  } catch (error) {
    console.error("userlist:", error);
    return Promise.reject(error);
  }
}

async function userCreate(data) {

  try {
    const response = await apiCallForm("POST", "signUp", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("user create error:", error);
    return Promise.reject(error);
  }
}

async function getUserDetails(data) {

  try {
    const response = await apiCall("POST", "/getUserById", data);
    return response;
  } catch (error) {
    console.error("getUserDetails:", error);
    return Promise.reject(error);
  }
}

async function getClientDetails(data) {

  try {
    const response = await apiCall("POST", "/getUserById", data);
    return response;
  } catch (error) {
    console.error("getClientDetails:", error);
    return Promise.reject(error);
  }
}

async function updateUser(data) {

  try {
    const response = await apiCall("POST", "/updateUser", data);
    return response;
  } catch (error) {
    console.error("updateUser:", error);
    return Promise.reject(error);
  }
}

async function deleteUser(data) {

  try {
    const response = await apiCall("POST", "/deleteUser", data);
    return response;
  } catch (error) {
    console.error("deleteUser:", error);
    return Promise.reject(error);
  }
}

async function uploadDocFile(formData) {

  try {
    const response = await apiCallForm("POST", "/uploadImage", formData);
    return response.data;
  } catch (error) {
    console.error("deleteUser:", error);
    return Promise.reject(error);
  }
}

export const userServices = {
  getUserList,
  userSearch,
  userCreate,
  getUserDetails,
  updateUser,
  deleteUser,
  getClientDetails,
  uploadDocFile
};