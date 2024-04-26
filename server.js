const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const serviceKey = path.join(__dirname, './mykey.json')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let pool;
if (process.env.JAWSDB_URL) {
  pool = mysql.createPool(process.env.JAWSDB_URL);
} else {
  // Database connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}
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





const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'estate-405518',
});

const bucketName = 'realestate-images'; // Replace 'your-bucket-name' with your actual bucket name
const bucket = storage.bucket(bucketName);

// Create a post
const upload = multer({ storage: multer.memoryStorage() });

app.post('/posts', upload.single('image'), async (req, res) => {
  const { title, content, user_id, created_at } = req.body;
  const image = req.file; // This is the uploaded image file
  try {
    // Upload the image to Google Cloud Storage
    const fileName = `${Date.now()}_${image.originalname}`;
    const file = bucket.file(fileName);

    await file.save(image.buffer, {
      public: true,
      contentType: image.mimetype,
    });

    // Get the public URL of the uploaded image
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    // Save the image URL to your database
    await pool.query('INSERT INTO posts (title, content, user_id, created_at, image) VALUES (?, ?, ?, ?, ?)', [title, content, 1, created_at, imageUrl]);

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
    // Fetch the post from the database to get the image URL
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found or does not belong to the user' });
    }
    const post = rows[0];
    const imageUrl = post.image;
    const fileName = imageUrl.split('/').pop(); // Extract the filename from the image URL

    // Delete the post from the database
    const result = await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    if (result.affectedRows > 0) {
      // Delete the image from Google Cloud Storage
      const bucketName = 'realestate-images'; // Replace with your bucket name
      await storage.bucket(bucketName).file(fileName).delete();

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
