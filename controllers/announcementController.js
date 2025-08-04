const Announcement = require('../models/announcement');
const logger = require('../utils/logger');

// POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  const { groupId, title, message } = req.body;
  const userId = req.user.id;

  try {
    const announcement = await Announcement.create({
      groupId,
      title,
      message,
      createdBy: userId,
    });

    req.io.to(groupId).emit('announcement:new', announcement);

    res.status(201).json({ announcement });
  } catch (error) {
    logger.error('❌ Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// GET /api/announcements/:groupId?page=1&limit=10
exports.getAnnouncements = async (req, res) => {
  const { groupId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  try {
    const announcements = await Announcement.find({ groupId })
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

// DELETE /api/announcements/:id
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
