const Tender = require('../models/tender.model');
const Bid = require('../models/bid.model');
const Notification = require('../models/notificaiton.model');

// Create a new tender
exports.createTender = async (req, res) => {
  try {
    const { tenderName, description, startTime, endTime, bufferTime } = req.body;
    const tender = new Tender({ tenderName, description, startTime, endTime, bufferTime });
    await tender.save();
    const content = `A new tender has been created ${tender.tenderName}. Click here to check the bids`
    await Notification.create({
      views:[],
      content,
      tender:tender._id
    })
    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tenders
exports.getTenders = async (req, res) => {
  try {
    const tenders = await Tender.aggregate([
      {
        // Lookup bids related to this tender
        $lookup: {
          from: 'bids', // The collection name for bids
          localField: '_id', // Match Tender _id with Bid tenderId
          foreignField: 'tenderId',
          as: 'bids'
        }
      },
      {
        // Add a field for the lowest bid
        $addFields: {
          lowestBid: { $min: '$bids.bidCost' }
        }
      },
      {
        // Project only the needed fields (optional)
        $project: {
          _id: 1,
          startTime:1,
          createdAt:1,
          tenderName: 1,
          description: 1,
          endTime: 1,
          lowestBid: 1,
        }
      }
    ]);
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getActiveTenders = async (req, res) => {
  try {
    const currentTime = new Date();

    // Aggregating tenders with the lowest bid
    const tenders = await Tender.aggregate([
      {
        // Match only active tenders
        $match: { endTime: { $gt: currentTime } }
      },
      {
        // Lookup bids related to this tender
        $lookup: {
          from: 'bids', // The collection name for bids
          localField: '_id', // Match Tender _id with Bid tenderId
          foreignField: 'tenderId',
          as: 'bids'
        }
      },
      {
        // Add a field for the lowest bid
        $addFields: {
          lowestBid: { $min: '$bids.bidCost' }
        }
      },
      {
        // Project only the needed fields (optional)
        $project: {
          _id: 1,
          startTime:1,
          createdAt:1,
          tenderName: 1,
          description: 1,
          endTime: 1,
          lowestBid: 1,
        }
      }
    ]);

    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTender = async (req, res) => {
  const { id } = req.params;

  try {
      // Find the tender by ID and delete it
      const tender = await Tender.findByIdAndDelete(id);

      // If the tender is not found, send a 404 response
      if (!tender) {
          return res.status(404).json({ success: false, message: 'Tender not found' });
      }

      // Return a success message
      res.status(200).json({ success: true, message: 'Tender deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTenderById = async (req, res) => {
  try {
    const tenderId = req.params.id;

    // Find tender by ID
    const tender = await Tender.findById(tenderId);


    res.status(200).json(tender);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    const content = `A new bid has been submitted on ${tender.tenderName}. Click here to check the latest bids`
    await Notification.create({
      views:[],
      content,
      tender:tender._id
    })
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