import React, { Component } from 'react'
import LoadingAnim from '../components/LoadingAnim'
import {auth} from "../firebase";
import {Link, withRouter} from 'react-router-dom'
class Header extends Component {
    state = {
        loaded: false,
        buttonText: "",
        isMenuOpen: false
    }

    render() {
        return (
            <div style={{height: 100}}>
                <nav className="menu-nav menu-full-width fixed-header">
                    <div className="container">
                        <div className="menu-full-width" style={{backgroundColor: "#192133", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <LoadingAnim width={100} height={100} />
                                <h2 className="menu-title">Lettore Audiolibri</h2>
                            </div>
                            <div style={{display:"flex", alignItems: "center"}}> 
                                <Link style={{marginRight: 25}} className="nav-box" to={this.props.location.pathname === "/" ? "/lettore" : "/"}><h3 className="box-text" style={{cursor: "pointer"}}>{this.props.location.pathname === "/" ? "Lettore" : "Il mio profilo"}</h3></Link>   
                                <div className="box nav-box"><h3 className="box-text" style={{cursor: "pointer"}} onClick = {() => {auth.signOut()}}>Esci</h3></div>
                            </div>                                                        
                            <i className="fa fa-bars fa-2x nav-mobile" style={{color: "#3e4dec"}} onClick={() => this.setState({isMenuOpen: !this.state.isMenuOpen})}></i>
                        </div>
                        <div ref={(ref) => this.mobileMenuRef=ref} className={`nav-mobile menu-full-width closed cf ${this.state.isMenuOpen ? "open" : "closed"}`} style={{backgroundColor: "#192133"}}>                        
                            <Link to="/lettore"><div className="box" style={{justifyContent: "center", textDecoration: "none", width: "100%"}}><h3 className="box-text" >Lettore</h3></div></Link>
                            <div className="box" style={{justifyContent: "center", marginTop:10, marginBottom: 25, width: "100%"}}><h3 className="box-text" onClick = {() => {auth.signOut()}}>Esci</h3></div>
                        </div>
                    </div>              
                </nav>
            </div>
        )
    }
}

export default withRouter(Header)
