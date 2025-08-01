const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupCode: {
    type: String,
    required: true,
    unique: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Group', groupSchema);
