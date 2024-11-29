import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React, { useState, useEffect } from "react";

// LoginSuccessful is a function sent in by parent component
function LoginForm({ LoginEvent }) {
  const firebaseAPI = process.env.REACT_APP_FIREBASE_API_KEY;
  const firebaseConfig = {
    apiKey: firebaseAPI,
    authDomain: "project5frontend.firebaseapp.com",
    projectId: "project5frontend",
    storageBucket: "project5frontend.firebasestorage.app",
    messagingSenderId: "357864896411",
    appId: "1:357864896411:web:730b64e713cd072cef933e",
  };

  initializeApp(firebaseConfig);

  const [loggedUser, setLoggedUser] = useState("");

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // User signed in
        console.log("User signed in successfully with Google.");
        console.log("User Info:", result.user);
        setLoggedUser(result.user);
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error during sign-in:", error);
      });
  };

  function logoutGoogle() {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log("User successfully signed out.");
        setLoggedUser(null); // Clear local loggedUser state
        LoginEvent(null); // Notify the parent component (App.js) of logout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user);
        setLoggedUser(user);
        LoginEvent(user); // Notify App.js
      } else {
        console.log("No user is signed in.");
        setLoggedUser(null);
        LoginEvent(null); // Clear user in App.js
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [LoginEvent]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>English Teacher's Helper</h1>
      <div style={styles.card}>
        {loggedUser ? (
          <>
            <p style={styles.userInfo}>Welcome, {loggedUser.email}</p>
            <button onClick={logoutGoogle} style={styles.button}>
              Log Out
            </button>
          </>
        ) : (
          <button onClick={signInWithGoogle} style={styles.button}>
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f9",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  userInfo: {
    marginBottom: "20px",
    fontSize: "16px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default LoginForm;
