// src/store/gameSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import { getUserBalance } from '../../user/userSlice';
import { message } from 'antd';

// Thunks for asynchronous actions
export const fetchSessionInfo = createAsyncThunk('game/fetchSessionInfo', async () => {
  const result = await api.get('/game/surath/current/session');
  return result.data.data;
});

export const fetchOpenBets = createAsyncThunk('game/fetchOpenBets', async () => {
  const result = await api.get('/game/surath/current/bets');
  return result.data.openBets;
});

export const fetchLastResults = createAsyncThunk('game/fetchLastResults', async () => {
  const result = await api.get('/game/surath/result');
  return result.data.results;
});

export const submitBet = createAsyncThunk(
  'game/submitBet',
  async ({ amount, card }, {dispatch, rejectWithValue }) => {
    try {
      const result = await api.post('/game/surath/bet-place', { amount, card });
      message.success(result.data.message);
      dispatch(getUserBalance());
      return result.data.openBets;
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchStreamToken = createAsyncThunk(
  'stream/fetchToken',
  async (channelName, { rejectWithValue }) => {
      try {
          const response = await api.get(`agora/get-user-token`);
          if (response.status !== 200) {
              throw new Error('Failed to fetch token');
          }
          return response.data; // Ensure response contains { token, uid }
      } catch (error) {
          return rejectWithValue(error.response?.data || error.message);
      }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    betAmounts: {},
    timer: null,
    endTime: null,
    // lastResults: [],
    lastRoundResult: null,
    loading: false,
    totalBetAmount: 0,
    sessionRemainder: 0,
    sessioninfoLoading: true,
    streamToken: null,
    uid:null,
    own: null
  },
  reducers: {
    updateTimer: (state, action) => {
      state.timer = action.payload;
    },
    setEndTime: (state, action) => { // New reducer
      state.endTime = action.payload;
    },
    resetBets: (state) => {
      state.betAmounts = {};
      state.totalBetAmount = 0
    },
    updateSessionRemainder: (state, action) => {
      state.sessionRemainder = action.payload; // Reducer to update sessionRemainder
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionInfo.pending, (state, action) => {
        state.sessioninfoLoading = true
      })
      .addCase(fetchSessionInfo.fulfilled, (state, action) => {
        const endTime = new Date(action.payload.endTime).getTime(); // Store endTime as timestamp
        state.endTime = endTime;
        state.own = action.payload.own;
        state.sessionRemainder = action.payload.sessionRemainder;
        state.sessioninfoLoading = false;

      })
      .addCase(fetchSessionInfo.rejected, (state, action) => {
        state.sessioninfoLoading = false
      })
      .addCase(fetchOpenBets.fulfilled, (state, action) => {
        const updatedBets = {};
        let totalAmount = 0;
        action.payload.forEach(({ card, amount }) => {
          updatedBets[card] = updatedBets[card] ? updatedBets[card] + amount : amount;
          totalAmount += amount;
        });
        state.betAmounts = updatedBets;
        state.totalBetAmount = totalAmount;
      })
      .addCase(fetchLastResults.fulfilled, (state, action) => {
        state.lastResults = action.payload;
        state.lastRoundResult = { winningCard: action.payload[0].result };
      })
      .addCase(submitBet.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitBet.fulfilled, (state, action) => {
        const updatedBets = {};
        let totalAmount = 0;
        action.payload.forEach(({ card, amount }) => {
          updatedBets[card] = updatedBets[card] ? updatedBets[card] + amount : amount;
          totalAmount += amount;
        });
        state.betAmounts = updatedBets;
        state.totalBetAmount = totalAmount;
        state.loading = false;
      })
      .addCase(submitBet.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchStreamToken.pending, (state) => {
        state.loading = true;
        state.streamToken = null;
        state.uid = null;
    })
    .addCase(fetchStreamToken.fulfilled, (state, action) => {
        state.loading = false;
        console.info("redux =>",action.payload)
        state.streamToken = action.payload.token;
        state.uid = action.payload.uid;
    })
    .addCase(fetchStreamToken.rejected, (state, action) => {
        state.loading = false;
    });
  },
});

export const { updateTimer, resetBets, setEndTime, updateSessionRemainder } = gameSlice.actions;
export default gameSlice.reducer;
