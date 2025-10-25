import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { leaveTypeServices } from "./_leave_type_services";




export const getLeaveTypeList = createAsyncThunk(
  "user/getLeaveTypeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await leaveTypeServices.getLeaveTypeList(reqData);
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

export const leaveTypeSearch = createAsyncThunk(
  "user/leaveTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await leaveTypeServices.leaveTypeSearch(reqData);
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

export const getLeaveTypeDetails = createAsyncThunk(
  "user/getLeaveTypeDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveTypeServices.getLeaveTypeDetails(reqData);
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

export const createLeaveType = createAsyncThunk(
  "user/createLeaveType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveTypeServices.createLeaveType(reqData);
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

export const updateleaveType = createAsyncThunk(
  "user/updateleaveType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveTypeServices.updateleaveType(reqData);
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
export const deleteLeaveType = createAsyncThunk(
  "user/deleteLeaveType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await leaveTypeServices.deleteLeaveType(reqData);
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
      .addCase(getLeaveTypeList.pending, (state, action) => {
        state.loading = true;
        state.leaveListData = [];
        state.totalLeaveListCount = 0;
      })
      .addCase(getLeaveTypeList.fulfilled, (state, action) => {
        state.leaveListData = action.payload?.data?.docs;
        state.totalLeaveListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getLeaveTypeList.rejected, (state, action) => {
        state.loading = false;
        state.leaveListData = [];
        state.totalLeaveListCount = 0;
      })
      .addCase(leaveTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.leaveListData = [];
        state.totalLeaveListCount = 0;
      })
      .addCase(leaveTypeSearch.fulfilled, (state, action) => {
        state.leaveListData = action.payload?.data?.docs;
        state.totalLeaveListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(leaveTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.leaveListData = [];
        state.totalLeaveListCount = 0;
      })
      .addCase(createLeaveType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeCreateData = action.payload;
      })
      .addCase(createLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateleaveType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateleaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeUpdateData = action.payload;
      })
      .addCase(updateleaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLeaveType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDeleteData = action.payload;
      })
      .addCase(deleteLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeaveTypeDetails.pending, (state) => {
        state.loading = true;
        state.leaveTypeDetails = null;

      })
      .addCase(getLeaveTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDetails = action.payload?.data;
      })
      .addCase(getLeaveTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.leaveTypeDetails = null;

      })
  },
});

export default employeeDocumentSlice.reducer;
