const mongoose = require('mongoose');
const tenderSchema = new mongoose.Schema({
  tenderName: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bufferTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Tender', tenderSchema);