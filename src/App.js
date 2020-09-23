import React from 'react';
//import logo from './logo.svg';
import './App.css';/*
import Login from './scenes/Login'
import AudioPlayer from './scenes/AudioPlayer'
import Loading from './scenes/Loading'
import Home from './scenes/Home'
import Menu from './scenes/Menu'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link
} from "react-router-dom";*/
import Application from "./components/Application";
import UserProvider from "./providers/UserProvider";

function App() {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}

/*
function App() {
  return (
    <Router>
      <div className="App">        
        <Switch>     
          <Route exact path="/" component={Home} />
          <Route exact path="/menu" component={Menu} />
          <Route exact path="/login" component={Login} style={{height: "100%"}}/>
          <Route exact path="/loading" component={Loading} />
          <Route exact path="/lettore" component={AudioPlayer} userId={localStorage.getItem("user_id")}/>/>
        </Switch>        
      </div>      
    </Router>
  );
}*/

export default App;
/*
{ localStorage.getItem("user_id") ?
        <AudioPlayer userId={localStorage.getItem("user_id")}/> : <Login/> 
        }*/