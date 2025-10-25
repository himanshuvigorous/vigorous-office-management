import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { eventCalanderServices } from "./_event_calander_services";




export const getEventCalanderList = createAsyncThunk(
  "user/getEventCalanderList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await eventCalanderServices.getEventCalanderList(reqData);
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

export const eventCalanderSearch = createAsyncThunk(
  "user/eventCalanderSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await eventCalanderServices.eventCalanderSearch(reqData);
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

export const geteventCalanderDetails = createAsyncThunk(
  "user/geteventCalanderDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await eventCalanderServices.geteventCalanderDetails(reqData);
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

export const createeventCalander = createAsyncThunk(
  "user/createeventCalander",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await eventCalanderServices.createeventCalander(reqData);
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

export const updateEventCalander = createAsyncThunk(
  "user/updateEventCalander",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await eventCalanderServices.updateEventCalander(reqData);
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
      const response = await eventCalanderServices.updateholidayDetails(reqData);
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
export const deleteEventCalander = createAsyncThunk(
  "user/deleteEventCalander",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await eventCalanderServices.deleteEventCalander(reqData);
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
      .addCase(getEventCalanderList.pending, (state, action) => {
        state.loading = true;
        state.eventCalanderData = [];
        state.totaleventCalanderCount = 0;
      })
      .addCase(getEventCalanderList.fulfilled, (state, action) => {
        state.eventCalanderData = action.payload?.data?.docs;
        state.totaleventCalanderCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getEventCalanderList.rejected, (state, action) => {
        state.loading = false;
        state.eventCalanderData = [];
        state.totaleventCalanderCount = 0;
      })
      .addCase(eventCalanderSearch.pending, (state, action) => {
        state.loading = true;
        state.eventCalanderData = [];
        state.totaleventCalanderCount = 0;
      })
      .addCase(eventCalanderSearch.fulfilled, (state, action) => {
        state.eventCalanderData = action.payload?.data?.docs;
        state.totaleventCalanderCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(eventCalanderSearch.rejected, (state, action) => {
        state.loading = false;
        state.eventCalanderData = [];
        state.totaleventCalanderCount = 0;
      })
      .addCase(createeventCalander.pending, (state) => {
        state.loading = true;
      })
      .addCase(createeventCalander.fulfilled, (state, action) => {
        state.loading = false;
        state.eventCalanderCreateData = action.payload;
      })
      .addCase(createeventCalander.rejected, (state, action) => {
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
      .addCase(deleteEventCalander.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEventCalander.fulfilled, (state, action) => {
        state.loading = false;
        state.eventCalanderDeleteData = action.payload;
      })
      .addCase(deleteEventCalander.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(geteventCalanderDetails.pending, (state) => {
        state.loading = true;
        state.eventCalanderDetails = {};
      })
      .addCase(geteventCalanderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.eventCalanderDetails = action.payload?.data;
      })
      .addCase(geteventCalanderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.eventCalanderDetails = {};
      })
  },
});

export default employeeDocumentSlice.reducer;
