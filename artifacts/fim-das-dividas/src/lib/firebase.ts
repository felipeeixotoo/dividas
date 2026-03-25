import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFY28sC2hN7Rny30n-9iB6eenfj1RijRU",
  authDomain: "controledividas-13747.firebaseapp.com",
  projectId: "controledividas-13747",
  storageBucket: "controledividas-13747.firebasestorage.app",
  messagingSenderId: "55868763850",
  appId: "1:55868763850:web:6c11be3a8a459d28468e33"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
