import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../../request'
import { ArrowUp, ArrowDown, Clock, DollarSign, Building } from 'lucide-react'

const BiddingPage = () => {
  const { tenderId } = useParams()
  const [bids, setBids] = useState([])
  const [tender, setTender] = useState(null)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState('bidCost')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bidsResponse, tenderResponse] = await Promise.all([
          getRequest(`/tenders/${tenderId}/bids`),
          getRequest(`/tenders/${tenderId}`)
        ])
        setBids(bidsResponse.data)
        setTender(tenderResponse.data)
      } catch (err) {
        setError('Failed to fetch data.')
        console.error(err)
      }
    }

    fetchData()
  }, [tenderId])

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-red-600 text-xl font-semibold bg-white p-8 rounded-lg shadow-lg">
        {error}
      </div>
    </div>
  )

  if (!tender) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-gray-600 text-xl font-semibold">Loading...</div>
    </div>
  )

  const isBidRecent = (bidTime) => {
    const bidDate = new Date(bidTime)
    const now = new Date()
    const tenderEndTime = new Date(tender.endTime)

    return bidDate > new Date(now - 5 * 60 * 1000) && bidDate <= tenderEndTime
  }

  const sortedBids = [...bids].sort((a, b) => {
    if (sortField === 'bidCost') {
      return sortDirection === 'asc' ? a.bidCost - b.bidCost : b.bidCost - a.bidCost
    } else if (sortField === 'bidTime') {
      return sortDirection === 'asc' 
        ? new Date(a.bidTime) - new Date(b.bidTime) 
        : new Date(b.bidTime) - new Date(a.bidTime)
    }
    return 0
  })

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
  }

  return (
    <div className="min-h-screen pl-12 pt-20 bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h2 className="text-3xl font-bold mb-2">{tender.tenderName}</h2>
          <p className="text-blue-100">Tender ID: {tenderId}</p>
        </div>
        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2" /> Deadline
              </h3>
              <p>{new Date(tender.endTime).toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" /> Lowest Bid
              </h3>
              <p>${Math.min(...bids.map(b => b.bidCost)).toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Building className="w-5 h-5 mr-2" /> Total Bids
              </h3>
              <p>{bids.length}</p>
            </div>
          </div>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Company Name</th>
                <th className="py-3 px-6 text-left cursor-pointer" onClick={() => toggleSort('bidTime')}>
                  <div className="flex items-center">
                    Bid Time
                    <SortIcon field="bidTime" />
                  </div>
                </th>
                <th className="py-3 px-6 text-left cursor-pointer" onClick={() => toggleSort('bidCost')}>
                  <div className="flex items-center">
                    Bid Cost
                    <SortIcon field="bidCost" />
                  </div>
                </th>
                <th className="py-3 px-6 text-left">Recent Bid</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {sortedBids.map((bid) => (
                <tr key={bid._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                  <td className="py-3 px-6 font-medium">{bid.companyName}</td>
                  <td className="py-3 px-6">{new Date(bid.bidTime).toLocaleString()}</td>
                  <td className="py-3 px-6">${bid.bidCost.toLocaleString()}</td>
                  <td className="py-3 px-6">
                    {isBidRecent(bid.bidTime) ? (
                      <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-xs font-medium">Recent</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-medium">Earlier</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BiddingPage