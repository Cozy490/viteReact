// src/counterSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const initialState = {
  value: 0
}
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset:()=>{
      return { value: 3}
    }
  },
});
export const getInfo = createAsyncThunk(
  'counter/getInfo',
  async (_, { dispatch }) => {
    const res = await new Promise(resolve => {
      setTimeout(() => {
        dispatch(counterSlice.actions.reset());
        resolve(2);
        console.log(2233)
      }, 1000);
    });
    return res;
  }
);
export const getParamsInfo = createAsyncThunk(
  'counter/getParamsInfo',
  async (params:{id:number}, { dispatch }) => {
    console.log(params,'params');
    const res = await new Promise(resolve => {
      setTimeout(() => {
        dispatch(counterSlice.actions.reset());
        resolve(2);
      }, 1000);
    });
    return res;
  }
);

// export const { increment, decrement } = counterSlice.actions;
// export default counterSlice.reducer;
