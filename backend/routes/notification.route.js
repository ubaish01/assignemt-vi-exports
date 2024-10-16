const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { notifications, markNotificationsAsViewed } = require('../controllers/notifications.controller');
const router = express.Router();


router.get("/",protect,notifications);
router.put("/update",protect,markNotificationsAsViewed);

module.exports = router