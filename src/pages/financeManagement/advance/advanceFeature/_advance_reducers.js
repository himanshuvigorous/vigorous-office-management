import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { advanceServices } from "./_advance_services";







export const getadvanceList = createAsyncThunk(
  "user/getadvanceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await advanceServices.getadvanceList(reqData);
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

export const advanceSearch = createAsyncThunk(
  "user/advanceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await advanceServices.advanceSearch(reqData);
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

export const getadvanceDetails = createAsyncThunk(
  "user/getadvanceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await advanceServices.getadvanceDetails(reqData);
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

export const createadvance = createAsyncThunk(
  "user/createadvance",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await advanceServices.createadvance(reqData);
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

export const updateadvance = createAsyncThunk(
  "user/updateadvance",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await advanceServices.updateadvance(reqData);
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
export const deleteadvance = createAsyncThunk(
  "user/deleteadvance",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await advanceServices.deleteadvance(reqData);
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

const advanceSlice = createSlice({
  name: 'advanceSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getadvanceList.pending, (state, action) => {
        state.loading = true;
        state.advanceListData = [];
        state.totaladvanceListCount = 0;
      })
      .addCase(getadvanceList.fulfilled, (state, action) => {
        state.advanceListData = action.payload?.data?.docs;
        state.totaladvanceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getadvanceList.rejected, (state, action) => {
        state.loading = false;
        state.advanceListData = [];
        state.totaladvanceListCount = 0;
      })
      .addCase(advanceSearch.pending, (state, action) => {
        state.loading = true;
        state.advanceListData = [];
        state.totaladvanceListCount = 0;
      })
      .addCase(advanceSearch.fulfilled, (state, action) => {
        state.advanceListData = action.payload?.data?.docs;
        state.totaladvanceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(advanceSearch.rejected, (state, action) => {
        state.loading = false;
        state.advanceListData = [];
        state.totaladvanceListCount = 0;
      })
      .addCase(createadvance.pending, (state) => {
        state.loading = true;
      })
      .addCase(createadvance.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceCreateData = action.payload;
      })
      .addCase(createadvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateadvance.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateadvance.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceUpdateData = action.payload;
      })
      .addCase(updateadvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteadvance.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteadvance.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceDeleteData = action.payload;
      })
      .addCase(deleteadvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getadvanceDetails.pending, (state) => {
        state.loading = true;
        state.advanceDetails = null;
      })
      .addCase(getadvanceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceDetails = action.payload?.data;
      })
      .addCase(getadvanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.advanceDetails = null;

      })
  },
});

export default advanceSlice.reducer;
