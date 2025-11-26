// src/pages/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image and Dark Overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center animate-kenburns"
        style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL4AHJvnoUEWeD0xh34hYYkORAtZf-XOASSQ&s')` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white p-4">
        
        <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {/* UPDATED: Smoother text scaling for the headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">
            Welcome to AgriBid
          </h1>
        </div>
        <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          {/* UPDATED: Smoother text scaling and adaptive max-width for the tagline */}
          <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-md sm:max-w-xl md:max-w-3xl drop-shadow-md">
            The modern marketplace connecting farmers directly with traders for fair, real-time bidding.
          </p>
        </div>
        
        <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '1s' }}>
          <Link to="/login">
            {/* UPDATED: Adaptive button padding and text size */}
            <button className="mt-8 px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg bg-green-600 rounded-full font-semibold text-white transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg animate-pulse-subtle">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;