import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import { getUserBalance } from '../../user/userSlice';
import { message } from 'antd';

export const submitBet = createAsyncThunk('game/dragon-tiger/submitBet',async ({ amount, side }, {dispatch, rejectWithValue }) => {
    try {
      const result = await api.post('/game/dragon-tiger/bet-place', { amount, side });
      message.success(result.data.message);
      dispatch(getUserBalance());
      return result.data.openBets;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDTOpenBets = createAsyncThunk('game/dragon-tiger/fetchOpenBets', async () => {
  const result = await api.get('/game/dragon-tiger/current/bets');
  return result.data.openBets;
});

export const fetchGameHistory = createAsyncThunk('game/dragon-tiger/history', async () => {
  const result = await api.get('/game/dragon-tiger/history');
  return result.data;
});

const dragonTigerGameSlice = createSlice({
  name: 'dragonTigerGame',
  initialState: {
    endTime: null,
    betAmounts: {},
    totalBetAmount: 0,
    loading: false,
    lastRoundResults: null,
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
          .addCase(fetchDTOpenBets.fulfilled, (state, action) => {
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

export const { setEndTime, clearBetAmounts } = dragonTigerGameSlice.actions;
export default dragonTigerGameSlice.reducer;