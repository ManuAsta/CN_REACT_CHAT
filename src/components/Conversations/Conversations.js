import React, { useEffect, useState } from 'react';
//styles
import styles from "./Conversations.module.scss";
//icons
import addIcon from "../../images/add.png";
//component
import Conversation from '../Conversation/Conversation';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { ShowActions } from '../../redux/reducers/ShowReducer';
import { ChatSelector } from '../../redux/reducers/ChatReducer';


export default function Conversations() {

    //for showing contacts or not
    const dispatch=useDispatch();

    //conversations from redux store
    const {conversations}=useSelector(ChatSelector);
    // console.log(conversations);

    //get the conversations from the store whenever it changes and show them
    const [showConversations,setShowConversations]=useState([]);

    useEffect(()=>{
        setShowConversations(conversations);
    },[conversations])

    
    //filtering the conversations
    const handleFilter=(e)=>{
        if(conversations.length>0){
            const word=e.target.value.toLowerCase();
            const filteredConversations=conversations.filter((conv)=>conv.secondUserName.toLowerCase().includes(word));
            setShowConversations(filteredConversations);
        }
    }
    
    

  return (
    <div className={`${styles.container}`}>
        <div className={`${styles["top-bar"]}`}>
            <div className='d-flex justify-content-between align-items-center'>
                <h4>Conversations</h4>
                <button onClick={()=>dispatch(ShowActions.contacts())}>    
                    <img alt='Add-Conv' src={addIcon} width={"30px"}/>
                </button>
            </div>
            <div className={`${styles.search}`}>
                <input type='text' onChange={(e)=>handleFilter(e)} placeholder='Search Conversations...'/>
            </div>
        </div>
        <div className={`${styles["conversation-list"]}`}>
            {showConversations.length>0 && 
             showConversations.map((conversation,index)=> <Conversation key={index} conversation={conversation}/>)
            }
        </div>
    </div>
  )
}
