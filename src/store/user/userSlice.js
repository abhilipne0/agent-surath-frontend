import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const getUserBalance = createAsyncThunk('user/getbalance', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/user/balance");
        return response.data;
    } catch (error) {
        // Return the error using rejectWithValue to handle it in the slice's extraReducers
        return rejectWithValue(error.response.data);
    }
});
export const forgotePasswordOtp = createAsyncThunk('user/forgot-password', async (phone, { rejectWithValue }) => {
    try {
        const response = await api.post("/user/forgot/password", { phone: phone });
        return response.data;
    } catch (error) {
        // Return the error using rejectWithValue to handle it in the slice's extraReducers
        return rejectWithValue(error.response.data);
    }
});

export const resetPassword = createAsyncThunk('user/reset-password', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/user/password/reset", data);
        return response.data;
    } catch (error) {
        // Return the error using rejectWithValue to handle it in the slice's extraReducers
        return rejectWithValue(error.response.data);
    }
});
export const getUserInfo = createAsyncThunk('user/user-info', async (data, { rejectWithValue }) => {
    try {
        const response = await api.get("/user/information", data);
        return response.data;
    } catch (error) {
        // Return the error using rejectWithValue to handle it in the slice's extraReducers
        return rejectWithValue(error.response.data);
    }
});


export const getUserStatement = createAsyncThunk(
    'user/user-statement',
    async ({ page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await api.get("/user/statement", {
                params: { page, pageSize },
            });
            return response.data; // should include both data and total
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        balance: 0,
        availableBalance: 0,
        bonusAmount: 0,
        loading: true,
        error: null,
        message: '',
        forgotLoading: false,
        userInfo: null,
        accountStatement: [],
        totalStatements: 0,
        statementLoading: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.data.balance;
                state.availableBalance = action.payload.data.availableBalance;
                state.bonusAmount = action.payload.data.bonusAmount;
                state.message = 'User balance information retrieved successfully.';
            })
            .addCase(getUserBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload.message : 'Failed to fetch balance';
            })
            .addCase(forgotePasswordOtp.pending, (state) => {
                state.forgotLoading = true;
            })
            .addCase(forgotePasswordOtp.fulfilled, (state, action) => {
                state.forgotLoading = false;
            })
            .addCase(forgotePasswordOtp.rejected, (state, action) => {
                state.forgotLoading = false;
            })
            .addCase(resetPassword.pending, (state) => {
                state.forgotLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.forgotLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.forgotLoading = false;
            })
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload.data
                state.loading = false;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(getUserStatement.pending, (state) => {
                state.statementLoading = true;
            })
            .addCase(getUserStatement.fulfilled, (state, action) => {
                state.accountStatement = action.payload.data
                state.totalStatements = action.payload.totalCount;
                state.statementLoading = false;
            })
            .addCase(getUserStatement.rejected, (state, action) => {
                state.statementLoading = false;
            });
    }
});

export default userSlice.reducer;
