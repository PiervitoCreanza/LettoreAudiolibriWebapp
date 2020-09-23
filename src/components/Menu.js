import React, {Component} from 'react';
import FlipBox from '../components/FlipBox'
import firebase from 'firebase/app';
import {auth, firestore as db} from "../firebase";
import axios from 'axios'
import {removeBook, removeCurrentBook, apiUri} from '../firestore'
import Header from '../components/Header'
import Footer from '../components/Footer'

class Menu extends Component {
    state = {
        loaded: false,
        buttonText: "",
        isMenuOpen: false
    }

    addBookRef = null
    mobileMenuRef = null

    componentDidMount() {
        console.log('ok')
        auth.currentUser.getIdToken(true).then((authtoken) => {
            console.log(authtoken)
        })
        let uid = auth.currentUser.uid
        db.collection('users').doc(uid).collection('read').doc('data').onSnapshot(doc => {
            if (doc.exists) {
                let docData = doc.data()
                if (docData.currentBook) {
                    console.log('current', doc.data().currentBook)
                    this.setState({currentBook: docData.currentBook, nextBooks: docData.nextBooks, loaded: true})
                } else if (docData.nextBooks){
                    if (docData.nextBooks.length) {
                        var batch = db.batch()
                        var userDataRef = db.collection('users').doc(uid).collection('read').doc('data')
                        batch.update(userDataRef, {"currentBook": {...docData.nextBooks[0], chapter: 1}})
                        batch.update(userDataRef, {"nextBooks": firebase.firestore.FieldValue.arrayRemove({...docData.nextBooks[0]})})
                        batch.commit()
                    } else {
                        console.log('Coda vuota')
                        this.setState({currentBook: {isEmpty: true}})
                    }
                } else {
                    console.log('Db compromesso')
                }
            } else {
                console.log('doc does not exist')
            }
        })

        document.addEventListener('mousedown', this.handleClickOutside); // Detect click outside menu to close it
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.mobileMenuRef && !this.mobileMenuRef.contains(event.target) && this.state.isMenuOpen) {
            this.toggleMenu()
        }
    }

    toggleMenu = () => {
        this.setState({isMenuOpen: !this.state.isMenuOpen})
    }

    removeBook = (e, book) => {
        removeBook(auth.currentUser.uid, book)
    }
    removeCurrentBook = (e, book) => {
        removeCurrentBook(auth.currentUser.uid)
    }

    addBook = (e) => {
        e.preventDefault()
        let bookId = e.target.bookId.value
        if (bookId) {
            auth.currentUser.getIdToken(true).then((authtoken) => {
                axios.post(apiUri, {action: "addBook", bookId}, {headers: {authtoken}}).then(res => {
                    if (res.data) {
                        console.log(res.data)
                        if (res.data.message === "invalid id") {
                            console.log('err')
                            this.setState({buttonText: "ID non valido"})
                        }
                    }                    
                });
            })
        }
    }

    clearErr = () => {this.setState({buttonText: ""})}
    highlightAdd = () => {
        console.log(this.addBookRef)
        if (document.documentElement.clientWidth <= 1155) {
            this.addBookRef.scrollIntoView({behavior: 'smooth'})
            //window.scrollTo(0, this.addBookRef.offsetTop)
        }
    }
    render() {
        return (
            <div className="page-container" /*style={{backgroundColor: "white", top: 0, left: 0, right: 0, position: "absolute"}}*/>
                <Header />
                <div className="content-wrap">
                    <div style={{maxWidth: 1160, margin: "0 auto"}} className="cf">
                            <h3 className="menu-h3" style={{marginTop: 50}}>Ciao {this.props.user.displayName},</h3>
                            <h3 className="menu-h3">Benvenuto nella tua home!</h3>
                            <h4 className="menu-h4">Qui puoi gestire i tuoi libri e le tue impostazioni.</h4>
                            <div className="col-2_3 column cf" style={{marginTop: 68}}>
                                <h5 className="menu-h5">Al momento stai leggendo:</h5>
                                {this.state.loaded && !this.state.currentBook.isEmpty && 
                                    this.state.currentBook ? <FlipBox 
                                    title={this.state.currentBook.name}
                                    description={`Di ${this.state.currentBook.author}`} 
                                    backTitle={`Sei arrivato al capitolo ${this.state.currentBook.chapter} su ${this.state.currentBook.totalChapters} capitoli totali.`}
                                    backDescription="ANNULLA LA LETTURA"
                                    book={this.state.currentBook}
                                    clickEvent={this.removeCurrentBook}
                                /> : <FlipBox 
                                title="Nessun Audiolibro"
                                backTitle={`Non ti è rimasto nessun libro da leggere.`}
                                backDescription="AGGIUNGI UN LIBRO ALLA CODA"
                                clickEvent={this.highlightAdd}
                            />}                       
                            </div>
                            <div className="col-1_3 column cf sticky-col" ref={ (ref) => this.addBookRef=ref }>
                                <h3 className="menu-h3" style={{textAlign: "center"}}>Aggiungi un libro</h3>
                                <h4 className="menu-h4">Vuoi leggere qualcos’altro? Inserisci i dati del tuo nuovo audiolibro.</h4>
                                <div style={{backgroundColor: "#192133", height: 200, borderRadius: 5, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center"}}>
                                    <form onSubmit={this.addBook} className="add-form-container">
                                        <input onChange={this.clearErr} className={`add-input ${this.state.buttonText ? "false" : ""}`} name="bookId" placeholder="Inserisci l'id del libro"/>
                                        <button className="button add-button" style={{marginTop: 15}}>{this.state.buttonText ? this.state.buttonText : "Aggiungi libro"}</button>
                                    </form>
                                </div>                        
                            </div>
                            { this.state.loaded && (
                                <div className="col-2_3 column cf" style={{textAlign: "center", marginTop: 50}}>
                                    <h3 className="menu-h3">Verifica i libri in coda</h3>
                                    <h4 className="menu-h4">Non ricordi cosa hai aggiunto alla coda? Eccola qui.</h4>
                                    {this.state.nextBooks.map((e, index) => {
                                        return (
                                            <FlipBox 
                                                title={e.name}
                                                backDescription="ANNULLA LA LETTURA"
                                                clickEvent={this.removeBook}
                                                book={e}
                                                key={index}
                                            />
                                        )
                                    })}
                                </div>)
                            }
                            
                    </div>
                </div>                
                <Footer />         
            </div>
          );
    }
}
/*
function App() {
    const [data, setData] = useState({});

    const user = useContext(UserContext);
    if (isEmpty(data)) {
        auth.currentUser.getIdToken(true)
        .then((authtoken) => {
            axios.post('http://localhost:8080', {action: "dashboardData"}, {headers: {authtoken}}).then(res => {
                setData(res.data)
                console.log('this is what we got:', data)
                console.log('this is the res:', res.data)
            });
        })
    } else {
        console.log('we already have data')
    }
    

    

    const {photoURL, displayName, email} = user;
    const onClick = (e, bookId) => {
        console.log(bookId)
    }
  return (
    <div className="white-background" style={{backgroundColor: "white", top: 0, left: 0, right: 0, position: "absolute"}}>
        <nav className="menu-nav menu-full-width fixed-top" style={{display: "fixed", backgroundColor: "#192133", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <LoadingAnim width={100} height={100} />
                <h2 className="menu-title">Lettore Audiolibri</h2>
            </div>            
            <div className="box"><h3 className="box-text" onClick = {() => {auth.signOut()}}>Esci</h3></div>
        </nav>
        <div style={{maxWidth: 1160, margin: "0 auto"}} className="cf">
                <h3 className="menu-h3" style={{marginTop: 150}}>Ciao {displayName},</h3>
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
        <footer className="menu-full-width" style={{backgroundColor: "#192133", width: "100%", marginTop: 70, paddingTop: 20, marginBottom: -21}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <LoadingAnim width={70} height={70} />
                <h2 className="menu-title">Lettore Audiolibri</h2>
            </div>
            <h4>© 2019 - 2020 LettoreAudiolibri | All Rights Reserved.</h4>
        </footer>         
    </div>
  );
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}*/

export default Menu;