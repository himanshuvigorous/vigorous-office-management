import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { eventServices } from "./_event_services";


export const getEventDataList = createAsyncThunk(
  "user/getEventDataList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await eventServices.getEventDataList(reqData);
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
export const eventSearch = createAsyncThunk(
  "user/eventSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await eventServices.eventSearch(reqData);
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
export const getEventDetails = createAsyncThunk(
  "user/getEventDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await eventServices.getEventDetails(reqData);
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

export const createEventFunc = createAsyncThunk(
  "user/createEventFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await eventServices.createEventFunc(reqData);
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

export const updateEventFunc = createAsyncThunk(
  "user/updateEventFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await eventServices.updateEventFunc(reqData);
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
export const deleteEventFunc = createAsyncThunk(
  "user/deleteEventFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await eventServices.deleteEventData(reqData);
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

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    eventDataList: [],
    totalEventCount: 0,
    eventDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getEventDataList.pending, (state, action) => {
        state.loading = true;
        state.eventDataList = [];
        state.totalEventCount = 0;
      })
      .addCase(getEventDataList.fulfilled, (state, action) => {
        state.eventDataList = action.payload?.data?.docs;        
        state.totalEventCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getEventDataList.rejected, (state, action) => {
        state.loading = false;
        state.eventDataList = [];
        state.totalEventCount = 0;
      })
      .addCase(eventSearch.pending, (state, action) => {
        state.loading = true;
        state.eventDataList = [];
        state.totalEventCount = 0;
      })
      .addCase(eventSearch.fulfilled, (state, action) => {
        state.eventDataList = action.payload?.data?.docs;
        state.totalEventCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(eventSearch.rejected, (state, action) => {
        state.loading = false;
        state.eventDataList = [];
        state.totalEventCount = 0;
      })
      .addCase(createEventFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEventFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.eventCreateData = action.payload;
      })
      .addCase(createEventFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEventFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEventFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.eventUpdateData = action.payload;
      })
      .addCase(updateEventFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEventFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEventFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.eventDeleteData = action.payload;
      })
      .addCase(deleteEventFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEventDetails.pending, (state) => {
        state.loading = true;
        state.eventDetails = null;
      })
      .addCase(getEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.eventDetails = action.payload?.data;
      })
      .addCase(getEventDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.eventDetails = null;
      })
  },
});

export default eventSlice.reducer;