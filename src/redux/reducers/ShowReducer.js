import { createSlice } from "@reduxjs/toolkit";


//for showing components, since the action and usage are in different components , the state is centralized here
const initialState={
    showContacts:false,
    showProfile:false
}


const ShowSlice=createSlice({
    name:"show",
    initialState,
    reducers:{
        contacts:(state,action)=>{
            state.showContacts=!state.showContacts
        },
        profile:(state,action)=>{
            state.showProfile=!state.showProfile
        },
        reset:(state,action)=>{
            state.showContacts=false
            state.showProfile=false
        }
    }
})

//reducer
export const ShowReducer=ShowSlice.reducer;
export const ShowActions=ShowSlice.actions;
export const ShowSelector=(state)=>state.ShowReducer;