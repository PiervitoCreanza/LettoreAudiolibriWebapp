import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingAnim from '../components/LoadingAnim'
import {auth, signInWithGoogle, generateUserDocument} from '../firebase'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    try{
      const {user} = await auth.createUserWithEmailAndPassword(email, password);
      generateUserDocument(user, {displayName});
    }
    catch(error){
      setError('Error Signing up with email and password');
    }
      
    setEmail("");
    setPassword("");
    setDisplayName("");
  };
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value);
    }
  };
  return (
    <div className="vertical-center" style={{width: "100%"}}>
      <div className="welcome-login">
          <LoadingAnim height={280} width={280} className="logo-welcome" />
          <h1 style={{textAlign: "center"}}>Registrati</h1>        
      </div>
      <div className="wrapper">
        {error !== null && (
          <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
            {error}
          </div>
        )}
        <form className="">
          <input
            type="text"
            className="login-input"
            name="displayName"
            value={displayName}
            placeholder="Nome"
            id="displayName"
            onChange={event => onChangeHandler(event)}
          /><br/>
          <input
            type="email"
            className="login-input space-up"
            name="userEmail"
            value={email}
            placeholder="Email"
            id="userEmail"
            onChange={event => onChangeHandler(event)}
          /><br/>
          <input
            type="password"
            className="login-input space-up"
            name="userPassword"
            value={password}
            placeholder="Password"
            id="userPassword"
            onChange={event => onChangeHandler(event)}
          /><br/>
          <button
            className="space-up button login-input"
            onClick={event => {
              createUserWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Registrati
          </button>
        </form>
        <p className="text-center my-3">oppure</p>
        <button className="button login-input" onClick={signInWithGoogle}>
          Registrati con Google
        </button>
        <p className="text-center my-3">
          Hai già un account?{" "}
          <Link to="/" className="login-label-bold">Accedi</Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;