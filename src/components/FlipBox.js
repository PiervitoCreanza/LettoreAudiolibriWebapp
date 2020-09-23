import React, {Component} from 'react'
import {CalcFlipBoxesEqualHeights} from './CalcFlipBoxesEqualHeights'

export default class FlipBox extends Component {
    flipBoxRef = null
    descriptionClick = (e) => {
        if (this.props.clickEvent && this.props.book) {
            this.props.clickEvent(e, this.props.book)
        } else if (this.props.clickEvent) {
            this.props.clickEvent()
        }
    }

    componentDidMount() {
        CalcFlipBoxesEqualHeights(this.flipBoxRef)
        setTimeout(()=> {
            CalcFlipBoxesEqualHeights(this.flipBoxRef)
        }, 100)
        setTimeout(()=> {
            CalcFlipBoxesEqualHeights(this.flipBoxRef)
        }, 500)

        window.addEventListener('resize', CalcFlipBoxesEqualHeights(this.flipBoxRef))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', CalcFlipBoxesEqualHeights(this.flipBoxRef))
        clearInterval(this.interval)
    }

    render() {
        return (
            <div className="flip-box" style={{marginBottom: 15}} ref = {ref => this.flipBoxRef = ref}>
                <div className="flip-box-inner">
                    <div className="flip-box-front">
                    <h1 className="flip-box-title" style={{margin: 0, width: "100%"}}>{this.props.title}</h1><br/>
                    <h3>{this.props.description}</h3>
                    </div>
                    <div className="flip-box-back">
                    {this.props.backTitle && <h4 style={{margin: 0, fontWeight: 600, flexBasis: "100%"}}>{this.props.backTitle}</h4> && <br/>}
                    <h3 onClick={this.descriptionClick}>{this.props.backDescription}</h3>
                    </div>
                </div>
            </div>
        )
    }
    
}