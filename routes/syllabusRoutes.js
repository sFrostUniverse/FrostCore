const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const syllabusController = require('../controllers/syllabusController');

// Clean paths – avoid redundant `/syllabus`
router.post('/', protect, syllabusController.addSyllabus);
router.get('/:groupId', protect, syllabusController.getSyllabus);
router.delete('/:id', protect, syllabusController.deleteSyllabus);

module.exports = router;
