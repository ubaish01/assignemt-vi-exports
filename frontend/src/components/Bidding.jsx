import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../../request'; // Import your getRequest utility

const BiddingPage = () => {
  const { tenderId } = useParams(); // Get tenderId from the route
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await getRequest(`/tenders/${tenderId}/bids`);
        setBids(response.data); // Set bids to state
      } catch (err) {
        setError('Failed to fetch bids.');
        console.error(err);
      }
    };

    fetchBids();
  }, [tenderId]);

  if (error) return <div className="text-red-500">{error}</div>;

  // Function to determine if a bid was placed in the last 5 minutes
  const isBidRecent = (bidTime) => {
    const bidDate = new Date(bidTime);
    const now = new Date();
    const tenderEndTime = new Date('2024-10-20T15:00:00Z'); // Replace with actual tender end time

    return bidDate > new Date(now - 5 * 60 * 1000) && bidDate <= tenderEndTime;
  };

  // Sort bids by bid cost in ascending order
  const sortedBids = bids.sort((a, b) => a.bidCost - b.bidCost);

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Bids for Tender ID: {tenderId}</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Company Name</th>
            <th className="py-3 px-6 text-left">Bid Time</th>
            <th className="py-3 px-6 text-left">Bid Cost</th>
            <th className="py-3 px-6 text-left">Recent Bid</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedBids.map((bid) => (
            <tr key={bid._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">{bid.companyName}</td>
              <td className="py-3 px-6">{new Date(bid.bidTime).toLocaleString()}</td>
              <td className="py-3 px-6">${bid.bidCost}</td>
              <td className="py-3 px-6">
                {isBidRecent(bid.bidTime) ? (
                  <span className="text-red-500 font-semibold">Yes</span>
                ) : (
                  <span className="text-green-500">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BiddingPage;