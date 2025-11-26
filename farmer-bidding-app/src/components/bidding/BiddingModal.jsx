// src/components/bidding/BiddingModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BiddingModal = ({ crop, onClose }) => {
  const [bidAmount, setBidAmount] = useState('');
  
  // In a real app, these would come from a WebSocket server
  const [highestBid, setHighestBid] = useState(crop.basePrice);
  const [timer, setTimer] = useState(120); // 2-minute timer

  // Effect to handle the countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval); // Cleanup on close
  }, [timer]);

  const handlePlaceBid = () => {
    const newBid = parseFloat(bidAmount);
    if (newBid > highestBid) {
      setHighestBid(newBid); // Update UI instantly for this user
      // In a real app, you would emit this bid to the server via WebSocket
      alert(`Your bid of ₹${newBid.toLocaleString('en-IN')} has been placed!`);
      setBidAmount('');
    } else {
      alert('Your bid must be higher than the current highest bid.');
    }
  };

  // Format the timer into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 m-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{crop.name}</h2>
            <p className="text-gray-500">Time Remaining: <span className="font-bold text-red-600">{formatTime(timer)}</span></p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Bidding Info */}
        <div className="py-6 my-4 border-t border-b">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">Current Highest Bid:</span>
            <span className="text-3xl font-bold text-green-700">₹{highestBid.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        {/* Bid Input */}
        <div className="mt-4">
          <label className="block font-medium text-gray-700">Your Bid Amount</label>
          <div className="flex mt-2 space-x-3">
            <input 
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`> ₹${highestBid.toLocaleString('en-IN')}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
            <button 
              onClick={handlePlaceBid}
              className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Place Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingModal;