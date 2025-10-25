import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { hrmsSettingsServices } from "./_hrms_settings_services";






export const getHrmsSettingsDetails = createAsyncThunk(
  "user/getHrmsSettingsDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await hrmsSettingsServices.getHrmsSettingsDetails(reqData);
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

export const updateHrmsSettings = createAsyncThunk(
  "user/updateHrmsSettings",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await hrmsSettingsServices.updateHrmsSettings(reqData);
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
      .addCase(getHrmsSettingsDetails.pending, (state) => {
        state.loading = true;
        state.hrmsSettingsData = null;
      })
      .addCase(getHrmsSettingsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.hrmsSettingsData = action.payload?.data;
      })
      .addCase(getHrmsSettingsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hrmsSettingsData = {};
      })
      .addCase(updateHrmsSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHrmsSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.updateProfileData = action.payload;
      })
      .addCase(updateHrmsSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
  },
});

export default employeeDocumentSlice.reducer;
