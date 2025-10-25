import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import { VisitReasonTypeServices } from "./_visitReason_type_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";






export const getVisitReasonList = createAsyncThunk(
  "user/getVisitReasonList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await VisitReasonTypeServices.getVisitReasonTypeList(reqData);
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

export const VisitReasonTypeSearch = createAsyncThunk(
  "user/VisitReasonTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await VisitReasonTypeServices.getVisitReasonSeachList(reqData);
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

export const getVisitReasonDetails = createAsyncThunk(
  "user/getVisitReasonDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await VisitReasonTypeServices.getVisitReasonTypeDetails(reqData);
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

export const createVisitReasonType = createAsyncThunk(
  "user/createVisitReasonType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await VisitReasonTypeServices.createVisitReasonType(reqData);
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

export const updateVisitReasonType = createAsyncThunk(
  "user/updateVisitReasonType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await VisitReasonTypeServices.updateVisitReasonType(reqData);
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
export const deleteVisitReasonType = createAsyncThunk(
  "user/deleteVisitReasonType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await VisitReasonTypeServices.deleteVisitReasonType(reqData);
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

const visitReasonSlice = createSlice({
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
      .addCase(getVisitReasonList.pending, (state, action) => {
        state.loading = true;
        state.VisitReasonListData = [];
        state.totaVisitReasonCount = 0;
      })
      .addCase(getVisitReasonList.fulfilled, (state, action) => {
        state.VisitReasonListData = action.payload?.data?.docs;
        state.totaVisitReasonCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getVisitReasonList.rejected, (state, action) => {
        state.loading = false;
        state.VisitReasonListData = [];
        state.totaVisitReasonCount = 0;
      })
      // .addCase(leaveTypeSearch.pending, (state, action) => {
      //   state.loading = true;
      //   state.VisitReasonListData = [];
      //   state.totaVisitReasonCount = 0;
      // })
      // .addCase(leaveTypeSearch.fulfilled, (state, action) => {
      //   state.VisitReasonListData = action.payload?.data?.docs;
      //   state.totaVisitReasonCount = action.payload?.data?.totalDocs;
      //   state.loading = false;
      // })
      // .addCase(leaveTypeSearch.rejected, (state, action) => {
      //   state.loading = false;
      //   state.VisitReasonListData = [];
      //   state.totaVisitReasonCount = 0;
      // })
      .addCase(createVisitReasonType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVisitReasonType.fulfilled, (state, action) => {
        state.loading = false;
        state.VisitReasonCreateData = action.payload;
      })
      .addCase(createVisitReasonType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVisitReasonType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVisitReasonType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeUpdateData = action.payload;
      })
      .addCase(updateVisitReasonType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVisitReasonType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVisitReasonType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDeleteData = action.payload;
      })
      .addCase(deleteVisitReasonType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVisitReasonDetails.pending, (state) => {
        state.loading = true;
        state.VisitReasonDetails = null;
      })

      .addCase(getVisitReasonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.VisitReasonDetails = action.payload?.data;
      })
      .addCase(getVisitReasonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.VisitReasonDetails = null;

      })
      .addCase(VisitReasonTypeSearch.pending, (state) => {
        state.loading = true;
        state.VisitReasonList = null;
      })

      .addCase(VisitReasonTypeSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.VisitReasonList = action.payload?.data?.docs;
      })
      .addCase(VisitReasonTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.VisitReasonList = null;

      })
  },
});

export default visitReasonSlice.reducer;
