import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { contraServices } from "./_contra_services";







export const getcontraList = createAsyncThunk(
  "user/getcontraList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await contraServices.getcontraList(reqData);
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

export const contraSearch = createAsyncThunk(
  "user/contraSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await contraServices.contraSearch(reqData);
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

export const getcontraDetails = createAsyncThunk(
  "user/getcontraDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await contraServices.getcontraDetails(reqData);
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

export const createcontra = createAsyncThunk(
  "user/createcontra",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await contraServices.createcontra(reqData);
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

export const updatecontra = createAsyncThunk(
  "user/updatecontra",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await contraServices.updatecontra(reqData);
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
export const deletecontra = createAsyncThunk(
  "user/deletecontra",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await contraServices.deletecontra(reqData);
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

const contraSlice = createSlice({
  name: 'contraSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getcontraList.pending, (state, action) => {
        state.loading = true;
        state.contraListData = [];
        state.totalcontraListCount = 0;
      })
      .addCase(getcontraList.fulfilled, (state, action) => {
        state.contraListData = action.payload?.data?.docs;
        state.totalcontraListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getcontraList.rejected, (state, action) => {
        state.loading = false;
        state.contraListData = [];
        state.totalcontraListCount = 0;
      })
      .addCase(contraSearch.pending, (state, action) => {
        state.loading = true;
        state.contraListData = [];
        state.totalcontraListCount = 0;
      })
      .addCase(contraSearch.fulfilled, (state, action) => {
        state.contraListData = action.payload?.data?.docs;
        state.totalcontraListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(contraSearch.rejected, (state, action) => {
        state.loading = false;
        state.contraListData = [];
        state.totalcontraListCount = 0;
      })
      .addCase(createcontra.pending, (state) => {
        state.loading = true;
      })
      .addCase(createcontra.fulfilled, (state, action) => {
        state.loading = false;
        state.contraCreateData = action.payload;
      })
      .addCase(createcontra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatecontra.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatecontra.fulfilled, (state, action) => {
        state.loading = false;
        state.contraUpdateData = action.payload;
      })
      .addCase(updatecontra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletecontra.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletecontra.fulfilled, (state, action) => {
        state.loading = false;
        state.contraDeleteData = action.payload;
      })
      .addCase(deletecontra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getcontraDetails.pending, (state) => {
        state.loading = true;
        state.contraDetails = null;
      })
      .addCase(getcontraDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contraDetails = action.payload?.data;
      })
      .addCase(getcontraDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.contraDetails = null;

      })
  },
});

export default contraSlice.reducer;
