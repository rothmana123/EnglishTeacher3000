import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import LoginForm from './LoginForm';
import AuthorListComponent from './AuthorListComponent';
import AuthorDetailComponent from './AuthorDetailComponent';
import FeedbackComponent from './FeedbackComponent'; // Import FeedbackComponent

function App() {
  
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    console.log('User logged in:', user);
    setUser(user);
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log('User successfully signed out.');
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <Router>
      <div>
        {user ? (
          <Routes>
            <Route
              path="/"
              element={<AuthorListComponent onLogout={handleLogout} />}
            />
            <Route path="/author/:id" element={<AuthorDetailComponent />} />
            <Route
              path="/feedback"
              element={<FeedbackComponent onLogout={handleLogout} />}
            /> {/* FeedbackComponent route */}
          </Routes>
        ) : (
          <div>
            <h1>Login</h1>
            <LoginForm LoginEvent={handleLogin} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
