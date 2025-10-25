import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { onBoardingServices } from "./_onBoarding_services";



export const getOnBoardingList = createAsyncThunk(
  "getOnBoardingList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await onBoardingServices.getOnBoardingList(userData);
    
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


export const onBoardingSearch = createAsyncThunk(
  "user/onBoardingSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await onBoardingServices.onBoardingSearch(userData);
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

export const onBoardingCreate = createAsyncThunk(
  "onBoardingCreate",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.onBoardingCreate(userData);
      showNotification({
        message: user?.companyinfo?.message,
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
export const importDirectOnBoarding = createAsyncThunk(
  "importDirectOnBoarding",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.importDirectOnBoarding(userData);
      showNotification({
        message: user?.companyinfo?.message,
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
export const getOnBoardingDetails = createAsyncThunk(
  "/company/getOnBoardingDetails",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.getOnBoardingDetails(userData);
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
export const sendEmailOnboarding = createAsyncThunk(
  "/company/sendEmailOnboarding",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.sendEmailOnboarding(userData);
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
export const sendEmailCommon = createAsyncThunk(
  "/company/sendEmailCommon",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.sendEmailCommon(userData);
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



export const updateOnBoarding = createAsyncThunk(
  "/updateOnBoarding",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.updateOnBoarding(userData);
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
export const deleteOnBoarding = createAsyncThunk(
  "/deleteOnBoarding",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.deleteOnBoarding(userData);
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
export const statusOnBoarding = createAsyncThunk(
  "/statusOnBoarding",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await onBoardingServices.statusOnBoarding(userData);
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

export const uploadDocFile = createAsyncThunk(
  'file/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await onBoardingServices.uploadDocFile(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createEmployeeFromOnBoarding = createAsyncThunk(
  'file/createEmployeeFromOnBoarding',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await onBoardingServices.createEmployeeFromOnBoarding(formData);
      // showNotification({
      //   message: response?.message,
      //   type: 'success',
      // });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.data?.message);
    }
  }
);
export const employeExcelDownloadFunc = createAsyncThunk(
  'file/employeExcelDownloadFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await onBoardingServices.employeExcelDownloadFunc(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error?.data?.message);
    }
  }
);


const onBoardingSlice = createSlice({
  name: 'user',
  initialState: {
  
  },
  reducers: {
   resetOnBoarding: (state) => {
    state.onBoardingList = [];
    state.totalOnBoardingCount = 0;
    state.onBoardingDetailsData =null;

   }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOnBoardingList.pending, (state, action) => {
        state.loading = true;
        state.onBoardingList = [];
        state.totalOnBoardingCount = 0;
      })
      .addCase(getOnBoardingList.fulfilled, (state, action) => {
        state.onBoardingList = action.payload?.data?.docs;
        state.totalOnBoardingCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getOnBoardingList.rejected, (state, action) => {
        state.loading = false;
        state.onBoardingList = [];
        state.totalOnBoardingCount = 0;
      })
      .addCase(onBoardingSearch.pending, (state, action) => {
        state.loading = true;
        state.onBoardingList = [];
        state.totalOnBoardingCount = 0;
      })
      .addCase(onBoardingSearch.fulfilled, (state, action) => {
        state.onBoardingList = action.payload?.data?.docs;
        state.totalOnBoardingCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(onBoardingSearch.rejected, (state, action) => {
        state.loading = false;
        state.onBoardingList = [];
        state.totalOnBoardingCount = 0;
      })
      .addCase(onBoardingCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(onBoardingCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.onBoardingCreateData = action.payload;
      })
      .addCase(onBoardingCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(importDirectOnBoarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(importDirectOnBoarding.fulfilled, (state, action) => {
        state.loading = false;
        state.importDirectOnBoardingData = action.payload;
      })
      .addCase(importDirectOnBoarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOnBoarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOnBoarding.fulfilled, (state, action) => {
        state.loading = false;
        state.onBoardingupdateData = action.payload;
      })
      .addCase(updateOnBoarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOnBoarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOnBoarding.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteOnBoarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusOnBoarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusOnBoarding.fulfilled, (state, action) => {
        state.loading = false;
        state.userStatusData = action.payload;
      })
      .addCase(statusOnBoarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOnBoardingDetails.pending, (state, action) => {
        state.loading = true;
        state.onBoardingDetailsData = null;
      })
      .addCase(getOnBoardingDetails.fulfilled, (state, action) => {
        state.onBoardingDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getOnBoardingDetails.rejected, (state, action) => {
        state.loading = false;
        state.onBoardingDetailsData = null;

      })
      .addCase(uploadDocFile.pending, (state) => {
        state.uploadStatus = 'loading';
      })
      .addCase(uploadDocFile.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        const { name, imageName, imgBaseUrl } = action.payload;
        state.fieldsMatch[name] = `${imgBaseUrl}/${imageName}`;
      })
      .addCase(uploadDocFile.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(sendEmailOnboarding.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendEmailOnboarding.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emailData= action.payload;
      })
      .addCase(sendEmailOnboarding.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(sendEmailCommon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendEmailCommon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emailData= action.payload;
      })
      .addCase(sendEmailCommon.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(createEmployeeFromOnBoarding.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEmployeeFromOnBoarding.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.createEmployeeData= action.payload;
      })
      .addCase(createEmployeeFromOnBoarding.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(employeExcelDownloadFunc.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(employeExcelDownloadFunc.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeExcelDownloadData= action.payload;
      })
      .addCase(employeExcelDownloadFunc.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      })
  },
});

export const { resetOnBoarding } = onBoardingSlice.actions;

export default onBoardingSlice.reducer;
