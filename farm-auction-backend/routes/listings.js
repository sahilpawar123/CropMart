/**
 * @file routes/listings.js
 * @description All API routes related to crop listings, protected by authentication.
 */

const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth'); // <-- 1. IMPORT THE AUTH MIDDLEWARE

// @route   POST /api/listings
// @desc    Create a new crop listing
// @access  Private (Farmer Only)
router.post('/', auth, async (req, res) => { // <-- 2. ADD 'auth' MIDDLEWARE
  try {
    // Basic role check (can be made more robust)
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ msg: 'Access denied. Only farmers can create listings.' });
    }

    const { 
      cropName, auctionType, quantity, basePrice, imageUrl,
      location, variety, minIncrement, qualityGrade, moisture,
      duration, endTime 
    } = req.body;

    let finalStartTime = new Date();
    let finalEndTime = endTime;
    
    if (auctionType === 'daily_rush' && duration) {
      const durationInHours = parseInt(duration, 10);
      finalEndTime = new Date();
      finalEndTime.setHours(finalStartTime.getHours() + durationInHours);
    }

    const newListing = new Listing({
      cropName, auctionType, quantity, basePrice, imageUrl,
      startTime: finalStartTime, endTime: finalEndTime, status: 'live',
      farmerId: req.user.id, // <-- 3. USE REAL FARMER ID
      location, variety, minIncrement, qualityGrade, moisture
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error("Error in POST /api/listings:", err);
    res.status(500).json({ msg: 'Server error.', error: err.message });
  }
});

// @route   GET /api/listings
// @desc    Get all live listings with filtering
// @access  Private (Trader Only - assumes only traders browse all)
router.get('/', auth, async (req, res) => { // <-- Protect this route
   if (req.user.role !== 'trader') {
      return res.status(403).json({ msg: 'Access denied.' });
   }
  try {
    const filter = { status: 'live' };
    if (req.query.cropName && req.query.cropName.trim() !== '') { /* ... */ }
    if (req.query.location && req.query.location.trim() !== '') { /* ... */ }
    if (req.query.maxPrice && parseInt(req.query.maxPrice, 10) > 0) { /* ... */ }
    if (req.query.auctionType && req.query.auctionType.trim() !== '') { /* ... */ }

    const liveListings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(liveListings);
  } catch (err) {
    console.error("Error in GET /api/listings:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/listings/my-listings
// @desc    Get listings for the logged-in farmer
// @access  Private (Farmer Only)
router.get('/my-listings', auth, async (req, res) => { // <-- Add 'auth' middleware
  if (req.user.role !== 'farmer') {
      return res.status(403).json({ msg: 'Access denied.' });
   }
  try {
    const myListings = await Listing.find({ farmerId: req.user.id }).sort({ createdAt: -1 }); // <-- Use req.user.id
    res.json(myListings);
  } catch (err) {
    console.error("Error in GET /my-listings:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/listings/:id
// @desc    Get a single listing by ID
// @access  Private (Both roles can view details)
router.get('/:id', auth, async (req, res) => { // <-- Protect this route
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Listing not found' });
    }
    console.error(`Error in GET /api/listings/${req.params.id}:`, err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/listings/:id/bid
// @desc    Place a bid on a listing
// @access  Private (Trader Only)
router.post('/:id/bid', auth, async (req, res) => { // <-- Add 'auth' middleware
   if (req.user.role !== 'trader') {
      return res.status(403).json({ msg: 'Only traders can place bids.' });
   }
  try {
    const { amount } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) { return res.status(404).json({ msg: 'Listing not found.' }); }
    if (amount <= listing.currentHighestBid) {
      return res.status(400).json({ msg: `Bid must be > ₹${listing.currentHighestBid}.` });
    }
    const newBid = { 
        amount: amount,
        bidder: req.user.id // <-- Add the bidder's ID
    };
    listing.bids.unshift(newBid);
    listing.currentHighestBid = amount;
    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error("Error in POST /:id/bid:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/listings/:id/accept
// @desc    A farmer accepts the highest bid on a listing
// @access  Private (Farmer Only)
router.post('/:id/accept', auth, async (req, res) => { // <-- Add 'auth' middleware
  if (req.user.role !== 'farmer') {
      return res.status(403).json({ msg: 'Only farmers can accept bids.' });
   }
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) { return res.status(404).json({ msg: 'Listing not found.' }); }

    // Check if the logged-in user owns this listing
    if (listing.farmerId.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized to accept bids for this listing.' });
    }

    if (listing.status !== 'live') { return res.status(400).json({ msg: 'Auction not live.' }); }
    if (listing.bids.length === 0) { return res.status(400).json({ msg: 'No bids to accept.' }); }

    listing.status = 'sold';
    // listing.winnerId = listing.bids[0].bidder; // Future enhancement
    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error("Error in POST /:id/accept:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;