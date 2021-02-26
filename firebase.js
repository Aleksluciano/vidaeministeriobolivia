import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAMxns2oUY-lGg17uH8A3PNsHHFfml-MEA",
  authDomain: "vidaeministerio-91da5.firebaseapp.com",
  projectId: "vidaeministerio-91da5",
  storageBucket: "vidaeministerio-91da5.appspot.com",
  messagingSenderId: "992671254413",
  appId: "1:992671254413:web:6d6f74cce071e42b8edfc4",
  measurementId: "G-229HJ15SPX"
};

firebase.initializeApp(firebaseConfig);

//firebase.functions().useEmulator("localhost",5001);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
export const callFirebaseFnJw = firebase.app().functions('southamerica-east1').httpsCallable("jw");

