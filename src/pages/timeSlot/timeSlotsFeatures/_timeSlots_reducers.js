import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { TimeSlotsServices } from "./_timeSlots_services";

export const getTimeSlotList = createAsyncThunk(
  "user/departmentList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await TimeSlotsServices.getTimeSlotList(reqData);
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

export const timeSlotSearch = createAsyncThunk(
  "user/timeSlotSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await TimeSlotsServices.timeSlotSearch(userData);
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

export const getTimeSlotsById = createAsyncThunk(
  "user/getTimeSlotsById",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await TimeSlotsServices.getTimeSlotsById(userData);
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

export const createTimeSlotsFunc = createAsyncThunk(
  "user/createTimeSlotsFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await TimeSlotsServices.TimeSlotsCreate(userData);
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

export const updateTimeSlotsFunc = createAsyncThunk(
  "user/updateTimeSlotsFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await TimeSlotsServices.TimeSlotsUpdate(userData);
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

export const deleteTimeSlotsFunc = createAsyncThunk(
  "user/deleteTimeSlotsFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await TimeSlotsServices.TimeSlotsDelete(userData);
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

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    timeSlotsListData: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimeSlotList.pending, (state, action) => {
        state.loading = true;
        state.timeSlotsListData = [];
        state.totalTimeSlotsCount = 0;
      })
      .addCase(getTimeSlotList.fulfilled, (state, action) => {
        state.timeSlotsListData = action.payload?.data?.docs;
        state.totalTimeSlotsCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getTimeSlotList.rejected, (state, action) => {
        state.loading = false;
        state.timeSlotsListData = [];
        state.totalTimeSlotsCount = 0;
      })
      .addCase(timeSlotSearch.pending, (state, action) => {
        state.loading = true;
        state.timeSlotsListData = [];
        state.totalTimeSlotsCount = 0;
      })
      .addCase(timeSlotSearch.fulfilled, (state, action) => {
        state.timeSlotsListData = action.payload?.data?.docs;
        state.totalTimeSlotsCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(timeSlotSearch.rejected, (state, action) => {
        state.loading = false;
        state.timeSlotsListData = [];
        state.totalTimeSlotsCount = 0;
      })
     
      .addCase(createTimeSlotsFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTimeSlotsFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentCreateData = action.payload;
      })
      .addCase(createTimeSlotsFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTimeSlotsFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTimeSlotsFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentUpdateData = action.payload;
      })
      .addCase(updateTimeSlotsFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTimeSlotsFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTimeSlotsFunc.fulfilled, (state, action) => {
        state.loading = false;
        // state.departmentDeleteData = action.payload;
      })
      .addCase(deleteTimeSlotsFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTimeSlotsById.pending, (state) => {
        state.loading = true;
        state.timeSlotsByIdData = null;
      })
      .addCase(getTimeSlotsById.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlotsByIdData = action.payload;
      })
      .addCase(getTimeSlotsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.timeSlotsByIdData = null;
      })
  },
});

export default departmentSlice.reducer;
