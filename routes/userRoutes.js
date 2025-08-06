// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, storeFcmToken, getMe, updateNickname } = require('../controllers/userController');
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware');
const { sendPushNotification } = require('../utils/notificationUtils'); 

// Existing routes
router.get('/', getAllUsers);
router.post('/store-token', storeFcmToken);
router.get('/me', protect, getMe); // ✅ Authenticated user profile route
router.patch('/me/nickname', protect, updateNickname);

// ✅ Test notification route (correct place)
router.post('/test-notify', async (req, res) => {
  const { email, title, body } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.fcmToken) {
      return res.status(404).json({ error: 'User or FCM token not found' });
    }

    await sendPushNotification(user.fcmToken, title, body);
    res.status(200).json({ message: 'Notification sent' });
  } catch (err) {
    console.error('Notification error:', err.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
