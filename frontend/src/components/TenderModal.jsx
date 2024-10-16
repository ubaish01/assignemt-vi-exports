import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { postRequest } from '../../request';

const TenderCreationModal = ({ isOpen, onClose, onSuccess }) => {
  const [tenderName, setTenderName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bufferTime, setBufferTime] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!tenderName || !description || !startTime || !endTime || !bufferTime) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        tenderName,
        description,
        startTime,
        endTime,
        bufferTime: Number(bufferTime),
      };
      const response = await postRequest('/tenders', payload);
      console.log('Tender created:', response.data);
      onSuccess();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error creating tender:', err);
      setError('Failed to create tender. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTenderName('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setBufferTime('');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create New Tender</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="tenderName" className="block text-sm font-medium text-gray-700 mb-1">
                Tender Name
              </label>
              <input
                type="text"
                id="tenderName"
                value={tenderName}
                onChange={(e) => setTenderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700 mb-1">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                id="bufferTime"
                value={bufferTime}
                onChange={(e) => setBufferTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Tender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenderCreationModal;