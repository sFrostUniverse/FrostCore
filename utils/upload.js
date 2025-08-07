const multer = require('multer');
const path = require('path');

// Setup storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // e.g., 1691234567890.jpg
  }
});

const upload = multer({ storage });

module.exports = upload;
