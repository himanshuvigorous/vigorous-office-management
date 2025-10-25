import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";

import { interviewRoundTypeServices } from "./_interviewRound_type_services";




export const getInterviewRoundList = createAsyncThunk(
  "user/getInterviewRoundList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await interviewRoundTypeServices.getInterviewRoundTypeList(reqData);
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

export const InterviewRoundTypeSearch = createAsyncThunk(
  "user/InterviewRoundTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await interviewRoundTypeServices.searchInterviewRoundTypeList(reqData);
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

export const getInterviewRoundDetails = createAsyncThunk(
  "user/getInterviewRoundDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await interviewRoundTypeServices.getInterviewRoundTypeDetails(reqData);
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

export const createInterviewRoundType = createAsyncThunk(
  "user/createInterviewRoundType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await interviewRoundTypeServices.createInterviewRoundType(reqData);
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

export const updateInterviewRoundType = createAsyncThunk(
  "user/updateInterviewRoundType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await interviewRoundTypeServices.updateInterviewRoundType(reqData);
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
export const deleteInterviewRoundType = createAsyncThunk(
  "user/deleteInterviewRoundType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await interviewRoundTypeServices.deleteInterviewRoundType(reqData);
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

const interviewRoundSlice = createSlice({
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
      .addCase(getInterviewRoundList.pending, (state, action) => {
        state.loading = true;
        state.interviewRoundListData = [];
        state.totaInterviewRoundCount = 0;
      })
      .addCase(getInterviewRoundList.fulfilled, (state, action) => {
        state.interviewRoundListData = action.payload?.data?.docs;
        state.totaInterviewRoundCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getInterviewRoundList.rejected, (state, action) => {
        state.loading = false;
        state.interviewRoundListData = [];
        state.totaInterviewRoundCount = 0;
      })
      .addCase(InterviewRoundTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.interviewRoundListData = [];
        state.totaInterviewRoundCount = 0;
      })
      .addCase(InterviewRoundTypeSearch.fulfilled, (state, action) => {
        state.interviewRoundListData = action.payload?.data?.docs;
        state.totaInterviewRoundCount = 0;
        state.loading = false;
      })
      .addCase(InterviewRoundTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.interviewRoundListData = [];
        state.totaInterviewRoundCount = 0;
      })

      .addCase(createInterviewRoundType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInterviewRoundType.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewRoundCreateData = action.payload;
      })
      .addCase(createInterviewRoundType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInterviewRoundType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInterviewRoundType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeUpdateData = action.payload;
      })
      .addCase(updateInterviewRoundType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInterviewRoundType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInterviewRoundType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDeleteData = action.payload;
      })
      .addCase(deleteInterviewRoundType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getInterviewRoundDetails.pending, (state) => {
        state.loading = true;
        state.interviewRoundDetails = null;
      })

      .addCase(getInterviewRoundDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewRoundDetails = action.payload?.data;
      })
      .addCase(getInterviewRoundDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.interviewRoundDetails = null;

      })
  },
});

export default interviewRoundSlice.reducer;
