const Tender = require('../models/tender.model');
const Bid = require('../models/bid.model');

// Create a new tender
exports.createTender = async (req, res) => {
  try {
    const { tenderName, description, startTime, endTime, bufferTime } = req.body;
    const tender = new Tender({ tenderName, description, startTime, endTime, bufferTime });
    await tender.save();
    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tenders
exports.getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find();
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a bid
exports.submitBid = async (req, res) => {
  try {
    const { tenderId, companyName, bidCost } = req.body;
    const tender = await Tender.findById(tenderId);
    const bidTime = new Date();

    if(!tender)return res.json({
      success:false,
      message:"Tender not found"
    })
    // Check if bid is within the last 5 minutes of the tender end time
    const flagLast5Minutes = (tender.endTime - bidTime) <= 5 * 60 * 1000;
    if (flagLast5Minutes) {
      tender.endTime = new Date(tender.endTime.getTime() + tender.bufferTime * 60000);
      await tender.save();
    }

    const bid = new Bid({ tenderId, companyName, bidCost, flagLast5Minutes, bidTime });
    await bid.save();
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowestBidForTenders = async (req, res) => {
  try {
    const tenders = await Tender.find().lean();
    const tendersWithLowestBid = await Promise.all(
      tenders.map(async (tender) => {
        const lowestBid = await Bid.find({ tenderId: tender._id }).sort({ bidCost: 1 }).limit(1);
        return {
          ...tender,
          lowestBid: lowestBid.length > 0 ? lowestBid[0].bidCost : null,
        };
      })
    );
    res.status(200).json(tendersWithLowestBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch bids for a specific tender
exports.getBidsForTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    
    // Find bids for the given tender, sorted by bid cost in ascending order
    const bids = await Bid.find({ tenderId }).sort({ bidCost: 1 });
    
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};