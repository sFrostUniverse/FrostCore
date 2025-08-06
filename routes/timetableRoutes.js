const express = require('express');
const router = express.Router();
const {
  addTimetableEntry,
  getTimetableForDay,
} = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.post('/groups/:groupId/timetable', protect, addTimetableEntry);
router.get('/groups/:groupId/timetable', protect, getTimetableForDay);


module.exports = router;
