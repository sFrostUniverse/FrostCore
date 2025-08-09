const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'Upload successful',
    filePath: req.file.path,  // <-- full Cloudinary URL here
  });
});


module.exports = router;
