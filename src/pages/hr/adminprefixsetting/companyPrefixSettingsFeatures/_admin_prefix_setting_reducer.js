import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { AdminPrefixServices } from "./_admin_prefix_settings_services";







export const getAdminPrefixDetails = createAsyncThunk(
  "user/getAdminPrefixDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await AdminPrefixServices.getAdminPrefixDetails(reqData);
      // showNotification({
      //   message: response?.message,
      //   type: 'success',
      // });
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

export const updateAdminPrefix = createAsyncThunk(
  "user/updateAdminPrefix",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await AdminPrefixServices.updateAdminPrefix(reqData);
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



const adminPrefixSlice = createSlice({
  name: 'AdminPrefix',
  initialState: {
    AdminPrefixList: [],
 
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPrefixDetails.pending, (state) => {
        state.loading = true;
        state.adminPrefixData = null;
      })
      .addCase(getAdminPrefixDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.adminPrefixData = action.payload?.data;
      })
      .addCase(getAdminPrefixDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.adminPrefixData = {};
      })
      .addCase(updateAdminPrefix.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminPrefix.fulfilled, (state, action) => {
        state.loading = false;
        state.updatePrefixData = action.payload;
      })
      .addCase(updateAdminPrefix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
  },
});

export default adminPrefixSlice.reducer;
