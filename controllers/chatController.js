const Chat = require('../models/chat');
const User = require('../models/user');
const MessageReadTracker = require('../models/messageReadTracker');
const logger = require('../utils/logger');

// POST /api/chats/send
const sendMessage = async (req, res) => {
  const { groupId, message } = req.body;

  if (!groupId || !message) {
    return res.status(400).json({ error: 'GroupId and message are required' });
  }

  try {
    const newMessage = await Chat.create({
      groupId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await Chat.findById(newMessage._id)
      .populate('sender', 'username email')
      .lean();

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
      .lean();

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

// GET /api/groups/:groupId/chat/preview
const getGroupChatPreview = async (req, res) => {
  const { groupId } = req.params;

  try {
    const lastMessage = await Chat.findOne({ groupId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username email')
      .lean();

    if (!lastMessage) {
      return res.status(200).json({ message: 'No messages yet' });
    }

    res.status(200).json(lastMessage);
  } catch (error) {
    logger.error('❌ Error fetching chat preview:', error);
    res.status(500).json({ error: 'Failed to fetch chat preview' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount,
  markMessagesAsRead,
  getGroupChatPreview,
};
