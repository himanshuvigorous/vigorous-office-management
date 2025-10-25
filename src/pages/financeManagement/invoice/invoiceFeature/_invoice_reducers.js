import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { invoiceServices } from "./_invoice_services";







export const getinvoiceList = createAsyncThunk(
  "user/getinvoiceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await invoiceServices.getinvoiceList(reqData);
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

export const invoiceSearch = createAsyncThunk(
  "user/invoiceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await invoiceServices.invoiceSearch(reqData);
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
export const invoiceComentCreate = createAsyncThunk(
  "user/invoiceComentCreate",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await invoiceServices.invoiceComentCreate(reqData);
      //   showNotification({
      //   message: respose?.message,
      //   type: 'success',
      // });
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const invoiceComentList = createAsyncThunk(
  "user/invoiceComentList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await invoiceServices.invoiceComentList(reqData);

      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const invoiceSummary = createAsyncThunk(
  "user/invoiceSummary",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await invoiceServices.invoiceSummary(reqData);
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
export const pendingInvoiceSummary = createAsyncThunk(
  "user/pendingInvoiceSummary",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await invoiceServices.pendingInvoiceSummary(reqData);
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

export const getinvoiceDetails = createAsyncThunk(
  "user/getinvoiceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await invoiceServices.getinvoiceDetails(reqData);
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
export const htmlTemplateGenerator = createAsyncThunk(
  "user/htmlTemplateGenerator",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await invoiceServices.htmlTemplateGenerator(reqData);
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

export const createinvoice = createAsyncThunk(
  "user/createinvoice",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await invoiceServices.createinvoice(reqData);
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

export const updateinvoice = createAsyncThunk(
  "user/updateinvoice",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await invoiceServices.updateinvoice(reqData);
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
export const deleteinvoice = createAsyncThunk(
  "user/deleteinvoice",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await invoiceServices.deleteinvoice(reqData);
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
export const invoiceStatusChangeFunc = createAsyncThunk(
  "user/invoiceStatusChangeFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await invoiceServices.invoiceStatusChangeFunc(reqData);
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

const invoiceSlice = createSlice({
  name: 'invoiceSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder

      .addCase(getinvoiceList.pending, (state, action) => {
        state.loading = true;
        state.invoiceListData = [];
        state.totalinvoiceListCount = 0;
      })
      .addCase(getinvoiceList.fulfilled, (state, action) => {
        state.invoiceListData = action.payload?.data?.docs;
        state.totalinvoiceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getinvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.invoiceListData = [];
        state.totalinvoiceListCount = 0;
      })
      .addCase(invoiceSearch.pending, (state, action) => {
        state.loading = true;
        state.invoiceListData = [];
        state.totalinvoiceListCount = 0;
      })
      .addCase(invoiceSearch.fulfilled, (state, action) => {
        state.invoiceListData = action.payload?.data?.docs;
        state.totalinvoiceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(invoiceSearch.rejected, (state, action) => {
        state.loading = false;
        state.invoiceListData = [];
        state.totalinvoiceListCount = 0;
      })
      .addCase(invoiceSummary.pending, (state, action) => {
        state.loading = true;
        state.invoiceSummarydata = null;

      })
      .addCase(invoiceSummary.fulfilled, (state, action) => {
        state.invoiceSummarydata = action.payload?.data;
        state.loading = false;
      })
      .addCase(invoiceSummary.rejected, (state, action) => {
        state.loading = false;
        state.invoiceSummarydata = [];

      })
      .addCase(pendingInvoiceSummary.pending, (state, action) => {
        state.loading = true;
        state.pendingInvoiceSummarydata = null;

      })
      .addCase(pendingInvoiceSummary.fulfilled, (state, action) => {
        state.pendingInvoiceSummarydata = action.payload?.data;
        state.loading = false;
      })
      .addCase(pendingInvoiceSummary.rejected, (state, action) => {
        state.loading = false;
        state.pendingInvoiceSummarydata = [];

      })
      .addCase(createinvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createinvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceCreateData = action.payload;
      })
      .addCase(createinvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(invoiceComentList.pending, (state) => {
        state.loadingComment = true;
         state.invoiceCopmmentListData = null
      })
      .addCase(invoiceComentList.fulfilled, (state, action) => {
        state.loadingComment = false;
        state.invoiceCopmmentListData = action.payload;
      })
      .addCase(invoiceComentList.rejected, (state, action) => {
        state.loadingComment = false;
        state.error = action.payload;
         state.invoiceCopmmentListData = null
      })
      .addCase(updateinvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateinvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceUpdateData = action.payload;
      })
      .addCase(updateinvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteinvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteinvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceDeleteData = action.payload;
      })
      .addCase(deleteinvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(invoiceStatusChangeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(invoiceStatusChangeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicestatusData = action.payload;
      })
      .addCase(invoiceStatusChangeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getinvoiceDetails.pending, (state) => {
        state.loading = true;
        state.invoiceDetails = null;
      })
      .addCase(getinvoiceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceDetails = action.payload?.data;
      })
      .addCase(getinvoiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.invoiceDetails = null;

      })
      .addCase(htmlTemplateGenerator.pending, (state) => {
        state.loading = true;
        state.htmlTemplateGeneratorDetails = null;
      })
      .addCase(htmlTemplateGenerator.fulfilled, (state, action) => {
        state.loading = false;
        state.htmlTemplateGeneratorDetails = action.payload?.data;
      })
      .addCase(htmlTemplateGenerator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.htmlTemplateGeneratorDetails = null;

      })
  },
});

export default invoiceSlice.reducer;
