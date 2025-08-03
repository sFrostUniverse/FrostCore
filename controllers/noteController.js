const Note = require('../models/note');

const createNote = async (req, res) => {
  try {
    const { title, type, url, parentId, groupId } = req.body;
    if (!title || !type || !groupId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = await Note.create({ title, type, url, parentId, groupId });
    res.status(201).json({ note });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getNotes = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { parentId } = req.query;

    const filter = { groupId };
    if (parentId === undefined) {
      filter.parentId = null;
    } else {
      filter.parentId = parentId;
    }

    const notes = await Note.find(filter).sort({ createdAt: 1 });
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createNote, getNotes, deleteNote };
