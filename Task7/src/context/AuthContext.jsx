import { createContext, useState, useEffect } from "react";
import {
  signUp,
  logIn,
  logInWithGoogle,
  logOut,
  subscribeToAuthChanges,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function runAction(action) {
    setError(null);
    try {
      return await action();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const value = {
    user,
    loading,
    error,
    clearError: () => setError(null),
    signUp: (email, password) => runAction(() => signUp(email, password)),
    logIn: (email, password) => runAction(() => logIn(email, password)),
    logInWithGoogle: () => runAction(() => logInWithGoogle()),
    logOut: () => runAction(() => logOut()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}