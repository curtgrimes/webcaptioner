import Vue from 'vue'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export default ({
  app
}, inject) => {
  const config = {
    apiKey: this.$env.FIREBASE_API_KEY,
    authDomain: this.$env.FIREBASE_AUTH_DOMAIN,
    databaseURL: this.$env.FIREBASE_DATABASE_URL,
    projectId: this.$env.FIREBASE_PROJECT_ID,
    storageBucket: this.$env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: this.$env.FIREBASE_SENDER_ID,
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  inject('firebase', firebase);
}
