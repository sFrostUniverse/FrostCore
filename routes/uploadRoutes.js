const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'Upload successful',
    filePath: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
