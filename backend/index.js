const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // <- bcrypt remains the same
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.json());

// MSSQL configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // For Azure database or secure connection
    trustServerCertificate: true // Use this for self-signed certs
  }
};

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Backend running' });
});

// Signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const pool = await sql.connect(dbConfig); // Establishing connection to MSSQL

    const query = `INSERT INTO users (username, email, password) 
                    VALUES (@username, @email, @password)`;
    
    // Query execution with parameterized values
    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(query);

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    sql.close(); // Close connection to the DB
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const pool = await sql.connect(dbConfig);

    const query = 'SELECT * FROM users WHERE email = @email';
    
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(query);
    
    if (result.recordset.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = result.recordset[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    sql.close(); // Close the DB connection
  }
});

// Get all users (for admin/testing only)
app.get('/users', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const query = 'SELECT id, username, email, created_at FROM users';
    
    const result = await pool.request().query(query);
    res.json(result.recordset); // Accessing recordset from result
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    sql.close(); // Close connection
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));