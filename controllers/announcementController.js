const Announcement = require('../models/announcement');
const logger = require('../utils/logger');

// ✅ POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  const { groupId, title, message, pinned = false, eventDate = null } = req.body;
  const userId = req.user.id;

  try {
    const announcement = await Announcement.create({
      groupId,
      title,
      message,
      pinned,
      eventDate,
      createdBy: userId,
    });

    req.io.to(groupId).emit('announcement:new', announcement);

    res.status(201).json({ announcement });
  } catch (error) {
    logger.error('❌ Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// ✅ GET /api/announcements/:groupId?page=1&limit=10
exports.getAnnouncements = async (req, res) => {
  const { groupId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const announcements = await Announcement.find({ groupId, pinned: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ announcements, page });
  } catch (error) {
    logger.error('❌ Get announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// ✅ DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Announcement not found' });

    res.status(200).json({ message: 'Announcement deleted' });
  } catch (error) {
    logger.error('❌ Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};

// ✅ GET /api/announcements/:groupId/pinned
exports.getPinnedAnnouncements = async (req, res) => {
  const { groupId } = req.params;

  try {
    const pinned = await Announcement.find({ groupId, pinned: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ pinned });
  } catch (error) {
    logger.error('❌ Get pinned announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch pinned announcements' });
  }
};

// ✅ GET /api/announcements/:groupId/upcoming
// Rename these to match your logical use in routes
exports.getUpcomingAnnouncements = async (req, res) => {
  const { groupId } = req.params;
  try {
    const now = new Date();
    const upcoming = await Announcement.find({
      groupId,
      eventDate: { $gte: now },
    }).sort({ eventDate: 1 }).lean();

    res.status(200).json({ upcoming });
  } catch (error) {
    logger.error('❌ Get upcoming announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming announcements' });
  }
};

exports.togglePinnedStatus = async (req, res) => {
  const { pinned } = req.body;
  if (typeof pinned !== 'boolean') {
    return res.status(400).json({ error: 'Pinned status must be a boolean' });
  }
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { pinned },
      { new: true }
    ).lean();

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Optionally emit socket event:
    req.io.to(announcement.groupId).emit('announcement:pinToggled', announcement);

    res.status(200).json({ announcement });
  } catch (error) {
    logger.error('❌ Toggle pinned status error:', error);
    res.status(500).json({ error: 'Failed to toggle pinned status' });
  }
};

