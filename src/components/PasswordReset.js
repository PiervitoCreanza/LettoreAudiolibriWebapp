import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingAnim from '../components/LoadingAnim'
import { auth } from "../firebase";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    }
  };
  const sendResetEmail = event => {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true)
      })
      .catch((err) => {        
        if (err.code === "auth/user-not-found") {
          setError("Email non trovata!")
        } else {
          setError("Errore!")
        }
        console.log(err)
        error ? console.log('true') : console.log('false')
      });
  };
  return (
    <div className="vertical-center" style={{width: "100%"}}>
      <div className="welcome-login">
        <LoadingAnim height={280} width={280} />
        <h1 style={{textAlign: "center"}}>Recupero</h1>        
      </div>
      <div className="wrapper">
        <form action="">
          {emailHasBeenSent && (
            <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
              An email has been sent to you!
            </div>
          )}
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            value={email}
            placeholder="Inserisci la tua email"
            onChange={onChangeHandler}
            className={`login-input ${error ? "false" : ""}`}
          /><br/>
          <button className="space-up button login-input" onClick={event => {sendResetEmail(event)}}>{error ? error : "Recupera la password"}</button>
        </form>
        <div className="space-up">
          <Link to ="/" className="login-label-bold">&larr; Torna al login</Link>
        </div>        
      </div>        
    </div>
  );
};
export default PasswordReset;