import React,{useState,useEffect} from 'react';
//styles
import styles from "./Message.module.scss";


export default function Message(props) {
// console.log(messageOb);
// console.log(props);


    //in a message item , we have the sender, the receiver info and the message info, we are getting it from props here
   const {user,messageItem,selectedChat}=props;
   const {sender,message,type,image}=messageItem;

   const [time,setTime]=useState("");

   //setting the time similar to whatsapp
   useEffect(()=>{
    if(!messageItem){
        return;
    }
    // console.log("Timestamp is ",messageItem.timestamp);
    const timestamp=new Date(messageItem.timestamp);
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
  },[messageItem]);

//   console.log(time);

  return (
    <>
    {sender===user.uid && <div className={`${styles.container} ${styles.right}`} >
        <div className={`${styles.message} `} >
           {type==="image" &&<img alt='pic' src={image}/>}
           {type==="text" &&  <span>{message}</span>}
        </div>
        <div className={`${styles.info} float-end`}>
            <div className={`${styles.time}`}>{time}</div>  
            <div className={`${styles["user-pic"]}`}>
                <img src={user.photo} width={"100%"} height={"100%"}  alt="p1"/>
            </div>
        </div>
    </div>}

    {sender!==user.uid && <div className={`${styles.container}`}>
        {
            <div className={`${styles.message} ${styles.right} `}>
                {type==="image" &&<img alt='pic' src={image}/>}
                {type==="text" &&  <span>{message}</span>}
            </div>
        }
        <div className={`${styles.info}`}>
            <div className={`${styles["user-pic"]}`}>
                <img src={selectedChat.photo} width={"100%"} height={"100%"}  alt="p1"/>
            </div>
           <div className={`${styles.time}`}>{ time}</div>
        </div>
    </div>}
    </>
    
  )
}
