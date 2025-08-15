const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const doubtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  answers: [answerSchema], // ✅ store multiple answers
  answered: {
    type: Boolean,
    default: false
  },
  checkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // 👈 track users who saw this doubt
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);
