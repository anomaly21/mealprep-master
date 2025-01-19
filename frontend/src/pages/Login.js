import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state for redirect
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      await onLogin(username, password); // Call the login function passed as a prop
      setIsLoggedIn(true); // Update state to trigger redirect
    } catch (err) {
      setError('Invalid username or password. Please try again.'); // Display login error
    }
  };

  // Redirect to "/home" if logged in
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Login</h1>
      <form onSubmit={handleLogin} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      <div className="text-center mt-3">
        <p>
          Not a user?{' '}
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate('/register')}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
