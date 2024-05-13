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
const server = http.createServer(app); // Create HTTP server
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//API CODE//
const maxRequestsPerSecond = 1;
const maxQueueSize = 250; // Increase queue size to handle more requests
const delayBetweenRequests = 1000 / maxRequestsPerSecond; // Adjust delay for optimization


const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
  });

  ws.send('connected');
});

// Send progress updates
function sendProgressUpdate(progress) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ progress }));
    }
  });
}

const requestQueue = [];
let isProcessing = false;

async function handleLeaseSearch(req, res) {
  try {


    // Handle the search logic here based on the request body
    const { address, state, page, country, sort, propertyType, minPrice, maxPrice, maxBeds, maxBaths } = req.body;

    const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    // Fetch latitude and longitude from Google Maps
    const geocodeResponse = await axios.get(geocodeUrl);
    const { results } = geocodeResponse.data;
    if (!results || results.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lng } = results[0].geometry.location;

    // Fetch lease listings from Zillow
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: 'ForRent',
        home_type: propertyType,
        sort: sort,
        rentMinPrice: minPrice,
        rentMaxPrice: maxPrice,
        bathsMin: maxBaths,
        bedsMin: maxBeds
      },
      headers: {
        'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    });

    // Fetch additional info and images for each property
    const leaseListings = estateResponse.data.props;
    if (!leaseListings || leaseListings.length === 0) {
      res.json({
        success: true,
        data: {
          estate: {
            props: [],
            schools: {}, // Assuming schools data should also be empty
            resultsPerPage: 0,
            totalPages: 0,
            totalResultCount: 0,
            currentPage: 1
          }
        }
      });
      return;
    }
    const infoDataArray = [];
    const imageUrlsArray = [];

    const fetchPropertyData = async (zpid) => {
      const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
      const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

      const propertyResponse = await axios.get(propertyUrl, {
        params: { zpid },
        headers: {
          'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });

      // Introduce a delay before making the second request
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

      const imageResponse = await axios.get(imagesUrl, {
        params: { zpid },
        headers: {
          'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });

      return { property: propertyResponse.data, images: imageResponse.data };
    };

    for (let i = 0; i < leaseListings.length; i++) {
      const zpid = leaseListings[i].zpid;
      const { property, images } = await fetchPropertyData(zpid);

      // Use property and images data as needed
      infoDataArray.push({ ...property, images });
      imageUrlsArray.push(images);

      if (i < leaseListings.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
        sendProgressUpdate((i + 1) / leaseListings.length); // Send progress update
      }
    }

    // Prepare and send response
    const responseData = {
      lat,
      lng,
      estate: estateResponse.data,
      leaseListings: infoDataArray,
      leaseImages: imageUrlsArray

    };
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching lease listings:', error);
    res.status(500).json({ error: 'Failed to fetch lease listings' });
  }
}

// For Sale - Initial
async function handleForSaleSearch(req, res) {
  try {


    // Handle the search logic here based on the request body
    const { address, state, page, country, sort, propertyType, minPrice, maxPrice, maxBeds, maxBaths } = req.body;

    const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    // Fetch latitude and longitude from Google Maps
    const geocodeResponse = await axios.get(geocodeUrl);
    const { results } = geocodeResponse.data;
    if (!results || results.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lng } = results[0].geometry.location;

    // Fetch lease listings from Zillow
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: 'ForSale',
        home_type: propertyType,
        sort: sort,
        minPrice: minPrice,
        maxPrice: maxPrice,
        bathsMin: maxBaths,
        bedsMin: maxBeds
      },
      headers: {
        'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    });

    // Fetch additional info and images for each property
    const leaseListings = estateResponse.data.props;
    if (!leaseListings || leaseListings.length === 0) {
      res.json({
        success: true,
        data: {
          estate: {
            props: [],
            schools: {}, // Assuming schools data should also be empty
            resultsPerPage: 0,
            totalPages: 0,
            totalResultCount: 0,
            currentPage: 1
          }
        }
      });
      return;
    }
    const infoDataArray = [];
    const imageUrlsArray = [];

    const fetchPropertyData = async (zpid) => {
      const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
      const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

      const propertyResponse = await axios.get(propertyUrl, {
        params: { zpid },
        headers: {
          'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });

      // Introduce a delay before making the second request
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

      const imageResponse = await axios.get(imagesUrl, {
        params: { zpid },
        headers: {
          'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });

      return { property: propertyResponse.data, images: imageResponse.data };
    };

    for (let i = 0; i < leaseListings.length; i++) {
      const zpid = leaseListings[i].zpid;
      const { property, images } = await fetchPropertyData(zpid);

      // Use property and images data as needed
      infoDataArray.push({ ...property, images });
      imageUrlsArray.push(images);

      if (i < leaseListings.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
        sendProgressUpdate((i + 1) / leaseListings.length); // Send progress update
      }
    }

    // Prepare and send response
    const responseData = {
      lat,
      lng,
      estate: estateResponse.data,
      leaseListings: infoDataArray,
      leaseImages: imageUrlsArray

    };
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching lease listings:', error);
    res.status(500).json({ error: 'Failed to fetch lease listings' });
  }
}

// Recently Sold
async function handleRecentlySoldSearch(req, res) {
  try {


    // Handle the search logic here based on the request body
    const { address, state, page, country, sort, propertyType, minPrice, maxPrice, maxBeds, maxBaths } = req.body;

    const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    // Fetch latitude and longitude from Google Maps
    const geocodeResponse = await axios.get(geocodeUrl);
    const { results } = geocodeResponse.data;
    if (!results || results.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lng } = results[0].geometry.location;

    // Fetch lease listings from Zillow
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: 'RecentlySold',
        home_type: propertyType,
        sort: sort,
        minPrice: minPrice,
        maxPrice: maxPrice,
        bathsMin: maxBaths,
        bedsMin: maxBeds
      },
      headers: {
        'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    });

    // Fetch additional info and images for each property
    const leaseListings = estateResponse.data.props;
    if (!leaseListings || leaseListings.length === 0) {
      res.json({
        success: true,
        data: {
          estate: {
            props: [],
            schools: {}, // Assuming schools data should also be empty
            resultsPerPage: 0,
            totalPages: 0,
            totalResultCount: 0,
            currentPage: 1
          }
        }
      });
      return;
    }
    const infoDataArray = [];
    const imageUrlsArray = [];

    const fetchPropertyData = async (zpid) => {
      const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
      const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';

      const propertyResponse = await axios.get(propertyUrl, {
        params: { zpid },
        headers: {
          'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });

      // Introduce a delay before making the second request
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

      const imageResponse = await axios.get(imagesUrl, {
        params: { zpid },
        headers: {
          'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        }
      });

      return { property: propertyResponse.data, images: imageResponse.data };
    };

    for (let i = 0; i < leaseListings.length; i++) {
      const zpid = leaseListings[i].zpid;
      const { property, images } = await fetchPropertyData(zpid);

      // Use property and images data as needed
      infoDataArray.push({ ...property, images });
      imageUrlsArray.push(images);

      if (i < leaseListings.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
        sendProgressUpdate((i + 1) / leaseListings.length); // Send progress update
      }
    }

    // Prepare and send response
    const responseData = {
      lat,
      lng,
      estate: estateResponse.data,
      leaseListings: infoDataArray,
      leaseImages: imageUrlsArray

    };
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching lease listings:', error);
    res.status(500).json({ error: 'Failed to fetch lease listings' });
  }
}

// Middleware to limit requests and add them to the queue
app.post('/api/search-listings-lease', async (req, res) => {
  addToQueue(req, res, handleLeaseSearch);
});

app.post('/api/search-listings-forsale', async (req, res) => {
  addToQueue(req, res, handleForSaleSearch);
});

app.post('/api/search-listings-recentlySold', async (req, res) => {
  addToQueue(req, res, handleRecentlySoldSearch);
});
app.post('/api/geocode', async (req, res) => {
  const { address } = req.body;
  const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM'; // Replace with your Google Maps API key
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

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
function addToQueue(req, res, handler) {
  if (requestQueue.length >= maxQueueSize) {
    res.status(429).json({ error: 'Too Many Requests' });
  } else {
    requestQueue.push({
      handler: handler,
      req: req,
      res: res
    });
    processQueue(); // Start processing immediately
  }
}

// Function to process requests from the queue
async function processQueue() {
  if (requestQueue.length > 0 && !isProcessing) {
    isProcessing = true;
    const { handler, req, res } = requestQueue.shift();
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Error processing request:', error);
    }
    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, delayBetweenRequests);
  }
}

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
  console.log(`Server is listening on port ${PORT}`);
});
 