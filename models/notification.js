const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // index on userId
  },
  title: String,
  body: String,
  data: Object,
  read: {
    type: Boolean,
    default: false,
    index: true, // optional, to help filtered queries on read status
  },
}, { timestamps: true });

// Compound index for efficient unread notification queries sorted by date
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
