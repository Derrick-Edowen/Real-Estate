const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();


// Middleware
app.use(cors());
app.use(express.json());


let pool;
 if (process.env.JAWSDB_URL) {
pool = mysql.createPool(process.env.JAWSDB_URL)
 } else
// Database connection pool
pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


// Login endpoint
app.post('/login', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [results] = await pool.execute('SELECT id FROM users WHERE id = 1 AND name = ? AND email = ? AND password = ?', [name, email, password]);
    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', userID: results[0].id });
    } else {
      res.json({ success: false, message: 'Incorrect email, name, or password' });
    }
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// Create a post
app.post('/posts',upload.single('image'), async (req, res) => {
  const { title, content, user_id, created_at } = req.body;
  const image = req.file; // This is the uploaded image file

  try {
    // Save the image to a directory on your server
    const imagePath = `/uploads/${image.filename}`;

    // Save the post data and image path to your database
    await pool.query('INSERT INTO posts (title, content, user_id, created_at, image) VALUES (?, ?, ?, ?, ?)', [title, content, 1, created_at, imagePath]);
    
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts for user with ID = 1
app.get('/posts', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM posts WHERE user_id = ?', [1]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// DELETE a post by ID and user ID
app.delete('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  const userId = 1; // Assuming user_id is always 1 in this case
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Post not found or does not belong to the user' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// API endpoints
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







