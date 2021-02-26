import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyBhZ82oCvNOu_lkmGpWUeb3IaFB8nRSVkI",
  authDomain: "vidaeministerio-eede1.firebaseapp.com",
  projectId: "vidaeministerio-eede1",
  storageBucket: "vidaeministerio-eede1.appspot.com",
  messagingSenderId: "481772310998",
  appId: "1:481772310998:web:906cb4bac0b53cbd19d477",
  measurementId: "G-LN2GLY5B27"
};

firebase.initializeApp(firebaseConfig);

//firebase.functions().useEmulator("localhost",5001);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
export const callFirebaseFnJw = firebase.app().functions('southamerica-east1').httpsCallable("jw");

