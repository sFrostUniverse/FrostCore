const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ⚡ Compound index for efficient querying
chatSchema.index({ groupId: 1, createdAt: 1 });

module.exports = mongoose.model('Chat', chatSchema);
