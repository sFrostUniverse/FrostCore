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
  timetable: [
    {
      day: { type: String, required: true },
      subject: { type: String, required: true },
      teacher: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
}, {
  timestamps: true,
});

// ✅ Indexes
groupSchema.index({ groupCode: 1 });
groupSchema.index({ 'members': 1 });
groupSchema.index({ 'timetable.day': 1 });
groupSchema.index({ adminId: 1, createdAt: -1 }); // optional

module.exports = mongoose.model('Group', groupSchema);
