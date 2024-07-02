import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persisConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userReducer,
});

export const persistedReducer = persistReducer(persisConfig, rootReducer);
