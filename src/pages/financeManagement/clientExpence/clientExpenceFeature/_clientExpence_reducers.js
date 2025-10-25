import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { clientExpenceServices } from "./_clientExpence_services";







export const getclientExpenceList = createAsyncThunk(
  "user/getclientExpenceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await clientExpenceServices.getclientExpenceList(reqData);
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

export const clientExpenceSearch = createAsyncThunk(
  "user/clientExpenceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await clientExpenceServices.clientExpenceSearch(reqData);
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

export const getclientExpenceDetails = createAsyncThunk(
  "user/getclientExpenceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientExpenceServices.getclientExpenceDetails(reqData);
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

export const createclientExpence = createAsyncThunk(
  "user/createclientExpence",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientExpenceServices.createclientExpence(reqData);
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

export const updateclientExpence = createAsyncThunk(
  "user/updateclientExpence",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientExpenceServices.updateclientExpence(reqData);
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
export const deleteclientExpence = createAsyncThunk(
  "user/deleteclientExpence",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await clientExpenceServices.deleteclientExpence(reqData);
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

const clientExpenceSlice = createSlice({
  name: 'clientExpenceSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getclientExpenceList.pending, (state, action) => {
        state.loading = true;
        state.clientExpenceListData = [];
        state.totalclientExpenceListCount = 0;
      })
      .addCase(getclientExpenceList.fulfilled, (state, action) => {
        state.clientExpenceListData = action.payload?.data?.docs;
        state.totalclientExpenceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getclientExpenceList.rejected, (state, action) => {
        state.loading = false;
        state.clientExpenceListData = [];
        state.totalclientExpenceListCount = 0;
      })
      .addCase(clientExpenceSearch.pending, (state, action) => {
        state.loading = true;
        state.clientExpenceListData = [];
        state.totalclientExpenceListCount = 0;
      })
      .addCase(clientExpenceSearch.fulfilled, (state, action) => {
        state.clientExpenceListData = action.payload?.data?.docs;
        state.totalclientExpenceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(clientExpenceSearch.rejected, (state, action) => {
        state.loading = false;
        state.clientExpenceListData = [];
        state.totalclientExpenceListCount = 0;
      })
      .addCase(createclientExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(createclientExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.clientExpenceCreateData = action.payload;
      })
      .addCase(createclientExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateclientExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateclientExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.clientExpenceUpdateData = action.payload;
      })
      .addCase(updateclientExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteclientExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteclientExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.clientExpenceDeleteData = action.payload;
      })
      .addCase(deleteclientExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getclientExpenceDetails.pending, (state) => {
        state.loading = true;
        state.clientExpenceDetails = null;
      })
      .addCase(getclientExpenceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.clientExpenceDetails = action.payload?.data;
      })
      .addCase(getclientExpenceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.clientExpenceDetails = null;

      })
  },
});

export default clientExpenceSlice.reducer;
