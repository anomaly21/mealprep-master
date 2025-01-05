const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const SECRET_KEY = process.env.SECRET_KEY;

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => {
    console.error('Database connection error:', err.stack);
    process.exit(1);
  });

app.use(cors());
app.use(bodyParser.json());

// Test API endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS current_time');
    res.json({ message: 'Database connection successful', time: result.rows[0].current_time });
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, username AS name, email FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Hash and store a password
app.post('/api/hash-password', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
      username,
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error hashing password:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
