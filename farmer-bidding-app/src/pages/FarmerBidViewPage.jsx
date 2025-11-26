// src/pages/FarmerBidViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertCircle, CheckCircle, Hammer } from 'lucide-react';

const FarmerBidViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAccepting, setIsAccepting] = useState(false); // For loading state on the button

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError('Could not load listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleAcceptBid = async () => {
    if (!window.confirm(`Are you sure you want to accept the highest bid of ₹${listing.currentHighestBid}? This will end the auction.`)) {
      return;
    }
    setIsAccepting(true);
    try {
      await axios.post(`http://localhost:5000/api/listings/${id}/accept`);
      alert('Bid accepted! The auction has ended and the item is marked as sold.');
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to accept the bid.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-semibold flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-semibold">{error}</div>;
  if (!listing) return null;

  const hasBids = listing.bids.length > 0;

  return (
    <div className="max-w-5xl mx-auto my-8 p-4">
      <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800">{listing.cropName}</h1>
          <p className="text-lg text-gray-500">Review Bids</p>
      </div>
      
      {/* STYLE UPDATE: Prominent Bid Acceptance Section */}
      {hasBids && listing.status === 'live' && (
        <div className="bg-green-50 border-2 border-dashed border-green-300 p-6 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <p className="font-semibold text-green-800 text-lg">Highest Bid to Accept:</p>
            <p className="text-5xl font-bold text-green-700">₹{listing.currentHighestBid.toLocaleString()}</p>
          </div>
          <button 
            onClick={handleAcceptBid}
            disabled={isAccepting}
            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 flex items-center gap-2 text-lg transition-colors disabled:bg-gray-400"
          >
            {isAccepting ? <Loader2 className="animate-spin" size={24}/> : <CheckCircle size={24} />}
            {isAccepting ? 'Accepting...' : 'Accept This Bid'}
          </button>
        </div>
      )}

      {listing.status === 'sold' && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8 text-center">
            <h2 className="text-2xl font-bold text-blue-800">Auction Sold!</h2>
            <p className="text-blue-700">The highest bid of ₹{listing.currentHighestBid.toLocaleString()} was accepted.</p>
        </div>
      )}

      {/* STYLE UPDATE: Cleaner Bidding History List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <Hammer size={24} className="mr-2" />
            Bidding History ({listing.bids.length} bids)
        </h2>
        {hasBids ? (
          <div className="border-t border-gray-200">
            {listing.bids.map((bid, index) => (
              <div key={index} className="flex justify-between items-center p-4 border-b border-gray-200">
                <div>
                    <p className="font-semibold text-gray-800 text-lg">Bid Amount: ₹{bid.amount.toLocaleString()}</p>
                    {/* In a real app with users, you would show the bidder's name */}
                    {/* <p className="text-sm text-gray-500">Bidder: {bid.bidder.name}</p> */}
                </div>
                <span className="text-sm text-gray-500">{new Date(bid.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 py-8 text-center">No bids have been placed on this item yet.</p>
        )}
      </div>
    </div>
  );
};

export default FarmerBidViewPage;