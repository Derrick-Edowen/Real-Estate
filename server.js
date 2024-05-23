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
const Bottleneck = require('bottleneck');
const server = http.createServer(app); // Create HTTP server
const PORT = process.env.PORT || 3001;
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1500
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
/*
app.use((req, res, next) => {
  if (req.headers.host.slice(0, 4) !== 'www.') {
    res.redirect(301, 'https://www.' + req.headers.host + req.url);
  } else {
    next();
  }
});*/
//API CODE//
const maxRequestsPerSecond = 2;
const maxQueueSize = 2000; // Increase queue size to handle more requests
const delayBetweenRequests = 1000 / maxRequestsPerSecond; // Adjust delay for optimization

const wss = new WebSocket.Server({ server });
const clients = [];

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  clients.push(ws);
  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1);
  });
  ws.send('connected');
});

// Send data updates
function sendDataUpdate(data) {
  clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'data', data }));
    }
  });
}

const requestQueue = [];
let isProcessing = false;

async function handleLeaseSearch(ws, req) {
  try {
    const { address, state, page, sort, minPrice, maxPrice, maxBeds, maxBaths } = req.body; // Already parsed by bodyParser

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;
    const geocodeResponse = await axios.get(geocodeUrl);
    const { results } = geocodeResponse.data;
    if (!results || results.length === 0) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: 'Location not found' }));
        ws.close();
      }
      return;
    }
    const { lat, lng } = results[0].geometry.location;

    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: 'ForRent',
        sort: sort,
        home_type: 'Houses, Townhomes',
        rentMinPrice: minPrice,
        rentMaxPrice: maxPrice,
        bathsMin: maxBaths,
        bedsMin: maxBeds
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    });

    const leaseListings = estateResponse.data.props;
    const zpidListings = estateResponse.data;
    if (!leaseListings || leaseListings.length === 0) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ success: true, data: { estate: { props: [], schools: {}, resultsPerPage: 0, totalPages: 0, totalResultCount: 0, currentPage: 1 } } }));
        ws.close();
      }
      return;
    }
    const zpidData = { zpids: zpidListings };

    // Log data being sent
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
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        }));

        const imageResponse = await limiter.schedule(() => axios.get(imagesUrl, {
          params: { zpid },
          headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        }));

        const data = { property: propertyResponse.data, images: imageResponse.data };

        // Log data being sent
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));  // Send data incrementally
        }

        return data;
      } catch (error) {
        console.error(`Error fetching data for zpid ${zpid}:`, error.message);
        return null;
      }
    };

    for (let i = 0; i < leaseListings.length; i++) {
      const zpid = leaseListings[i].zpid;
      await fetchPropertyData(zpid);
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ success: true, done: true })); // Indicate end of data transmission
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

// For Sale - Initial
async function handleForSaleSearch(req, res) {
  try {
    const { address, state, page, sort, minPrice, maxPrice, maxBeds, maxBaths } = req.body;

    const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    // Fetch latitude and longitude from Google Maps
    const geocodeResponse = await axios.get(geocodeUrl);
    const { results } = geocodeResponse.data;
    if (!results || results.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lng } = results[0].geometry.location;

    // Fetch for sale listings from Zillow
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: 'ForSale',
        sort: sort,
        home_type: 'Houses, Townhomes',
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

    const forSaleListings = estateResponse.data.props;
    if (!forSaleListings || forSaleListings.length === 0) {
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
      try {
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
        await delay(delayBetweenRequests);

        const imageResponse = await axios.get(imagesUrl, {
          params: { zpid },
          headers: {
            'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        });

        return { property: propertyResponse.data, images: imageResponse.data };
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error(`Rate limit exceeded. Waiting for ${delayBetweenRequests} milliseconds before retrying...`);
          await delay(delayBetweenRequests);
          return fetchPropertyData(zpid); // Retry the request
        } else {
          console.error(`Error fetching data for zpid ${zpid}:`, error.message);
          return null; // Return null if there's an error
        }
      }
    };

    const validForSaleListings = forSaleListings.filter(listing => !isNaN(listing.zpid)); // Filter out invalid zpids
    const validListingsCount = validForSaleListings.length;

    for (let i = 0; i < validForSaleListings.length; i++) {
      const zpid = validForSaleListings[i].zpid;
      const data = await fetchPropertyData(zpid);

      if (data) {
        infoDataArray.push({ ...data.property, images: data.images });
        imageUrlsArray.push(data.images);
      } else {
        // Remove the invalid listing from the forSaleListings array to ensure proper order
        validForSaleListings.splice(i, 1);
        i--; // Adjust the index to account for the removed element
      }

      if (i < validForSaleListings.length - 1) {
        await delay(delayBetweenRequests);
        sendProgressUpdate((i + 1) / validForSaleListings.length); // Send progress update
      }
    }

    // Prepare and send response
    const responseData = {
      lat,
      lng,
      estate: {
        ...estateResponse.data,
        props: validForSaleListings, // Ensure props only contains valid listings
        totalResultCount: infoDataArray.length // Update the totalResultCount to match the valid listings count
      },
      forSaleListings: infoDataArray,
      forSaleImages: imageUrlsArray
    };
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching for sale listings:', error);
    res.status(500).json({ error: 'Failed to fetch for sale listings' });
  }
}
// Recently Sold
async function handleRecentlySoldSearch(req, res) {
  try {
    const { address, state, page, sort, minPrice, maxPrice, maxBeds, maxBaths } = req.body;

    const apiKey = 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    // Fetch latitude and longitude from Google Maps
    const geocodeResponse = await axios.get(geocodeUrl);
    const { results } = geocodeResponse.data;
    if (!results || results.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lng } = results[0].geometry.location;

    // Fetch recently sold listings from Zillow
    const estateResponse = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
      params: {
        location: `${address},${state}`,
        page: page,
        status_type: 'RecentlySold',
        sort: sort,
        home_type: 'Houses, Townhomes',
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

    const recentlySoldListings = estateResponse.data.props;
    if (!recentlySoldListings || recentlySoldListings.length === 0) {
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
      try {
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
        await delay(delayBetweenRequests);

        const imageResponse = await axios.get(imagesUrl, {
          params: { zpid },
          headers: {
            'X-RapidAPI-Key': 'f2d3bb909amsh6900a426a40eabep10efc1jsn24e7f3d354d7',
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        });

        return { property: propertyResponse.data, images: imageResponse.data };
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error(`Rate limit exceeded. Waiting for ${delayBetweenRequests} milliseconds before retrying...`);
          await delay(delayBetweenRequests);
          return fetchPropertyData(zpid); // Retry the request
        } else {
          console.error(`Error fetching data for zpid ${zpid}:`, error.message);
          return null; // Return null if there's an error
        }
      }
    };

    const validRecentlySoldListings = recentlySoldListings.filter(listing => !isNaN(listing.zpid)); // Filter out invalid zpids
    const validListingsCount = validRecentlySoldListings.length;

    for (let i = 0; i < validRecentlySoldListings.length; i++) {
      const zpid = validRecentlySoldListings[i].zpid;
      const data = await fetchPropertyData(zpid);

      if (data) {
        infoDataArray.push({ ...data.property, images: data.images });
        imageUrlsArray.push(data.images);
      } else {
        // Remove the invalid listing from the recentlySoldListings array to ensure proper order
        validRecentlySoldListings.splice(i, 1);
        i--; // Adjust the index to account for the removed element
      }

      if (i < validRecentlySoldListings.length - 1) {
        await delay(delayBetweenRequests);
        sendProgressUpdate((i + 1) / validRecentlySoldListings.length); // Send progress update
      }
    }

    // Prepare and send response
    const responseData = {
      lat,
      lng,
      estate: {
        ...estateResponse.data,
        props: validRecentlySoldListings, // Ensure props only contains valid listings
        totalResultCount: infoDataArray.length // Update the totalResultCount to match the valid listings count
      },
      recentlySoldListings: infoDataArray,
      recentlySoldImages: imageUrlsArray
    };
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching recently sold listings:', error);
    res.status(500).json({ error: 'Failed to fetch recently sold listings' });
  }
}

// Middleware to limit requests and add them to the queue
app.post('/api/search-listings-lease', (req, res) => {
  const ws = clients[0]; // Assuming a single client for simplicity, adjust as needed
  handleLeaseSearch(ws, req);
  res.sendStatus(200); // Immediate response to acknowledge receipt
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
  const now = Date.now();
  const lastRequestTime = requestQueue.length > 0 ? requestQueue[requestQueue.length - 1].requestTime : 0;
  const elapsed = now - lastRequestTime;

  if (elapsed < delayBetweenRequests) {
    // If the delay between requests has not elapsed yet, respond with a 429 error (Too Many Requests)
    res.status(429).json({ error: 'Too Many Requests' });
  } else {
    // Add the request to the queue
    requestQueue.push({
      requestTime: now,
      handler: handler,
      req: req,
      res: res
    });

    // Process the queue
    processQueue();
  }
}

// Function to process requests from the queue
async function processQueue() {
  if (requestQueue.length > 0 && !isProcessing) {
    isProcessing = true;
    const { requestTime, handler, req, res } = requestQueue.shift();
    const elapsed = Date.now() - requestTime;
    const delay = Math.max(delayBetweenRequests - elapsed, 0); // Ensure minimum delay is respected

    try {
      await handler(req, res);
    } catch (error) {
      console.error('Error processing request:', error);
    }

    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, delay);
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
 