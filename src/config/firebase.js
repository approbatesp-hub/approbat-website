import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChS7WWeOxCBmtT_jWg-9OF6RXuoCgnnnU",
  authDomain: "approbat-a5393.firebaseapp.com",
  projectId: "approbat-a5393",
  storageBucket: "approbat-a5393.appspot.com",
  messagingSenderId: "299262559236",
  appId: "1:299262559236:web:020bb0ee8fde6c86492151",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
