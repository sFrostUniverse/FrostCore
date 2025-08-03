const express = require('express');
const router = express.Router();
const {
  createGroup,
  joinGroup,
  getGroupInfo,
  getGroupTimetable,
  addTimetableEntry,
  getGroupMembers // ⬅️ ADD THIS
} = require('../controllers/groupController');

const { protect } = require('../middleware/authMiddleware');

// Secure all routes with protect middleware
router.post('/create', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/:groupId', protect, getGroupInfo);
router.get('/:groupId/timetable', protect, getGroupTimetable);
router.post('/:groupId/timetable', protect, addTimetableEntry);

// ✅ ADD THIS ROUTE
router.get('/:groupId/members', protect, getGroupMembers);

module.exports = router;
