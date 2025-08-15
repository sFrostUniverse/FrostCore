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
      .populate('userId', 'email username')
      .populate('answers.createdBy', 'email username'); // populate answer authors

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    res.json(doubt);
  } catch (error) {
    console.error('❌ Error fetching doubt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all doubts
exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate('userId', 'email username')
      .populate('answers.createdBy', 'email username')
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
      .populate('answers.createdBy', 'email username')
      .sort({ createdAt: -1 });

    console.log('Doubts found:', doubts);
    res.json(doubts);
  } catch (error) {
    console.error('Error fetching doubts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Answer a doubt (add to array instead of replacing)
exports.answerDoubt = async (req, res) => {
  try {
    const { answer } = req.body;
    const answerImage = req.file ? req.file.path : null; // Cloudinary URL

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    // Push new answer to array
    const newAnswer = {
      text: answer || "",
      imageUrl: answerImage || "",
      createdBy: req.user._id,
    };

    doubt.answers = doubt.answers || [];
    doubt.answers.push(newAnswer);
    doubt.answered = true;

    await doubt.save();

    // Populate createdBy for frontend
    await doubt.populate('answers.createdBy', 'username');

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
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

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

// Delete an answer
exports.deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    // find the doubt that contains this answer
    const doubt = await Doubt.findOne({ 'answers._id': answerId });
    if (!doubt) return res.status(404).json({ message: 'Answer not found' });

    const answer = doubt.answers.id(answerId);

    if (String(answer.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    answer.remove();
    doubt.answered = doubt.answers.length > 0;

    await doubt.save();

    res.json({ message: 'Answer deleted successfully', doubt });
  } catch (error) {
    console.error('❌ Error deleting answer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
