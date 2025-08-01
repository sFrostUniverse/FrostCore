// controllers/userController.js
const User = require('../models/user');

// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ✅ Store FCM token
exports.storeFcmToken = async (req, res) => {
  const { email, token } = req.body;
  try {
    await User.findOneAndUpdate({ email }, { fcmToken: token });
    res.status(200).json({ message: 'FCM token stored' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store token' });
  }
};
