const Syllabus = require('../models/syllabus');

exports.addSyllabus = async (req, res) => {
  try {
    const { groupId, subject, link } = req.body;

    const syllabus = new Syllabus({
      groupId,
      subject,
      link,
    });

    await syllabus.save();
    res.status(201).json({ message: 'Syllabus added successfully', syllabus });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSyllabus = async (req, res) => {
  try {
    const { groupId } = req.params;

    const syllabusList = await Syllabus.find({ groupId }).sort({ createdAt: -1 });
    res.status(200).json({ syllabus: syllabusList });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    await Syllabus.findByIdAndDelete(id);
    res.status(200).json({ message: 'Syllabus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
