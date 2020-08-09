import React, { useContext, useEffect, useState } from "react";
import { Firebase, FirebaseContext } from "./services/firebase";

type AuthUser = firebase.User | null;

export interface UseAuthHook {
  user: firebase.User | null;
}

export const UserContext = React.createContext<AuthUser>(null);

export const useAuth = (): UseAuthHook => {
  const firebase = useContext(FirebaseContext);

  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    // Listen for auth state changes and keep track of the logged in user or
    // set the user to null if the user isn't logged in
    const unsubscribe = (firebase as Firebase).auth.onAuthStateChanged(
      (authUser: firebase.User | null) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      }
    );

    // Unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [firebase]);

  return {
    user,
  };
};

export interface UseAuthSessionHook {
  user: AuthUser;
}

export const useAuthSession = (): UseAuthSessionHook => {
  const user = useContext(UserContext);

  return {
    user,
  };
};
