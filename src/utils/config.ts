import { getApp, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
/**
 * The client ID used to authenticate with the backend API.
 * @type {string}
 */
export const clientID: string =
  "BKhcXAOCpBqCGBkLiyLNTGXeGOeBL2i1Wqr5ImBsM54mWhrNrrT4FeFv6ghT-arTTi3HCc6Jk8A-W3T5bSFHN-c";

/**
 * The Firebase configuration object.
 * @type {{
 *   apiKey: string,
 *   authDomain: string,
 *   databaseURL: string,
 *   projectId: string,
 *   storageBucket: string,
 *   messagingSenderId: string,
 *   appId: string,
 *   measurementId: string
 * }}
 */
const firebaseConfig = {
  apiKey: "AIzaSyBjCkRxvWFPm0O1x_X5jyTwdpERmKc7zpM",
  authDomain: "frietor-wallet.firebaseapp.com",
  databaseURL: "https://frietor-wallet-default-rtdb.firebaseio.com",
  projectId: "frietor-wallet",
  storageBucket: "frietor-wallet.appspot.com",
  messagingSenderId: "621102240407",
  appId: "1:621102240407:web:e7a933a945e2f48a25cfd2",
  measurementId: "G-TZ2BRV0VSY",
};

/**
 * The Firebase app instance.
 * @type {firebase.app.App}
 */
const app = initializeApp(firebaseConfig);

/**
 * The Firebase authentication service instance.
 * @type {Auth}
 */
const getFirebaseAuth = () => {
  if (Capacitor.isNativePlatform()) {
    return initializeAuth(getApp(), {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    return getAuth(app);
  }
};

getFirebaseAuth();
