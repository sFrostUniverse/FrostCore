const Chat = require('../models/chat');
const User = require('../models/user');
const MessageReadTracker = require('../models/messageReadTracker');
const logger = require('../utils/logger');

// POST /api/chats/send
const sendMessage = async (req, res) => {
  const { groupId, message } = req.body;

  if (!groupId || !message) {
    return res.status(400).json({ error: 'GroupId and message required' });
  }

  try {
    const newMessage = await Chat.create({
      groupId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await newMessage
      .populate('sender', 'username email')
      .execPopulate?.(); // optional for Mongoose <7

    req.io.to(groupId).emit('new-message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    logger.error('❌ Error sending chat message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// GET /api/chats/:groupId?page=1&limit=30
const getMessages = async (req, res) => {
  const { groupId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  try {
    const messages = await Chat.find({ groupId })
      .populate('sender', 'username email')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({ messages, page });
  } catch (error) {
    logger.error('❌ Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// GET /api/groups/:groupId/chat/unread-count
const getUnreadCount = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  try {
    const tracker = await MessageReadTracker.findOne({ userId, groupId });
    const lastRead = tracker?.lastReadMessageTimestamp || new Date(0);

    const unreadCount = await Chat.countDocuments({
      groupId,
      createdAt: { $gt: lastRead },
    });

    res.json({ unreadCount });
  } catch (err) {
    logger.error('❌ Error getting unread count:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// POST /api/groups/:groupId/chat/mark-read
const markMessagesAsRead = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  try {
    await MessageReadTracker.findOneAndUpdate(
      { userId, groupId },
      { lastReadMessageTimestamp: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    logger.error('❌ Error marking messages as read:', err);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount,
  markMessagesAsRead,
};
