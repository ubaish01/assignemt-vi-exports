// components/TenderCreationModal.js
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { postRequest } from '../../request';

const TenderCreationModal = ({ isOpen, onClose }) => {
  const [tenderName, setTenderName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bufferTime, setBufferTime] = useState('');
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenderName || !description || !startTime || !endTime || !bufferTime) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const payload= {
        tenderName,
        description,
        startTime,
        endTime,
        bufferTime: Number(bufferTime),
      }
      const response = await postRequest('/tenders', payload);
      console.log('Tender created:', response.data);
      // Reset form and close modal
      setTenderName('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setBufferTime('');
      onClose();
    } catch (err) {
      console.error('Error creating tender:', err);
      setError('Failed to create tender. Please try again.');
    }
  };

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
          <h3 className="text-lg font-semibold">Create New Tender</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tenderName" className="block text-sm font-medium text-gray-700 mb-1">
              Tender Name
            </label>
            <input
              type="text"
              id="tenderName"
              value={tenderName}
              onChange={(e) => setTenderName(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700 mb-1">
              Buffer Time (minutes)
            </label>
            <input
              type="number"
              id="bufferTime"
              value={bufferTime}
              onChange={(e) => setBufferTime(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-2 w-full hover:bg-indigo-700 transition duration-300">
            Create Tender
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenderCreationModal;