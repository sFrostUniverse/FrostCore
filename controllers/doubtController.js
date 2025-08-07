const Doubt = require('../models/doubtModel');

// POST /api/groups/:groupId/doubts
exports.askDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.create({
      userId: req.body.userId,
      groupId: req.body.groupId,
      question: req.body.question,
      imageUrl: req.file ? req.file.path : null,
    });
    res.status(201).json(doubt);
  } catch (err) {
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
    const updated = await Doubt.findByIdAndUpdate(
      req.params.id,
      {
        answer: req.body.answer,
        answered: true
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
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
