import React from "react";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Standup } from "./standups.interface";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export class Firebase {
  auth: firebase.auth.Auth;
  db: firebase.firestore.Firestore;
  standupCollection = "standups";

  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  // Auth API
  createUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  sendPasswordResetEmail = (email: string) =>
    this.auth.sendPasswordResetEmail(email);

  updatePassword = (password: string) =>
    this.auth.currentUser?.updatePassword(password);

  // Standup API
  // TODO: need to add security rules to be sure authenticated users can only perform
  // crud on its own data

  getStandups = ({
    userId,
    startDate,
    endDate,
    limit,
  }: {
    userId: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    // TODO: add more conditions for order by timestamp, date range, limit, etc.
    return this.db
      .collection(this.standupCollection)
      .where("userId", "==", userId)
      .get();
  };

  getStandupDetails = ({
    standupId,
    userId,
  }: {
    standupId: string;
    userId: string;
  }) =>
    this.db
      .collection(this.standupCollection)
      .where("id", "==", standupId)
      .where("userId", "==", userId)
      .get();

  createStandup = (standupToCreate: Omit<Standup, "id">) =>
    this.db.collection(this.standupCollection).add(standupToCreate);

  updateStandup = (updatedStandup: Standup) => {
    const { id, ...updatedStandupFields } = updatedStandup;
    return this.db
      .collection(this.standupCollection)
      .doc(id)
      .update({
        ...updatedStandupFields,
      });
  };

  deleteStandup = (standupId: string) =>
    this.db.collection(this.standupCollection).doc(standupId).delete();
}

export const FirebaseContext = React.createContext<Firebase>(null as any);
export default Firebase;
