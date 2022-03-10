import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDKDawdUstTl-fv_oJVECip5zRN5GwFQxg',
  authDomain: 'arrevents-8a198.firebaseapp.com',
  projectId: 'arrevents-8a198',
  storageBucket: 'arrevents-8a198.appspot.com',
  messagingSenderId: '698362174483',
  appId: '1:698362174483:web:a2f1ccd05328d94845b3e6',
};

// export const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
