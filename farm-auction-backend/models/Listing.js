// models/Listing.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A sub-schema to define the structure of a single bid
const BidSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  bidder: {
    type: Schema.Types.ObjectId,
    ref: 'User' // This will link to your User model in the future
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});


// The main schema for a single crop listing
const ListingSchema = new Schema({
  // --- Basic Fields ---
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  
  // --- Detailed Fields from New Form ---
  location: { type: String, required: true },
  variety: { type: String },
  minIncrement: { type: Number, required: true },
  qualityGrade: { type: String },
  moisture: { type: String },
  
  // --- Ownership Field ---
  farmerId: {
    type: String, // In a real app, this would be: type: Schema.Types.ObjectId, ref: 'User'
    required: true
  },

  // --- Auction Control Fields ---
  auctionType: {
    type: String,
    required: true,
    enum: ['normal', 'real-time', 'daily_rush']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'live', 'sold', 'expired', 'cancelled'],
    default: 'live'
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  // --- Bidding Fields ---
  currentHighestBid: {
    type: Number,
    default: function() {
      // The highest bid starts at the item's base price
      return this.basePrice; 
    }
  },
  bids: [BidSchema] // An array that will contain a history of all bids

}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);