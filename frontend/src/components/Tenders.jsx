import React, { useState, useEffect } from 'react'
import { PlusCircle, ChevronDown } from 'lucide-react'
import { getRequest } from '../../request'
import TenderCreationModal from './TenderModal'
import TenderCard from './TenderCard'

export default function Tenders() {
  const [tenders, setTenders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTenders = async () => {
    try {
    const url = user?.role === "admin" ? "/tenders" : "/tenders/users/active"
      const response = await getRequest(url)
      console.log(response.data)
      setTenders(response.data)
    } catch (err) {
      console.error('Error fetching tenders:', err)
      setError('Failed to load tenders.')
    }
  }

  useEffect(() => {
    fetchTenders()
  }, [])

  const filteredTenders = tenders
    ?.filter(tender => tender?.tenderName?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline)
      return 0
    })

  return (
    <div className="container sm:pl-20 pt-20 bg-gray-100 min-h-screen mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Available Tenders</h2>
        {
            user?.role==="admin" 
            ?
            <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Tender
        </button>
        :
        ""
        }
      </div>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search tenders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sort by: {sortBy === 'latest' ? 'Latest' : 'Deadline'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setSortBy('latest')
                  setIsDropdownOpen(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Latest
              </button>
              <button
                onClick={() => {
                  setSortBy('deadline')
                  setIsDropdownOpen(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Deadline
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenders.length > 0 ? (
          filteredTenders.map(tender => (
            <TenderCard key={tender._id} tender={tender} refetch={fetchTenders} />
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">No tenders available.</p>
        )}
      </div>

      <TenderCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cb={fetchTenders} />
    </div>
  )
}