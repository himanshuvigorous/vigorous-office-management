import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { penaltyTypeServices } from "./_penalty_services";







export const getpenaltyList = createAsyncThunk(
  "user/getpenaltyList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await penaltyTypeServices.getpenaltyTypeList(reqData);
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

export const penaltyTypeSearch = createAsyncThunk(
  "user/penaltyTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await penaltyTypeServices.penaltyTypeSearch(reqData);
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

export const getpenaltyDetails = createAsyncThunk(
  "user/getpenaltyDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await penaltyTypeServices.getpenaltyTypeDetails(reqData);
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

export const createpenaltyType = createAsyncThunk(
  "user/createpenaltyType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await penaltyTypeServices.createpenaltyType(reqData);
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

export const updatepenaltyType = createAsyncThunk(
  "user/updatepenaltyType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await penaltyTypeServices.updatepenaltyType(reqData);
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
export const deletepenaltyType = createAsyncThunk(
  "user/deletepenaltyType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await penaltyTypeServices.deletepenaltyType(reqData);
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

const penaltySlice = createSlice({
  name: 'workType',
  initialState: {
    // employeeDocumentList: [],
    // totalUserDesignationCount: 0,
    // employeeDocDetails: {},
    workTypeListData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getpenaltyList.pending, (state, action) => {
        state.loading = true;
        state.CCC = [];
        state.totapenaltyCount = 0;
      })
      .addCase(getpenaltyList.fulfilled, (state, action) => {
        state.penaltyListData = action.payload?.data?.docs;
        state.totapenaltyCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getpenaltyList.rejected, (state, action) => {
        state.loading = false;
        state.penaltyListData = [];
        state.totapenaltyCount = 0;
      })
      .addCase(penaltyTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.CCC = [];
        state.totapenaltyCount = 0;
      })
      .addCase(penaltyTypeSearch.fulfilled, (state, action) => {
        state.penaltyListData = action.payload?.data?.docs;
        state.totapenaltyCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(penaltyTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.penaltyListData = [];
        state.totapenaltyCount = 0;
      })
      // .addCase(leaveTypeSearch.pending, (state, action) => {
      //   state.loading = true;
      //   state.penaltyListData = [];
      //   state.totapenaltyCount = 0;
      // })
      // .addCase(leaveTypeSearch.fulfilled, (state, action) => {
      //   state.penaltyListData = action.payload?.data?.docs;
      //   state.totapenaltyCount = action.payload?.data?.totalDocs;
      //   state.loading = false;
      // })
      // .addCase(leaveTypeSearch.rejected, (state, action) => {
      //   state.loading = false;
      //   state.penaltyListData = [];
      //   state.totapenaltyCount = 0;
      // })
      .addCase(createpenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createpenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.penaltyCreateData = action.payload;
      })
      .addCase(createpenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatepenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatepenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeUpdateData = action.payload;
      })
      .addCase(updatepenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletepenaltyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletepenaltyType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDeleteData = action.payload;
      })
      .addCase(deletepenaltyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getpenaltyDetails.pending, (state) => {
        state.loading = true;
        state.penaltyDetails = null;
      })

      .addCase(getpenaltyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.penaltyDetails = action.payload?.data;
      })
      .addCase(getpenaltyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.penaltyDetails = null;

      })
  },
});

export default penaltySlice.reducer;
