const express = require('express');
const router = express.Router();

const {
  createGroup,
  joinGroup,
  getGroupInfo,
  getGroupTimetable,
  addTimetableEntry,
  getGroupMembers
} = require('../controllers/groupController');

const chatController = require('../controllers/chatController'); // ✅ Import this
const { protect } = require('../middleware/authMiddleware');

// Group management
router.post('/create', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/:groupId', protect, getGroupInfo);
router.get('/:groupId/members', protect, getGroupMembers);

// Timetable
router.get('/:groupId/timetable', protect, getGroupTimetable);
router.post('/:groupId/timetable', protect, addTimetableEntry);

// 🔔 Chat unread/read tracking
router.get('/:groupId/chat/unread-count', protect, chatController.getUnreadCount);
router.post('/:groupId/chat/mark-read', protect, chatController.markMessagesAsRead);

module.exports = router;
