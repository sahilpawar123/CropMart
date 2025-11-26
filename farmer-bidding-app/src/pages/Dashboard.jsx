// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // NEW: Import axios to fetch data
import useAuthStore from '../store/authStore';
import CropListingForm from '../components/listings/CropListingForm';
import FarmerChatbot from '../components/chat/FarmerChatbot';
import BiddingModal from '../components/bidding/BiddingModal';

// --- FarmerView (This component is for the Farmer's UI) ---
const FarmerView = ({ user }) => {
  const [activeView, setActiveView] = useState('form');

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center border-b border-white/20 mb-8">
        <button
          onClick={() => setActiveView('form')}
          className={`px-6 py-3 font-semibold transition-colors duration-200 text-lg ${
            activeView === 'form' 
              ? 'border-b-2 border-white text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          List a Crop
        </button>
        <button
          onClick={() => setActiveView('chat')}
          className={`px-6 py-3 font-semibold transition-colors duration-200 text-lg ${
            activeView === 'chat' 
              ? 'border-b-2 border-white text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          AI Assistant
        </button>
      </div>
      <div>
        {activeView === 'form' && <CropListingForm />}
        {activeView === 'chat' && <FarmerChatbot />}
      </div>
    </div>
  );
};

// --- TraderView (This component is for the Trader's UI) ---
const TraderView = () => {
  // NEW: State for storing listings and loading status
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // NEW: useEffect hook to fetch live data from the backend API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings');
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // The empty array [] means this runs once when the page loads

  if (loading) {
      return <div className="text-white text-center">Loading listings...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Available Crops for Bidding</h2>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing._id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{listing.cropName}</h3>
                <p className="mt-2 text-sm text-gray-600">Quantity: {listing.quantity} kg</p>
                <p className="mt-1 text-gray-600">Base Price: <span className="font-bold">₹{listing.basePrice.toLocaleString('en-IN')}</span></p>
                <button 
                  onClick={() => setSelectedCrop(listing)}
                  className="w-full mt-4 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  Bid Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-center bg-black/30 p-8 rounded-lg">
          <p className="text-lg">No crops are currently listed for bidding.</p>
        </div>
      )}
      {selectedCrop && (
        <BiddingModal 
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
        />
      )}
    </div>
  );
};

// --- Main Dashboard Component (The Parent) ---
const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/589810/pexels-photo-589810.jpeg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 flex flex-col min-h-screen"> 
        <header className="flex justify-between items-center p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.role === 'farmer' ? "Farmer Dashboard" : "Trader Dashboard"}
            </h1>
            <p className="text-white/80 text-lg">Welcome, {user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30"
          >
            Logout
          </button>
        </header>

        <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
          {user.role === 'farmer' ? <FarmerView user={user} /> : <TraderView />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;