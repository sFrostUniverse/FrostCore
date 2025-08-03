const Group = require('../models/group');
const User = require('../models/user');
const generateUniqueGroupCode = require('../utils/codeGenerator');


// POST /api/groups/create
exports.createGroup = async (req, res) => {
  const { groupName } = req.body;
  const userId = req.user.id;

  try {
    const groupCode = await generateUniqueGroupCode(); // ✅ generate it first

    const group = await Group.create({
      groupName,
      groupCode,
      members: [userId],
      adminId: userId,
    });

    await User.findByIdAndUpdate(userId, { groupId: group._id, role: 'admin' });

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
    const group = await Group.findOne({ groupCode }); // FIXED
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Add user to group
    group.members.push(userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { groupId: group._id, role: 'member' });

    res.status(200).json({ group });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
};

// GET /api/groups/:groupId
exports.getGroupInfo = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members', 'name email');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get group info' });
  }
};

// GET /api/groups/:groupId/timetable?day=Monday
exports.getGroupTimetable = async (req, res) => {
  const { groupId } = req.params;
  const { day } = req.query;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const entries = group.timetable.filter((entry) => entry.day === day);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get timetable' });
  }
};

// ✅ This should be OUTSIDE
exports.addTimetableEntry = async (req, res) => {
  const { day, subject, teacher, time } = req.body;
  const { groupId } = req.params;

  if (!day || !subject || !teacher || !time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.timetable.push({ day, subject, teacher, time });
    await group.save();

    res.status(201).json({ message: 'Timetable entry added', entry: { day, subject, teacher, time } });
  } catch (error) {
    console.error('Add timetable error:', error);
    res.status(500).json({ error: 'Failed to add timetable entry' });
  }
};
