import { apiCall } from "../../config/Http";


async function createNoticeBoard(data) {

  try {
    const user = await apiCall("POST", "master/others/notice/create", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function listNoticeBoard(data) {

  try {
    const user = await apiCall("POST", "master/others/notice/list", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function updateNoticeBoard(data) {

  try {
    const user = await apiCall("POST", "master/others/notice/update", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function deleteNoticeBoard(data) {

  try {
    const user = await apiCall("POST", "master/others/notice/delete", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}



export const noticeBoardServices = {
  createNoticeBoard,
  listNoticeBoard,
  updateNoticeBoard,
  deleteNoticeBoard

};