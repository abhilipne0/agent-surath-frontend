import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
import gameReducer from './game/surath/gameSlice';
import andarBaharGameReducer from './game/andar-bahar/andarBaharSlice';
import dragonTigerGameReducer from './game/dragon-tiger/dragonTiger';
import depositeSlice from './deposite/depositeSlice';
import withdrawalSlice from './withdrawal/withdrawalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // This should match the slice name you're accessing in useSelector
    user: userReducer, // This should match the slice name you're accessing in useSelector
    game: gameReducer,
    andarBaharGame: andarBaharGameReducer,
    dragonTigerGame: dragonTigerGameReducer,
    deposite: depositeSlice,
    withdrawal: withdrawalSlice
  },
  // devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
