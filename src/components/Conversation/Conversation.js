import React, { useEffect, useState } from 'react'
import styles from "./Conversation.module.scss";
import { useDispatch } from 'react-redux';
import { ChatActions } from '../../redux/reducers/ChatReducer';
export default function Conversation(props) {

  const {conversation}=props;
  // console.log(conversation);
  // console.log('conversation');
  const [time,setTime]=useState("");

  useEffect(()=>{
    const timestamp=new Date(conversation.timestamp);
    // console.log(timestamp);
    const currentTime=new Date();
    const diffInMilliSeconds=currentTime-timestamp;
    // console.log(diffInMilliSeconds);

    if(diffInMilliSeconds<=6000){
      setTime("just now")
    }else if(diffInMilliSeconds<86400000){
      const formattedTime=timestamp.toLocaleString(
        "en-US",{
          hour:"numeric",
          minute:"numeric",
          hour12:true
        }
      );
      setTime(formattedTime);
    }else{
      setTime(timestamp.toLocaleDateString());
    }
  },[conversation])

  const dispatch=useDispatch();
  

  return (
    <div className={`${styles.conversation}`} onClick={()=>dispatch(ChatActions.currentChat(conversation))}>
        <div className={`${styles.photo}`}>
            <img alt='user' src={conversation.secondUserPic} width={"100%"} height={"100%"}/>
        </div>
        <div className={`${styles.message}`}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <h5>{conversation.secondUserName}</h5>
                <div className={styles.time}>{time}</div>
            </div>
            <div>{conversation.recentMessages}</div>
        </div>
    </div>
  )
}
