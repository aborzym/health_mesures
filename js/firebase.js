// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7LezTsWvWKuCSl9imt0UEqx905ExloHE",
  authDomain: "pomiary-zdrowotne.firebaseapp.com",
  projectId: "pomiary-zdrowotne",
  storageBucket: "pomiary-zdrowotne.firebasestorage.app",
  messagingSenderId: "344261190503",
  appId: "1:344261190503:web:fd07ef75175828d1c785c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
