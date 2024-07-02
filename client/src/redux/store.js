import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer } from './reducers';
import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
