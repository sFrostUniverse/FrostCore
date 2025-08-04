const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    index: true, // add index on groupId
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Compound index for queries by group and sorting by creation date
announcementSchema.index({ groupId: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
