import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from '../img/loading-infinite-loop.json'

export default class LoadingAnim extends Component {

    render(){

        const defaultOptions = {
          loop: true,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        };
    
        return(
          <div className={this.props.className}>
            <Lottie options={defaultOptions}
              isClickToPauseDisabled={true}
              height={this.props.height}
              width={this.props.width}                          
            />
          </div>
        )
    }
}