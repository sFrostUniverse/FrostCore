const Timetable = require('../models/timetable');

exports.addTimetableEntry = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { day, subject, teacher, time } = req.body;

    if (!day || !subject || !teacher || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const entry = new Timetable({
      groupId,
      day,
      subject,
      teacher,
      time,
    });

    await entry.save();
    res.status(201).json({ message: 'Timetable entry added', entry });
  } catch (error) {
    console.error('Error adding timetable entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTimetableForDay = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { day } = req.query;

    if (!day) {
      return res.status(400).json({ message: 'Missing day in query' });
    }

    const dayLower = day.toLowerCase();
    const entries = await Timetable.find({
      groupId,
      day: dayLower,
    })
      .sort({ time: 1 })
      .lean();

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

