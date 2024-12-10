import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuthStore } from './store';

export async function signUp(email: string, password: string, type: 'admin' | 'client') {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create a user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    type,
    createdAt: new Date().toISOString()
  });

  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setUserType(type);
  return user;
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Verify if user document exists and get user type
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }

  const userData = userDoc.data();
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setUserType(userData.type as 'admin' | 'client');
  return { user, type: userData.type };
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setUserType(null);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: any) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          useAuthStore.getState().setUser(user);
          useAuthStore.getState().setUserType(userData.type as 'admin' | 'client');
        } else {
          console.error('User document not found');
          useAuthStore.getState().setUser(null);
          useAuthStore.getState().setUserType(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setUserType(null);
      }
    } else {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setUserType(null);
    }
    if (callback) callback(user);
  });
}

export function initializeAuth() {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          useAuthStore.getState().setUser(user);
          useAuthStore.getState().setUserType(userData.type as 'admin' | 'client');
        } else {
          console.error('User document not found during initialization');
          useAuthStore.getState().setUser(null);
          useAuthStore.getState().setUserType(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setUserType(null);
      }
    } else {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setUserType(null);
    }
  });
}