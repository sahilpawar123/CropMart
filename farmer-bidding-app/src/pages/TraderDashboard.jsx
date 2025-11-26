// src/pages/TraderDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/common/ListingCard';
import { Search, SlidersHorizontal } from 'lucide-react';

// --- NEW: A custom hook to debounce user input ---
// This is the fix for the maxPrice bug.
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};


// --- NEW: The improved, Amazon-style FilterSidebar ---
const FilterSidebar = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
        <SlidersHorizontal size={20} className="mr-2"/>
        Filters
      </h3>
      <div className="space-y-6">
        {/* Search by Name */}
        <div>
          <label htmlFor="cropName" className="block text-sm font-semibold text-gray-700 mb-1">Crop Name</label>
          <input type="text" id="cropName" name="cropName" value={filters.cropName} onChange={onFilterChange} placeholder="e.g., Tomato" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
        </div>
        
        {/* Search by Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input type="text" id="location" name="location" value={filters.location} onChange={onFilterChange} placeholder="e.g., Punjab" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
        </div>
        
        {/* Price Filter */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-semibold text-gray-700 mb-1">Max Price (₹)</label>
          <input type="number" id="maxPrice" name="maxPrice" value={filters.maxPrice} onChange={onFilterChange} placeholder="e.g., 50000" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
        </div>
        
        {/* Auction Type Filter with Radio Buttons */}
        <div>
          <h4 className="block text-sm font-semibold text-gray-700 mb-2">Auction Type</h4>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="auctionType" value="" checked={filters.auctionType === ''} onChange={onFilterChange} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
              <span className="ml-2 text-gray-700">All Types</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="auctionType" value="daily_rush" checked={filters.auctionType === 'daily_rush'} onChange={onFilterChange} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
              <span className="ml-2 text-gray-700">Daily Rush</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="auctionType" value="normal" checked={filters.auctionType === 'normal'} onChange={onFilterChange} className="h-4 w-4 text-green-600 focus:ring-green-500"/>
              <span className="ml-2 text-gray-700">Normal Auction</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- The Main Dashboard Component, now using the debounced filters ---
const TraderDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    cropName: '',
    location: '',
    maxPrice: '',
    auctionType: '',
  });

  // Create debounced versions of the text filters
  const debouncedCropName = useDebounce(filters.cropName, 500);
  const debouncedLocation = useDebounce(filters.location, 500);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 500);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // We now send the debounced values to the API
        const response = await axios.get('http://localhost:5000/api/listings', { 
          params: {
            cropName: debouncedCropName,
            location: debouncedLocation,
            maxPrice: debouncedMaxPrice,
            auctionType: filters.auctionType, // Radio buttons don't need debounce
          } 
        });
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [debouncedCropName, debouncedLocation, debouncedMaxPrice, filters.auctionType]); // Re-fetch only when debounced values change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 bg-gray-50">
      <aside className="w-full lg:w-1/4 xl:w-1/5">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </aside>

      <main className="w-full lg:w-3/4 xl:w-4/5">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Auctions</h1>
        
        {loading ? (
          <div className="text-center p-10">Loading...</div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard
                key={listing._id}
                id={listing._id}
                name={listing.cropName}
                location={listing.location}
                basePrice={listing.basePrice}
                quantity={`${listing.quantity} kg`}
                auctionType={listing.auctionType}
                endTime={listing.endTime}
                imageUrl={listing.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm border">
            <p className="font-semibold text-gray-600">No active listings match your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TraderDashboard;