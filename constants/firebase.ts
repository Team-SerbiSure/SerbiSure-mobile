import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    // @ts-ignore
    getReactNativePersistence,
    initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Using the same credentials as your web system
const firebaseConfig = {
    apiKey: "AIzaSyDK4gJB0xbrtlg6RVJ-MUn8MrcAmWWCC8g",
    authDomain: "serbisure-970bc.firebaseapp.com",
    projectId: "serbisure-970bc",
    storageBucket: "serbisure-970bc.firebasestorage.app",
    messagingSenderId: "933039253892",
    appId: "1:933039253892:web:f3b2edc64cd29730efd5d1",
    measurementId: "G-P23KBEL3NR"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-appropriate persistence
export const auth = Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

export const db = getFirestore(app);

export default app;
