const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const syllabusController = require('../controllers/syllabusController');

router.post('/syllabus', protect, syllabusController.addSyllabus);
router.get('/syllabus/:groupId', protect, syllabusController.getSyllabus);
router.delete('/syllabus/:id', protect, syllabusController.deleteSyllabus);

module.exports = router;
