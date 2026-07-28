// Firebase client SDK — this file only ever runs in the browser (it's imported
// from "use client" components). Never import this from server actions or
// server components; use firebase-admin on the backend for that.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId;

if (!hasFirebaseConfig) {
  console.warn(
    "[firebase] Missing NEXT_PUBLIC_FIREBASE_* env vars. Firebase client features will be disabled."
  );
}

// Avoid re-initializing on hot reload / multiple imports.
export const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : ({} as ReturnType<typeof initializeApp>);

export const firebaseAuthClient = hasFirebaseConfig
  ? getAuth(firebaseApp)
  : ({} as unknown as ReturnType<typeof getAuth>);

export const googleProvider = hasFirebaseConfig
  ? new GoogleAuthProvider()
  : (null as unknown as GoogleAuthProvider);
