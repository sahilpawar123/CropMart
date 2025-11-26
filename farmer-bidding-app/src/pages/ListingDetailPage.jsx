// src/pages/ListingDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertCircle, MapPin, Award, Droplet } from 'lucide-react';

const ListingDetailPage = () => {
  const { id } = useParams(); 
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(response.data);

        const initialBid = response.data.bids.length > 0 ? response.data.currentHighestBid + 1 : response.data.basePrice;
        setBidAmount(initialBid);

      } catch (err) {
        setError('Could not load listing details. It may have been removed.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`http://localhost:5000/api/listings/${id}/bid`, { amount: bidAmount });
      
      setListing(response.data); 
      setBidAmount(response.data.currentHighestBid + 1);
      alert('Your bid was successfully placed!');

    } catch (err) {
      const message = err.response?.data?.msg || 'Failed to place bid. Please try again.';
      setError(message);
      console.error('Bid submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-semibold">Loading Listing...</div>;
  if (error && !listing) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!listing) return null;

  const hasBids = listing.bids.length > 0;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-96 object-cover" />
        <div className="p-6">
          <p className="text-base text-gray-500 flex items-center mb-2">
            <MapPin size={16} className="mr-2" />
            {listing.location}
          </p>
          <h1 className="text-4xl font-bold text-gray-800">{listing.cropName}</h1>
          <p className="text-lg text-gray-600">Variety: {listing.variety || 'N/A'}</p>
          
          {/* --- UPDATED: Additional Details Section --- */}
          <div className="my-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity</p>
              <p className="font-semibold text-gray-900">{listing.quantity} kg</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Min. Increment</p>
              <p className="font-semibold text-gray-900">₹{listing.minIncrement}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quality Grade</p>
              <p className="font-semibold text-gray-900">{listing.qualityGrade || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Moisture %</p>
              <p className="font-semibold text-gray-900">{listing.moisture || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6 border-t border-b py-6">
            <div>
              <p className="text-sm text-gray-500">Starts at (Base Price)</p>
              <p className="text-2xl font-semibold">₹{listing.basePrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Highest Bid</p>
              <p className="text-2xl font-bold text-green-600">
                {hasBids ? `₹${listing.currentHighestBid.toLocaleString()}` : 'No bids yet'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitBid} className="mt-6">
            <label htmlFor="bidAmount" className="block text-lg font-medium text-gray-700">
              Your Bid (must be {'>'} ₹{hasBids ? listing.currentHighestBid.toLocaleString() : listing.basePrice - 1})
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="block w-full p-3 border-gray-300 rounded-l-md text-xl focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your amount"
                min={hasBids ? listing.currentHighestBid + 1 : listing.basePrice}
                required
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-r-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Place Final Bid'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;