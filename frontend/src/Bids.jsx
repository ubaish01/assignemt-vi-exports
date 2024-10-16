// components/Bids.js
import React from 'react';

// Mock data - replace with actual API call
const bids = [
  { id: 1, tenderTitle: 'Office Supplies Procurement', amount: 5000, status: 'Pending', submittedDate: '2024-06-15' },
  { id: 2, tenderTitle: 'IT Equipment Upgrade', amount: 15000, status: 'Accepted', submittedDate: '2024-06-10' },
  { id: 3, tenderTitle: 'Catering Services', amount: 7500, status: 'Rejected', submittedDate: '2024-06-05' },
  // Add more mock bids as needed
];

function BidCard({ bid }) {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-lg font-semibold mb-2">{bid.tenderTitle}</h3>
      <p className="text-gray-600 mb-2">Bid Amount: ${bid.amount.toLocaleString()}</p>
      <p className="text-sm text-gray-500 mb-2">Submitted: {bid.submittedDate}</p>
      <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${statusColors[bid.status]}`}>
        {bid.status}
      </span>
    </div>
  );
}

function Bids() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Bids</h2>
      <div className="space-y-4">
        {bids.map(bid => (
          <BidCard key={bid.id} bid={bid} />
        ))}
      </div>
    </div>
  );
}

export default Bids;