import React, {useState} from "react";
import { Link } from "react-router-dom";
import LoadingAnim from '../components/LoadingAnim'
import {auth, signInWithGoogle} from '../firebase'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const signInWithEmailAndPasswordHandler = (event,email, password) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email, password).catch(error => {
      setError("Error signing in with password and email!");
        console.error("Error signing in with password and email", error);
      });
    };

      const onChangeHandler = (event) => {
          const {name, value} = event.currentTarget;

          if(name === 'userEmail') {
              setEmail(value);
          }
          else if(name === 'userPassword'){
            setPassword(value);
          }
      };

  return (
    <div className="vertical-center" style={{width: "100%"}}>
      <div className="welcome-login">
        <LoadingAnim height={280} width={280} />
        <h1 style={{textAlign: "center"}}>Accedi</h1>        
      </div>
      <div className="wrapper">
        {error !== null && <div className = "py-4 bg-red-600 w-full text-white text-center mb-3">{error}</div>}
        <form style={{maxWidth: 300, margin: "0 auto", padding: "0 30px"}}>
          <input
            type="email"
            className="login-input"
            name="userEmail"
            value = {email}
            placeholder="Nome Utente o Email"
            id="userEmail"
            onChange = {(event) => onChangeHandler(event)}
          /><br/>
          <input
            type="password"
            className="space-up login-input"
            name="userPassword"
            value = {password}
            placeholder="Password"
            id="userPassword"
            onChange = {(event) => onChangeHandler(event)}
          /><br/>
          <button className="space-up button login-input" onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password); console.log('ok') }}>
            Accedi
          </button>
        </form>
        <p className="text-center my-3">oppure</p>
        <button
          className="button login-input" onClick={signInWithGoogle}> 
          Accedi con Google
        </button>
        <p className="text-center my-3">
        Non hai un account?{" "}
          <Link to="signUp" className="login-label-bold">
          Registrati!
          </Link>{" "}
          <br />{" "}
          <Link to = "passwordReset" className="login-label-bold">
          Problemi di accesso?
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignIn;