import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { digitalSignServices } from "./_digital_sign_services";


export const getDigitalSignList = createAsyncThunk(
  "user/getDigitalSignList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await digitalSignServices.getDigitalSignList(reqData);
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
      const respose = await digitalSignServices.eventSearch(reqData);
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
export const getDigitalSignDetails = createAsyncThunk(
  "user/getDigitalSignDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await digitalSignServices.getDigitalSignDetails(reqData);
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

export const createDigitalSign = createAsyncThunk(
  "user/createDigitalSign",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await digitalSignServices.createDigitalSign(reqData);
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

export const updateDigitalSign = createAsyncThunk(
  "user/updateDigitalSign",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await digitalSignServices.updateDigitalSign(reqData);
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
export const deleteDigitalSign = createAsyncThunk(
  "user/deleteDigitalSign",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await digitalSignServices.deleteDigitalSignData(reqData);
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

const digitalSignSlice = createSlice({
  name: 'digitalSign',
  initialState: {
    digitalSignList: [],
    totalDigitalSignCount: 0,
    digitalSignDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDigitalSignList.pending, (state, action) => {
        state.loading = true;
        state.digitalSignList = [];
        state.totalDigitalSignCount = 0;
      })
      .addCase(getDigitalSignList.fulfilled, (state, action) => {
        state.digitalSignList = action.payload?.data?.docs;
        state.totalDigitalSignCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getDigitalSignList.rejected, (state, action) => {
        state.loading = false;
        state.digitalSignList = [];
        state.totalDigitalSignCount = 0;
      })
      .addCase(eventSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(eventSearch.fulfilled, (state, action) => {
        state.digitalSignList = action.payload?.data?.docs;
        state.totalDigitalSignCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(eventSearch.rejected, (state, action) => {
        state.loading = false;
        state.digitalSignList = [];
        state.totalDigitalSignCount = 0;
      })
      .addCase(createDigitalSign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDigitalSign.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalCreateData = action.payload;
      })
      .addCase(createDigitalSign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDigitalSign.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDigitalSign.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalUpdateData = action.payload;
      })
      .addCase(updateDigitalSign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDigitalSign.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDigitalSign.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalDeleteData = action.payload;
      })
      .addCase(deleteDigitalSign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDigitalSignDetails.pending, (state) => {
        state.loading = true;
        state.digitalSignDetails = null;
      })
      .addCase(getDigitalSignDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.digitalSignDetails = action.payload?.data;
      })
      .addCase(getDigitalSignDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.digitalSignDetails = null;
      })
  },
});

export default digitalSignSlice.reducer;