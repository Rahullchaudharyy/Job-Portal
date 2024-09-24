import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js'
import configReducer from './configSlice.js'
import jobReducer from "./jobSlice.js";
const store = configureStore({
    reducer:{
        user:userReducer,
        config:configReducer,
        jobs:jobReducer,
        
    }
})


export default store