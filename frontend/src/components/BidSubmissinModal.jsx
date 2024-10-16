import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { postRequest } from '../../request'; // Import your postRequest utility

const BidSubmissionModal = ({ isOpen, onClose,tenderId }) => {
  const [companyName, setCompanyName] = useState('');
  const [bidCost, setBidCost] = useState('');
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!companyName || !bidCost) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const payload = {
        tenderId,
        companyName,
        bidCost: Number(bidCost),
      };

      // Call the submit bid API
      const response = await postRequest('/bids', payload); // Make the API request to /bids endpoint
      console.log('Bid submitted:', response.data);

      // Reset form and close modal
      setCompanyName('');
      setBidCost('');
      onClose();
    } catch (err) {
      console.error('Error submitting bid:', err);
      setError('Failed to submit bid. Please try again.');
    }
  };

  // Handle outside clicks to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Submit Your Bid</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bidCost" className="block text-sm font-medium text-gray-700 mb-1">
              Bid Cost
            </label>
            <input
              type="number"
              id="bidCost"
              value={bidCost}
              onChange={(e) => setBidCost(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-2 w-full hover:bg-indigo-700 transition duration-300">
            Submit Bid
          </button>
        </form>
      </div>
    </div>
  );
};

export default BidSubmissionModal;