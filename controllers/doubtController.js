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

    let updated = await Doubt.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Doubt not found' });
    }

    // ✅ Fix URLs before sending
    updated = {
      ...updated.toObject(),
      imageUrl: makeFullUrl(req, updated.imageUrl),
      answerImage: makeFullUrl(req, updated.answerImage),
    };

    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to answer doubt:', err);
    res.status(400).json({ error: 'Failed to answer doubt' });
  }
};


// GET /api/doubts/:id
// controllers/doubtController.js
exports.getDoubtById = async (req, res) => {
  try {
    console.log('📩 Incoming getDoubtById request');
    console.log('➡ URL:', req.originalUrl);
    console.log('➡ Params:', req.params);

    const { id } = req.params;

    // Check if ID is missing or invalid format
    if (!id || id.length !== 24) {
      console.warn('⚠ Invalid doubt ID received:', id);
      return res.status(400).json({ message: 'Invalid doubt ID' });
    }

    const doubt = await Doubt.findById(id)
      .populate('createdBy', 'username')
      .populate('answers.createdBy', 'username');

    if (!doubt) {
      console.warn('❌ Doubt not found for ID:', id);
      return res.status(404).json({ message: 'Doubt not found' });
    }

    console.log('✅ Doubt found:', doubt.title);
    res.status(200).json(doubt);

  } catch (error) {
    console.error('💥 Error in getDoubtById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
