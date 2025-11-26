// src/components/listings/CropListingForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CropListingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: '',
    location: '',
    quantity: '',
    variety: '',
    basePrice: '',
    minIncrement: '',
    duration: '4',
    qualityGrade: '',
    moisture: '',
    endTime: '',
  });
  
  const [auctionType, setAuctionType] = useState('daily_rush');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    setIsUploading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(response.data.url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload an image for the listing.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    const listingData = { ...formData, auctionType, imageUrl };
    try {
      await axios.post('http://localhost:5000/api/listings', listingData);
      alert('Your crop has been successfully listed!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.msg || 'Failed to create listing.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">List a New Crop for Bidding</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">Crop Name *</label>
            <input type="text" id="cropName" value={formData.cropName} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
            <input type="text" id="location" placeholder="e.g., Punjab" value={formData.location} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (in kg) *</label>
            <input type="number" id="quantity" placeholder="e.g., 5000" value={formData.quantity} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="variety" className="block text-sm font-medium text-gray-700">Variety</label>
            <input type="text" id="variety" placeholder="e.g., 1121 Basmati" value={formData.variety} onChange={handleInputChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price (₹) *</label>
            <input type="number" id="basePrice" placeholder="e.g., 50000" value={formData.basePrice} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="minIncrement" className="block text-sm font-medium text-gray-700">Min Increment (₹) *</label>
            <input type="number" id="minIncrement" placeholder="e.g., 500" value={formData.minIncrement} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="qualityGrade" className="block text-sm font-medium text-gray-700">Quality Grade</label>
            <input type="text" id="qualityGrade" placeholder="e.g., Grade A" value={formData.qualityGrade} onChange={handleInputChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="moisture" className="block text-sm font-medium text-gray-700">Moisture %</label>
            <input type="text" id="moisture" placeholder="e.g., 12%" value={formData.moisture} onChange={handleInputChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
        </div>

        <div className="pt-2">
          <label className="block mb-3 text-sm font-medium text-gray-700">Auction Type</label>
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <input type="radio" id="daily_rush" name="auctionType" value="daily_rush" checked={auctionType === 'daily_rush'} onChange={(e) => setAuctionType(e.target.value)} className="h-4 w-4 text-green-600"/>
              <label htmlFor="daily_rush" className="ml-2 text-gray-800">Daily Rush</label>
            </div>
            <div className="flex items-center">
              <input type="radio" id="normal" name="auctionType" value="normal" checked={auctionType === 'normal'} onChange={(e) => setAuctionType(e.target.value)} className="h-4 w-4 text-green-600"/>
              <label htmlFor="normal" className="ml-2 text-gray-800">Normal Auction</label>
            </div>
          </div>
        </div>
        
        {auctionType === 'daily_rush' ? (
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours) *</label>
            <input type="number" id="duration" value={formData.duration} onChange={handleInputChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
        ) : (
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Auction End Time *</label>
            <input type="datetime-local" id="endTime" required value={formData.endTime} onChange={handleInputChange} className="mt-1 w-full p-3 border border-gray-300 rounded-lg"/>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image *</label>
          <input type="file" id="cropImage" accept="image/*" onChange={handleImageChange} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" disabled={isUploading}/>
        </div>
        
        {isUploading && (
          <div className="flex items-center text-blue-600">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span>Uploading image...</span>
          </div>
        )}
        {imageUrl && !isUploading && (
          <div className="mt-4 p-2 border-2 border-dashed border-green-500 rounded-lg">
            <p className="text-sm text-green-700 font-semibold mb-2">Image Upload Successful!</p>
            <img src={imageUrl} alt="Crop preview" className="w-full h-48 object-cover rounded-md"/>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <button type="submit" disabled={isUploading || isSubmitting} className="w-full py-3 inline-flex items-center justify-center font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Listing...</> : (isUploading ? 'Waiting for image...' : 'Submit Listing')}
        </button>
        
      </form>
    </div>
  );
};

export default CropListingForm;