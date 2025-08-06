const mongoose = require('mongoose');
const Note = require('../models/note');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

// POST /api/notes/:groupId
const createNote = async (req, res) => {
  try {
    console.log('Create note request body:', req.body); // <-- log request body here

    const { title, type, url, parentId } = req.body;
    const groupId = req.params.groupId;

    if (!title || !type || !groupId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = await Note.create({ title, type, url, parentId, groupId });

    console.log('Created note:', note); // <-- log created note here

    // Clear cache after creating a new note
    cache.del(`notes-${groupId}`);

    // Real-time update
    req.io.to(groupId).emit('note-updated');

    res.status(201).json({ success: true, note });
  } catch (error) {
    logger.error('❌ Error creating note:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// GET /api/notes/:groupId?parentId=xxx&page=1&limit=30
const getNotes = async (req, res) => {
  const { groupId } = req.params;
  const { parentId, page = 1, limit = 50 } = req.query;
  const key = `notes-${groupId}-${parentId || 'all'}-p${page}-l${limit}`;

  const cached = cache.get(key);
  if (cached) {
    return res.json(cached);
  }

  try {
    const filter = { groupId };
    if (parentId) filter.parentId = parentId;

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    cache.set(key, notes);
    res.json(notes);
  } catch (err) {
    logger.error('❌ Error fetching notes:', err.message);
    res.status(500).json({ error: 'Failed to fetch notes' });
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

    // Clear cache for this group
    cache.del(`notes-${deleted.groupId}`);

    // 🟢 Emit real-time update to all group users
    req.io.to(deleted.groupId.toString()).emit('note-updated');

    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    logger.error('❌ Error deleting note:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// GET /api/notes/ (for user’s own group)
const getNotesByUserGroup = async (req, res) => {
  try {
    const groupId = req.user.groupId;
    if (!groupId) {
      return res.status(400).json({ error: 'User not in any group' });
    }

    const key = `notes-usergroup-${groupId}`;
    const cached = cache.get(key);
    if (cached) {
      return res.json(cached);
    }

    const notes = await Note.find({ groupId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    cache.set(key, notes);
    res.status(200).json({ success: true, notes });
  } catch (error) {
    logger.error('❌ Error fetching notes by user group:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  createNote,
  getNotes,
  deleteNote,
  getNotesByUserGroup,
};
