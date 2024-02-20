import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
//authentication
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { getConversationsAsync } from "./ChatReducer";

const initialState={
    user:null,
    loading:false,
    error:null,
    success:false
}


//returns the user, when the user changes
export const handleAuthAsync=createAsyncThunk("authentication",

    async (payload,thunkAPI)=>{
        const auth=getAuth();
        return new Promise((resolve,reject)=>{
            const unsub=onAuthStateChanged(auth,(user)=>{
                if(user){
                    // console.log(user);
                    thunkAPI.dispatch(getConversationsAsync(user.uid));
                    resolve({
                        name:user.displayName,
                        photo:user.photoURL,
                        uid:user.uid
                    });
                }else{
                    //if no user, then user is null
                   
                    resolve(null);
                }
            unsub();
            },(error)=>{
               
                reject(error.message);
            })
        })
      
        
    }

)




const AuthSlice=createSlice({
    name:"authslice",
    initialState,
    reducers:{
        reset:(state,action)=>{
            state.error=null;
            state.loading=false;
            state.success=false;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(handleAuthAsync.fulfilled,(state,action)=>{
            // console.log(action.payload);
            state.user=action.payload;
            state.loading=false;
            state.success=true;
            state.error=null;
        })
        .addCase(handleAuthAsync.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=true;
            state.success=false;
        })
        .addCase(handleAuthAsync.pending,(state,action)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        })
    }
})


//exporting the reducer
export const AuthReducer=AuthSlice.reducer;
//exporting the selector
export const AuthSelectors=(state)=>state.AuthReducer;
//exporting the actions
export const AuthActions=AuthSlice.actions;