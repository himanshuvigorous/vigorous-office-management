import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { compensatoryLeaveRequestServices } from "./_compensatory_request_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";






export const getCompensatoryLeaveRequestList = createAsyncThunk(
  "user/getCompensatoryLeaveRequestList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await compensatoryLeaveRequestServices.getCompensatoryLeaveRequestList(reqData);
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


export const getCompensatoryLeaveRequestDetails = createAsyncThunk(
  "user/getCompensatoryLeaveRequestDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await compensatoryLeaveRequestServices.getCompensatoryLeaveRequestDetails(reqData);
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

export const createCompensatoryLeaveRequest = createAsyncThunk(
  "user/createCompensatoryLeaveRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await compensatoryLeaveRequestServices.createCompensatoryLeaveRequest(reqData);
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
export const updateCompensatoryLeaveRequest = createAsyncThunk(
  "user/updateCompensatoryLeaveRequest",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await compensatoryLeaveRequestServices.updateCompensatoryLeaveRequest(reqData);
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
export const updateCompensatoryLeaveRequestStatus = createAsyncThunk(
  "user/updateCompensatoryLeaveRequestStatus",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await compensatoryLeaveRequestServices.updateCompensatoryLeaveRequestStatus(reqData);
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
      .addCase(getCompensatoryLeaveRequestList.pending, (state, action) => {
        state.loading = true;
        state.leaveRequestData = [];
        state.totalLeaverequestCount = 0;
      })
      .addCase(getCompensatoryLeaveRequestList.fulfilled, (state, action) => {
        state.compensatoryleaveRequestData = action.payload?.data?.docs;
        state.totalCompensatoryLeaverequestCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getCompensatoryLeaveRequestList.rejected, (state, action) => {
        state.loading = false;
        state.leaveRequestData = [];
        state.totalLeaverequestCount = 0;
      })
      .addCase(getCompensatoryLeaveRequestDetails.pending, (state, action) => {
        state.loading = true;
        state.compensatoryLeaveData = {};
      })
      .addCase(getCompensatoryLeaveRequestDetails.fulfilled, (state, action) => {
        state.compensatoryLeaveData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getCompensatoryLeaveRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.compensatoryLeaveData = {};
      })
      .addCase(createCompensatoryLeaveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompensatoryLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.compensatoryleaverequestCreateData = action.payload;
      })
      .addCase(createCompensatoryLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompensatoryLeaveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompensatoryLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.updateCompensatoryleave = action.payload;
      })
      .addCase(updateCompensatoryLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompensatoryLeaveRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompensatoryLeaveRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.updateCompensatoryleaveStatus = action.payload;
      })
      .addCase(updateCompensatoryLeaveRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default employeeDocumentSlice.reducer;
