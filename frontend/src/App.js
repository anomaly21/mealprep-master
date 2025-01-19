import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Authenticated home page
import MealPlanner from './pages/MealPlanner';
import RecipeLibrary from './pages/RecipeLibrary';
import Login from './pages/Login'; // Login form
import Register from './pages/Register'; // Register form
import LandingPage from './pages/LandingPage'; // Unauthenticated landing page
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${BASE_URL}/api/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Token invalid');
          return response.json();
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [BASE_URL]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
  
      // Immediately set the authentication state
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error during login:', err.message);
      alert('Login failed: ' + err.message);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        {/* Default Route for unauthenticated users */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />
          }
        />

        {/* Authenticated Routes */}
        <Route
          path="/home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/meal-planner"
          element={
            isAuthenticated ? (
              <MealPlanner />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/recipe-library"
          element={
            isAuthenticated ? (
              <RecipeLibrary />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Register />
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
