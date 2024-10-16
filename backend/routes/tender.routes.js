const express = require('express');
const { createTender, getTenders, submitBid, getBidsForTender } = require('../controllers/tender.controller');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Admin only routes
router.post('/tenders', protect, adminOnly, createTender);


// user and admin routes
router.get('/tenders', protect, getTenders);
router.post('/bids', protect, submitBid);
router.get('/tenders/:tenderId/bids', getBidsForTender);

module.exports = router;