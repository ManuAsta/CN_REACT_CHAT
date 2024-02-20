//react, hooks
import React,{useState,useEffect, useRef} from 'react'
//styles
import styles from "./SignUpForm.module.scss";
//redux
import {useDispatch, useSelector} from "react-redux";
import {SignSelectors, handleSignUpAsync,SignActions} from "../../redux/reducers/SignReducer";
//firebase
import { storage } from '../../firebase/firebaseinit';
import { ref, uploadBytesResumable,getDownloadURL,deleteObject } from "firebase/storage";
//components
import Loading from '../Loading/Loading';
//notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//routing
import { useNavigate } from 'react-router-dom';
//images
import addProfilePic from "../../images/add-user.png"



export default function SignUpForm() {

//default user avatar
  const defaultPic="https://i.pinimg.com/564x/41/10/d5/4110d5dd2247837d4083905f6a9607b4.jpg";

  //for setting the states of email, password and name
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [photoURL,setPhotoURL]=useState(defaultPic);
  const [info,setinfo]=useState("");
  const [photoLoading,setPhotoLoading]=useState(false);
  //route
  const navigate=useNavigate();
  
  //redux
  const dispatch=useDispatch();
  const {success,error,loading}=useSelector(SignSelectors);

  //when the component loads, i want the focus to be  on the input
  const nameRef=useRef();

  //to show notifications and navigate to the home page after login/signup
  useEffect(()=>{
    nameRef.current.focus();
  },[])

 //after signing up redirect to the homepage
  useEffect(()=>{
    if(error){
        toast.error(`${error.substring(9)}`);
        dispatch(SignActions.reset());
    }
    if(success){
        toast.success('Signed Up successfully');
        dispatch(SignActions.reset());
        setTimeout(()=>{
            navigate('/')
        },2000)
      }
  },[error,success,dispatch,navigate])


  //for confirming the password, it should show whether it matches or not, as the user types the password
  const handleConfirm=(e)=>{
    const confirmPassword=e.target.value;
    if(confirmPassword.length>=password.length){
        if(confirmPassword!==password){
            setinfo("Passwords don't match ");
            return;
        }
    }
    setinfo("");
  }



  //for generating a phot URL and showing it in the component
  const handlePhoto=(e)=>{
    const file=e.target.files[0];
    if(!file){
        return;
    }
    if(!isValid(file)){
        return;
    }
    // console.log("Hello here woii");

    // console.log(file);
    setinfo(file.name);

    //before uploading a new pic, i want to delete the previous ones to save storage
    if(photoURL!==defaultPic){
        const storageRef=ref(storage,photoURL);
        deleteObject(storageRef).then(()=>{
            // console.log("photo Deleted from the firebase");
        })
    }

    //now generate URL and set the image
    //every photo has a unique name
    const storageRef = ref(storage, `${name+new Date().toISOString()}`); 
    const uploadTask = uploadBytesResumable(storageRef, file);
    setPhotoLoading(true);
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
        setPhotoLoading(false);
    }, 
    () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // console.log('File available at', downloadURL);
            setPhotoURL(downloadURL);
        });
        setPhotoLoading(false);
    }
    );
  }




  //for checking the validity of profile pic
  const isValid=(file)=>{
     //checking for the photo type
        if(file){
            const validExtensions= [".jpg",".jpeg","png"];
            //check if the file ends with these extensions
            const isValidFile=validExtensions.some((ext)=>file.name.toLowerCase().endsWith(ext));
            if(!isValidFile){
                console.log("Hello");
                toast.warning("Profile pic must be jpg/jpeg/png");
                return false;
            }
        }
        return true;
  }




  //submitting the form
  const handleFormSubmission=(e)=>{
    e.preventDefault();
    //checking for password
    if(password!==e.target[3].value){
        console.log("not equal password");
        toast.warning("Passwords Don't Match");
        return;
    }

    const file=e.target[4].files[0];
    if(!isValid(file)){
        return;
    }

    dispatch(handleSignUpAsync({name,email,password,photoURL}));
  }




  

  return (
    <>
        {loading? <div className='position-absolute top-50 start-50 translate-middle'><Loading/></div>: <div className={`${styles.container}`}>
        <div className={`${styles["photo-section"]}`}>
            <div className={`${styles.photo}`}>
                <img alt='pic' src={photoURL} width={"100%"} height={"100%"}/>
                {photoLoading && 
                <div className='position-absolute top-50 start-50 translate-middle'>
                   <Loading/>
                </div>}
                
            </div>
        </div>
        <div className={`${styles.form} text-center w-100`}>
            <h3>Sign Up</h3>
            <form className={`d-flex flex-column w-100 align-items-center`} onSubmit={handleFormSubmission}>
                <input type='text' placeholder='Your Name' value={name} onChange={(e)=>setName(e.target.value)} ref={nameRef} required/>
                <input type="email" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}  required/>
                <input type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} minLength={6} required/>
                <input type="password" placeholder='Confirm Password'  onChange={(e)=>handleConfirm(e)} minLength={6}  required/>
                <label htmlFor='profile-pic'>
                <img alt='add pic'  src={addProfilePic} width={"40px"} height={"40px"}/>
                <span>Add Profile Picture</span></label>
                {info && <div className='fw-bold'>{info.substring(0,30)}...</div>}
                <input type="file" accept='.jpg, .jpeg, .png' id='profile-pic' onChange={(e)=>handlePhoto(e)}  style={{display:"none"}} />
                <button disabled={photoLoading} type='submit'>Submit</button>
            </form>
        </div>
    </div>}
    </>
   
  )
}
