const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // secure
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
}, { timestamps: true });

// ⚡️ Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ groupId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ groupId: 1, role: 1 }); // optional compound index

module.exports = mongoose.model('User', userSchema);
