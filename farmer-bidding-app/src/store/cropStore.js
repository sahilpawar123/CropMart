// src/store/cropStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// This is our initial data so the page isn't empty
const initialCrops = [
  { id: 1, name: 'Sona Masoori Rice', quantity: '500 kg', basePrice: 25000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmziafEnHX6hvYkSRD4y39C56rDDzX88feNw&s' },
  { id: 2, name: 'Organic Turmeric', quantity: '120 kg', basePrice: 18000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgMnxLhcu3P1CUlDAQORsA7vNnDRSSZOdeZA&s' },
];

const useCropStore = create(
  persist(
    (set) => ({
      // State: an array to hold all crops
      crops: initialCrops,
      
      // Action: a function to add a new crop to the array
      addCrop: (newCropData) => set((state) => ({
        crops: [
          ...state.crops,
          { 
            id: Date.now(), // Use a timestamp for a unique ID
            ...newCropData 
          }
        ]
      })),
    }),
    {
      name: 'crop-listings-storage', // Name for the browser's local storage
    }
  )
);

export default useCropStore;