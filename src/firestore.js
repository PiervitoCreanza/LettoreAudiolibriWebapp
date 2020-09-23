import {auth, firestore as db} from './firebase'
import firebase from 'firebase/app';
import 'firebase/firestore';
import axios from 'axios';

const mediaServerUri = "https://www.libroparlato.org/media-server/v1/"
export const apiUri = "https://api.lettoreaudiolibri.tk"

export const getCurrentBook = async => {
    return new Promise(async function (resolve, reject) {
        auth.currentUser.getIdToken(true).then((authtoken) => {
            axios.post(apiUri, {action: "currentBook"}, {headers: {authtoken}}).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    });
}

export const getNextBooks = async uid => {
    return new Promise(async function (resolve, reject) {
        db.collection('users').doc(uid).collection('read').doc('data').get().then(doc => {
            if (doc.exists) {
                console.log(doc.data())
                let nextBooks = doc.data().nextBooks
                if (nextBooks) {
                    if (nextBooks.length) {
                        axios.get(`${mediaServerUri}books/${nextBooks[0].id}/chapters`, {
                            headers: {Authorization: `Bearer ${auth.bearer}`}
                        }).then(res => {
                            res = JSON.parse(res)
                            var batch = db.batch()
                            var userDataRef = db.collection('users').doc(uid).collection('read').doc('data')
                            batch.update(userDataRef, {"currentBook": {...nextBooks[0], chapter: 1, chapterList: res}})
                            batch.update(userDataRef, {"nextBooks": firebase.firestore.FieldValue.arrayRemove({...nextBooks[0]})})
                            batch.commit()
                        }).catch(err => {
                            reject(err)
                        })
                    }
                    resolve(doc.data().nextBooks)
                }            
            } else {
                reject('doc does not exist')
            }
        }).catch(err => {
            reject(err)
        })
    });
}

export const readingCompleted = async (uid, currentBook) => {
    return new Promise(async function (resolve, reject) {
        console.log(currentBook.totalChapters, currentBook.chapter)
        if (currentBook.totalChapters > currentBook.chapter) {
            db.collection('users').doc(uid).collection('read').doc('data').update({
                "currentBook.chapter": firebase.firestore.FieldValue.increment(1)
            });
            resolve('ok')
        } else {
            removeCurrentBook(uid)
            resolve('completed')
        }
    })
}

export const getDashboardData = async uid => {
    db.collection('users').doc(uid).collection('read').doc('data').onSnapshot(doc => {
        if (doc.exists) {
            if (doc.data().currentBook) {
                console.log('current', doc.data().currentBook)
                return doc.data()
            } else {
                console.log('set new book')
                auth.currentUser.getIdToken(true).then((authtoken) => {
                    axios.post(apiUri, {action: "setNextBook"}, {headers: {authtoken}})
                })
            }
        } else {
            return 'doc does not exist'
        }
    })
}
/*
export const addBook = async (uid, bookId) => {
    return new Promise(async function (resolve, reject) {
        let url = `https://www.libroparlato.org/cilp-repository/${bookId}/marker.txt`
        
        rp(url).then(result => {
            let lines = result.split(/\r\n|\r|\n/)
            let author = lines[1].toLowerCase().trim().split(', ')
            let book = {
                id: bookId,
                name: lines[2],
                author: author[1].charAt(0).toUpperCase() + author[1].slice(1) 
                + ' ' + author[0].charAt(0).toUpperCase() + author[0].slice(1),
                totalChapters: lines[6].trim()
            }
            db.collection('users').doc(uid).collection('read').doc('data').update({
                "nextBooks": firebase.firestore.FieldValue.arrayUnion({
                    id: book.id,
                    name: book.name,
                    author: book.author,
                    totalChapters: book.totalChapters 
                })
            })
            .then(()=> {resolve(book)})
            .catch((err) => {reject(err)})
        }).catch(err => {
            if (err.statusCode === 404) {
                reject(404)
            } else {
                reject(err)
            }
        })
    })
}*/

export const removeBook = async (uid, book) => {
    return new Promise(async function (resolve, reject) {
        db.collection('users').doc(uid).collection('read').doc('data').update({
            "nextBooks": firebase.firestore.FieldValue.arrayRemove(book)
        })
            .then(()=> {resolve()})
            .catch((err) => {reject(err)})
    })
}

export const removeCurrentBook = async (uid) => {
    return new Promise(async function (resolve, reject) {
        db.collection('users').doc(uid).collection('read').doc('data').update({
            "currentBook": firebase.firestore.FieldValue.delete()
        })
            .then(() => resolve())
            .catch((err) => {reject(err)})
    })
}