// components/TenderCard.js (Updated)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BidSubmissionModal from './BidSubmissinModal';

function TenderCard({ tender }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 duration-300">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{tender.tenderName}</h3>
      <p className="text-gray-600 mb-4">{tender.description}</p>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Deadline: {tender.deadline}</p>
        <span className="text-sm font-medium text-indigo-600">Status: Open</span>
      </div>
      <button 
        onClick={() => setModalOpen(true)} 
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
      >
        Bid Now
      </button>
      <Link 
        to={`/bids/${tender._id}`} 
        className="mt-2 inline-block text-indigo-600 hover:underline transition duration-300"
      >
        View Bids
      </Link>

      {/* Modal for Bid Submission */}
      <BidSubmissionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} tenderId={tender._id} />
    </div>
  );
}

export default TenderCard;