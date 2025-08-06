const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "folder" or "pdf"
    url: String, // optional, for pdf links

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      default: null,
      index: true, // ⚡️ index added
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true, // ⚡️ index added
    },
  },
  { timestamps: true }
);

// 📅 Optional compound index for pagination/sorting
noteSchema.index({ groupId: 1, parentId: 1, createdAt: 1 });

module.exports = mongoose.model('Note', noteSchema);
