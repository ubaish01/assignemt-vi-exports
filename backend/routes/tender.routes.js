const express = require('express');
const { createTender, getTenders, submitBid, getBidsForTender, getActiveTenders, getTenderById, deleteTender } = require('../controllers/tender.controller');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Admin only routes
router.post('/tenders', protect, adminOnly, createTender);


// user and admin routes
router.get('/tenders', protect, getTenders);
router.get('/tenders/:id', protect, getTenderById);
router.delete('/tenders/:id', protect, deleteTender);
router.get('/tenders/users/active', protect, getActiveTenders);
router.post('/bids', protect, submitBid);
router.get('/tenders/:tenderId/bids', getBidsForTender);

module.exports = router;