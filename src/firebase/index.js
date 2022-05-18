import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCLGMyTfa-CvDfQipxZz5uGsQQIQ6UmEZg",
    authDomain: "image-store-for-ecommerce-app.firebaseapp.com",
    projectId: "image-store-for-ecommerce-app",
    storageBucket: "image-store-for-ecommerce-app.appspot.com",
    messagingSenderId: "1058528197798",
    appId: "1:1058528197798:web:c922cc1ce5019e52eec867",
    measurementId: "G-QTTZHGF75J"
};

const firebaseApp = initializeApp(firebaseConfig);  
export const storageImage = getStorage(firebaseApp)