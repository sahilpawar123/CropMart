// server.js (UPDATED for Authentication)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- 1. IMPORT THE NEW AUTHENTICATION ROUTES ---
const authRoutes = require('./routes/auth');
// ----------------------------------------------

const listingRoutes = require('./routes/listings');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

const dbURI = 'mongodb://localhost:27017/farm-auction';
mongoose.connect(dbURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- 2. USE THE AUTHENTICATION ROUTES ---
// Any request to '/api/auth/...' will be handled by authRoutes
app.use('/api/auth', authRoutes);
// ----------------------------------------

// --- USE THE OTHER ROUTES ---
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes); 
// ---------------------------

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});