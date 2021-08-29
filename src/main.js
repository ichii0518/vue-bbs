import { createApp } from 'vue'
import App from './App.vue'

// Import the functions you need from the SDKs you need
import firebase from "firebase/app";

import router from './router'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlA3tJm0AhThqNAPmTaKsXx-2BXX-dZHM",
  authDomain: "vue-bbs-ed718.firebaseapp.com",
  projectId: "vue-bbs-ed718",
  storageBucket: "vue-bbs-ed718.appspot.com",
  messagingSenderId: "801096101771",
  appId: "1:801096101771:web:46c9cf21670e4435aac98e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ignoreUndefinedProperties: true});

createApp(App).use(router).mount('#app')
