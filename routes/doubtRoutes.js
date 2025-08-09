const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const upload = require('../middleware/upload');

// 🌐 Group-specific doubt routes
router.get('/groups/:groupId/doubts', doubtController.getGroupDoubts);
router.post('/groups/:groupId/doubts', upload.single('image'), doubtController.askDoubt);

// 🗂️ General routes
router.get('/', doubtController.getAllDoubts);
router.get('/:id', doubtController.getDoubtById); // ✅ Added this
router.put('/:id/answer', upload.single('image'), doubtController.answerDoubt);

module.exports = router;
