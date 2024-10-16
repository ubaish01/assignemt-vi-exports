const Notification = require('../models/notification.model');

exports.getNotifications = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (user.role === 'admin') {
      return res.json({
        success: true,
        notifications: [],
        newNotificationsCount: 0,
      });
    }

    const notifications = await Notification.find({})
      .populate('tender')
      .sort({ createdAt: -1 });

    const newNotificationsCount = await Notification.countDocuments({
      views: { $nin: [userId] },
    });

    return res.json({
      success: true,
      notifications,
      newNotificationsCount,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.markNotificationsAsViewed = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const result = await Notification.updateMany(
      { views: { $nin: [userId] } },
      { $addToSet: { views: userId } }
    );

    return res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as viewed`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};