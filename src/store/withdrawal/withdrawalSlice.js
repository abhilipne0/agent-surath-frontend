import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/api'; // Replace with your actual API module
import { message } from "antd";

// API call for making a withdrawal request (POST)
export const withdrawRequest = createAsyncThunk(
  'withdrawal/withdrawRequest',
  async ({ bankAccountId, amount }, { rejectWithValue }) => {
    try {
      const response = await api.post("/withdraw/request", { bankAccountId, amount });
      return response.data; // Return the response data to store in the slice
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

// API call for getting withdrawal history (GET)
export const getWithdrawalHistory = createAsyncThunk(
  'withdrawal/getWithdrawalHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/withdraw/history");
      return response.data; // Return the withdrawal history data
    } catch (error) {
      message.error("Getting error to fetch withdrawal");
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

// API call for adding a bank account (POST)
export const addBankAccount = createAsyncThunk(
  'withdrawal/addBankAccount',
  async (bankDetails, { rejectWithValue }) => {
    try {
      const response = await api.post("/bank/add/bank/account", bankDetails);
      return response.data; // Return the response data to store in the slice
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

// API call for removing a bank account (DELETE)
export const removeBankAccount = createAsyncThunk(
  'withdrawal/removeBankAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/bank/bank/account/${accountId}`);
      return response.data; // Return the response data to store in the slice
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

// API call for getting all bank accounts (GET)
export const getBackAccounts = createAsyncThunk(
  'withdrawal/getBackAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/bank/bank/accounts");
      return response.data; // Return the bank account data
    } catch (error) {
      message.error("Getting error to fetch bank accounts.");
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

// Create slice to manage withdrawal state
export const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState: {
    withdrawalHistory: [], // Store withdrawal history data
    bankAccounts: [], // Store bank account data
    loadingWithdrawRequest: false, // Loading state for withdraw request
    loadingGetHistory: false, // Loading state for withdrawal history
    loadingAddBankAccount: false, // Loading state for adding bank account
    loadingRemoveBankAccount: false, // Loading state for removing bank account
    loadingGetBankAccounts: false, // Loading state for getting bank accounts
    error: null, // Error state for handling failed API calls
    success: false, // Success state for withdraw request
  },
  reducers: {
    resetWithdrawalState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handling withdrawal request
    builder
      .addCase(withdrawRequest.pending, (state) => {
        state.loadingWithdrawRequest = true;
        state.error = null;
      })
      .addCase(withdrawRequest.fulfilled, (state, action) => {
        state.loadingWithdrawRequest = false;
        state.success = true;
      })
      .addCase(withdrawRequest.rejected, (state, action) => {
        state.loadingWithdrawRequest = false;
        state.error = action.payload;
      });

    // Handling withdrawal history fetch
    builder
      .addCase(getWithdrawalHistory.pending, (state) => {
        state.loadingGetHistory = true;
        state.error = null;
      })
      .addCase(getWithdrawalHistory.fulfilled, (state, action) => {
        state.loadingGetHistory = false;
        state.withdrawalHistory = action.payload.data; // Store withdrawal history
      })
      .addCase(getWithdrawalHistory.rejected, (state, action) => {
        state.loadingGetHistory = false;
        state.error = action.payload;
      });

    // Handling add bank account
    builder
      .addCase(addBankAccount.pending, (state) => {
        state.loadingAddBankAccount = true;
        state.error = null;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.loadingAddBankAccount = false;
        state.success = true;
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.loadingAddBankAccount = false;
        state.error = action.payload;
      });

    // Handling remove bank account
    builder
      .addCase(removeBankAccount.pending, (state) => {
        state.loadingRemoveBankAccount = true;
        state.error = null;
      })
      .addCase(removeBankAccount.fulfilled, (state, action) => {
        state.loadingRemoveBankAccount = false;
        state.success = true;
      })
      .addCase(removeBankAccount.rejected, (state, action) => {
        state.loadingRemoveBankAccount = false;
        state.error = action.payload;
      });

    // Handling fetch bank accounts
    builder
      .addCase(getBackAccounts.pending, (state) => {
        state.loadingGetBankAccounts = true;
        state.error = null;
      })
      .addCase(getBackAccounts.fulfilled, (state, action) => {
        state.loadingGetBankAccounts = false;
        state.bankAccounts = action.payload.data; // Store bank account data
      })
      .addCase(getBackAccounts.rejected, (state, action) => {
        state.loadingGetBankAccounts = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetWithdrawalState } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
