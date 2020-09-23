import React from 'react';
import LoadingAnim from '../components/LoadingAnim'
import FlipBox from '../components/FlipBox'

function App() {
    const onClick = (e, bookId) => {
        console.log(bookId)
    }
  return (
    <div className="white-background" style={{backgroundColor: "white", top: 0, left: 0, right: 0, position: "absolute"}}>
        <nav className="menu-nav fixed-top" style={{display: "fixed", backgroundColor: "#192133", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <LoadingAnim width={100} height={100} />
                <h2 className="menu-title">Lettore Audiolibri</h2>
            </div>            
            <div className="box"><h3 className="box-text">Il mio profilo</h3></div>
        </nav>
        <div style={{maxWidth: 1160, margin: "0 auto"}} className="cf">
                <h3 className="menu-h3" style={{marginTop: 150}}>Ciao Piervito,</h3>
                <h3 className="menu-h3">Benvenuto nella tua home!</h3>
                <h4 className="menu-h4">Qui puoi gestire i tuoi libri e le tue impostazioni.</h4>
                <div className="col-2_3 column cf" style={{marginTop: 68}}>
                    <h5 className="menu-h5">Al momento stai leggendo:</h5>
                    <FlipBox 
                        title="Alexandros- il confine del mondo Vol- 3" 
                        description="Di Valerio massimo manfredi" 
                        backTitle="Sei arrivato al capitolo <b>15</b> su <b>67</b> capitoli totali."
                        backDescription="ANNULLA LA LETTURA"
                        bookId={1234}
                        clickEvent={onClick}
                    />                        
                </div>
                <div className="col-1_3 column cf sticky-col" >
                    <h3 className="menu-h3" style={{textAlign: "center"}}>Aggiungi un libro</h3>
                    <h4 className="menu-h4">Vuoi leggere qualcos’altro? Inserisci i dati del tuo nuovo audiolibro.</h4>
                    <div style={{backgroundColor: "#192133", height: 200, borderRadius: 5, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center"}}>
                        <div className="add-form-container">
                            <input className="add-input" placeholder="Inserisci l'id del libro"/>
                            <button className="button add-button" style={{marginTop: 15}}>Aggiungi libro</button>
                        </div>
                    </div>                        
                </div>
                <div className="col-2_3 column cf" style={{textAlign: "center", marginTop: 50}}>
                    <h3 className="menu-h3">Verifica i libri in coda</h3>
                    <h4 className="menu-h4">Non ricordi cosa hai aggiunto alla coda? Eccola qui.</h4>
                    <FlipBox 
                        title="Alexandros- il confine del mondo Vol- 3"
                        backTitle="Sei arrivato al capitolo <b>15</b> su <b>67</b> capitoli totali."
                        backDescription="ANNULLA LA LETTURA"
                    />
                    <FlipBox 
                        title="Alexandros- il confine del mondo Vol- 3"
                        backTitle="Sei arrivato al capitolo <b>15</b> su <b>67</b> capitoli totali."
                        backDescription="ANNULLA LA LETTURA"
                    />
                    <FlipBox 
                        title="Alexandros- il confine del mondo Vol- 3"
                        backTitle="Sei arrivato al capitolo <b>15</b> su <b>67</b> capitoli totali."
                        backDescription="ANNULLA LA LETTURA"
                    />
                    <FlipBox 
                        title="Alexandros- il confine del mondo Vol- 3"
                        backTitle="Sei arrivato al capitolo <b>15</b> su <b>67</b> capitoli totali."
                        backDescription="ANNULLA LA LETTURA"
                    />
                </div>
        </div>
        <footer className="menu-nav" style={{backgroundColor: "#192133", width: "100%", marginTop: 70, paddingTop: 20, marginBottom: -21}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <LoadingAnim width={70} height={70} />
                <h2 className="menu-title">Lettore Audiolibri</h2>
            </div>
            <h4>© 2019 - 2020 LettoreAudiolibri | All Rights Reserved.</h4>
        </footer>         
    </div>
  );
}

export default App;