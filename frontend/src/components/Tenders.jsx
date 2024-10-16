import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRequest } from '../../request'; // Assuming this is your custom utility for making GET requests
import TenderCreationModal from './TenderModal';
import TenderCard from './TenderCard';


function Tenders() {
  const [tenders, setTenders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tenders from API
  const fetchTenders = async () => {
    try {
      const response = await getRequest('/tenders'); // API endpoint to get all tenders
      setTenders(response.data);
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setError('Failed to load tenders.');
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []); // Empty dependency array to fetch data on component mount

  return (
    <div className='sm:pl-20 bg-white flex w-full p-8 flex-col'>
      <h2 className="text-2xl font-bold mb-6">Available Tenders</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
      >
        Create New Tender
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenders.length > 0 ? (
          tenders.map(tender => (
            <TenderCard key={tender._id} tender={tender} />
          ))
        ) : (
          <p className="text-gray-600">No tenders available.</p>
        )}
      </div>

      <TenderCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Tenders;