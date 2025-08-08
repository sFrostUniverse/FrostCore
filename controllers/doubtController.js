const Doubt = require('../models/doubtModel');

// POST /api/groups/:groupId/doubts
// POST /api/groups/:groupId/doubts
// POST /api/groups/:groupId/doubts
exports.askDoubt = async (req, res) => {
  try {
    const { userId, title, question } = req.body;
    const groupId = req.params.groupId;

    if (!userId || !title || !question) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const description = question; // ✅ Map question to description
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

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

    res.json(doubts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group doubts' });
  }
};


// PUT /api/doubts/:id/answer
exports.answerDoubt = async (req, res) => {
  try {
    const { answer } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const updateData = {
      answer,
      answered: true,
    };

    if (imageUrl) {
      updateData.answerImage = imageUrl; // Add this field in your model if not present
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


// Optional: GET /api/doubts — to fetch all doubts across groups (useful for admin)
exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().populate('userId', 'name email');
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doubts' });
  }
};
