//store
import { configureStore } from "@reduxjs/toolkit";
//reducers
import {SignReducer} from "../reducers/SignReducer";
import {AuthReducer} from "../reducers/AuthReducer";
import { ChatReducer } from "../reducers/ChatReducer";
import { ShowReducer } from "../reducers/ShowReducer";


export const store= configureStore({
    reducer:{
        SignReducer,
        AuthReducer,
        ChatReducer,
        ShowReducer
    }
})