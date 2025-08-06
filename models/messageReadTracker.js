const mongoose = require('mongoose');

const messageReadTrackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  lastReadMessageTimestamp: { type: Date, default: new Date(0) },
}, { timestamps: true });

messageReadTrackerSchema.index({ userId: 1, groupId: 1 }, { unique: true });

module.exports = mongoose.model('MessageReadTracker', messageReadTrackerSchema);
