import { apiCall } from "../../../../../config/Http";


async function getTodoList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/todo/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/asset/inventory/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function AssetInventrySearch(data) {

  try {
    const response = await apiCall("POST", "employe/asset/inventory/list", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}
async function CreateTodoList(data) {

  try {
    const response = await apiCall("POST", "employe/todo/create", data);
    return response;
  } catch (error) {
    console.error("leave Type List:", error);
    return Promise.reject(error);
  }
}
async function deleteTodoData(data) {

  try {
    const response = await apiCall("POST", "employe/todo/delete", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function updateTodoList(data) {

  try {
    const response = await apiCall("POST", "employe/todo/update", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function statusTodoList(data) {

  try {
    const response = await apiCall("POST", "employe/todo/status", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}
async function assetInventryDetails(data) {

  try {
    const response = await apiCall("POST", "employe/todo/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const TodoServices = {
getTodoList,
AssetInventrySearch,
CreateTodoList,
deleteTodoData,
updateTodoList,
assetInventryDetails,
statusTodoList
};
