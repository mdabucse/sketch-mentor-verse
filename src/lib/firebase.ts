
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCFqHwNqGk0Utiq2umPZ9hKny2ZnVNuci4",
  authDomain: "sketchmentor-6ec65.firebaseapp.com",
  projectId: "sketchmentor-6ec65",
  storageBucket: "sketchmentor-6ec65.firebasestorage.app",
  messagingSenderId: "984767234188",
  appId: "1:984767234188:web:7185264863e5d6eb3d3ba9",
  measurementId: "G-5LQ0VJCPGH"
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider for better popup handling
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export auth functions
export { signInWithPopup, signOut };
