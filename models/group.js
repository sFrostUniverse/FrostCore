const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    groupCode: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

groupSchema.index({ groupCode: 1 });
groupSchema.index({ members: 1 });
groupSchema.index({ adminId: 1, createdAt: -1 });

module.exports = mongoose.model('Group', groupSchema);
