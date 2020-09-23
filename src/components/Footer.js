import React, { Component } from 'react'
import LoadingAnim from '../components/LoadingAnim'
import {Link} from 'react-router-dom'

export default class Footer extends Component {
    render() {
        return (
            <footer className="menu-full-width" style={{backgroundColor: "#192133", /*width: "calc(100% - 60px)", marginTop: 70, paddingTop: 20, marginBottom: -21*/}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <LoadingAnim width={70} height={70} />
                    <Link to="/lettore"><h2 className="menu-title">Lettore Audiolibri</h2></Link>
                </div>
                <h4>© 2019 - 2020 LettoreAudiolibri | All Rights Reserved.</h4>
            </footer>
        )
    }
}
