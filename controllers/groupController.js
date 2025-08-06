const Group = require('../models/group');
const User = require('../models/user');
const Timetable = require('../models/timetable');
const generateUniqueGroupCode = require('../utils/codeGenerator');

// POST /api/groups/create
exports.createGroup = async (req, res) => {
  const { groupName } = req.body;
  const userId = req.user.id;

  try {
    const groupCode = await generateUniqueGroupCode();

    const group = await Group.create({
      groupName,
      groupCode,
      members: [userId],
      adminId: userId,
    });

    await User.findByIdAndUpdate(userId, {
      groupId: group._id,
      role: 'admin',
    });

    res.status(201).json({ group });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// POST /api/groups/join
exports.joinGroup = async (req, res) => {
  const { groupCode } = req.body;
  const userId = req.user.id;

  try {
    const group = await Group.findOne({ groupCode });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    await User.findByIdAndUpdate(userId, {
      groupId: group._id,
      role: 'member',
    });

    res.status(200).json({ group });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
};

// GET /api/groups/:groupId
exports.getGroupInfo = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members', 'username email')
      .populate('adminId', 'username email');

    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group info:', error);
    res.status(500).json({ error: 'Failed to get group info' });
  }
};

// ✅ UPDATED: GET /api/groups/:groupId/timetable?day=Monday
exports.getGroupTimetable = async (req, res) => {
  const { groupId } = req.params;
  const { day } = req.query;

  try {
    const entries = await Timetable.find({ groupId, day }).sort({ time: 1 }).lean();

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Failed to get timetable' });
  }
};

// ✅ UPDATED: POST /api/groups/:groupId/timetable
exports.addTimetableEntry = async (req, res) => {
  const { day, subject, teacher, time } = req.body;
  const { groupId } = req.params;

  if (!day || !subject || !teacher || !time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newEntry = await Timetable.create({
      groupId,
      day,
      subject,
      teacher,
      time,
    });

    // 🔁 Emit update to group
    req.io.to(groupId).emit('timetable:update', newEntry);

    res.status(201).json({
      message: 'Timetable entry added',
      entry: newEntry,
    });
  } catch (error) {
    console.error('Add timetable error:', error);
    res.status(500).json({ error: 'Failed to add timetable entry' });
  }
};

// ✅ OUTSIDE all other functions
exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate(
      'members',
      'username email role'
    );
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json(group.members);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Failed to fetch group members' });
  }
};
