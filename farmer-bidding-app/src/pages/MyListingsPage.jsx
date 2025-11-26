// src/pages/MyListingsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertCircle } from 'lucide-react';

const MyListingsPage = () => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // IMPROVEMENT: Added error state

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings/my-listings');
        setMyListings(response.data);
      } catch (error) {
        console.error("Failed to fetch farmer's listings:", error);
        setError("Could not load your listings. Please try again later."); // IMPROVEMENT: Set error message for the user
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2 text-lg">Loading your listings...</span>
      </div>
    );
  }

  // IMPROVEMENT: Show a clear error message if the API call fails
  if (error) {
    return (
        <div className="text-center p-10 bg-red-50 rounded-lg shadow">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Listed Crops</h1>
      
      {myListings.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p className="text-gray-600">You have not listed any crops for auction yet.</p>
          <Link to="/farmer" className="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
            List Your First Crop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myListings.map(listing => (
            <div key={listing._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center transition-shadow hover:shadow-md">
              <div className="flex items-center">
                {/* IMPROVEMENT: Added a fallback placeholder for the image */}
                <img 
                  src={listing.imageUrl || `https://via.placeholder.com/150?text=${listing.cropName}`} 
                  alt={listing.cropName} 
                  className="w-24 h-24 object-cover rounded-md mr-4 bg-gray-200" 
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{listing.cropName}</h2>
                  <p className="text-sm text-gray-500">Status: <span className="font-semibold capitalize">{listing.status}</span></p>
                  <p className="text-sm text-gray-500">Bids Received: {listing.bids.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                {/* FIXED: Added optional chaining (?.) to prevent crash if currentHighestBid is missing */}
                <p className="text-xl font-bold text-green-600">
                  ₹{listing.currentHighestBid?.toLocaleString() ?? listing.basePrice.toLocaleString()}
                </p>
               <Link to={`/my-listings/${listing._id}`} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                  View Bids
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;