const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const upload = require('../middleware/upload'); // ← This is the Cloudinary multer storage

// 📝 Test route for quick upload check
router.post('/ask', upload.single('image'), doubtController.askDoubt);

// 🌐 Group-specific doubt routes
router.get('/groups/:groupId/doubts', doubtController.getGroupDoubts);
router.post('/groups/:groupId/doubts', upload.single('image'), doubtController.askDoubt);

// 🗂️ General routes
router.get('/', doubtController.getAllDoubts);
router.get('/:id', doubtController.getDoubtById);
router.put('/:id/answer', upload.single('image'), doubtController.answerDoubt);

module.exports = router;
