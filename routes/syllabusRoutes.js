const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const syllabusController = require('../controllers/syllabusController');

// 🧠 Auto-detect from logged-in user's group
router.get('/', protect, syllabusController.getSyllabusByUserGroup);

// 📄 Get syllabus by group ID (admin/fallback)
router.get('/:groupId', protect, syllabusController.getSyllabus);

// ➕ Add new syllabus entry
router.post('/', protect, syllabusController.addSyllabus);

// ❌ Delete syllabus entry
router.delete('/:id', protect, syllabusController.deleteSyllabus);

module.exports = router;
