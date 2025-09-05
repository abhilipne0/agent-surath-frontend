import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Register user action (using OTP verification)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (requestBody, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register", requestBody);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Verify OTP action
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register/verify", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Resend OTP action
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register/resend", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Login user action
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    token: null,
    otpVisible: false,
    isRegistered: false,
    loading: false,
    error: null,
    isAuthenticated: false,
    phone: null,
    resendLoading: false, // For resend OTP loading
    resendError: null, // For resend OTP errors
  },
  reducers: {
    setOtpVisible(state, action) {
      state.otpVisible = action.payload;
    },
    resetError(state) {
      state.error = null;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
      state.phone = null;
      localStorage.removeItem('userAuthToken');
      localStorage.removeItem('userID');
      sessionStorage.removeItem('seen_offer_modal');
      sessionStorage.removeItem('createdBy');
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle user registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVisible = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Handle OTP verification
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem('userAuthToken', action.payload.data.token);
        localStorage.setItem('userID', action.payload.data._id);
        localStorage.setItem('phone', action.payload.data.phone);
        localStorage.setItem('createdBy', action.payload.data.createdBy);
        state.isAuthenticated = true;
        state.phone = action.payload.data.Phone;
        state.userId = action.payload.data._id.slice(0, 10);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Handle OTP resend
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.resendError = action.payload.message;
      })
      // Handle user login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem('userAuthToken', action.payload.data.token);
        localStorage.setItem('userID', action.payload.data._id);
        localStorage.setItem('phone', action.payload.data.phone);
        localStorage.setItem('createdBy', action.payload.data.createdBy);
        state.isAuthenticated = true;
        state.userId = action.payload.data._id;
        state.token = action.payload.data.token;
        state.phone = action.payload.data.phone;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

// Export actions
export const { setOtpVisible, resetError, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
