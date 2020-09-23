import React, { Component } from 'react'
const logo = require('../img/logo.png')
// Required constants
const welcomeMessages = ['come va?', 'tutto bene?', 'oggi ti trovo bene', 'spero vada tutto bene', 'io sto bene e tu?', 'che bello poter trascorrere del tempo insieme']
const sentences = ['Ti ho già detto che mi piace molto leggere?', 'Non vedo lora dicontinuare a leggere!', 'Finalmente leggiamo qualcosa!', 'Questo libro mi sta appassionando', 'Che bel libro che stiamo leggendo!']
const userName = 'Pietro'
export default class Loading extends Component {
    componentDidMount() {
         //Get random element 
        var randomWelcome = randomItem(welcomeMessages);
        var randomSentence = randomItem(sentences);

        var d = new Date(); // Get date
        var h = d.getHours(); // Get hour

        var welcome
        switch (true) { // Choose what word to sat based on day hour
            case (h <13): 
                welcome = 'Buongiorno';    
                break;

            case (13<h<17):
                welcome = 'Buon pomeriggio'; 
                break;
            case (h>17):
                welcome = 'Buonasera'; 
                break;
            default:
                break;
        }
        let message =  `${welcome} ${userName}. ${randomWelcome}. ${randomSentence}`; // Ruturn the sentence
        //say(message) //
    }
    render() {
        return (
            <div>
                <div class="welcome-login">                    
                    <h1 style={{marginBottom: 0}}>Ciao Pietro,</h1>        
                    <h1 style={{marginTop: 0}}>Mi metto subito al lavoro!</h1>
                    <img class="logo-login" src={logo} alt="logo" /><br/>
                    <button className="button" style={{marginTop: 40}}>Esci</button>  
                </div>
            </div>
        )
    }
}

function say(msg) {
    msg = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(msg);
}

const randomItem = (list) => { // Pick random item from list
    return list[Math.floor(Math.random()*list.length)];
}