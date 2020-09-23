import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import "firebase/performance"; // Add the Performance Monitoring library
import {firebaseConfig} from "./firebaseConfig"


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
  
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
  
    if (!snapshot.exists) {
      const { email, displayName, photoURL } = user;
      try {
        await userRef.set({
          displayName,
          email,
          photoURL,
          ...additionalData
        });
        await userRef.collection('read').doc('read').set({nextBooks: []});
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    return getUserDocument(user.uid);
  };
  
  const getUserDocument = async uid => {
    if (!uid) return null;
    try {
      const userDocument = await firestore.doc(`users/${uid}`).get();
  
      return {
        uid,
        ...userDocument.data()
      };
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

// Initialize Performance Monitoring and get a reference to the service
export const perf = firebase.performance();