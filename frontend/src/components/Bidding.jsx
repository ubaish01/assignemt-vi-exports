import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../../request'
import { ArrowUp, ArrowDown, Clock, DollarSign, Users, Search, RefreshCw } from 'lucide-react'

const BiddingPage = () => {
  const { tenderId } = useParams()
  const [bids, setBids] = useState([])
  const [tender, setTender] = useState(null)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState('bidCost')
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tenderId])

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-red-600 text-xl font-semibold bg-white p-8 rounded-lg shadow-lg">
        {error}
      </div>
    </div>
  )

  if (isLoading || !tender) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-gray-600 text-xl font-semibold flex items-center">
        <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
        Loading...
      </div>
    </div>
  )

  const isBidRecent = (bidTime) => {
    const bidDate = new Date(bidTime)
    const now = new Date()
    const tenderEndTime = new Date(tender.endTime)
    return bidDate > new Date(now - 5 * 60 * 1000) && bidDate <= tenderEndTime
  }

  const filteredBids = bids.filter(bid => 
    bid.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedBids = [...filteredBids].sort((a, b) => {
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
    <div className="min-h-screen pl-12 bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h2 className="text-3xl font-bold mb-2">{tender.tenderName}</h2>
            <p className="text-blue-100">Tender ID: {tenderId}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg flex items-center">
                <Clock className="w-10 h-10 text-blue-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Deadline</h3>
                  <p className="text-gray-600">{new Date(tender.endTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg flex items-center">
                <DollarSign className="w-10 h-10 text-green-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Lowest Bid</h3>
                  <p className="text-gray-600">${Math.min(...bids.map(b => b.bidCost)).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg flex items-center">
                <Users className="w-10 h-10 text-purple-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Bids</h3>
                  <p className="text-gray-600">{bids.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Bids</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('bidTime')}>
                    <div className="flex items-center">
                      Bid Time
                      <SortIcon field="bidTime" />
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('bidCost')}>
                    <div className="flex items-center">
                      Bid Cost
                      <SortIcon field="bidCost" />
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBids.map((bid) => (
                  <tr key={bid._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="py-4 px-6 whitespace-nowrap">{bid.companyName}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{new Date(bid.bidTime).toLocaleString()}</td>
                    <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">${bid.bidCost.toLocaleString()}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {isBidRecent(bid.bidTime) ? (
                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-medium">Recent</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs font-medium">Earlier</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BiddingPage