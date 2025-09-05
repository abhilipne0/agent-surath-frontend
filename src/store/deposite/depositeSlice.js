import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; // custom axios instance

// Async thunk for fetching deposit history
export const fetchDepositeHistory = createAsyncThunk(
    "deposite/fetchDepositeHistory",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("/payment/deposit/history");
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch deposit history");
      }
    }
  );
  
  // Async thunk for adding a new deposit
  export const addDeposit = createAsyncThunk(
    "deposite/addDeposit",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await api.post("/payment/add/deposit", formData);
        return response.data.message;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add deposit");
      }
    }
  );

// Get bank account
export const getBankAccount = createAsyncThunk(
  "deposite/bankAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/bank/active/bank/account");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bank account");
    }
  }
);

// 🚀 Initiate UPI Payment securely
export const initiatePayment = createAsyncThunk(
  "payment/initiate",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/transaction/payment/order", payload);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment initiation failed");
    }
  }
);
export const upiPaymentHistory = createAsyncThunk(
  "payment/history",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/transaction/payment/history", payload);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment initiation failed");
    }
  }
);

export const depositeSlice = createSlice({
  name: "deposite",
  initialState: {
    depositeList: [],
    loading: true,
    errorMessage: null,
    bankAccount: null,
    status: "idle",
    error: null,
    UpiDepositeList: [],
    paymentLinks: null
  },
  reducers: {
    clearError(state) {
      state.errorMessage = null;
    },
    resetPaymentLinks(state) {
      state.paymentLinks = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepositeHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepositeHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.depositeList = action.payload;
      })
      .addCase(fetchDepositeHistory.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(addDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDeposit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addDeposit.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getBankAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccount = action.payload?.data || null;
      })
      .addCase(getBankAccount.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.status = "processing";
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.paymentLinks = action.payload.data;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })
      .addCase(upiPaymentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(upiPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.UpiDepositeList = action.payload.data
      })
      .addCase(upiPaymentHistory.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { clearError, resetPaymentLinks } = depositeSlice.actions;
export default depositeSlice.reducer;