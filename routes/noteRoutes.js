const express = require('express');
const {
  getNotes,
  createNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:groupId', protect, getNotes);
router.post('/:groupId', protect, createNote);
router.delete('/:groupId/:noteId', protect, deleteNote);

module.exports = router;
