import React, { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch server message
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching message:', err));

    // Fetch users from database
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to MealPrep Master</h1>
      <p className="lead">Plan your meals, organize recipes, and streamline grocery shopping.</p>
      <div className="alert alert-primary mt-4" role="alert">
        {message || 'Fetching message from server...'}
      </div>
      <div className="mt-5">
        <h3>Users</h3>
        {users.length > 0 ? (
          <ul className="list-group">
            {users.map(user => (
              <li key={user.id} className="list-group-item">
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
