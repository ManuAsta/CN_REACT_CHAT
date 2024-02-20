import React, { useEffect, useRef, useState } from 'react'
//styling
import styles from "./Contacts.module.scss";
//close image
import close from "../../images/close.png";
//redux
import { useDispatch, useSelector } from 'react-redux';
import { ChatSelector, createConversationAsync, getUsersAsync } from '../../redux/reducers/ChatReducer';
import { ShowActions } from '../../redux/reducers/ShowReducer';


export default function Contacts(props) {


//redux
const dispatch=useDispatch();
//users
const {users}=useSelector(ChatSelector);
//as the component loads, i want the focus on the search
const inputRef=useRef();
//useState
const [showUsers,setShowUsers]=useState(users);

//for focussing on the input, as the compoenent loads
useEffect(()=>{
    if(inputRef.current){
        inputRef.current.focus();
    }
},[])

//showing users when the component loads
useEffect(()=>{
    setShowUsers(users);
},[users])
 

//when the componenet loads, the component interacts with the firebase to get the list of all the users
 useEffect(()=>{
    dispatch(getUsersAsync(props.userId));
 },[dispatch,props]);



 //for filtering the users
    const filterUsers=(e)=>{
        const word=e.target.value.toLowerCase();
        if(users.length>0){
            const usersToShow=users.filter((user)=>user.name.toLowerCase().includes(word));
            setShowUsers(usersToShow);
        }    
    }



//for adding a user conversation
    const addConversation=(uid)=>{
        const combinedSortedArray=[uid,props.userId].sort();
        // console.log(combinedSortedArray);
        const combinedId=`${combinedSortedArray[0]}_${combinedSortedArray[1]}`;
        dispatch(createConversationAsync({
            combinedId,
            user1:props.userId,
            user2:uid
        }));
    }


  return (
    <>
         <div className={styles.container}>
        <div className={styles["contacts-search"]}>
            <input type='text' placeholder='Search Users..' ref={inputRef} onChange={(e)=>filterUsers(e)}/>
            <img alt='close' width={"40px"} src={close} onClick={()=>dispatch(ShowActions.contacts())}/>
        </div>
        <div className={styles["contacts-list"]}>
            {showUsers.length>0 && 
            showUsers.map((user)=><div key={user.uid} className={styles.contact} onClick={()=>addConversation(user.uid)}>
                <div className={styles.photo}>
                    <img alt='contact'  src={user.photo} width={"100%"} height={"100%"}/>
                </div>
                <h5>
                   {user.name}
                </h5>
            </div>) }  
        </div>
    </div>
    </>
    
  )
}
