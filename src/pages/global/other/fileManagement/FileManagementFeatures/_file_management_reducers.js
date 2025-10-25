import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fileManagementServices } from "./_file_management_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";

export const getDocumentList = createAsyncThunk(
  "user/getDocumentList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await fileManagementServices.getDocumentList(reqData);
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
export const getDocumentListseearch = createAsyncThunk(
  "user/getDocumentListseearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await fileManagementServices.getDocumentListseearch(reqData);
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

export const createDocument = createAsyncThunk(
  "user/createDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.createDocument(reqData);
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

export const updateDocument = createAsyncThunk(
  "user/updateDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.updateDocument(reqData);
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

export const updateExperianceFunc = createAsyncThunk(
  "user/updateExperianceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.updateExperianceFunc(reqData);
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
export const deleteExperianceFunc = createAsyncThunk(
  "user/deleteExperianceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.deleteExperianceFunc(reqData);
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
export const updateFinacialDocument = createAsyncThunk(
  "user/updateFinacialDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.updateFinacialDocument(reqData);
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
export const deleteFinacialDocument = createAsyncThunk(
  "user/deleteFinacialDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.deleteFinacialDocument(reqData);
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

export const getBankDocumentList = createAsyncThunk(
  "user/getBankDocumentList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await fileManagementServices.getDocumentList(reqData);
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

export const createBankDocument = createAsyncThunk(
  "user/createBankDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.createDocument(reqData);
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

export const updateBankDocument = createAsyncThunk(
  "user/updateBankDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.updateDocument(reqData);
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
export const deleteDocument = createAsyncThunk(
  "user/deleteDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.deleteDocument(reqData);
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
export const fileUploadFunc = createAsyncThunk(
  "user/fileUploadFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await fileManagementServices.fileUploadFunc(reqData);
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

const fileManagementSlice = createSlice({
  name: 'fileManagement',
  initialState: {
    documentList: [],
    bankDocumentList: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocumentList.pending, (state, action) => {
        state.loading = true;
        state.documentList = [];
      })
      .addCase(getDocumentList.fulfilled, (state, action) => {
        state.documentList = action.payload?.data?.docs;
        state.loading = false;
      })
      .addCase(getDocumentList.rejected, (state, action) => {
        state.loading = false;
        state.documentList = [];
      })
      .addCase(getDocumentListseearch.pending, (state, action) => {
        state.loading = true;
        state.documentList = [];
      })
      .addCase(getDocumentListseearch.fulfilled, (state, action) => {
        state.documentList = action.payload?.data?.docs;
        state.loading = false;
      })
      .addCase(getDocumentListseearch.rejected, (state, action) => {
        state.loading = false;
        state.documentList = [];
      })
      .addCase(getBankDocumentList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getBankDocumentList.fulfilled, (state, action) => {
        state.bankDocumentList = action.payload?.data?.docs;
        state.loading = false;
      })
      .addCase(getBankDocumentList.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBankDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBankDocument.fulfilled, (state, action) => {
        state.GstTypeCreateData = action.payload;
        state.loading = false;
      })
      .addCase(createBankDocument.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // updateExperianceFunc,
// deleteExperianceFunc
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateExperianceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExperianceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.updateExperianceData = action.payload;
      })
      .addCase(updateExperianceFunc.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteExperianceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExperianceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteExperianceData = action.payload;
      })
      .addCase(deleteExperianceFunc.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateFinacialDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFinacialDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.financialUpdateData = action.payload;
      })
      .addCase(updateFinacialDocument.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteFinacialDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFinacialDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.financialdeleteData = action.payload;
      })
      .addCase(deleteFinacialDocument.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteDocumentData = action.payload;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateBankDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBankDocument.fulfilled, (state, action) => {
        state.GstTypeUpdateData = action.payload;
        state.loading = false;
      })
      .addCase(updateBankDocument.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fileUploadFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(fileUploadFunc.fulfilled, (state, action) => {
        state.fileUploadData = action.payload;
        state.loading = false;
      })
      .addCase(fileUploadFunc.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export default fileManagementSlice.reducer;
