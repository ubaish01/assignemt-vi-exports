const express = require('express');
const { createTender, getTenders, submitBid, getBidsForTender, getActiveTenders, getTenderById, deleteTender } = require('../controllers/tender.controller');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, adminOnly, createTender);
router.get('/', protect, getTenders);
router.get('/:id', protect, getTenderById);
router.delete('/:id', protect, deleteTender);
router.get('/users/active', protect, getActiveTenders);
router.post('/bids', protect, submitBid);
router.get('/:tenderId/bids', getBidsForTender);

module.exports = router;