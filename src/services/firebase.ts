import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

// PamWill Firebase web app configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDq_N_X6_v7-Uy-1a5LazM8hjRFp1L_J84",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-projects-d261b.firebaseapp.com",
  databaseURL: "https://ai-projects-d261b-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-projects-d261b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-projects-d261b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "715519778537",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:715519778537:web:44591b95eabda9a1725a78",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q1G5CMLMB3"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google Popup using Firebase
 */
export async function firebaseSignInWithGoogle(): Promise<{ user: FirebaseUser | null; error: any }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    return { user: null, error };
  }
}

/**
 * Sign out from Firebase
 */
export async function firebaseSignOutUser(): Promise<boolean> {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    return false;
  }
}

/**
 * Listen to Firebase Auth state changes
 */
export function onFirebaseAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
