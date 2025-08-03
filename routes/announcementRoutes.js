// CORRECT way for named export
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware'); // ✅ FIXED

const express = require('express');
const router = express.Router();

router.post('/', protect, createAnnouncement); // POST /api/announcements
router.get('/:groupId', protect, getAnnouncements); // GET /api/announcements/:groupId
router.delete('/:id', protect, deleteAnnouncement); // DELETE /api/announcements/:id

module.exports = router;
