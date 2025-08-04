const Chat = require('../models/chat');
const User = require('../models/user');
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
      .execPopulate?.(); // if using Mongoose < 7

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
      .sort({ createdAt: 1 }) // oldest first
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

module.exports = {
  sendMessage,
  getMessages,
};
