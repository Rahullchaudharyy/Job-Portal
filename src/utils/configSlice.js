import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: 'config',
  initialState: {
    formState: false, 
    filters: {        
      jobTitle: '',
      company: '',
      location: '',
      jobType: '',
    },
  },
  reducers: {
    changeState: (state) => {
      state.formState = !state.formState;
    },

    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload, 
      };
    },
    resetFilters: (state) => {
      state.filters = {
        jobTitle: '',
        company: '',
        location: '',
        jobType: '',
      };
    },
  },
});

export const { changeState, updateFilters, resetFilters } = configSlice.actions;
export default configSlice.reducer;
