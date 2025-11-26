// src/pages/FarmerPage.jsx
import React, { useState } from 'react';
import CropListingForm from '../components/listings/CropListingForm';
import FarmerChatbot from '../components/chat/FarmerChatbot';

const FarmerPage = () => {
  const [activeView, setActiveView] = useState('form');

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* --- Tab Navigation --- */}
      <div className="flex justify-center border-b border-gray-300 mb-8">
        <button
          onClick={() => setActiveView('form')}
          className={`px-6 py-3 font-semibold transition-colors duration-200 text-lg ${
            activeView === 'form' 
              ? 'border-b-2 border-green-600 text-gray-800' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          List a Crop
        </button>
        <button
          onClick={() => setActiveView('chat')}
          className={`px-6 py-3 font-semibold transition-colors duration-200 text-lg ${
            activeView === 'chat' 
              ? 'border-b-2 border-green-600 text-gray-800' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          AI Assistant
        </button>
      </div>

      {/* --- Content Area --- */}
      <div>
        {activeView === 'form' && <CropListingForm />}
        {activeView === 'chat' && <FarmerChatbot />}
      </div>
    </div>
  );
};

export default FarmerPage;