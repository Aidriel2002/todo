import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { database } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import './SignIn.css'
import SignUp from './SignUp';
import Modal from '../Modal.js';
import ForgotPassword from "./ForgotPassword.js";



const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const history = useNavigate();

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };
  
  const closeSignUpModal = () => {
    console.log('Closing SignUp Modal');
    setShowSignUpModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };
 
  const closeModal = () => {
    setShowModal(false);
    history("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEmail = email;

    if (password.length < 8 ) {
      setMessage("Passwords must have at least 8 characters.");
        const errorMessageElement = document.getElementById("created");
        errorMessageElement.style.color = "red";
      return;
    }  
 
    signInWithEmailAndPassword(database, userEmail, password)
      .then((userCredential) => {
        console.log(userCredential);
        history('/home');
        
      })
      .catch((error) => {
        setMessage("Invalid Email or Password.");
        const errorMessageElement = document.getElementById("created");
        errorMessageElement.style.color = "red";
        errorMessageElement.style.padding = "5px 40px";
        console.log(error);
      });

  };

  return (
    <>
    
    <div className="big-box">
            <div className="left-box">
              <div className="trt">
              <div className="image-box">
                <img
                  className="logo"
                  src="./logo.png"
                  alt="Logo"
                  draggable="false"
                />
              </div>
              <h2 className="logo-caption">
                Organize your daily task, say goodbye to missed deadlines.
              </h2>
              </div>
            </div>
            
            
    <div className="right-box">
    

              <div className="form-container">

              <div className="loginForm">
                <h3 className="login">Login</h3>
                <p className="caption">Hello! Let's get started</p>
      <form onSubmit={(e) => handleSubmit(e)}>
      <div className="space">
      <div className="inputBox">
        <input
          className="email-box"
        
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
         <span>Enter your email</span>
        </div>
        </div>

        <div style={{display: "flex"}}>
        <div className="space">
        <div className="inputBox">
          <input name="password" type={showPassword ? 'text' : 'password'} className="pw-box" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <span>Password</span>
 </div>
            </div>
            <FontAwesomeIcon
   icon={showPassword ? faEyeSlash : faEye}
   className="eye-icon"
   style={{ position: 'absolute', margin: '35px 333px', cursor: 'pointer'}}
   onClick={() => setShowPassword(!showPassword)}
 />
  
</div>
                  <div className="spaceTwo adjustTwo">
                      <p className="adjust-forgot-pw"  onClick={openModal}>Forgot Password?</p>
                  </div>
                  
                  <div className="space">
                    <button type="submit"  className="login-button"><b>Log In</b></button>    
                  </div>
                  <p className="signup">Don't have an account? <span onClick={openSignUpModal}>Sign Up</span></p>
                  
                      
      </form>
      </div>
      <p id="created">{message}</p>
      
      </div>
      {showSignUpModal && (
        <Modal onClose={closeSignUpModal}>
          <SignUp />
        </Modal>
      )}
      {showModal && (
        <Modal onClose={closeModal}>
          <ForgotPassword />
        </Modal>
      )}
    </div>
    </div>
    </>
  );
};


export default SignIn;