import { apiCall } from "../../../../config/Http";


async function getExpenseList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `finance/expense/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `finance/expense/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}

async function expenseSearch(data) {
  try {
    const response = await apiCall("POST", "finance/expense/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getExpenseDetails(data) {
  try {
    const response = await apiCall("POST", "finance/expense/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}

async function createExpense(data) {
  try {
    const response = await apiCall("POST", "finance/expense/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updateExpense(data) {

  try {
    const response = await apiCall("POST", "finance/expense/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deleteExpense(data) {

  try {
    const response = await apiCall("POST", "finance/expense/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const expenseServices = {
  getExpenseList,
  getExpenseDetails,
  createExpense,
  updateExpense,
  deleteExpense,
  expenseSearch
};