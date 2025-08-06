const express = require('express');
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  getPinnedAnnouncements,
  getUpcomingAnnouncements,
  togglePinnedStatus,
} = require('../controllers/announcementController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAnnouncement);                  // ✅ Create
router.get('/:groupId', protect, getAnnouncements);             // ✅ Fetch All
router.get('/:groupId/pinned', protect, getPinnedAnnouncements); // 🔹 Needed
router.get('/:groupId/upcoming', protect, getUpcomingAnnouncements); // 🔹 Needed
router.delete('/:id', protect, deleteAnnouncement);             // ✅ Delete
router.patch('/:id/pin', protect, togglePinnedStatus);          // 🔄 (optional)

module.exports = router;
