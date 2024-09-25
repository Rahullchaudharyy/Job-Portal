import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js'
import configReducer from './configSlice.js'
import jobReducer from "./jobSlice.js";
import filterAndSearchReducer from './Filter&SearchSlice.js'
const store = configureStore({
    reducer:{
        user:userReducer,
        config:configReducer,
        jobs:jobReducer,
        filterAndSearch:filterAndSearchReducer,
        

        
    }
})


export default store