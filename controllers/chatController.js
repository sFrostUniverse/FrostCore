const Chat = require('../models/chat');
const User = require('../models/user');

const sendMessage = async (req, res) => {
  const { groupId, message } = req.body;

  if (!groupId || !message) {
    return res.status(400).json({ error: 'GroupId and message required' });
  }

  const newMessage = await Chat.create({
    groupId,
    sender: req.user._id,
    message,
  });

  const populatedMessage = await newMessage.populate('sender', 'username email');

  // Emit message to group room via Socket.io
  req.io.to(groupId).emit('new-message', populatedMessage);

  res.status(201).json(populatedMessage);
};

const getMessages = async (req, res) => {
  const { groupId } = req.params;

  const messages = await Chat.find({ groupId })
    .populate('sender', 'username email')
    .sort({ createdAt: 1 });

  res.status(200).json(messages);
};

module.exports = {
  sendMessage,
  getMessages,
};
