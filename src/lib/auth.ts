import { getAuthClient } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

export const signInEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(getAuthClient(), email, password);

export const signUpEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(getAuthClient(), email, password);

export const signOutUser = () => signOut(getAuthClient());

export const signInGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuthClient(), provider);
};

export const listenAuth = (cb: (user: User | null) => void) =>
  onAuthStateChanged(getAuthClient(), cb);