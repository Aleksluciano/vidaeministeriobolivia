import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDNGiJVz0lPSIOXY8nYVv_zMNOvtq8YDrk",
  authDomain: "vidaeministerio-e4bf6.firebaseapp.com",
  projectId: "vidaeministerio-e4bf6",
  storageBucket: "vidaeministerio-e4bf6.appspot.com",
  messagingSenderId: "484949252041",
  appId: "1:484949252041:web:9e71bf0fe21f0dfc4aba18",
  measurementId: "G-04S9HB806X"
};

firebase.initializeApp(firebaseConfig);

//firebase.functions().useEmulator("localhost",5001);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
export const callFirebaseFnJw = firebase.app().functions('southamerica-east1').httpsCallable("jw");

