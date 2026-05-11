import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUokPtAC3XFcjEl6xnmQrL66RVzYLgfT8",
  authDomain: "smarttaskreminder-7e593.firebaseapp.com",
  projectId: "smarttaskreminder-7e593",
  storageBucket: "smarttaskreminder-7e593.firebasestorage.app",
  messagingSenderId: "767354221022",
  appId: "1:767354221022:web:4b63d0222235ffa7186d4f",
  measurementId: "G-8FLQJ2XSN4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BBVHDSiW1NciBXaQhjzMiVE55XlpSBsWUOPXyOYuXHjHRNkNvxzg8WiASwaZ3FtUIPLwl4Dmp6zNU7jaZaRJr2c"
    });

    if (currentToken) {
      console.log("Token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.log("An error occurred while retrieving token.", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });