import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { companyServices } from "./_company_services";

export const getCompanyList = createAsyncThunk(
  "getCompanyList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await companyServices.getCompanyList(reqData);
      return response
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const companySearch = createAsyncThunk(
  "user/companySearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await companyServices.companySearch(userData);
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

export const companyCreate = createAsyncThunk(
  "companyCreate",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.companyCreate(userData);
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
export const getCompanyDetails = createAsyncThunk(
  "/company/detail",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.getCompanyDetails(userData);
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




export const updateCompany = createAsyncThunk(
  "/updateCompany",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.updateCompany(userData);
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
export const updateCompanyOwner = createAsyncThunk(
  "/updateCompanyOwner",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.updateCompanyOwner(userData);
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
export const deleteCompanyOwner = createAsyncThunk(
  "/deleteCompanyOwner",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.deleteCompanyOwner(userData);
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
export const deleteCompany = createAsyncThunk(
  "/deleteCompany",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.deleteCompany(userData);
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
export const companyStatuspdate = createAsyncThunk(
  "/companyStatuspdate",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyServices.companyStatuspdate(userData);
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
      const response = await companyServices.uploadDocFile(formData);
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
export const companyRazorPayfunc = createAsyncThunk(
  'file/companyRazorPayfunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.companyRazorPayfunc(formData);
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
export const companyPlanHistory = createAsyncThunk(
  'file/companyPlanHistory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.companyPlanHistory(formData);
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

export const regeneratePassfunc = createAsyncThunk(
  'file/regeneratePassfunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.regeneratePassfunc(formData);
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

export const verifyAuthFunc = createAsyncThunk(
  'file/verifyAuthFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.verifyAuthFunc(formData);
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

export const subscriptionFunc = createAsyncThunk(
  'file/subscriptionFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.subscriptionFunc(formData);
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
export const companyInvoiveDetail = createAsyncThunk(
  'file/companyInvoiveDetail',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.companyInvoiveDetail(formData);
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
      return rejectWithValue(error.response.data);

    }
  }
);
export const companyInvoiceRefund = createAsyncThunk(
  'file/companyInvoiceRefund',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.companyInvoiceRefund(formData);
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
      return rejectWithValue(error.response.data);
    }
  }
);
export const companySubscriptionStatus = createAsyncThunk(
  'file/companySubscriptionStatus',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyServices.companySubscriptionStatus(formData);
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


const companySlice = createSlice({
  name: 'company',
  initialState: {
    companyCreateData: {},
    loading:false
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyList.pending, (state, action) => {
        state.loading = true;
        state.companyList = [];
        state.totalCompanyCount =0;
      })
      .addCase(getCompanyList.fulfilled, (state, action) => {
        state.companyList = action.payload?.data?.docs;
        state.totalCompanyCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getCompanyList.rejected, (state, action) => {
        state.loading = false;
        state.companyList = [];
        state.totalCompanyCount = 0;
      })
      .addCase(companySearch.pending, (state, action) => {
        state.companyListLoading = true;
      })
      .addCase(companySearch.fulfilled, (state, action) => {
        state.companyList = action.payload?.data?.docs;
        state.totalCompanyCount = action.payload?.data?.totalDocs;
        state.companyListLoading = false;
      })
      .addCase(companySearch.rejected, (state, action) => {
        state.companyListLoading = false;
        state.companyList = [];
        state.totalCompanyCount = 0;
      })
      .addCase(companyCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.companyCreateData = action.payload?.companyinfo?.data;
      })
      .addCase(companyCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.userupdateData = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompanyOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompanyOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.companyOwnerupdateData = action.payload;
      })
      .addCase(updateCompanyOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCompanyOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCompanyOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.companyOwnerupdateData = action.payload;
      })
      .addCase(deleteCompanyOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = false;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCompanyDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCompanyDetails.fulfilled, (state, action) => {
        state.companyDetailsData = action.payload;
        state.loading = false;
      })
      .addCase(getCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.companyDetailsData = null;
      })
      .addCase(companyStatuspdate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(companyStatuspdate.fulfilled, (state, action) => {
        state.companyStatusUpdateData = action.payload;
        state.loading = false;
      })
      .addCase(companyStatuspdate.rejected, (state, action) => {
        state.loading = false;
        state.companyStatusUpdateData = null;
      })
      .addCase(companyPlanHistory.pending, (state, action) => {
        state.loading = true;
        state.companyPlanHistoryData = [];
      })
      .addCase(companyPlanHistory.fulfilled, (state, action) => {
        state.companyPlanHistoryData = action.payload;
        state.loading = false;
      })
      .addCase(companyPlanHistory.rejected, (state, action) => {
        state.loading = false;
        state.companyStatusUpdateData = null;
        state.companyPlanHistoryData = [];
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
      .addCase(companyRazorPayfunc.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(companyRazorPayfunc.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.companyrazorPayData = action.payload;
        
      })
      .addCase(companyRazorPayfunc.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(verifyAuthFunc.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(verifyAuthFunc.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.verifyAuthData = action.payload;
        
      })
      .addCase(verifyAuthFunc.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(regeneratePassfunc.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(regeneratePassfunc.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.regeneratePass = action.payload;
        
      })
      .addCase(regeneratePassfunc.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
      })
      .addCase(subscriptionFunc.pending, (state) => {
        state.loading = 'loading';
        state.subscriptionData = null;
      })
      .addCase(subscriptionFunc.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.subscriptionData = action.payload;
        
      })
      .addCase(subscriptionFunc.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
        state.subscriptionData = null;
      })
      .addCase(companyInvoiveDetail.pending, (state) => {
        state.loading = 'loading';
        state.companyInvoiceDetailsdata = null;
      })
      .addCase(companyInvoiveDetail.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.companyInvoiceDetailsdata = action.payload;
        
      })
      .addCase(companyInvoiveDetail.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
        state.companyInvoiceDetailsdata = null;
      })
      .addCase(companyInvoiceRefund.pending, (state) => {
        state.loading = 'loading';
        state.companyRefundDetailsdata = null;
      })
      .addCase(companyInvoiceRefund.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.companyRefundDetailsdata = action.payload;
        
      })
      .addCase(companyInvoiceRefund.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
        state.companyRefundDetailsdata = null;
      })
      .addCase(companySubscriptionStatus.pending, (state) => {
        state.loading = 'loading';
        state.companySubscriptionStatusdata = null;
      })
      .addCase(companySubscriptionStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.companySubscriptionStatusdata = action.payload;
        
      })
      .addCase(companySubscriptionStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.errorMessage = action.payload;
        state.companySubscriptionStatusdata = null;
      })
  },
});

export default companySlice.reducer;
