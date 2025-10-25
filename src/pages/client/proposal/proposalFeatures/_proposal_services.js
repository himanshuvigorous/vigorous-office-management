import { apiCall } from "../../../../config/Http";


async function getProposalList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `client/proposal/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Proposal List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/proposal/list`);
      return response;
    } catch (error) {
      console.error("Proposal List:", error);
      return Promise.reject(error);
    }
  }
}

async function proposalSearch(data) {

  try {
    const response = await apiCall("POST", "client/proposal/list", data);
    return response;
  } catch (error) {
    console.error("Proposal List:", error);
    return Promise.reject(error);
  }
}
async function getProposalDetails(data) {

  try {
    const response = await apiCall("POST", "client/proposal/detail", data);
    return response;
  } catch (error) {
    console.error("Proposal:", error);
    return Promise.reject(error);
  }
}
async function createProposal(data) {

  try {
    const response = await apiCall("POST", "client/proposal/create", data);
    return response;
  } catch (error) {
    console.error("Proposal error:", error);
    return Promise.reject(error);
  }
}
async function updateProposalData(data) {

  try {
    const response = await apiCall("POST", "client/proposal/update", data);
    return response;
  } catch (error) {
    console.error("Proposal error:", error);
    return Promise.reject(error);
  }
}
async function deleteProposalData(data) {

  try {
    const response = await apiCall("POST", "client/proposal/delete", data);
    return response;
  } catch (error) {
    console.error("Proposal error:", error);
    return Promise.reject(error);
  }
}

async function sendProposalEmail(data) {
  try {
    const response = await apiCall("POST", "commonMailer", data);
    return response;
  } catch (error) {
    console.error("getProposalDetails:", error);
    return Promise.reject(error);
  }
}
async function updateProposalStatus(data) {
  try {
    const response = await apiCall("POST", "client/proposal/status", data);
    return response;
  } catch (error) {
    console.error("getProposalDetails:", error);
    return Promise.reject(error);
  }
}

export const proposalServices = {
  getProposalList,
  getProposalDetails,
  createProposal,
  updateProposalData,
  deleteProposalData,
  proposalSearch,
  sendProposalEmail,
  updateProposalStatus
};