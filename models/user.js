const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fcmToken: { type: String },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // optional: links to Group model
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
});
