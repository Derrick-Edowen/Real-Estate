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
const sendEmail = require('./sendEmail');
//const redisClient = new Redis(process.env.REDIS_URL);
const wss = new WebSocket.Server({ server });
const clients = new Map(); // Use a Map to store clients with a unique identifier

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//API CODE//




const maxRequestsPerSecond = 1;
const delayBetweenRequests = 1300 / maxRequestsPerSecond; // Adjust delay for optimization
const limiter = new Bottleneck({
  maxConcurrent: maxRequestsPerSecond,
  minTime: 1000 / maxRequestsPerSecond,
});

const MAX_RETRIESS = 45; // Maximum number of retry attempts
const RETRY_DELAYS = 1400; // Delay between retries (1 second)

// Define the request queue
const requestQueue = [];
let isProcessing = false;
const fetchPropertyDetailsQueue = [];
let isProcessingFetchQueue = false;
const nearbyDetailsQueue = [];
let isProcessingNearbyQueue = false;

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

// Add retry logic to the property search function
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

// Retry request function
async function retryRequest(requestFn, retries) {
  let attempts = 0;

  while (attempts < retries) {
    try {
      const response = await requestFn();
      return response; // Return the successful response
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);

      if (attempts >= retries) {
        throw new Error(`Request failed after ${retries} attempts`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS));
    }
  }
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

    const estateResponse = await retryRequest(() => limiter.schedule(() => 
      axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
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
      })
    ), MAX_RETRIESS);

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
const delayF = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIESF = 45; // Maximum number of retry attempts
const RETRY_DELAYF = 1300; // Delay between retries (1 second)

app.post('/api/fetch-property-details', (req, res) => {
  addToFetchQueue(req, res);
});

function addToFetchQueue(req, res) {
  fetchPropertyDetailsQueue.push({ req, res });
  processFetchQueue();
}

async function processFetchQueue() {
  if (isProcessingFetchQueue) return; // Exit if already processing

  isProcessingFetchQueue = true;

  while (fetchPropertyDetailsQueue.length > 0) {
    const { req, res } = fetchPropertyDetailsQueue.shift(); // Get the next request
    await handleFetchPropertyDetails(req, res); // Process the request
  }

  isProcessingFetchQueue = false; // Mark processing as complete
}

async function handleFetchPropertyDetails(req, res) {
  const { zpid } = req.body;
  if (!zpid) {
    console.error('No zpid provided in request');
    return res.status(400).json({ error: 'Missing zpid in request' });
  }

  try {
    // Fetch property details and images with retry logic
    const propertyData = await retryRequest(() => getPropertyDetails(zpid), MAX_RETRIESF);
    const imageData = await retryRequest(() => getPropertyImages(zpid), MAX_RETRIESF);

    // Send back both property and image data
    res.json({ property: propertyData, images: imageData });
  } catch (error) {
    console.error(`Error fetching data after retries for zpid ${zpid}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch property details and images' });
  }
}

// Function to retry requests
async function retryRequest(requestFn, retries) {
  let attempts = 0;

  while (attempts < retries) {
    try {
      const response = await requestFn(); // Call the provided request function
      return response; // Return the successful response
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);

      if (attempts >= retries) {
        throw new Error(`Request failed after ${retries} attempts`);
      }

      // Wait before retrying
      await delayF(RETRY_DELAYF);
    }
  }
}

// Function to fetch property details
async function getPropertyDetails(zpid) {
  const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
  const propertyResponse = await axios.get(propertyUrl, {
    params: { zpid },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
    },
  });
  return propertyResponse.data;
}

// Function to fetch property images
async function getPropertyImages(zpid) {
  const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';
  const imageResponse = await axios.get(imagesUrl, {
    params: { zpid },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
    },
  });
  return imageResponse.data;
}





const delayN = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 45; // Number of retries in case of error
const RETRY_DELAY = 1400; // 1 second delay between retries

app.post('/nearby-details', (req, res) => {
  addToNearbyQueue(req, res);
});

function addToNearbyQueue(req, res) {
  nearbyDetailsQueue.push({ req, res });
  processNearbyQueue();
}

async function processNearbyQueue() {
  if (isProcessingNearbyQueue) return; // Exit if already processing

  isProcessingNearbyQueue = true;

  while (nearbyDetailsQueue.length > 0) {
    const { req, res } = nearbyDetailsQueue.shift(); // Get the next request
    await nearbyPropertyDetails(req, res); // Process the request
  }

  isProcessingNearbyQueue = false; // Mark processing as complete
}

async function nearbyPropertyDetails(req, res) {
  const zpid = req.body.zpid;
  if (!zpid) {
    console.error('No zpid provided in request');
    return res.status(400).json({ error: 'Missing zpid in request' });
  }

  try {
    const propertyData = await retryRequest(() => getPropertyDetails(zpid), MAX_RETRIES);
    const imageData = await retryRequest(() => getPropertyImages(zpid), MAX_RETRIES);
    
    // Send back both property and image data
    res.json({ property: propertyData, images: imageData });
  } catch (error) {
    console.error(`Error fetching data after retries for zpid ${zpid}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch property details' });
  }
}

// Function to retry requests
async function retryRequest(requestFn, retries) {
  let attempts = 0;

  while (attempts < retries) {
    try {
      const response = await requestFn(); // Call the provided request function
      return response; // If success, return the result
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);

      if (attempts >= retries) {
        throw new Error(`Request failed after ${retries} attempts`);
      }

      // Wait before retrying
      await delayN(RETRY_DELAY);
    }
  }
}

// Function to get property details
async function getPropertyDetails(zpid) {
  const propertyUrl = 'https://zillow-com1.p.rapidapi.com/property';
  const propertyResponse = await axios.get(propertyUrl, {
    params: { zpid },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
    },
  });
  return propertyResponse.data;
}

// Function to get property images
async function getPropertyImages(zpid) {
  const imagesUrl = 'https://zillow-com1.p.rapidapi.com/images';
  const imageResponse = await axios.get(imagesUrl, {
    params: { zpid },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
    },
  });
  return imageResponse.data;
}


//City suggestions
app.get('/api/citySuggestions', async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input: query,
        key: process.env.GOOGLE_API_KEY,
        types: '(cities)'
      }
    });

    // Filter suggestions to include only those with "USA" or "Canada" in the description
    const suggestions = response.data.predictions
      .filter(prediction => 
        prediction.description.includes('USA') || 
        prediction.description.includes('Canada')
      )
      .map(prediction => prediction.description);

    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    res.status(500).json({ message: 'Error fetching city suggestions' });
  }
});









//Market Location and Data
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get('/api/marketData', async (req, res) => {
  let { city } = req.query;
  city = JSON.stringify(city).replace(/"/g, ''); // Remove quotes

  if (typeof city !== 'string' || city.trim() === '') {
    return res.status(400).json({ message: 'City parameter must be a non-empty string.' });
  }

  const cityParts = city.split(',');
  if (cityParts.length >= 2) {
    city = cityParts.slice(0, 2).join(',').trim();
  }

  const MAX_RETRIES = 45;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      // Step 1: Get the resource_id
      const locationOptions = {
        method: 'GET',
        url: 'https://zillow-com1.p.rapidapi.com/marketLocation',
        params: { location: city },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'zillow-com1.p.rapidapi.com',
        },
      };

      const locationResponse = await axios.request(locationOptions);
      const resourceId = locationResponse.data?.data[0]?.resourceId;

      if (!resourceId) {
        return res.status(404).json({ message: 'Resource ID not found for the specified city.' });
      }

      // Step 2: Get the market data using resource_id
      const dataOptions = {
        method: 'GET',
        url: 'https://zillow-com1.p.rapidapi.com/marketData',
        params: { resourceId },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'zillow-com1.p.rapidapi.com',
        },
      };

      const marketDataResponse = await axios.request(dataOptions);
      return res.json(marketDataResponse.data);
      
    } catch (error) {
      console.error('Error fetching market data:', error);
      attempts++;

      // If we've hit the max retries, return an error response
      if (attempts === MAX_RETRIES) {
        return res.status(500).json({ message: 'Error fetching market data after multiple attempts' });
      }

      // Wait for 1 second before trying again
      await delay(1600);
    }
  }
});


//AI Chatbot
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  let reply = "Sorry, I am not sure about that. Try contacting [Realtor's Name] through our contact form, they will love to assist you!";

  // Custom response logic based on user message
  if (message.toLowerCase().includes('listings')) {
    reply = 'You can look at listings on our Property Search page: <a href="https://www.oneestatewebservices.com/Find%20Listings%20%7C%20Property%20Search"> Find Listings </a>';
  } else if (message.toLowerCase().includes('selling') || message.toLowerCase().includes('sell')) {
    reply = 'For selling your home, visit our Selling information page: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Selling%20Your%20Home"> Selling Your Home </a> or contact [Realtor Name] for personalized assistance!';
  } else if (message.toLowerCase().includes('sell') || message.toLowerCase().includes('sell')) {
    reply = 'For selling your home, visit our Selling information page: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Selling%20Your%20Home"> Selling Your Home </a> or contact [Realtor Name] for personalized assistance!';
  } else if (message.toLowerCase().includes('buying') || message.toLowerCase().includes('buy')) {
    reply = 'If you"re looking to buy a home, check out our Buying Guide: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a> , contact [Realtor Name] for more info, or explore available listings: <a href="https://www.oneestatewebservices.com/Find%20Listings%20%7C%20Property%20Search"> Find Listings </a>';
  } else if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('buy')) {
    reply = 'If you"re looking to buy a home, check out our Buying Guide: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a> , contact [Realtor Name] for more info, or explore available listings: <a href="https://www.oneestatewebservices.com/Find%20Listings%20%7C%20Property%20Search"> Find Listings </a>';
  } else if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('agent') || message.toLowerCase().includes('realtor')) {
    reply = "[Realtor's Name] would love to assist you! Get in touch via our contact form.";
  } else if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('talk') || message.toLowerCase().includes('realtor')) {
    reply = "[Realtor's Name] would love to assist you! Get in touch via our contact form.";
  } else if (message.toLowerCase().includes('how long')) {
    reply = "I can't provide exact timeframes, but [Realtor's Name] will assist you with any timeline queries. Reach out through the contact form!";
  } else if (message.toLowerCase().includes('mortgage')) {
    reply = "For mortgage advice, speak to a lender for personalized advice, or contact [Realtor's Name] for more assistance!";
  } else if (message.toLowerCase().includes('down payment')) {
    reply = "A typical down payment ranges from 3% to 20% of the home's price. Contact [Realtor's Name] for more advice tailored to your situation.";
  } else if (message.toLowerCase().includes('property tax')) {
    reply = "Property taxes vary by location. You can find more details in your area's tax assessor website or contact [Realtor's Name] for help.";
  } else if (message.toLowerCase().includes('closing costs')) {
    reply = 'Closing costs usually range from 2% to 5% of the purchase price. Visit our Buying Guide for more information: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a>.';
  } else if (message.toLowerCase().includes('closing cost')) {
    reply = 'Closing costs usually range from 2% to 5% of the purchase price. Visit our Buying Guide for more information: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a>.';
  } else if (message.toLowerCase().includes('home inspection')) {
    reply = 'We recommend getting a home inspection before buying. Visit our Buying Guide for more information: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a>.';
  } else if (message.toLowerCase().includes('pre-approval')) {
    reply = 'A mortgage pre-approval strengthens your buying power. Visit our Buying Guide for more information: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a>.';
  } else if (message.toLowerCase().includes('investment property')) {
    reply = 'Looking to invest? Read our guide to investment properties: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Investing%20In%20Real%20Estate> Investing In Real Estate </a>.';
  } else if (message.toLowerCase().includes('invest')) {
    reply = 'Looking to invest? Read our guide to investment properties: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Investing%20In%20Real%20Estate> Investing In Real Estate </a>.';
  } else if (message.toLowerCase().includes('investment')) {
    reply = 'Looking to invest? Read our guide to investment properties: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Investing%20In%20Real%20Estate> Investing In Real Estate </a>.';
  } else if (message.toLowerCase().includes('refinance')) {
    reply = "Considering refinancing? Ask your local lenders, banks, or contact [Realtor's Name] for assistance!";
  } else if (message.toLowerCase().includes('market trends')) {
    reply = 'Stay updated with the latest market trends on our Real Estate Market page: <a href="https://www.oneestatewebservices.com/Rental%20Market%20Data> Market Data </a>.';
  } else if (message.toLowerCase().includes('first-time buyer')) {
    reply = 'Check out our Buyer Guide: <a href="https://www.oneestatewebservices.com/Real%20Estate%20Advice%20%7C%20Buying%20A%20Home"> Buying Your Home </a> for everything you need to know!';
  } else if (message.toLowerCase().includes('foreclosure')) {
    reply = 'Interested in foreclosure properties? Browse listings: <a href="https://www.oneestatewebservices.com/Find%20Listings%20%7C%20Property%20Search"> Find Listings </a> or contact [Realtor Name] for further assistance.';
  } else if (message.toLowerCase().includes('agent')) {
    reply = "[Realtor's Name] would love to assist you! You can contact [Realtor's Name] through our Contact form below";
  } else if (message.toLowerCase().includes('realtor')) {
    reply = "[Realtor's Name] would love to assist you! You can contact [Realtor's Name] through our Contact form below";
  } else if (message.toLowerCase().includes('sales representative')) {
    reply = "[Realtor's Name] would love to assist you! You can contact [Realtor's Name] through our Contact form below"; 
  } else if (message.toLowerCase().includes('suicide')) {
    reply = "I am sorry to here that. Try contacting 9-8-8 or your local crisis helpline!";
  } else if (message.toLowerCase().includes('kms')) {
    reply = "I am sorry to here that. Try contacting 9-8-8 or your local crisis helpline!";
  } else if (message.toLowerCase().includes('kill')) {
    reply = "I am sorry to here that. Try contacting 9-8-8 or your local crisis helpline!";
  } else if (message.toLowerCase().includes('are you real')) {
    reply = "Sorry I am not real, just an AI Chatbot, however [Realtor's Name] is real and would love to speak to you about any real estate needs!";
  } else if (message.toLowerCase().includes('hey')) {
    reply = "Hello";
  } else if (message.toLowerCase().includes('hello')) {
    reply = "Hello";
  } else if (message.toLowerCase().includes('whats up')) {
    reply = "Nothing much, you?";
  } else if (message.toLowerCase().includes('hi')) {
    reply = "Hello";
  }
  // Send the reply as JSON
  res.json({ reply });
});












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

//Mailing
app.post('/api/send-email', async (req, res) => {
  const formData = req.body;
  try {
    await sendEmail(formData);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).send('Failed to send email');
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
 