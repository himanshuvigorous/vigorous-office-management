import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeDocumentServices } from "./_emp_document_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";




export const getEmployeeDocument = createAsyncThunk(
  "user/getEmployeeDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeeDocumentServices.getEmployeeDocument(reqData);
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

export const empDoctSearch = createAsyncThunk(
  "user/empDoctSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeeDocumentServices.empDoctSearch(reqData);
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

export const getEmployeeDocDetails = createAsyncThunk(
  "user/getEmployeeDocDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeeDocumentServices.getEmployeeDocDetails(reqData);
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

export const createEmployeeDoc = createAsyncThunk(
  "user/createEmployeeDoc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeeDocumentServices.createEmployeeDoc(reqData);
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

export const updateEmployeeDoc = createAsyncThunk(
  "user/updateEmployeeDoc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeeDocumentServices.updateEmployeeDoc(reqData);
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
export const deleteEmployeeDoc = createAsyncThunk(
  "user/deleteEmployeeDoc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await employeeDocumentServices.deleteEmployeeDoc(reqData);
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
    totalEmpDoctCount: 0,
    employeeDocDetails: {}
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeDocument.pending, (state, action) => {
        state.employeeDocListloading = true;
        state.employeeDocumentList = [];
        state.totalEmpDoctCount = 0;
      })
      .addCase(getEmployeeDocument.fulfilled, (state, action) => {
        state.employeeDocumentList = action.payload?.data?.docs;
        state.totalEmpDoctCount = action.payload?.data?.totalDocs;
        state.employeeDocListloading = false;
      })
      .addCase(getEmployeeDocument.rejected, (state, action) => {
        state.employeeDocListloading = false;
        state.employeeDocumentList = [];
        state.totalEmpDoctCount = 0;
      })
      .addCase(empDoctSearch.pending, (state, action) => {
        state.loading = true;
        state.employeeDocumentList = [];
        state.totalEmpDoctCount = 0;
      })
      .addCase(empDoctSearch.fulfilled, (state, action) => {
        state.employeeDocumentList = action.payload?.data?.docs;
        state.totalEmpDoctCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(empDoctSearch.rejected, (state, action) => {
        state.loading = false;
        state.employeeDocumentList = [];
        state.totalEmpDoctCount = 0;
      })
      .addCase(createEmployeeDoc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployeeDoc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createEmployeeDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeDoc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployeeDoc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateEmployeeDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEmployeeDoc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployeeDoc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypetDeleteData = action.payload;
      })
      .addCase(deleteEmployeeDoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeeDocDetails.pending, (state) => {
        state.loading = true;
        state.employeeDocDetails = null;
      })
      .addCase(getEmployeeDocDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeDocDetails = action.payload?.data;
      })
      .addCase(getEmployeeDocDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.employeeDocDetails = null;

      })
  },
});

export default employeeDocumentSlice.reducer;
