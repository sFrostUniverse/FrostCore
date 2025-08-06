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
// ✅ Get authenticated user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      groupId: user.groupId || '',
      role: user.role || '',
      nickname: user.nickname || '', // ✅ add this
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
// ✅ Update nickname
exports.updateNickname = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { nickname },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update nickname error:', error.message);
    res.status(500).json({ error: 'Failed to update nickname' });
  }
};



