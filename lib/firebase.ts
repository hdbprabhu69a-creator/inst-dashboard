import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "inst-dashboard-6e9c6.firebaseapp.com",
  projectId: "inst-dashboard-6e9c6",
  storageBucket: "inst-dashboard-6e9c6.firebasestorage.app",
  messagingSenderId: "603362675367",
  appId: "1:603362675367:web:53e45dc59dd9ca90bca982"
};

export const app = initializeApp(firebaseConfig);