import React, { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch server message for the authenticated user
    fetch('http://localhost:5000/api/test', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch message');
        }
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error('Error fetching message:', err);
        setError('Failed to load the welcome message.');
      });

    // Fetch all registered users (for admin or demo purposes)
    fetch('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Failed to load the user list.');
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-4">Welcome to MealPrep Master</h1>
        <p className="lead">
          Plan your meals, organize recipes, and streamline grocery shopping.
        </p>
        <div className="alert alert-primary mt-4" role="alert">
          {message || 'Fetching message from server...'}
        </div>
        {error && (
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-center">Registered Users</h3>
        {users.length > 0 ? (
          <ul className="list-group mt-3">
            {users.map((user) => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>{user.name}</strong> ({user.email})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted mt-3">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
