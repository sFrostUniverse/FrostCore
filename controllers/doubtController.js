const Doubt = require('../models/doubtModel');

// Ask a doubt
exports.askDoubt = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { groupId } = req.params;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const imageUrl = req.file ? req.file.path : null; // ✅ Cloudinary full URL

    const doubt = await Doubt.create({
      group: groupId || null,
      title,
      description,
      image: imageUrl,
      askedBy: req.user._id
    });

    res.status(201).json(doubt);
  } catch (error) {
    console.error('❌ Error asking doubt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all doubts
exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().populate('askedBy', 'name');
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get group-specific doubts
exports.getGroupDoubts = async (req, res) => {
  try {
    const { groupId } = req.params;
    const doubts = await Doubt.find({ group: groupId }).populate('askedBy', 'name');
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doubt by ID
exports.getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id).populate('askedBy', 'name');
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Answer a doubt
exports.answerDoubt = async (req, res) => {
  try {
    const { answer } = req.body;
    const imageUrl = req.file ? req.file.path : null; // ✅ Cloudinary full URL

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    doubt.answers.push({
      answer,
      answeredBy: req.user._id,
      image: imageUrl
    });

    await doubt.save();
    res.json(doubt);
  } catch (error) {
    console.error('❌ Error answering doubt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
