const express = require('express');
const { protect } = require('../middleware/auth');
const { getNotifications, markNotificationsAsViewed } = require('../controllers/notification.controller');
const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/update", protect, markNotificationsAsViewed);

module.exports = router;