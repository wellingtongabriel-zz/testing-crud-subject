import firebase from "firebase/app";
import "firebase/messaging";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAe4nA3-JvX_V3lqFOx4nNacoZo-bbWGVc",
  authDomain: "apphealth-homolog.firebaseapp.com",
  databaseURL: "https://apphealth-homolog.firebaseio.com",
  projectId: "apphealth-homolog",
  storageBucket: "apphealth-homolog.appspot.com",
  messagingSenderId: "943782570527",
  appId: "1:943782570527:web:6ad2d93db9802238"
};

export const initializeFirebase = () => {
  firebase.initializeApp(config);
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      firebase.messaging().useServiceWorker(registration);
    });
};

export const askForPermissionToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    return {
      token: token
    };
  } catch (error) {
    return {
      error: error
    };
  }
};

export const getPushNotificationToken = async () => {
  const messaging = firebase.messaging();
  return messaging.getToken();
};
