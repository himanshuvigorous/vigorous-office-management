import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { interviewServices } from "./_interview_services";

export const getInterviewList = createAsyncThunk(
  "user/getInterviewList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await interviewServices.getInterviewList(reqData);
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

export const interviewSearch = createAsyncThunk(
  "user/interviewSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await interviewServices.interviewSearch(reqData);
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

export const getInterviewDetails = createAsyncThunk(
  "user/getInterviewDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await interviewServices.getInterviewDetails(reqData);
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

export const createInterview = createAsyncThunk(
  "user/createInterview",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await interviewServices.createInterview(reqData);
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

export const updateInterview = createAsyncThunk(
  "user/updateInterview",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await interviewServices.updateInterview(reqData);
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
export const deleteInterview = createAsyncThunk(
  "user/deleteInterview",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await interviewServices.deleteInterview(reqData);
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

export const sendEmailInterview = createAsyncThunk(
  "/company/sendEmailInterview",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await interviewServices.sendEmailInterview(userData);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const statusUpdateApplication = createAsyncThunk(
  "/company/statusUpdateApplication",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await interviewServices.statusUpdateApplication(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);


const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    interviewList: [],
    totalInterviewCount: 0
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getInterviewList.pending, (state, action) => {
        state.loading = true;
        state.interviewList = [];
        state.totalInterviewCount = 0;

      })
      .addCase(getInterviewList.fulfilled, (state, action) => {
        state.interviewList = action.payload?.data?.docs;
        state.totalInterviewCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getInterviewList.rejected, (state, action) => {
        state.loading = false;
        state.interviewList = [];
        state.totalInterviewCount = 0;
      })
      .addCase(interviewSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(interviewSearch.fulfilled, (state, action) => {
        state.interviewList = action.payload?.data?.docs;
        state.totalInterviewCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(interviewSearch.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createInterview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewCreateData = action.payload;
      })
      .addCase(createInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInterview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewUpdateData = action.payload;
      })
      .addCase(updateInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInterview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewDeleteData = action.payload;
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getInterviewDetails.pending, (state) => {
        state.loading = true;
        state.interviewDetails = {};
      })
      .addCase(getInterviewDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewDetails = action.payload?.data;
      })
      .addCase(getInterviewDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.interviewDetails = {};
      })
      .addCase(sendEmailInterview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendEmailInterview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emailData = action.payload;
      })
      .addCase(sendEmailInterview.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(statusUpdateApplication.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(statusUpdateApplication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statusData = action.payload;
      })
      .addCase(statusUpdateApplication.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      });
  },
});

export default interviewSlice.reducer;
