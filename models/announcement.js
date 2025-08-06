const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date, // Used for upcoming events
  },
  pinned: {
    type: Boolean,
    default: false, // Used to pin announcements
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Index for fast queries by group and recent first
announcementSchema.index({ groupId: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
