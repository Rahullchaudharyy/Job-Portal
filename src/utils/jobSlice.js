import { createSlice } from "@reduxjs/toolkit";

 const jobSlice = createSlice({
    name:"jobs",
    initialState:[],
    reducers:{
        addJobs:(state,action)=>{
            return action.payload
        },
        removeJob:(state,action)=>{
            return []
        }
    }
})

export const {addJobs,removeJob} = jobSlice.actions
export default jobSlice.reducer