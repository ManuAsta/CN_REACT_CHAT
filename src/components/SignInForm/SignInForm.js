import React,{useEffect, useRef, useState} from 'react';
//styles
import styles from "./SignInForm.module.scss";
//routing
import { NavLink, useNavigate } from 'react-router-dom';
//redux
import { SignActions, SignSelectors, handleSignInAsync } from '../../redux/reducers/SignReducer';
import { useDispatch, useSelector } from 'react-redux';
//notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//loading component
import Loading from '../Loading/Loading';



export default function SignInForm() {

 //for setting the states of email and password
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
//redux
const dispatch=useDispatch();
const {error,success,loading}=useSelector(SignSelectors);
//routing
const navigate=useNavigate();

//when the component loads, i want to focus on the email
const emailRef=useRef();
useEffect(()=>{
    emailRef.current.focus();
},[])

//after a succesffull login, i want to redirect to the homepage
useEffect(()=>{
   if(error){
        toast.error(`${error.substring(9)}`);
        dispatch(SignActions.reset());
    }
    if(success && !loading){
        toast.success("Logged In Succesfully");
        dispatch(SignActions.reset());
        setTimeout(()=>{
            navigate("/");
        },2000);
    }

},[error,navigate,success,dispatch,loading]);



 //form submission
 const handleFormSubmission=(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("email",email);
    formData.append("password",password);
    dispatch(handleSignInAsync(formData));
 }



  return (
    <>
        {loading? <div className='position-absolute top-50 start-50 translate-middle'><Loading/></div>:
        <div className={`${styles.container}`}>
        <div className={`${styles.form} text-center w-100`}>
            <h3>Sign In</h3>
            <form className={`d-flex flex-column w-100 align-items-center`}  onSubmit={handleFormSubmission}>
                <input type="email" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)} ref={emailRef} required/>
                <input type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}  required/>     
                <button type='submit'>Submit</button>
            </form>
            <NavLink to={"/sign/signup"}>No Account? Create a new account instead</NavLink>
        </div>
    </div>}
    </>
    
  )
}
