const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    day: {
      type: String,
      required: true,
      lowercase: true, // ensures saved as lowercase
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    time: {
      type: String, // assuming 'HH:mm' format
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Compound index for fast query
timetableSchema.index({ groupId: 1, day: 1, time: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);


