import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { officeAddressServices } from "./_office_address_services";





export const getofficeAddressList = createAsyncThunk(
  "user/getofficeAddressList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await officeAddressServices.getofficeAddressList(reqData);
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

export const officeAddressSearch = createAsyncThunk(
  "user/officeAddressSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await officeAddressServices.officeAddressSearch(reqData);
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

export const getofficeAddressDetails = createAsyncThunk(
  "user/getofficeAddressDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await officeAddressServices.getofficeAddressDetails(reqData);
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

export const createofficeAddress = createAsyncThunk(
  "user/createofficeAddress",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await officeAddressServices.createofficeAddress(reqData);
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

export const updateofficeAddress = createAsyncThunk(
  "user/updateofficeAddress",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await officeAddressServices.updateofficeAddress(reqData);
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
export const deleteofficeAddress = createAsyncThunk(
  "user/deleteofficeAddress",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await officeAddressServices.deleteofficeAddress(reqData);
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

const officeAddressSlice = createSlice({
  name: 'officeAddressSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getofficeAddressList.pending, (state, action) => {
        state.loading = true;
        state.officeAddressListData = [];
        state.totalofficeAddressListCount = 0;
      })
      .addCase(getofficeAddressList.fulfilled, (state, action) => {
        state.officeAddressListData = action.payload?.data?.docs;
        state.totalofficeAddressListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getofficeAddressList.rejected, (state, action) => {
        state.loading = false;
        state.officeAddressListData = [];
        state.totalofficeAddressListCount = 0;
      })
      .addCase(officeAddressSearch.pending, (state, action) => {
        state.loading = true;
        state.officeAddressListData = [];
        state.totalofficeAddressListCount = 0;
      })
      .addCase(officeAddressSearch.fulfilled, (state, action) => {
        state.officeAddressListData = action.payload?.data?.docs;
        state.totalofficeAddressListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(officeAddressSearch.rejected, (state, action) => {
        state.loading = false;
        state.officeAddressListData = [];
        state.totalofficeAddressListCount = 0;
      })
      .addCase(createofficeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(createofficeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.officeAddressCreateData = action.payload;
      })
      .addCase(createofficeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateofficeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateofficeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.officeAddressUpdateData = action.payload;
      })
      .addCase(updateofficeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteofficeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteofficeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.officeAddressDeleteData = action.payload;
      })
      .addCase(deleteofficeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getofficeAddressDetails.pending, (state) => {
        state.loading = true;
        state.officeAddressDetails = null;
      })
      .addCase(getofficeAddressDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.officeAddressDetails = action.payload?.data;
      })
      .addCase(getofficeAddressDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.officeAddressDetails = null;

      })
  },
});

export default officeAddressSlice.reducer;
