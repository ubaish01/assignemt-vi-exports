import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ArrowDownUp, Trash2 } from 'lucide-react';
import BidSubmissionModal from './BidSubmissionModal';
import { deleteRequest } from '../../request';



export default function TenderCard({ tender,refetch }) {
    const [isModalOpen, setModalOpen] = useState(false)
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
  
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }
  
    const daysUntilDeadline = () => {
      const deadline = new Date(tender.endTime)
      const today = new Date()
      const diffTime = deadline - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
  
    const timeUntilDeadline = () => {
      const deadline = new Date(tender.endTime);
      const now = new Date();
    
      const diffTime = deadline - now;
    
      const diffInMinutes = Math.abs(Math.floor(diffTime / (1000 * 60)));
      const diffInHours = Math.abs(Math.floor(diffTime / (1000 * 60 * 60)));
      const diffInDays = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      const diffInWeeks = Math.abs(Math.floor(diffInDays / 7));
      const diffInMonths = Math.abs(Math.floor(diffInDays / 30)); // Approximation, assuming 30 days in a month
      const diffInYears = Math.abs(Math.floor(diffInDays / 365)); // Approximation, assuming 365 days in a year
    
      if (diffTime < 0) return "Expired"
      else {
        // If the deadline is still in the future, show how much time is left
        if (diffInYears > 0) {
          return `${diffInYears} year${diffInYears > 1 ? 's' : ''} left`;
        } else if (diffInMonths > 0) {
          return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} left`;
        } else if (diffInWeeks > 0) {
          return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} left`;
        } else if (diffInDays > 0) {
          return `${diffInDays} day${diffInDays > 1 ? 's' : ''} left`;
        } else if (diffInHours > 0) {
          return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} left`;
        } else {
          return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} left`;
        }
      }
    };
  
    const handleDelete = async () => {
        try {
          const response = await deleteRequest(`/tenders/${tender._id}`)
          refetch();
          setConfirmationOpen(false);
        } catch (error) {
          console.error(error);
        }
      };
    

    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{tender.tenderName}</h3>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
            daysUntilDeadline() <= 3 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {timeUntilDeadline()} 
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{tender.organization}</p>
        <p className="text-gray-600 mb-4">{tender.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Deadline: {formatDate(tender.endTime)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="mr-2 h-4 w-4" />
          <span>Created: {formatDate(tender.createdAt)}</span>
        </div>
        <div className={`flex items-center text-sm text-gray-500`}>
          <ArrowDownUp className="mr-2 h-4 w-4" />
          <span>Lowest bid: <span className={tender?.lowestBid?'text-green-600':'text-red-600'} >{tender?.lowestBid ? `$${tender?.lowestBid}` : "No bids yet"}</span></span>
        </div>
      </div>
      <div className="bg-gray-50 flex items-center px-6 py-4 justify-between">
        {
          user?.role === "admin"
            ?
            <button
              onClick={() => setConfirmationOpen(true)}
              className="bg-red-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              <Trash2 className='w-4' />
              Delete
            </button>
            :
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Bid Now
            </button>
        }
        <Link 
          to={`/bids/${tender._id}`}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Bids
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <BidSubmissionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} tenderId={tender._id} />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this tender? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }
  
