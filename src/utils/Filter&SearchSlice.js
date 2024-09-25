// filterAndSearchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filteredJobs: [],
    searchedJobs: []
};

const filterAndSearchSlice = createSlice({
    name: 'filterAndSearch',
    initialState,
    reducers: {
        setFilteredJobs: (state, action) => {
            state.filteredJobs = action.payload;
        },
        setSearchedJobs: (state, action) => {
            state.searchedJobs = action.payload;
        },
        resetJobs: (state) => {
            state.filteredJobs = [];
            state.searchedJobs = [];
        }
    }
});

export const { setFilteredJobs, setSearchedJobs, resetJobs } = filterAndSearchSlice.actions;
export default filterAndSearchSlice.reducer;
