import React, { Component } from 'react'
import Login from './Login'
import AudioPlayer from './AudioPlayer'
import LoadingAnim from '../components/LoadingAnim'

export default class Home extends Component {
    render() {
        return (
            <div>
                { localStorage.getItem("user_id") ?
                <AudioPlayer userId={localStorage.getItem("user_id")}/> : <Login history={this.props.history}/> 
                }
            </div>
        )
    }
}

/*
{ localStorage.getItem("user_id") ?
                <AudioPlayer userId={localStorage.getItem("user_id")}/> : <Login history={this.props.history}/> 
                }*/