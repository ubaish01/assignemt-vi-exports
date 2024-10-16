const Tender = require('../models/tender.model');
const Bid = require('../models/bid.model');
const Notification = require('../models/notificaiton.model');


exports.notifications = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;

        if(user.role==='admin'){
            return res.json({
                success: true,
                notifications:[],
                newNotificationsCount:0
            });
        }

        // Fetch all notifications
        const notifications = await Notification.find({}).populate('tender').sort({createdAt:-1});

        // Count new notifications (where the current user's ID is not in the 'views' array)
        const newNotificationsCount = await Notification.countDocuments({
            views: { $nin: [userId] }
        });

        return res.json({
            success: true,
            notifications,
            newNotificationsCount
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


exports.markNotificationsAsViewed = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;

        // Update all notifications where the user hasn't viewed them yet
        const result = await Notification.updateMany(
            { views: { $nin: [userId] } }, // Find notifications where the user ID is not in views array
            { $addToSet: { views: userId } } // Add the user ID to the views array
        );

        return res.json({
            success: true,
            message: `${result.modifiedCount} notifications marked as viewed`
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};