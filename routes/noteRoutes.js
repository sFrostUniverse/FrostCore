const express = require('express');
const {
  getNotes,
  getNotesByUserGroup,
  createNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ New route: get notes using user's groupId

// ✅ Existing routes
router.get('/', protect, getNotesByUserGroup); // Get notes by logged-in user's group
router.get('/:groupId', protect, getNotes);
router.post('/:groupId', protect, createNote);
router.delete('/:noteId', protect, deleteNote);

module.exports = router;
