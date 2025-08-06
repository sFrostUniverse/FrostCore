const Announcement = require('../models/announcement');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

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

    // Invalidate all announcement caches for the group
    cache.del(`announcements-${groupId}`);
    cache.del(`announcements-pinned-${groupId}`);
    cache.del(`announcements-upcoming-${groupId}`);

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

  const cacheKey = `announcements-${groupId}-page-${page}-limit-${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    const announcements = await Announcement.find({ groupId, pinned: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const response = { announcements, page };
    cache.set(cacheKey, response);
    res.status(200).json(response);
  } catch (error) {
    logger.error('❌ Get announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// ✅ DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Announcement.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ error: 'Announcement not found' });

    // Invalidate caches
    const { groupId } = deleted;
    cache.del(`announcements-${groupId}`);
    cache.del(`announcements-pinned-${groupId}`);
    cache.del(`announcements-upcoming-${groupId}`);

    res.status(200).json({ message: 'Announcement deleted' });
  } catch (error) {
    logger.error('❌ Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};

// ✅ GET /api/announcements/:groupId/pinned
exports.getPinnedAnnouncements = async (req, res) => {
  const { groupId } = req.params;
  const cacheKey = `announcements-pinned-${groupId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    const pinned = await Announcement.find({ groupId, pinned: true })
      .sort({ createdAt: -1 })
      .lean();

    cache.set(cacheKey, { pinned });
    res.status(200).json({ pinned });
  } catch (error) {
    logger.error('❌ Get pinned announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch pinned announcements' });
  }
};

// ✅ GET /api/announcements/:groupId/upcoming
exports.getUpcomingAnnouncements = async (req, res) => {
  const { groupId } = req.params;
  const now = new Date();
  const cacheKey = `announcements-upcoming-${groupId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    const upcoming = await Announcement.find({
      groupId,
      eventDate: { $gte: now },
    }).sort({ eventDate: 1 }).lean();

    cache.set(cacheKey, { upcoming });
    res.status(200).json({ upcoming });
  } catch (error) {
    logger.error('❌ Get upcoming announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming announcements' });
  }
};

// ✅ PATCH /api/announcements/:id/pin
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

    // Invalidate caches
    const { groupId } = announcement;
    cache.del(`announcements-${groupId}`);
    cache.del(`announcements-pinned-${groupId}`);
    cache.del(`announcements-upcoming-${groupId}`);

    req.io.to(groupId).emit('announcement:pinToggled', announcement);
    res.status(200).json({ announcement });
  } catch (error) {
    logger.error('❌ Toggle pinned status error:', error);
    res.status(500).json({ error: 'Failed to toggle pinned status' });
  }
};
