
// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Sidebar({ userRole, onLogout }) {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-64 bg-white shadow-lg"
    >
      <div className="h-full flex flex-col justify-between py-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to={userRole === 'admin' ? '/admin' : '/user'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/tenders" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                Tenders
              </Link>
            </li>
            <li>
              <Link to="/biddings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                Biddings
              </Link>
            </li>
          </ul>
        </nav>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-red-500 text-white rounded"
          onClick={onLogout}
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}


export default Sidebar