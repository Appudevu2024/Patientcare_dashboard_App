
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminExist: null,
};


const adminSlice = createSlice({
  name: 'admin',
  initialState,
  
  reducers: {
    saveAdmin: (state, action) => {
      state.adminExist = action.payload;
    },
    clearAdmin: (state) => {
      state.adminExist = null;
    },
  },
});

export const { saveAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
