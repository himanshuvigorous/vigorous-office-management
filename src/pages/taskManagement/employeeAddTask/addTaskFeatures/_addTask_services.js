import { apiCall } from "../../../../config/Http";


async function getTaskList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `employe/task/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/task/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}




export const taskServices = {
  getTaskList,
  
};
