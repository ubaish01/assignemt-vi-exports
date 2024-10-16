const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  companyName: { type: String, required: true },
  bidTime: { type: Date, default: Date.now },
  bidCost: { type: Number, required: true },
  flagLast5Minutes: { type: Boolean, default: false },
});
module.exports = mongoose.model('Bid', bidSchema);