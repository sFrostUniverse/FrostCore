const mongoose = require('mongoose');
const Note = require('../models/note');
const logger = require('../utils/logger');

// POST /api/notes/:groupId
const createNote = async (req, res) => {
  try {
    const { title, type, url, parentId } = req.body;
    const groupId = req.params.groupId;

    if (!title || !type || !groupId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = await Note.create({ title, type, url, parentId, groupId });
    res.status(201).json({ success: true, note });
  } catch (error) {
    logger.error('❌ Error creating note:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET /api/notes/:groupId?parentId=xxx&page=1&limit=30
const getNotes = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { parentId, page = 1, limit = 50 } = req.query;

    const filter = { groupId };

    if (parentId) {
      filter.parentId = parentId;
    } else {
      filter.$or = [{ parentId: null }, { parentId: { $exists: false } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
      .exec();

    res.json({ success: true, notes });
  } catch (error) {
    logger.error('❌ Error fetching notes:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// DELETE /api/notes/:noteId
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const deleted = await Note.findByIdAndDelete(noteId);

    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    logger.error('❌ Error deleting note:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createNote, getNotes, deleteNote };
