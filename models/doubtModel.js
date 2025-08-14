const mongoose = require('mongoose');

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
  answer: {
    type: String,
    default: ''
  },
  answerImage: {
    type: String,
    default: ''
  },
  answered: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // ✅ automatically adds createdAt & updatedAt

module.exports = mongoose.model('Doubt', doubtSchema);
