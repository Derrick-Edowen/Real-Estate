const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const serviceKey = path.join(__dirname, './mykey.json')
const WebSocket = require('ws');
const app = express();
const http = require('http');
const { v4: uuidv4 } = require('uuid'); // Using the 'uuid' package to generate unique IDs
const Bottleneck = require('bottleneck');
const server = http.createServer(app); // Create HTTP server
const PORT = process.env.PORT || 3001;


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//API CODE//
/*
const maxRequestsPerSecond = 2;
const delayBetweenRequests = 1300 / maxRequestsPerSecond; // Adjust delay for optimization

const limiter = new Bottleneck({
  maxConcurrent: maxRequestsPerSecond,
  minTime: 1100 / maxRequestsPerSecond,
});

const wss = new WebSocket.Server({ server });
const clients = new Map(); // Use a Map to store clients with a unique identifier

// Define the request queue
const requestQueue = [];
let isProcessing = false;

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.id) {
      clients.set(data.id, ws);
    }
  });

  ws.on('close', () => {
    for (let [key, value] of clients.entries()) {
      if (value === ws) {
        clients.delete(key);
        break;
      }
    }
  });
});

function getOrCreateWebSocket(id) {
  return clients.get(id);
}

async function handlePropertySearch(req) {
  const id = req.body.id; // Ensure the request contains a unique identifier
  const ws = getOrCreateWebSocket(id); // Ensure WebSocket is open

  if (!ws) {
    console.error('WebSocket not found for id:', id);
    return;
  }

  try {
    const { address, state, page, type, sort, minPrice, maxPrice, maxBeds, maxBaths } = req.body; // Ensure req.body is parsed correctly
    let status = '';
    let rentMinPrice, rentMaxPrice, saleMinPrice, saleMaxPrice;

    if (type === 1) {
      status = 'ForRent';
      rentMinPrice = minPrice;
      rentMaxPrice = maxPrice;
    } else if (type === 2) {
      status = 'ForSale';
      saleMinPrice = minPrice;
      saleMaxPrice = maxPrice;
    } else if (type === 3) {
      status = 'RecentlySold';
      saleMinPrice = minPrice;
      saleMaxPrice = maxPrice;
    }

    const estateResponse = await limiter.schedule(() => axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: status,
        sort: sort,
        home_type: 'Houses, Townhomes',
        rentMinPrice: rentMinPrice,
        rentMaxPrice: rentMaxPrice,
        minPrice: saleMinPrice,
        maxPrice: saleMaxPrice,
        bathsMin: maxBaths,
        bedsMin: maxBeds,
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    }));

    const leaseListings = estateResponse.data.props;
    const zpidListings = estateResponse.data;

    if (!leaseListings || leaseListings.length === 0) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ success: true, noResults: true, message: "No Listings Found" }));
        ws.close();
      }
      return;
    }

    const zpidData = { zpids: zpidListings };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(zpidData));  // Send data incrementally
    }

    const fetchPropertyData = async (zpid) => {
      try {
        const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
        const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

        const propertyResponse = await limiter.schedule(() => axios.get(propertyUrl, {
          params: { zpid },
          headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
          },
        }));

        const imageResponse = await limiter.schedule(() => axios.get(imagesUrl, {
          params: { zpid },
          headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
          },
        }));

        const data = { property: propertyResponse.data, images: imageResponse.data };

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));  // Send data incrementally
        }

        return data;
      } catch (error) {
        console.error(`Error fetching data for zpid ${zpid}:`, error.message);
        return null;
      }
    };

    const fetchPropertyDataPromises = leaseListings.map((listing) => fetchPropertyData(listing.zpid));
    await Promise.all(fetchPropertyDataPromises);

    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  } catch (error) {
    console.error('Error fetching lease listings:', error);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ error: 'Failed to fetch lease listings' }));
      ws.close();
    }
  }
}

// Middleware to limit requests and add them to the queue
app.use(express.json());
app.post('/api/search-listings', (req, res) => {
  addToQueue(req, res, handlePropertySearch);
  res.sendStatus(200); // Immediate response to acknowledge receipt
});

function addToQueue(req, res, handler) {
  requestQueue.push({ req, res, handler });
  processQueue();
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const { req, res, handler } = requestQueue.shift();
    handler(req, res);
    await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
  }

  isProcessing = false;
}*/
const maxRequestsPerSecond = 1;
const delayBetweenRequests = 1000 / maxRequestsPerSecond; // Adjust delay for optimization

const limiter = new Bottleneck({
  maxConcurrent: maxRequestsPerSecond,
  minTime: 1000 / maxRequestsPerSecond,
});

const wss = new WebSocket.Server({ server });
const clients = new Map(); // Use a Map to store clients with a unique identifier

// Define the request queue
const requestQueue = [];
let isProcessing = false;

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.id) {
      clients.set(data.id, ws);
    }
  });

  ws.on('close', () => {
    for (let [key, value] of clients.entries()) {
      if (value === ws) {
        clients.delete(key);
        break;
      }
    }
  });
});

function getOrCreateWebSocket(id) {
  return clients.get(id);
}

async function handlePropertySearch(req) {
  const id = req.body.id;
  const ws = getOrCreateWebSocket(id);

  if (!ws) {
    console.error('WebSocket not found for id:', id);
    return;
  }

  try {
    const { address, state, page, type, tier, sort, minPrice, maxPrice, maxBeds, maxBaths } = req.body;
    let status = '';
    let rentMinPrice, rentMaxPrice, saleMinPrice, saleMaxPrice;

    if (type === 1) {
      status = 'ForRent';
      rentMinPrice = minPrice;
      rentMaxPrice = maxPrice;
    } else if (type === 2) {
      status = 'ForSale';
      saleMinPrice = minPrice;
      saleMaxPrice = maxPrice;
    } else if (type === 3) {
      status = 'RecentlySold';
      saleMinPrice = minPrice;
      saleMaxPrice = maxPrice;
    }

    const estateResponse = await limiter.schedule(() => axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: status,
        sort: sort,
        home_type: tier,
        rentMinPrice: rentMinPrice,
        rentMaxPrice: rentMaxPrice,
        minPrice: saleMinPrice,
        maxPrice: saleMaxPrice,
        bathsMin: maxBaths,
        bedsMin: maxBeds,
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    }));

    const leaseListings = estateResponse.data.props;
    const totalResultCount = estateResponse.data.totalResultCount;
    const zpidListings = estateResponse.data;

    if (!leaseListings || leaseListings.length === 0 || totalResultCount === 0) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ success: true, noResults: true, message: "No Listings Found" }));
        ws.close();
      }
      return;
    }

    const zpidData = { zpids: zpidListings };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(zpidData));  // Send data incrementally
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  } catch (error) {
    console.error('Error fetching lease listings:', error);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ error: 'Failed to fetch lease listings' }));
      ws.close();
    }
  }
}

// New endpoint to fetch property details and images
async function handleFetchPropertyDetails(req, res) {
  const { zpid } = req.body;

  try {
    const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
    const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

    const propertyResponse = await limiter.schedule(() => axios.get(propertyUrl, {
      params: { zpid },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    }));

    const imageResponse = await limiter.schedule(() => axios.get(imagesUrl, {
      params: { zpid },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    }));

    const data = { property: propertyResponse.data, images: imageResponse.data };

    res.json(data);
  } catch (error) {
    console.error(`Error fetching data for zpid ${zpid}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch property details and images' });
  }
}

app.post('/api/fetch-property-details', handleFetchPropertyDetails);

app.use(express.json());
app.post('/api/search-listings', (req, res) => {
  addToQueue(req, res, handlePropertySearch);
  res.sendStatus(200); // Immediate response to acknowledge receipt
});

function addToQueue(req, res, handler) {
  requestQueue.push({ req, res, handler });
  processQueue();
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const batch = requestQueue.splice(0, clients.size); // Process as many requests as there are clients
    const handlers = batch.map(({ req, res, handler }) => handler(req, res));
    await Promise.all(handlers);
    await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
  }

  isProcessing = false;
}

app.post('/nearby-details', nearbyPropertyDetails);

async function nearbyPropertyDetails(req, res) {
  const zpid = req.body.zpid;

  try {
    const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
    const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

    const propertyResponse = await axios.get(propertyUrl, {
      params: { zpid },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    });

    const imageResponse = await axios.get(imagesUrl, {
      params: { zpid },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    });

    const data = {
      property: propertyResponse.data,
      images: imageResponse.data,
    };

    res.json(data);
  } catch (error) {
    console.error(`Error fetching data for zpid ${zpid}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch property details' });
  }
}

app.post('/api/geocode', async (req, res) => {
  const { address } = req.body;
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching the data' });
  }
});

//DATABASE CODE
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
app.get('/bio', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT bio FROM users WHERE id = ?', [1]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bio:', error);
    res.status(500).json({ error: 'Failed to fetch bio' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/bio', async (req, res) => {
  let connection;
  const { bio } = req.body;
  try {
    connection = await pool.getConnection();
    await connection.execute('UPDATE users SET bio = ? WHERE id = ?', [bio, 1]);
    res.json({ success: true, message: 'Bio updated successfully' });
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ error: 'Failed to update bio' });
  } finally {
    if (connection) connection.release();
  }
});
app.get('/banner', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT banner FROM users WHERE id = ?', [1]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/banner', async (req, res) => {
  let connection;
  const { banner } = req.body;
  try {
    connection = await pool.getConnection();
    await connection.execute('UPDATE users SET banner = ? WHERE id = ?', [banner, 1]);
    res.json({ success: true, message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/message', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT message FROM users WHERE id = ?', [1]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/message', async (req, res) => {
  let connection;
  const { message } = req.body;
  try {
    connection = await pool.getConnection();
    await connection.execute('UPDATE users SET message = ? WHERE id = ?', [message, 1]);
    res.json({ success: true, message: 'Message updated successfully' });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/email', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT email FROM users WHERE id = ?', [1]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/email', async (req, res) => {
  let connection;
  const { email } = req.body;
  try {
    connection = await pool.getConnection();
    await connection.execute('UPDATE users SET email = ? WHERE id = ?', [email, 1]);
    res.json({ success: true, message: 'Email updated successfully' });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/phone', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT phone FROM users WHERE id = ?', [1]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching phone:', error);
    res.status(500).json({ error: 'Failed to fetch phone' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/phone', async (req, res) => {
  let connection;
  const { phone } = req.body;
  try {
    connection = await pool.getConnection();
    await connection.execute('UPDATE users SET phone = ? WHERE id = ?', [phone, 1]);
    res.json({ success: true, message: 'Phone updated successfully' });
  } catch (error) {
    console.error('Error updating phone:', error);
    res.status(500).json({ error: 'Failed to update phone' });
  } finally {
    if (connection) connection.release();
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

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
 