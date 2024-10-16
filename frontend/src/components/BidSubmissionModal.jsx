import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { X, DollarSign, Building, Loader } from 'lucide-react'
import { postRequest } from '../../request'
import toast from 'react-hot-toast'

const BidSubmissionModal = ({ isOpen, onClose, tenderId }) => {
  const [companyName, setCompanyName] = useState('')
  const [bidCost, setBidCost] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!companyName || !bidCost) {
      setError('Please fill in all fields.')
      setIsSubmitting(false)
      return
    }

    try {
      const payload = {
        tenderId,
        companyName,
        bidCost: Number(bidCost),
      }

      const response = await postRequest('/tenders/bids', payload)
      console.log('Bid submitted:', response.data)
      toast.success("Bid submitted")
      setCompanyName('')
      setBidCost('')
      onClose()
    } catch (err) {
      console.error('Error submitting bid:', err)
      setError('Failed to submit bid. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        ref={modalRef} 
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-out"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Submit Your Bid</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                required
                placeholder="Enter your company name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="bidCost" className="block text-sm font-medium text-gray-700 mb-1">
              Bid Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                id="bidCost"
                value={bidCost}
                onChange={(e) => setBidCost(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                required
                placeholder="Enter your bid amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Submitting...
              </span>
            ) : (
              'Submit Bid'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BidSubmissionModal