import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { jobPostServices } from "./_job_post_services";





export const getJobPostList = createAsyncThunk(
  "user/getJobPostList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await jobPostServices.getJobPostList(reqData);
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

export const jobPostSearch = createAsyncThunk(
  "user/jobPostSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await jobPostServices.jobPostSearch(reqData);
 
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

export const getJobPostDetails = createAsyncThunk(
  "user/getJobPostDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await jobPostServices.getJobPostDetails(reqData);
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

export const createJobPost = createAsyncThunk(
  "user/createJobPost",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await jobPostServices.createJobPost(reqData);
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

export const updateJobPost = createAsyncThunk(
  "user/updateJobPost",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await jobPostServices.updateJobPost(reqData);
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
export const deleteJobPost = createAsyncThunk(
  "user/deleteJobPost",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await jobPostServices.deleteJobPost(reqData);
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
export const statusJobPost = createAsyncThunk(
  "user/statusJobPost",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await jobPostServices.statusJobPost(reqData);
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
      .addCase(getJobPostList.pending, (state, action) => {
        state.loading = true;
        state.jobPostData = [];
        state.totaljobPostCount = 0;
      })
      .addCase(getJobPostList.fulfilled, (state, action) => {
        state.jobPostData = action.payload?.data?.docs;
        state.totaljobPostCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getJobPostList.rejected, (state, action) => {
        state.loading = false;
        state.jobPostData = [];
        state.totaljobPostCount = 0;
      })
      .addCase(jobPostSearch.pending, (state, action) => {
        state.loading = true;
        state.jobPostData = [];
        state.totaljobPostCount = 0;
      })
      .addCase(jobPostSearch.fulfilled, (state, action) => {
        state.jobPostData = action.payload?.data?.docs;
        state.totaljobPostCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(jobPostSearch.rejected, (state, action) => {
        state.loading = false;
        state.jobPostData = [];
        state.totaljobPostCount = 0;
      })
      .addCase(createJobPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJobPost.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostCreateData = action.payload;
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJobPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJobPost.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostUpdateData = action.payload;
      })
      .addCase(updateJobPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJobPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostDeleteData = action.payload;
      })
      .addCase(deleteJobPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusJobPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusJobPost.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostStatusData = action.payload;
      })
      .addCase(statusJobPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getJobPostDetails.pending, (state) => {
        state.loading = true;
        state.jobPostDetails =null;
      })
      .addCase(getJobPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostDetails = action.payload?.data;
      })
      .addCase(getJobPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.jobPostDetails =null;
        state.error = action.payload;
      })
  },
});

export default employeeDocumentSlice.reducer;
