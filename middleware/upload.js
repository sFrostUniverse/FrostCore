const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    (file.mimetype && file.mimetype.startsWith('image/')) ||
    (file.mimetype === 'application/octet-stream' && allowedExts.includes(ext))
  ) {
    cb(null, true);
  } else {
    console.warn(`⚠️ Rejected file: ${file.originalname} | type: ${file.mimetype}`);
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
