import React, { Component } from 'react'
import ReactHowler from 'react-howler'
//import Loading from './Loading'
import raf from 'raf' // requestAnimationFrame polyfill
import Header from '../components/Header'
import Footer from '../components/Footer'
import {readingCompleted, getCurrentBook} from '../firestore'
import {auth} from "../firebase";

export default class AudioPlayer extends Component {

    constructor (props) {
        super(props)
        this.player = React.createRef();
        this.state = {
            playing: true,
            wasPlaying: false,
            loaded: false,
            loop: false,
            mute: false, // <------- change this
            volume: 1.0,
            canPlay: true,
            seek: {
                seconds: 0,
                hh: '00',
                mm: '00',
                ss: '00'
            },
            duration: {}
        }    
        
        this.renderSeekPos = this.renderSeekPos.bind(this) // Fix not a function error
    }    

    componentDidMount() {
        getCurrentBook().then(res => {
            if (res.status === 200) {
                this.setState({audio: res.data, pagination: res.data.chapter})
                console.log(res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    onLoad() {
        let duration = this.player.duration()
        this.setState({
            loaded: true,
            duration: {
                seconds: duration,
                hh: zeroFill(Math.floor(duration / 3600)),
                mm: zeroFill(Math.floor(duration / 60)),
                ss: zeroFill(Math.floor((duration % 60)))
            }
        })
    }
    
    renderSeekPos() {
        this.setState({
        seek: parseTime(this.player.seek())
        })

        this.state.playing && (this._raf = raf(this.renderSeekPos)) // If playing update seek
    }

    onPlay() {
        this.renderSeekPos()
    }

    onPause() {
        raf.cancel(this._raf) // Clear the loop called by renderSeekPos()
    }

    onEnd() {
        this.setState({playing: false})
            raf.cancel(this._raf) // Clear the loop called by renderSeekPos()

            readingCompleted(auth.currentUser.uid, this.state.audio).then(res => {
                console.log(res)
                if (res === "ok") {
                    say(
                        `Hai finito il capitolo numero ${
                        this.state.audio.chapter} su ${this.state.audio.totalChapters
                        } capitoli totali. Ti rimangono ${
                            this.state.audio.totalChapters - this.state.audio.chapter +1
                        } capitoli. Vuoi continuare a leggere? Se sì primi spazio, altrimenti mi spegnerò tra un minuto.`
                        )
                    document.addEventListener('keyup', () => {
                        speechSynthesis.cancel()
                        this.setState({canPlay: true})
                        let updatedState = this.state.audio
                        updatedState.chapter = updatedState.chapter + 1
                        this.setState({audio: updatedState})
                        this.setState({playing: true})
                    }, {once: true});
                } else  {
                    say(`Hai finito il capitolo numero ${this.state.audio.chapter} e hai terminato il libro. Ti è piaciuto?`)
                }

            })
    }

    componentWillUnmount () {
        raf.cancel(this._raf) // Clear the loop called by renderSeekPos()
    }   
    
    showMore() {
        if (this.state.pagination <= this.state.audio.totalChapters - 3) {
            this.setState({pagination: this.state.pagination + 2})
        } else {
            this.setState({pagination: 0})
        }     
    }
    
    render() {        
        return (
            <div className="page-container">
                <Header />
                <div className="content-wrap">
                    <div style={{maxWidth: 1160, margin: "0 auto"}} className="cf">                        
                        <div className="col-2_3 column cf">
                        <h3 className="menu-h3" style={{marginTop: 50}}>Ciao {this.props.user.displayName},</h3>
                        <h3 className="menu-h3">Leggiamo un po' insieme!</h3>
                        <h4 className="menu-h4">{`Ecco qui l'ultimo capitolo di: ${this.state.audio ? this.state.audio.name : "..."}.`}</h4>
                            <div className={`box-player ${!this.state.audio ? 'skeleton' : ''}`}>{ this.state.audio &&(
                                <div className='full-control' style={{width: "100%"}}>
                                    <ReactHowler
                                        src={this.state.audio.chapterList[this.state.audio.chapter -1].link}
                                        onLoad={() => this.onLoad()} onPlay={() => this.onPlay()} onPause={() => this.onPause()} onEnd={() => this.onEnd()}
                                        mute={this.state.mute} playing={this.state.playing} html5={true} ref={(ref) => {this.player = ref}}
                                    />
                                    <div className="flex-container"><div className="player-title-container"><h1 className="player-title">{(this.state.audio) ? this.state.audio.chapterList[this.state.audio.chapter -1].title : 'Loading'}</h1></div></div>
                                    <div className="player-group">
                                    <button id="playPause" className={`playPause ${this.state.playing ? "paused" : ""}`} onClick={() => this.setState({playing: !this.state.playing})}></button>
                                        <div className="player-seek left">
                                        <span className="digits">{(this.state.seek.hh === '00') ? this.state.seek.mm : this.state.seek.hh}</span>
                                        <span className="digits">:</span>
                                        <span className="digits">{(this.state.seek.hh === '00') ? this.state.seek.ss : this.state.seek.mm}</span>
                                        </div>
                                                            
                                        <div className='seek-container'>
                                        <input
                                            type='range'
                                            min='0'
                                            max={this.state.duration.seconds}
                                            step={0.000001}
                                            value={this.state.seek.seconds}
                                            onChange={e => this.setState({seek: parseTime(parseFloat(e.target.value))})}
                                            onMouseUp={() => {
                                                this.player.seek(this.state.seek.seconds)
                                                this.setState({playing: this.state.wasPlaying})
                                            }}
                                            onMouseDown={() => this.setState({playing: false, wasPlaying: this.state.playing})}
                                        />
                                        </div>
                                        <div className="player-seek right">
                                        <span className="digits">{(this.state.duration.hh === '00') ? this.state.duration.mm : this.state.duration.hh}</span>
                                        <span className="digits">:</span>
                                        <span className="digits">{(this.state.duration.hh === '00') ? this.state.duration.ss : this.state.duration.mm}</span>
                                        </div>                        
                                    </div>                                
                                    <h5 style={{textAlign: "center", margin: "5px 0px 15px"}}>{`Capitolo ${this.state.audio.chapter} su ${this.state.audio.totalChapters} totali`}</h5>            
                                </div>)}
                            </div>
                        </div>
                        <div className="col-1_3 column cf" style={{marginTop: 75}}>
                            <h3 className="menu-h3" style={{textAlign: "center"}}>Prossimi capitoli</h3>
                            <h4 className="menu-h4" style={{marginTop: 37}}>Ecco qui i prossimi capitoli che leggeremo insieme.</h4>
                            {this.state.audio ? this.state.audio.chapterList.slice(0+this.state.pagination,2+this.state.pagination).map((e, i) => {
                                return (
                                    <div className="simple-box scroll-box" style={{justifyContent: "center", height: 20, width: "calc(100% - 40px)", marginBottom: 10}} key={i}>
                                        <h1 className="flip-box-title" style={{fontSize: 30}}>{e.title}</h1>
                                    </div>
                                )
                            }): (
                                <div>
                                    <div className="simple-box scroll-box skeleton" style={{justifyContent: "center", height: 20, width: "calc(100% - 40px)", marginBottom: 10}}>
                                    </div>
                                    <div className="simple-box scroll-box skeleton" style={{justifyContent: "center", height: 20, width: "calc(100% - 40px)", marginBottom: 10}}>
                                    </div>
                                </div>
                            )}  
                            <button onClick={() => this.showMore()} className="simple-box" style={{justifyContent: "center", height: 74, backgroundColor: "#3e4dec", width: "100%", border: "none", color: "white", outline: "none"}}>
                                <h1 className="flip-box-title" style={{fontSize: 30, cursor: "pointer"}}>{this.state.audio && ((this.state.pagination <= this.state.audio.totalChapters - 3) ? "Mostra altri..." : "Mostra precedenti...")}</h1>
                            </button>                     
                        </div>
                        <div className="col-full column cf" style={{marginTop: 0}}>
                            <h3 className="menu-h3" style={{textAlign: "center", marginBottom: 30, marginTop: 30}}>Il tuo libro:</h3>
                            <div className={`simple-box ${!this.state.audio ? 'skeleton skeleton-fill' : ''}`}>
                                {this.state.audio && (
                                    <div style={{display: "flex"}}>
                                        <div style={{marginRight: 25, height: 150, marginBottom: -20}}>
                                            <img src={this.state.audio.cover} style={{height: 250, marginTop: -100}} alt="cover"/>
                                        </div>
                                        <div>
                                            <h1 className="flip-box-title" style={{margin: 0, width: "100%", fontSize: 40}}>{this.state.audio.name}</h1><br/>
                                            <p style={{textAlign: "justify", margin: 0, fontWeight: 300}}>{this.state.audio.description}</p>
                                        </div>
                                    </div>
                                )}                                    
                            </div>                                            
                        </div>
                        
                    </div>                    
                    
                </div>
                <Footer/>
            </div>
        )
    }
}

const zeroFill = (n) => {
    return ('0'+n).slice(-2)
}

const parseTime = (seconds) => {
    let hh = zeroFill(Math.floor(seconds / 3600))
    let mm = zeroFill(Math.floor(seconds / 60))
    let ss = zeroFill(Math.floor((seconds % 60)))
    return {hh, mm, ss, seconds}
}

function say(msg) {
    msg = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(msg);
}
/*
function sayPromise (text) { // Say text with promise
    say(text)
    return new Promise(resolve => {
        const id = setInterval(() => {
        if (speechSynthesis.speaking === false) {
            clearInterval(id);
            resolve();
        }
        }, 100);
    });
};*/