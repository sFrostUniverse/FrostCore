const Announcement = require('../models/announcement');

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

    // Real-time push to group
    req.io.to(groupId).emit('new-announcement', announcement);

    res.status(201).json({ announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// GET /api/announcements/:groupId
exports.getAnnouncements = async (req, res) => {
  const { groupId } = req.params;

  try {
    const announcements = await Announcement.find({ groupId }).sort({ createdAt: -1 });
    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
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
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
