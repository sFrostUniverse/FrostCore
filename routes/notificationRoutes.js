const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotifications,
  markNotificationRead,
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware');

// Secure routes with protect middleware
router.post('/send', protect, sendNotification);
router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markNotificationRead);

module.exports = router;
