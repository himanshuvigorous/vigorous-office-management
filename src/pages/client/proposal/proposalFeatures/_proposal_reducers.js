import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { proposalServices } from "./_proposal_services";


export const getProposalList = createAsyncThunk(
  "user/getProposalList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await proposalServices.getProposalList(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const proposalSearch = createAsyncThunk(
  "user/proposalSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await proposalServices.proposalSearch(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const getProposalDetails = createAsyncThunk(
  "user/getProposalDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await proposalServices.getProposalDetails(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const createProposal = createAsyncThunk(
  "user/createProposal",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await proposalServices.createProposal(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const updateProposalData = createAsyncThunk(
  "user/updateProposalData",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await proposalServices.updateProposalData(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const deleteProposal = createAsyncThunk(
  "user/deleteProposal",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await proposalServices.deleteProposalData(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const updateProposalStatus = createAsyncThunk(
  "user/updateProposalStatus",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await proposalServices.updateProposalStatus(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const sendProposalEmail = createAsyncThunk(
  "/company/sendProposalEmail",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await proposalServices.sendProposalEmail(userData);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

const proposalSlice = createSlice({
  name: 'proposal',
  initialState: {
    proposalList: [],
    totalProposalCount: 0,
    proposalDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getProposalList.pending, (state, action) => {
        state.loading = true;
        state.proposalList = [];
        state.totalProposalCount = 0;
      })
      .addCase(getProposalList.fulfilled, (state, action) => {
        state.proposalList = action.payload?.data?.docs;
        state.totalProposalCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getProposalList.rejected, (state, action) => {
        state.loading = false;
        state.proposalList = [];
        state.totalProposalCount = 0;
      })
      .addCase(proposalSearch.pending, (state, action) => {
        state.loading = true;
        state.proposalList = [];
        state.totalProposalCount = 0;
      })
      .addCase(proposalSearch.fulfilled, (state, action) => {
        state.proposalList = action.payload?.data?.docs;
        state.totalProposalCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(proposalSearch.rejected, (state, action) => {
        state.loading = false;
        state.proposalList = [];
        state.totalProposalCount = 0;
      })
      .addCase(sendProposalEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendProposalEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emailData = action.payload;
      })
      .addCase(sendProposalEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalCreateData = action.payload;
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProposalData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProposalData.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalUpdateData = action.payload;
      })
      .addCase(updateProposalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalDeleteData = action.payload;
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProposalStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProposalStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalstatusUpdateData = action.payload;
      })
      .addCase(updateProposalStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProposalDetails.pending, (state) => {
        state.loading = true;
        state.proposalDetails = null;
      })
      .addCase(getProposalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalDetails = action.payload?.data;
      })
      .addCase(getProposalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.proposalDetails = null;
      })
  },
});

export default proposalSlice.reducer;