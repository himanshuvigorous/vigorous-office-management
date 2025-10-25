import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { CompanyPrefixServices } from "./_company_prefix_settings_services";






export const getCompanyPrefixDetails = createAsyncThunk(
  "user/getCompanyPrefixDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await CompanyPrefixServices.getCompanyPrefixDetails(reqData);
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

export const updateCompanyPrefix = createAsyncThunk(
  "user/updateCompanyPrefix",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await CompanyPrefixServices.updateCompanyPrefix(reqData);
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



const companyPrefixSlice = createSlice({
  name: 'companyPrefix',
  initialState: {
    companyPrefixList: [],
 
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyPrefixDetails.pending, (state) => {
        state.loading = true;
        state.companyPrefixData = null;
      })
      .addCase(getCompanyPrefixDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.companyPrefixData = action.payload?.data;
      })
      .addCase(getCompanyPrefixDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.companyPrefixData = {};
      })
      .addCase(updateCompanyPrefix.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompanyPrefix.fulfilled, (state, action) => {
        state.loading = false;
        state.updatePrefixData = action.payload;
      })
      .addCase(updateCompanyPrefix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
  },
});

export default companyPrefixSlice.reducer;
