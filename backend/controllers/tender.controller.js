const Tender = require('../models/tender.model');
const Bid = require('../models/bid.model');
const Notification = require('../models/notification.model');

exports.createTender = async (req, res) => {
  try {
    const { tenderName, description, startTime, endTime, bufferTime } = req.body;
    const tender = new Tender({ tenderName, description, startTime, endTime, bufferTime });
    await tender.save();

    const content = `A new tender has been created: ${tender.tenderName}. Click here to check the bids.`;
    await Notification.create({ views: [], content, tender: tender._id });
    
    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTenders = async (req, res) => {
  try {
    const tenders = await Tender.aggregate([
      {
        $lookup: {
          from: 'bids',
          localField: '_id',
          foreignField: 'tenderId',
          as: 'bids',
        },
      },
      {
        $addFields: {
          lowestBid: { $min: '$bids.bidCost' },
        },
      },
      {
        $project: {
          _id: 1,
          tenderName: 1,
          description: 1,
          startTime: 1,
          endTime: 1,
          lowestBid: 1,
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveTenders = async (req, res) => {
  try {
    const currentTime = new Date();

    const tenders = await Tender.aggregate([
      {
        $match: { endTime: { $gt: currentTime } },
      },
      {
        $lookup: {
          from: 'bids',
          localField: '_id',
          foreignField: 'tenderId',
          as: 'bids',
        },
      },
      {
        $addFields: {
          lowestBid: { $min: '$bids.bidCost' },
        },
      },
      {
        $project: {
          _id: 1,
          tenderName: 1,
          description: 1,
          startTime: 1,
          endTime: 1,
          lowestBid: 1,
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTender = async (req, res) => {
  const { id } = req.params;

  try {
    const tender = await Tender.findByIdAndDelete(id);
    if (!tender) {
      return res.status(404).json({ success: false, message: 'Tender not found' });
    }

    res.status(200).json({ success: true, message: 'Tender deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTenderById = async (req, res) => {
  try {
    const tenderId = req.params.id;
    const tender = await Tender.findById(tenderId);

    if (!tender) {
      return res.status(404).json({ success: false, message: 'Tender not found' });
    }

    res.status(200).json(tender);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitBid = async (req, res) => {
  try {
    const { tenderId, companyName, bidCost } = req.body;
    const tender = await Tender.findById(tenderId);
    const bidTime = new Date();

    if (!tender) {
      return res.status(404).json({ success: false, message: 'Tender not found' });
    }

    const flagLast5Minutes = (tender.endTime - bidTime) <= 5 * 60 * 1000;
    if (flagLast5Minutes) {
      tender.endTime = new Date(tender.endTime.getTime() + tender.bufferTime * 60000);
      await tender.save();
    }

    const bid = new Bid({ tenderId, companyName, bidCost, flagLast5Minutes, bidTime });
    await bid.save();

    const content = `A new bid has been submitted on ${tender.tenderName}. Click here to check the latest bids.`;
    await Notification.create({ views: [], content, tender: tender._id });

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

exports.getBidsForTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const bids = await Bid.find({ tenderId }).sort({ bidCost: 1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};