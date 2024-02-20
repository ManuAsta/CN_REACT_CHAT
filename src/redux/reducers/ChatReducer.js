import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { db } from "../../firebase/firebaseinit";
import { collection,query,where,addDoc, getDocs,onSnapshot,getDoc,doc,setDoc, orderBy, updateDoc } from "firebase/firestore";
import { ShowActions } from "./ShowReducer";


//all the message reated states are being handled here, like the messages, users, conversations
const initialState={
    fetchLoading:false,
    addingConversation:false,
    users:[],
    conversations:[],
    selectedChat:null,
    messages:[]
}



//getting the list of users in the home page, when the user wants to start a new conversation
export const getUsersAsync=createAsyncThunk("chats/users",
    async(payload,thunkAPI)=>{
        //fetch all the users from firestore
        const querySnapshot = await getDocs(collection(db, "users"));
        const users=[];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            if(doc.data().uid!==payload){
                users.push(doc.data());
            }
        });
        return users;
    }
)


//getting the conversations on the left panel of the home page, when the home page loads
export const getConversationsAsync=createAsyncThunk("chats/conversations",
    async(payload,thunkAPI)=>{
        // console.log(payload);
        //fetch all the users from firestore
        // const q = query(collection(db, "conversations"), where("participants", "array-contains", payload));
        // const conversations=[];
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        // //   console.log(doc.id, " => ", doc.data());
        //     conversations.push({
        //         ...doc.data(),
        //         timestamp:doc.data().timestamp.toDate().toISOString()
        //     })
        // });



        // //get the other particpant data
        // const finalConversations=await Promise.all(conversations.map(async (conversation)=>{
        //     const secondParticipant=conversation["participants"].filter((id)=>id!==payload)[0];
        //     // console.log(secondParticipant);
        //     const docSnap= await getDoc(doc(db,"users",secondParticipant));
        //     // console.log("hello");
        //     return{
        //         ...conversation,
        //         secondUserName:docSnap.data().name,
        //         secondUserPic:docSnap.data().photo
        //     }
        // }))
        // return finalConversations;


        const q = query(collection(db, "conversations"), where("participants", "array-contains", payload),orderBy("timestamp","desc"));
        onSnapshot(q, async (querySnapshot) => {
        const currentConversations = [];
        querySnapshot.forEach((doc) => {
            if(doc.data()){
                currentConversations.push(doc.data());
            }   
        });

        
        //get the other particpant data
        const conversations=await Promise.all(currentConversations.map(async (conversation)=>{
            const secondParticipant=conversation["participants"].filter((id)=>id!==payload)[0];
            // console.log(secondParticipant);
            const docSnap= await getDoc(doc(db,"users",secondParticipant));
            // console.log("hello");
            return{
                ...conversation,
                secondUserName:docSnap.data().name,
                secondUserPic:docSnap.data().photo
            }
        }))
        thunkAPI.dispatch(ChatActions.updateConversations(conversations));
        });
    }
)





//for getting messages on real time

export const getMessagesAsync=createAsyncThunk("chats/getMessages",
    async(payload,thunkAPI)=>{
        const q = query(collection(db, "messages"), where("convoId", "==", payload),orderBy("timestamp","asc"));
         onSnapshot(q, (querySnapshot) => {
        const currentMessages = [];
        querySnapshot.forEach((doc) => {
            currentMessages.push(doc.data());
        });
        // console.log(currentMessages);
        thunkAPI.dispatch(ChatActions.updateMessages(currentMessages));
        });
    }
)











//for creating a conversation
export const createConversationAsync=createAsyncThunk("chats/createConversation",
    async(payload,thunkAPI)=>{
        const {combinedId,user1,user2}=payload;
        //check if the conversation already exists or not
        const docRef = doc(db, "conversations", combinedId);
        const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Already exists");
            } else {
        // docSnap.data() will be undefined in this case
            const data={
                participants:[user1,user2],
                timestamp: new Date().toISOString(),
                recentMessages:[],
                id:combinedId
            }   
            
            await setDoc(doc(db,"conversations",combinedId),data);
            thunkAPI.dispatch(ShowActions.reset());
            return data.id
        }
    }
)




//for creating a message
export const createMessageAsync=createAsyncThunk("chats/createMessage",
    async (payload,thunkAPI)=>{
        // console.log(payload);
        //create a new message with a random message id given by the firebase, so we can use addDoc here
        await addDoc(collection(db, "messages"), {
            ...payload,
            timestamp:new Date().toISOString(),
            read:false
          });
        
        const conversationDocRef=doc(db,"conversations",payload.convoId);
        updateDoc(conversationDocRef,{
            recentMessages:payload.message===""? "IMAGE":payload.message,
            timestamp:new Date().toISOString()
        })
    }
)










const ChatSlice=createSlice({
    name:"chats",
    initialState,
    reducers:{
        reset:(state,action)=>{
            console.log("this is executed when logged out");
            state.fetchLoading=false;
            state.users=[];
            state.conversations=[];
            state.selectedChat=null;
            state.messages=[]
        },
        currentChat:(state,action)=>{
            // console.log(action.payload);
            const {secondUserName,secondUserPic,id}=action.payload;
            state.selectedChat={
                name:secondUserName,
                photo:secondUserPic,
                convoId:id
            }
        },
        updateConversations:(state,action)=>{
            // console.log("hello this is being executed");
            state.conversations=action.payload
        },
        updateMessages:(state,action)=>{
            state.messages=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getUsersAsync.fulfilled,(state,action)=>{
            // console.log(action.payload);
            state.users=action.payload;
            state.fetchLoading=false;
        })
        .addCase(getUsersAsync.pending,(state,action)=>{
            state.fetchLoading=true;
        })
        .addCase(createConversationAsync.fulfilled,(state,action)=>{
            state.addingConversation=false;
        })
        .addCase(createConversationAsync.pending,(state,action)=>{
            state.addingConversation=true;
        })
    }
})




//reducer
export const ChatReducer=ChatSlice.reducer;
export const ChatActions=ChatSlice.actions;
export const ChatSelector=(state)=>state.ChatReducer;