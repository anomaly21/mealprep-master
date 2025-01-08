const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

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

// Middleware to verify JWT and extract user_id
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Request body received:', req.body); // Log incoming data
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { id: decoded.id }; // Attach user ID to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Verify JWT token
app.get('/api/verify', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: 'Token is valid', user: decoded });
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
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

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [
      username,
      email,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
      username,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
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
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch meals for a user
app.get('/api/meal-planner', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT * FROM meals WHERE user_id = $1 ORDER BY day', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching meals:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a meal for a user
app.post('/api/meal-planner', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { day, meal } = req.body;

  try {
    await db.query('INSERT INTO meals (day, meal, user_id) VALUES ($1, $2, $3)', [day, meal, userId]);
    res.status(201).json({ message: 'Meal added successfully' });
  } catch (err) {
    console.error('Error adding meal:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch recipes for a user
app.get('/api/recipes', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT * FROM recipes WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a recipe for a user
app.post('/api/recipes', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { title, ingredients } = req.body;

  try {
    await db.query('INSERT INTO recipes (title, ingredients, user_id) VALUES ($1, $2, $3)', [title, ingredients, userId]);
    res.status(201).json({ message: 'Recipe added successfully' });
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Serve React frontend for all non-API routes
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) { // Avoid intercepting API routes
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  } else {
    res.status(404).json({ message: 'API route not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
