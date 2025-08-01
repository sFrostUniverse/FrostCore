const Notification = require('../models/notification');

exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    const notification = new Notification({
      userId,
      title,
      body,
      data,
    });

    await notification.save();

    // Real-time push via Socket.io (later)
    req.io?.to(userId.toString()).emit('notification', {
      title,
      body,
      data,
      createdAt: notification.createdAt,
    });

    res.status(201).json({ message: 'Notification sent', notification });
  } catch (err) {
    console.error('Send notification error:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};
