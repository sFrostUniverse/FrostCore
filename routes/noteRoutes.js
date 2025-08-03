const express = require('express');
const {
  getNotes,
  createNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:groupId', protect, getNotes); // ✅ fine
router.post('/:groupId', protect, createNote); // ✅ fine
router.delete('/:noteId', protect, deleteNote); // ✅ fixed
// Removed groupId from DELETE route — not needed

module.exports = router;
