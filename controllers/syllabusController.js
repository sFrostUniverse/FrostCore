const Syllabus = require('../models/syllabus');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

// ✅ POST /api/syllabus/
exports.addSyllabus = asyncHandler(async (req, res) => {
  const { subject, link } = req.body;
  const groupId = req.user.groupId;

  if (!subject || !link) {
    return res.status(400).json({ message: 'Subject and link are required' });
  }

  const syllabus = await Syllabus.create({
    groupId,
    subject,
    link,
    createdBy: req.user._id,
  });

  // Invalidate cache
  cache.del(`syllabus-${groupId}`);

  res.status(201).json({ message: 'Syllabus added successfully', syllabus });
});

// ✅ GET /api/syllabus/:groupId
exports.getSyllabus = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const cacheKey = `syllabus-${groupId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.status(200).json({ syllabus: cached });
  }

  const syllabusList = await Syllabus.find({ groupId })
    .sort({ createdAt: -1 })
    .lean();

  cache.set(cacheKey, syllabusList);
  res.status(200).json({ syllabus: syllabusList });
});

// ✅ GET /api/syllabus/
exports.getSyllabusByUserGroup = asyncHandler(async (req, res) => {
  const groupId = req.user.groupId;
  const cacheKey = `syllabus-${groupId}`;

  if (!groupId) {
    return res.status(400).json({ message: 'User is not in a group' });
  }

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.status(200).json({ syllabus: cached });
  }

  const syllabusList = await Syllabus.find({ groupId })
    .sort({ createdAt: -1 })
    .lean();

  cache.set(cacheKey, syllabusList);
  res.status(200).json({ syllabus: syllabusList });
});

// ✅ DELETE /api/syllabus/:id
exports.deleteSyllabus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Syllabus.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Syllabus not found' });
  }

  // Invalidate cache
  const groupId = deleted.groupId?.toString?.();
  if (groupId) {
    cache.del(`syllabus-${groupId}`);
  }

  res.status(200).json({ message: 'Syllabus deleted successfully' });
});
