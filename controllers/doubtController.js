const Doubt = require('../models/doubtModel');

// Ask a doubt
exports.askDoubt = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { groupId } = req.params;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const imageUrl = req.file ? req.file.path : null; // Cloudinary full URL

    const doubt = await Doubt.create({
      userId: req.user._id,
      groupId: groupId || null,
      title,
      description,
      imageUrl,
      answer: "",
      answerImage: "",
      answered: false
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
    const doubts = await Doubt.find();
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get group-specific doubts
// Get group-specific doubts
exports.getGroupDoubts = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log(`Fetching doubts for groupId: ${groupId}`);

    // Populate userId with email and username fields
    const doubts = await Doubt.find({ groupId }).populate('userId', 'email username');
    console.log('Doubts found:', doubts);

    res.json(doubts);
  } catch (error) {
    console.error('Error fetching doubts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get doubt by ID
exports.getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
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
    const answerImage = req.file ? req.file.path : null; // Cloudinary full URL

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    doubt.answer = answer || "";
    doubt.answerImage = answerImage || "";
    doubt.answered = true;

    await doubt.save();
    res.json(doubt);
  } catch (error) {
    console.error('❌ Error answering doubt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
