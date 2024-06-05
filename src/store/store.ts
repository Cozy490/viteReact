import { configureStore } from '@reduxjs/toolkit';
import { counterSlice } from './homeSlice';

// configureStore 创建store
export const store = configureStore({
  reducer: {
    home: counterSlice.reducer
  },
});
export type RootState = ReturnType<typeof store.getState>