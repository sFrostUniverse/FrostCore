const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fcmToken: { type: String },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
}, { timestamps: true }); // optional: adds createdAt/updatedAt

module.exports = mongoose.model('User', userSchema);
