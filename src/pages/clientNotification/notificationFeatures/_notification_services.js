import { apiCall } from "../../../config/Http";


async function getNotificationList(data) {
  const { page, limit, reqPayload } = data
  try {
    const response = await apiCall("POST", `notification/list?page=${page}&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("notificationlist:", error);
    return Promise.reject(error);
  }
}

async function notificationSearch(data) {
  try {
    const response = await apiCall("POST", "/notification/list", data);
    return response;
  } catch (error) {
    console.error("notificationlist:", error);
    return Promise.reject(error);
  }
}

async function createNotification(data) {
  try {
    const response = await apiCall("POST", "notification/create", data);
    return response;
  } catch (error) {
    console.error("user create error:", error);
    return Promise.reject(error);
  }
}

async function getNotificationDetails(data) {
  try {
    const response = await apiCall("POST", "notification/detail", data);
    return response;
  } catch (error) {
    console.error("getNotificationDetails:", error);
    return Promise.reject(error);
  }
}

async function updateNotification(data) {
  try {
    const response = await apiCall("POST", "notification/update", data);
    return response;
  } catch (error) {
    console.error("updateNotification:", error);
    return Promise.reject(error);
  }
}

async function deleteNotification(data) {
  try {
    const response = await apiCall("POST", "notification/delete", data);
    return response;
  } catch (error) {
    console.error("deleteNotification:", error);
    return Promise.reject(error);
  }
}

export const notificationServices = {
  getNotificationList,
  notificationSearch,
  createNotification,
  getNotificationDetails,
  updateNotification,
  deleteNotification,
};