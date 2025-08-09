const Doubt = require('../models/doubtModel');

// Helper to create absolute URL for uploaded files
const makeFullUrl = (req, filePath) => {
  if (!filePath) return '';

  // If already a full URL (starts with http:// or https://), return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // Otherwise, prepend base URL
  return `${req.protocol}://${req.get('host')}${filePath}`;
};


// POST /api/groups/:groupId/doubts
exports.askDoubt = async (req, res) => {
  try {
    const { userId, title, question } = req.body;
    const groupId = req.params.groupId;

    if (!userId || !title || !question) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const description = question;

    // ✅ For Cloudinary, the URL is directly available in req.file.path
    const imageUrl = req.file ? req.file.path : '';

    const doubt = await Doubt.create({
      userId,
      groupId,
      title,
      description,
      imageUrl,
    });

    res.status(201).json(doubt);
  } catch (err) {
    console.error('❌ Failed to submit doubt:', err);
    res.status(400).json({ error: 'Failed to submit doubt' });
  }
};


// GET /api/groups/:groupId/doubts
exports.getGroupDoubts = async (req, res) => {
  try {
    const { groupId } = req.params;

    const doubts = await Doubt.find({ groupId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Ensure image URLs are absolute
    const withFullUrls = doubts.map(d => ({
      ...d.toObject(),
      imageUrl: makeFullUrl(req, d.imageUrl),
      answerImage: makeFullUrl(req, d.answerImage),
    }));

    res.json(withFullUrls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group doubts' });
  }
};

// PUT /api/doubts/:id/answer
exports.answerDoubt = async (req, res) => {
  try {
    const { answer } = req.body;
    const answerImage = req.file ? req.file.path : undefined;

    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const updateData = {
      answer,
      answered: true,
    };

    if (answerImage) {
      updateData.answerImage = answerImage;
    }

    const updated = await Doubt.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to answer doubt:', err);
    res.status(400).json({ error: 'Failed to answer doubt' });
  }
};

// GET /api/doubts/:id
exports.getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('userId', 'name email');

    if (!doubt) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    res.json({
      ...doubt.toObject(),
      imageUrl: makeFullUrl(req, doubt.imageUrl),
      answerImage: makeFullUrl(req, doubt.answerImage),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doubt' });
  }
};


// Optional: GET /api/doubts — fetch all doubts
exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().populate('userId', 'name email');

    const withFullUrls = doubts.map(d => ({
      ...d.toObject(),
      imageUrl: makeFullUrl(req, d.imageUrl),
      answerImage: makeFullUrl(req, d.answerImage),
    }));

    res.json(withFullUrls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doubts' });
  }
};
