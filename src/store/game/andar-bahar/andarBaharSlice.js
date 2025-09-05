import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import { getUserBalance } from '../../user/userSlice';
import { message } from 'antd';

export const submitBet = createAsyncThunk(
  'game/andar-bahar/submitBet',
  async ({ amount, side }, {dispatch, rejectWithValue }) => {
    try {
      const result = await api.post('/game/andar-bahar/bet-place', { amount, side });
      message.success(result.data.message,);
      dispatch(getUserBalance());
      return result.data.openBets;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchABOpenBets = createAsyncThunk('game/andar-bahar/fetchOpenBets', async () => {
  const result = await api.get('/game/andar-bahar/current/bets');
  return result.data.openBets;
});

export const fetchGameHistory = createAsyncThunk('game/andar-bahar/fetchLastResults', async () => {
  const result = await api.get('/game/andar-bahar/history');
  return result.data;
});

const andarBaharGameSlice = createSlice({
  name: 'andarBaharGame',
  initialState: {
    endTime: null,
    betAmounts: {},
    totalBetAmount: 0,
    loading: false,
    lastRoundResults: []
  },
  reducers: {
    setEndTime: (state, action) => { // New reducer
      state.endTime = action.payload;
    },
    clearBetAmounts: (state) => {
      state.betAmounts = {}
      state.totalBetAmount = 0
    }
  },
  extraReducers: (builder) => {
    builder
          .addCase(submitBet.pending, (state) => {
            state.loading = true;
          })
          .addCase(submitBet.fulfilled, (state, action) => {
            const updatedBets = {};
            let totalAmount = 0;

            action.payload.forEach(({ side, amount }) => {
              updatedBets[side] = updatedBets[side] ? updatedBets[side] + amount : amount;
              totalAmount += amount;
            });
          
            state.betAmounts = updatedBets;
            state.totalBetAmount = totalAmount;
            state.loading = false;
          })
          .addCase(submitBet.rejected, (state, action) => {
            state.loading = false;
          })
          .addCase(fetchABOpenBets.fulfilled, (state, action) => {
            const updatedBets = {};
            let totalAmount = 0;
            action.payload.forEach(({ side, amount }) => {
              updatedBets[side] = updatedBets[side] ? updatedBets[side] + amount : amount;
              totalAmount += amount;
            });
          
            state.betAmounts = updatedBets;
            state.totalBetAmount = totalAmount;
          })
          .addCase(fetchGameHistory.fulfilled, (state, action) => {
            state.lastRoundResults = action.payload.history;
          })
  },
});

export const { setEndTime, clearBetAmounts } = andarBaharGameSlice.actions;
export default andarBaharGameSlice.reducer;