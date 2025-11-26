// // src/components/common/ListingCard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom'; // Import Link for navigation
// import CountdownTimer from './CountdownTimer'; // Assumes CountdownTimer.jsx is in the same folder

// /**
//  * A reusable card component to display a single auction listing.
//  * It conditionally renders different information based on the auctionType.
//  *
//  * @param {object} props - The component props.
//  * @param {string} props.id - The unique ID of the listing for the link.
//  * @param {string} props.name - The name of the crop.
//  * @param {string|number} props.quantity - The quantity available (e.g., "500 kg").
//  * @param {number} props.basePrice - The starting price for the auction.
//  * @param {string} props.imageUrl - The URL of the crop image.
//  * @param {string} props.auctionType - The type of auction ('daily_rush', 'normal', etc.).
//  * @param {string} props.endTime - The ISO string for the auction's end time.
//  */
// const ListingCard = ({ id, name, quantity, basePrice, auctionType, endTime, imageUrl }) => {
//   return (
//     <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col">
//       {/* --- This is the corrected img tag --- */}
//        <img 
//         src={imageUrl || `https://via.placeholder.com/300x200.png?text=${name.replace(/\s/g, '+')}`} 
//         alt={name} 
//         className="w-full h-48 object-cover bg-gray-200" 
//       />

//       <div className="p-4 flex flex-col flex-grow">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="text-xl font-bold font-display text-gray-800 pr-2">{name}</h3>
//           {auctionType === 'daily_rush' && (
//             <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
//               ⏱️ Daily Rush
//             </span>
//           )}
//         </div>
        
//         {/* Conditional logic to show countdown or base price */}
//         {auctionType === 'daily_rush' ? (
//           <div className="my-2">
//             <p className="text-sm font-medium text-gray-500">Bidding ends in:</p>
//             <CountdownTimer targetTime={endTime} />
//           </div>
//         ) : (
//           <p className="text-gray-600">Base Price: <span className="font-semibold text-lg text-gray-900">₹{basePrice}</span></p>
//         )}
        
//         <p className="text-sm text-gray-500 mb-4 mt-auto pt-2">Quantity: {quantity}</p>
        
//         {/* The button is a Link that navigates to the details page for this specific item */}
//         <Link 
//           to={`/auction/${id}`} 
//           className="w-full text-center bg-primary text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
//         >
//           Place Bid
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ListingCard;

// src/components/common/ListingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { MapPin } from 'lucide-react';

const ListingCard = ({ id, name, quantity, basePrice, auctionType, endTime, imageUrl, location }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col">
      <img 
        src={imageUrl || `https://via.placeholder.com/300x200.png?text=${name.replace(/\s/g, '+')}`} 
        alt={name} 
        className="w-full h-48 object-cover bg-gray-200" 
      />

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold font-display text-gray-800 pr-2">{name}</h3>
          {auctionType === 'daily_rush' && (
            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
              ⏱️ Daily Rush
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 flex items-center mb-2">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          {location}
        </p>
        
        {auctionType === 'daily_rush' ? (
          <div className="my-2">
            <p className="text-sm font-medium text-gray-500">Bidding ends in:</p>
            <CountdownTimer targetTime={endTime} />
          </div>
        ) : (
          <p className="text-gray-600">Base Price: <span className="font-semibold text-lg text-gray-900">₹{basePrice.toLocaleString()}</span></p>
        )}
        
        <p className="text-sm text-gray-500 mb-4 mt-auto pt-2">Quantity: {quantity}</p>
        
        <Link 
          to={`/auction/${id}`} 
          className="w-full text-center bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Place Bid
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;