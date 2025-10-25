import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { leaveRequestServices } from "./_holiday_calander_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";




export const getHolidayCalanderList = createAsyncThunk(
  "user/getHolidayCalanderList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await leaveRequestServices.getHolidayCalanderList(reqData);
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

export const HolidayCalanderSearch = createAsyncThunk(
  "user/HolidayCalanderSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await leaveRequestServices.HolidayCalanderSearch(reqData);
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

export const getHolidayCalanderDetails = createAsyncThunk(
  "user/getHolidayCalanderDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveRequestServices.getHolidayCalanderDetails(reqData);
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

export const createholidayCalander = createAsyncThunk(
  "user/createholidayCalander",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveRequestServices.createholidayCalander(reqData);
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

export const updateholidayDetails = createAsyncThunk(
  "user/updateholidayDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await leaveRequestServices.updateholidayDetails(reqData);
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
export const deleteHolidayCalander = createAsyncThunk(
  "user/deleteHolidayCalander",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await leaveRequestServices.deleteHolidayCalander(reqData);
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
      .addCase(getHolidayCalanderList.pending, (state, action) => {
        state.loading = true;
        state.holidayCalanderData = [];
        state.totalholidayCalanderCount = 0;
      })
      .addCase(getHolidayCalanderList.fulfilled, (state, action) => {
        state.holidayCalanderData = action.payload?.data?.docs;
        state.totalholidayCalanderCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getHolidayCalanderList.rejected, (state, action) => {
        state.loading = false;
        state.holidayCalanderData = [];
        state.totalholidayCalanderCount = 0;
      })
      .addCase(HolidayCalanderSearch.pending, (state, action) => {
        state.loading = true;
        state.holidayCalanderData = [];
        state.totalholidayCalanderCount = 0;
      })
      .addCase(HolidayCalanderSearch.fulfilled, (state, action) => {
        state.holidayCalanderData = action.payload?.data?.docs;
        state.totalholidayCalanderCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(HolidayCalanderSearch.rejected, (state, action) => {
        state.loading = false;
        state.holidayCalanderData = [];
        state.totalholidayCalanderCount = 0;
      })
      .addCase(createholidayCalander.pending, (state) => {
        state.loading = true;
      })
      .addCase(createholidayCalander.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayCalanderCreateData = action.payload;
      })
      .addCase(createholidayCalander.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateholidayDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateholidayDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequestUpdateData = action.payload;
      })
      .addCase(updateholidayDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHolidayCalander.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHolidayCalander.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayCalanderDeleteData = action.payload;
      })
      .addCase(deleteHolidayCalander.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHolidayCalanderDetails.pending, (state) => {
        state.loading = true;
        state.holidayCalanderDetails = {};
      })
      .addCase(getHolidayCalanderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayCalanderDetails = action.payload?.data;
      })
      .addCase(getHolidayCalanderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.holidayCalanderDetails = {};
      })
  },
});

export default employeeDocumentSlice.reducer;
