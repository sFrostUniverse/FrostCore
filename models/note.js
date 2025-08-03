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
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
