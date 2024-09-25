// jobSlice.js
import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: [],
  reducers: {
    addJobs: (state, action) => {
      return [...state, ...action.payload]; // Append new jobs to the existing state
    },
    removeJob: (state, action) => {
      return state.filter(job => job.id !== action.payload.id); // Assuming each job has a unique id
    },
  },
});

export const { addJobs, removeJob } = jobSlice.actions;
export default jobSlice.reducer;
