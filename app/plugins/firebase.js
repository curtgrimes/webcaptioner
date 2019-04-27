import Vue from 'vue'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export default ({
  app
}, inject) => {
  const config = {
    apiKey: app.$env.FIREBASE_API_KEY,
    authDomain: app.$env.FIREBASE_AUTH_DOMAIN,
    databaseURL: app.$env.FIREBASE_DATABASE_URL,
    projectId: app.$env.FIREBASE_PROJECT_ID,
    storageBucket: app.$env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: app.$env.FIREBASE_SENDER_ID,
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  inject('firebase', firebase);
}
