import React, {useContext} from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProfilePage from "./Menu";
import PasswordReset from "./PasswordReset";
import AudioPlayer from '../scenes/AudioPlayer'
import { UserContext } from "../providers/UserProvider";


export default function Application() {
  const user = useContext(UserContext);
  console.log(user)
  
  return (
    user === "loading" ? <div className="dark-background" /> :
        (user) ? (        
        <Router>
          <Switch>
            <ProfilePage exact path="/" user={user} />
            <AudioPlayer exact path = "/lettore" user={user} />
          </Switch>          
        </Router>)
      :
        (
          <div className="dark-background">
            <Router>
              <Switch >
                <SignUp exact path="/signUp" />
                <SignIn exact path="/" />
                <PasswordReset exact path = "/passwordReset" />            
              </Switch>          
            </Router>
          </div>
        )

  );
}