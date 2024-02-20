//react
import React, { useEffect } from 'react';
//styling
import styles from "./Home.module.scss";
//redux
import { useDispatch, useSelector } from 'react-redux';
import { AuthActions, AuthSelectors, handleAuthAsync } from '../../redux/reducers/AuthReducer';
import { ShowSelector } from '../../redux/reducers/ShowReducer';
import { getConversationsAsync } from '../../redux/reducers/ChatReducer';
//components
import Chat from '../../components/Chat/Chat';
import Conversations from '../../components/Conversations/Conversations';
import Contacts from '../../components/Contacts/Contacts';
import Loading from '../../components/Loading/Loading';
//routing
import { useNavigate } from 'react-router-dom';



export default function Home() {

  //knowing if the user is there or not
  const {user,loading,success}=useSelector(AuthSelectors);
  //for showing contacts
  const {showContacts}=useSelector(ShowSelector);

  const dispatch=useDispatch();
  const navigate=useNavigate();
  
  //when the home page loads, it needs to check for the user change and get the user id
  useEffect(()=>{
    //dispatch so that it listens if the user is present or not
    dispatch(handleAuthAsync());
  },[dispatch]);

  //once the operation is success, and if the user is there then show the user or else redirect to the sign in page
  useEffect(()=>{
    if(success &&!loading &&!user){
      dispatch(AuthActions.reset());
      navigate("/sign/signin");
    }
  },[user,navigate,dispatch,success,loading])

 

//when the component loads, fetch the conversations (left panel) from firebase
  useEffect(()=>{
      dispatch(getConversationsAsync(user));
  },[dispatch,user])


  return (
    <>
      {loading? <div className={`position-absolute top-50 start-50 translate-middle`}><Loading/></div>:
      <div className={`${styles.app}`}>
        <div className={`${styles.conversations}`}>
         <Conversations />
        </div>
        <div className={`${styles.chat}`}>
        <Chat user={user} loading={loading}/>
        </div>
        {showContacts &&<div className={styles.modal}> <Contacts userId={user.uid}/></div>}
      </div>}
    </>
   
  )
}
