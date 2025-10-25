import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { leaveRequestServices } from "./_leave_request_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";






export const getLeaveRequestList = createAsyncThunk(
  "user/getLeaveRequestList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await leaveRequestServices.getLeaveRequestList(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const leaveRequestSearch = createAsyncThunk(
  "user/leaveRequestSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await leaveRequestServices.leaveRequestSearch(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getLeaveRequestDetails = createAsyncThunk(
  "user/getLeaveRequestDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveRequestServices.getLeaveRequestDetails(reqData);
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

export const createLeaveRequest = createAsyncThunk(
  "user/createLeaveRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveRequestServices.createLeaveRequest(reqData);
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

export const updateleaveRequest = createAsyncThunk(
  "user/updateleaveRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveRequestServices.updateleaveRequest(reqData);
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
export const deleteLeaveRequest = createAsyncThunk(
  "user/deleteLeaveRequest",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await leaveRequestServices.deleteLeaveRequest(reqData);
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
export const updateLeaveRequestStatus = createAsyncThunk(
  "user/updateLeaveRequestStatus",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await leaveRequestServices.updateLeaveRequestStatus(reqData);
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

const employeeDocumentSlice = createSlice({
  name: 'employeeDocument',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    leaveListData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveRequestList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLeaveRequestList.fulfilled, (state, action) => {
        state.leaveRequestData = action.payload?.data?.docs;
        state.totalLeaverequestCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getLeaveRequestList.rejected, (state, action) => {
        state.loading = false;
        state.leaveRequestData = [];
        state.totalLeaverequestCount = 0;
      })
      .addCase(leaveRequestSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(leaveRequestSearch.fulfilled, (state, action) => {
        state.leaveRequestData = action.payload?.data?.docs;
        state.totalLeaverequestCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(leaveRequestSearch.rejected, (state, action) => {
        state.loading = false;
        state.leaveRequestData = [];
        state.totalLeaverequestCount = 0;
      })
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaverequestCreateData = action.payload;
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateleaveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateleaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequestUpdateData = action.payload;
      })
      .addCase(updateleaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLeaveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequestDeleteData = action.payload;
      })
      .addCase(deleteLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeaveRequestDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeaveRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.leaverequestDetails = action.payload?.data;
      })
      .addCase(getLeaveRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.leaverequestDetails = null;
      })
      .addCase(updateLeaveRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeaveRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteREquestDataStatus = action.payload?.data;
      })
      .addCase(updateLeaveRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.leaverequestDetails = null;
      })
  },
});

export default employeeDocumentSlice.reducer;
