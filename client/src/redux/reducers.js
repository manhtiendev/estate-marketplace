import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';

export const reducer = combineReducers({
  user: userReducer,
});
