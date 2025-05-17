import { configureStore } from "@reduxjs/toolkit";
import postReducer from './postSlice'
import authReducer from './authSlice'
import commentReducer from './commentSlice'
const store =configureStore({reducer :{posts:postReducer , auth:authReducer , comments:commentReducer}})
export default store ;