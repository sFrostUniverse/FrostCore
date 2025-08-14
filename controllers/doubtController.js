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

// Get a single doubt by ID
exports.getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('userId', 'email username');
      
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    res.json(doubt);
  } catch (error) {
    console.error('❌ Error fetching doubt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate('userId', 'email username')
      .sort({ createdAt: -1 }); // newest first
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get group-specific doubts
exports.getGroupDoubts = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log(`Fetching doubts for groupId: ${groupId}`);

    const doubts = await Doubt.find({ groupId })
      .populate('userId', 'email username')
      .sort({ createdAt: -1 }); // newest first

    console.log('Doubts found:', doubts);
    res.json(doubts);
  } catch (error) {
    console.error('Error fetching doubts:', error);
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
// Delete a doubt
exports.deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Optional: restrict deletion to owner
    if (String(doubt.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this doubt' });
    }

    await doubt.deleteOne();
    res.json({ message: 'Doubt deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting doubt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
