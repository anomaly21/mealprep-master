import React, { useState } from 'react';

const LandingPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input updated: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.password) {
      console.log('Form data is invalid:', formData);
      setErrorMessage('Username and password are required.');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isLogin
            ? { username: formData.username, password: formData.password }
            : formData
        ),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }

      if (isLogin) {
        if (data.token) {
          console.log('Login successful, token:', data.token);
          localStorage.setItem('token', data.token);
          setFormData({ username: '', email: '', password: '' }); // Clear the form state
          onLogin(); // Trigger login in the parent component
        } else {
          throw new Error('Token not provided in response');
        }
      } else {
        setSuccessMessage('Registration successful! Please log in.');
        setIsLogin(true);
        setErrorMessage('');
      }
    } catch (err) {
      console.error('Error during request:', err.message);
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Welcome to MealPrep Master</h1>
      <div className="card mx-auto mt-4" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h4 className="text-center">{isLogin ? 'Login' : 'Register'}</h4>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {isLogin ? (loading ? 'Logging in...' : 'Login') : (loading ? 'Registering...' : 'Register')}
            </button>
          </form>
          <div className="text-center mt-3">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setIsLogin(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setIsLogin(true);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
