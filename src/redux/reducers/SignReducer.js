import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
//authentication
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
//update a new user
import {db} from "../../firebase/firebaseinit";
import {doc,setDoc} from "firebase/firestore"; 
import { ChatActions, getConversationsAsync } from "./ChatReducer";
import { ShowActions } from "./ShowReducer";


//intial state
const initialState={
    error:null,
    success:false,
    loading:false
}


//for handling async action in the form submission signup proces
export const handleSignUpAsync = createAsyncThunk("signup/formSubmission",

    //async callback when the form is submitted
    async(payload,thunkAPI)=>{
        try{
            //  console.log(payload);
            const auth = getAuth();
            const userCredential=await createUserWithEmailAndPassword(auth, payload.email, payload.password);
                // Signed up 
            const user = userCredential.user;
            //returning a promise
            await updateProfile(user,{
                displayName:payload.name,
                photoURL:payload.photoURL,
            });

          
            // Add a new document in collection "cities"
            await  setDoc(doc(db,"users",user.uid), {
                name: payload.name,
                photo:payload.photoURL,
                uid:user.uid,
                email:payload.email
            });

            thunkAPI.dispatch(getConversationsAsync(user.uid));
            
            return {
                uid:user.uid, 
            }
            
        }catch(error){
                // console.log(error);
                return new Promise((resolve,reject)=>{
                    reject(error);
                })
            }
        }
)


//for handling the form submission of signin
export const handleSignInAsync=createAsyncThunk("signin/formSubmission",
        async (formData)=>{
            // console.log(formData.get("password"));
            const auth=getAuth();
            const email=formData.get("email");
            const password=formData.get("password");
            // console.log(email,password);
            const userCredential=await signInWithEmailAndPassword(auth,email,password);
            // console.log(userCredential.user.uid);
            return {
                user:userCredential.user.uid
            }
        }
)


//for handling signout
export const handleSignOutAsync=createAsyncThunk("signout/click",
        async(payload,thunkAPI)=>{
            const auth=getAuth();
            thunkAPI.dispatch(ChatActions.reset());
            thunkAPI.dispatch(ShowActions.reset());
            return signOut(auth);
        }
)





//sign slice
const SignSlice= createSlice({
    name:"sign",
    initialState,
    reducers:{
        reset:(state,action)=>{
            state.error=null;
            state.loading=false;
            state.success=false;
        }
    },
    extraReducers:(builder)=>{
        //incase signup is successful
        builder.addCase(handleSignUpAsync.fulfilled,(state,action)=>{
            console.log("scuccess");
           state.success=true;
           state.error=null;
           state.loading=false
        })
        //incase signup is rejected
        .addCase(handleSignUpAsync.rejected,(state,action)=>{
            // console.log("failed");
            console.log(action.error);
            state.error=action.error.message;
            state.success=false;
            state.loading=false
        })
        //loading
        .addCase(handleSignUpAsync.pending,(state,action)=>{
            // console.log("loading");

            state.loading=true;
            state.error=null;
            state.success=false
        })

        .addCase(handleSignInAsync.fulfilled,(state,action)=>{
            // console.log("success");
            state.success=true;
            state.error=null;
            state.loading=false
        })
        //incase signup is rejected
        .addCase(handleSignInAsync.rejected,(state,action)=>{
            // console.log("failed");

            state.error=action.error.message;
            state.success=false;
            state.loading=false
        })
        //loading
        .addCase(handleSignInAsync.pending,(state,action)=>{
            // console.log("loading");
            state.loading=true;
            state.error=null;
            state.success=false
        })


        //for signing out also
        .addCase(handleSignOutAsync.fulfilled,(state,action)=>{
            state.success=true;
            state.error=null;
            state.loading=false
        })
        .addCase(handleSignOutAsync.rejected,(state,action)=>{
            state.error=action.error.message;
            state.success=false;
            state.loading=false
        })
        .addCase(handleSignOutAsync.pending,(state,action)=>{
            state.loading=true;
            state.error=null;
            state.success=false
        })
    }
})


//export reducer
export const SignReducer= SignSlice.reducer;
//export selectors
export const SignSelectors=(state)=>state.SignReducer;
//export actions
export const SignActions=SignSlice.actions;