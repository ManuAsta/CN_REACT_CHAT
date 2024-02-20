import React, { useEffect, useRef, useState } from 'react'
//styles
import styles from "./Chat.module.scss";
//images
import logout from "../../images/logout.png";
import photoSelector from "../../images/photo.png";
import send from "../../images/send-message.png";
//for genearting images
import { storage } from '../../firebase/firebaseinit';
import { ref,deleteObject, getDownloadURL,uploadBytesResumable} from 'firebase/storage';
//redux
import { ShowActions, ShowSelector } from '../../redux/reducers/ShowReducer';
import {  ChatSelector, createMessageAsync, getMessagesAsync } from '../../redux/reducers/ChatReducer';
import { useDispatch, useSelector } from 'react-redux';
import { SignActions, SignSelectors, handleSignOutAsync } from '../../redux/reducers/SignReducer';
//router
import { useNavigate } from 'react-router-dom';
//notifications
import { toast } from 'react-toastify';
//component
import Message from '../Message/Message';



export default function Chat(props) {
 

const{user}=props;


//redux
const {selectedChat,messages}=useSelector(ChatSelector);
//  console.log(selectedChat);
// console.log(messages);
//for showing the profile info
 const {showProfile}=useSelector(ShowSelector);
 const {loading,success,error}=useSelector(SignSelectors);



 //for refs
 const inputRef=useRef();
 const imgRef=useRef();
 const chatAreaRef=useRef();

 //variables for message
 const [inputMessage,setInputMessage]=useState("");
 const [pic,SetPic]=useState("");
 const [picURL,setPicURL]=useState("");
 const [picLoading,setPicLoading]=useState(false);

 //forlogging out
 const dispatch=useDispatch();
 const navigate=useNavigate();



 //useEffects
  //useEffects
 //when the chat loads, i want the respective messages
 useEffect(()=>{
    //get the messages, when a chat is selected
    if(selectedChat && user){
    
        dispatch(getMessagesAsync(selectedChat.convoId));
    }
 },[selectedChat,user,dispatch])
 
 






//for scrolling the chat section to the newest message
useEffect(()=>{
    if(!user || !chatAreaRef.current){
        return;
    }
    //every time a message changes, i want to scroll to the newest message
    chatAreaRef.current.scrollTop=chatAreaRef.current.scrollHeight;
 },[messages,user,pic])




 //for navigating to signin page after a succesfful logout

 useEffect(()=>{
    if(success && !loading){
        // console.log("Henloooo");
        dispatch(SignActions.reset());
        navigate("/sign/signin");
        return;
    }
    if(error){
        dispatch(SignActions.reset());
        toast.error(`${error}`);
    }

 },[loading,success,error,navigate,dispatch])




 






//when the user presses enter, it should send a message too

 function handleInputText(e){ 
    setInputMessage(e.target.value);     
 }

 function handleEnter(e){
    if(e.key==="Enter"){
        e.preventDefault();
        handleSend();
        // console.log("Hello");
    }
 }



 //for generating pic url
 function handleInputPic(e){
    const file=e.target.files[0];
    if(!file){
        return;
    }
    SetPic(file.name);
   
    //before uploading a new pic, i want to delete the previous ones to save storage
    if(picURL!==""){
        const storageRef=ref(storage,picURL);
        deleteObject(storageRef).then(()=>{
            // console.log("photo Deleted from the firebase");
        })
    }

      //now generate URL and set the image
    //every photo has a unique name
    const storageRef = ref(storage, `${pic+new Date().toISOString()}`); 
    const uploadTask = uploadBytesResumable(storageRef, file);
    setPicLoading(true);
    uploadTask.on('state_changed', 
    (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
            // console.log('Upload is paused');
            break;
        case 'running':
            // console.log('Upload is running');
            break;
        default:
            // console.log("Uploading");
        }
    }, 
    (error) => {
        // Handle unsuccessful uploads
        // console.log("Error in Uploading the Photo: ",error);
        setPicLoading(false);
    }, 
    () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // console.log('File available at', downloadURL);
            setPicURL(downloadURL);
        });
        setPicLoading(false);
    }
    );
    //make an async action to get the 
 }





//for sending image
 function handleSend(){

    const sender=user.uid;
    const convoId=selectedChat.convoId;
    if(pic.trim()!=="" && picURL.trim()!=="" &&!picLoading){

        const payload={
            type:"image",
            sender,
            convoId,
            message:inputMessage,
            image:picURL
        }
        setInputMessage("");
        SetPic("")
        dispatch(createMessageAsync(payload));

        // const ob={
        //     type:"image",
        //     sender:"p1",
        //     message:inputMessage,
        //     image:picURL
        // }   
        // // setMessages([...messages,ob]);
        // setInputMessage("");
        // SetPic("");
        // return;
    }else{
          //for only message
          if(inputMessage.trim()!==""){

            const payload={
                type:"text",
                sender,
                convoId,
                message:inputMessage,
                image:""
            }
            SetPic("");
            setInputMessage("");
            dispatch(createMessageAsync(payload));

            // const ob={
            //     type:"text",
            //     participant:"p1",
            //     message:inputMessage,
            //     image:""
            // }
            // setMessages([...messages,ob]);
            // setInputMessage("");
            // SetPic("");



          }
           
    } 
 }

//  console.log("Chat");
 
//logging out
 const logOut=()=>{
    dispatch(handleSignOutAsync());
 }


  return (
    <>
    {user &&  
    <div className={`${styles.container}`}>
        <div className={`${styles["top-bar"]} d-flex justify-content-between align-items-center`}>
            <div className={`${styles["second-user"]}`}>
            
                {selectedChat && <>
                <div className={`${styles.profile}`} >
                    <img alt='profile-pic' src={selectedChat.photo} width={"100%"} height={"100%"}/>
                </div>
                <h2 >{selectedChat.name}</h2></> 
                }      

            </div>
            <div className={`${styles.profile}`} onClick={()=>dispatch(ShowActions.profile())}>
                <img alt='profile-pic' src={user.photo} width={"100%"} height={"100%"}/>
            </div>
            {/* For showing the profile info */}
            {showProfile && <div className={`${styles["profile-info"]}`}>
                <h2>{user.name}</h2>
                <hr className="border border-danger border-1 opacity-20"></hr>
                <button onClick={()=>logOut()}>
                    <img src={logout} width={"50px"} alt='logout'/>
                    <span> {loading? "...":"Log out"}</span>
                </button>
            </div>}
            
        </div>
        {/* show the chat only if the conversation is selected */}
        {selectedChat &&  
        <div className={`${styles["chat-area"]}`} ref={chatAreaRef}>
                <div className={`${styles["message-area"]}`}>
                   {messages.length>0 && messages.map((messageItem,index)=><Message selectedChat={selectedChat} key={index} user={user} messageItem={messageItem}/>)}
                </div>
                <div className={`${styles["chat-input"]}`}>
                    <div className={`${styles.files}`}>
                        {pic && <div className={`${styles["pic-name"]}`}>
                            {pic.substring(0,10)}...
                        </div>}
                        <button>
                            <input type='file' id='select-pic' ref={imgRef} accept='.jpg, .png, .jpeg' style={{"display":"none"}} disabled={inputMessage.trim()!==""} onChange={(e)=>handleInputPic(e)}/>
                            <label htmlFor='select-pic'>
                                <img src={photoSelector}  alt='photoSelector' height={"100%"} width={"100%"}/>
                            </label>
                        </button>
                    </div>
                    <div className={`${styles["input-box"]}`}>
                        <textarea ref={inputRef} disabled={pic.trim()!==""}  value={inputMessage} onChange={(e)=>handleInputText(e)}  onKeyDown={(e) => {handleEnter(e)}} placeholder='Type a message here....'/>
                    </div>
                    <div className={`${styles.send}`}>   
                        <button onClick={()=>handleSend()} disabled={picLoading}>
                            {picLoading? <span className='fw-bold'>...</span>:<img alt='send' src={send} width={"100%"}/>}
                        </button>
                    </div>                
                </div>
        </div>
       }
       
    </div>}
    </>
    
  )
}
