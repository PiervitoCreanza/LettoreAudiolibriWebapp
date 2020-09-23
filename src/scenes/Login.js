import React, { Component } from 'react'
import axios from 'axios'
import LoadingAnim from '../components/LoadingAnim'
import { Link } from "react-router-dom";

export default class Login extends Component {

    state = {
        username: '',
        password: '',
        error:'',
        isUserOk: true,
        isPwdOk: true,
        buttonText: "",
        isLoading: false
    }
    handleChange = (e) => {
        let nam = e.target.name;
        let val = e.target.value;
        this.setState({[nam]: val});
      }

    signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
    };
    /*
      onSubmit = (e) => {
          console.log('submit')
          this.setState({isLoading: true})
          e.preventDefault()
          if (this.state.username && this.state.password) {
              let data = {
                  username: this.state.username, 
                  password: this.state.password
              }
              let headers = {
                headers: {
                    'Content-Type': 'application/json',
                }
              }
            axios.post('https://api.lettoreaudiolibri.it/login.php', data, headers).then(res => {
                this.setState({isLoading: false})
                if (res.data) {
                    if (res.data.user_id) {
                        localStorage.setItem("user_id", res.data.user_id);
                        localStorage.setItem('username', this.state.username)
                        //this.props.loggedIn(res.data.user_id)
                        this.props.history.push("/lettore");
                    } else if (res.data.message === "invalid password") {
                        this.setState({isPwdOk: false, buttonText: "Password errata."})                        
                    } else if (res.data.message === "invalid username"){
                        this.setState({isUserOk: false, buttonText: "Username errato."})
                    }
                } else {
                    this.setState({isUserOk: false, buttonText: "Errore sconosciuto."})
                }
                    
                });
          }
      }*/

      clearError = () => {
        this.setState({buttonText: "", isPwdOk: true, isUserOk: true})
      }

    render() {
        return (
            <div style={{position: "absolute", width: "100%", top: "40%", transform: 'translate(0, -40%)'}}>
                <div className="welcome-login">
                    <LoadingAnim height={280} width={280} />
                    <h1 style={{textAlign: "center"}}>Accedi</h1>        
                </div>
                <div className="wrapper">
                    <form id="login" onSubmit={this.onSubmit}>
                        <input 
                            onKeyDown={this.clearError} 
                            className={`login-input ${this.state.isUserOk ? "" : "false"}`} 
                            type="text" 
                            placeholder="Nome Utente" 
                            name="username" 
                            value={this.state.username} 
                            onChange={this.handleChange} 
                            required
                            />
                        <br/>
                        <input 
                            onKeyDown={this.clearError} 
                            className={`space-up login-input ${this.state.isPwdOk ? "" : "false"}`} 
                            type="password" 
                            placeholder="Password" 
                            id="pwd" 
                            name="password" 
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            required
                        />
                        <br/>     
                        <button disabled={this.state.isLoading} className="space-up button login-input" type="submit" id="button" style={{marginBottom: 15}}>
                            {this.state.buttonText ? this.state.buttonText : "Login"}
                            {this.state.isLoading && <i className="fa fa-refresh fa-spin" style={{ marginLeft: 10, marginTop: 3, position: "absolute"}} />}
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
                    </form>
                </div> 
            </div>
        )
    }
}