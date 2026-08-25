import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFv8tOdlI0CZK4imGEWfRmADICL8IzXHs",
  authDomain: "redacao-21727.firebaseapp.com",
  projectId: "redacao-21727",
  storageBucket: "redacao-21727.firebasestorage.app",
  messagingSenderId: "360612404153",
  appId: "1:360612404153:web:65b844557ab2e556697468"
};

const app = initializeApp(firebaseConfig);

export { app };