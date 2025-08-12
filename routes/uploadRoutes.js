const express = require('express');
const router = express.Router();
const upload = require('../config/cloudnaryUpload');

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // req.file.path is the Cloudinary URL
  res.status(200).json({
    message: 'Upload successful',
    filePath: req.file.path,
  });
});

module.exports = router;
